[CmdletBinding()]
param(
    [string]$RegistryRoot = ''
)

# Read-only dsphere-agent browser discovery.
$ErrorActionPreference = 'Stop'
$ExtensionId = 'dkpedeeoceglnpignjhiblgfgofpmmik'
$IsWindowsVariable = Get-Variable -Name IsWindows -ErrorAction SilentlyContinue
$RunningOnWindows = if ($IsWindowsVariable) { [bool]$IsWindowsVariable.Value } else { $env:OS -eq 'Windows_NT' }

if ($RegistryRoot -and ($RegistryRoot -notmatch '^Software\\[^\\]+' -or $RegistryRoot -match '[/:\x00\r\n]' -or
    @($RegistryRoot.Split('\') | Where-Object { $_ -in @('', '.', '..', 'Policies', 'NativeMessagingHosts') }).Count)) {
    throw 'RegistryRoot must be the verified HKCU-relative browser product root.'
}

function Get-UserNativeHostRegistration {
    param([Parameter(Mandatory = $true)][string]$RegistryRoot)
    # Chromium checks the 32-bit HKCU view first, even from a 64-bit client.
    foreach ($view in @([Microsoft.Win32.RegistryView]::Registry32, [Microsoft.Win32.RegistryView]::Registry64)) {
        $base = [Microsoft.Win32.RegistryKey]::OpenBaseKey([Microsoft.Win32.RegistryHive]::CurrentUser, $view)
        $key = $null
        try {
            $key = $base.OpenSubKey("$RegistryRoot\NativeMessagingHosts\com.dsworkspace.agent", $false)
            if ($key -and $key.GetValueNames() -contains '') {
                if ($key.GetValueKind('') -ne [Microsoft.Win32.RegistryValueKind]::String) { throw 'Native host registry default must be REG_SZ.' }
                return [ordered]@{ exists = $true; path = [string]$key.GetValue(''); view = [string]$view }
            }
        } finally {
            if ($key) { $key.Dispose() }
            $base.Dispose()
        }
    }
    return [ordered]@{ exists = $false; path = ''; view = '' }
}

function Test-UserManifestLocation {
    param([string]$Path)
    if (-not [IO.Path]::IsPathRooted($Path)) { return $false }
    $full = [IO.Path]::GetFullPath($Path)
    $userRoot = [IO.Path]::GetFullPath($env:LOCALAPPDATA).TrimEnd('\') + '\'
    return $full.StartsWith($userRoot, [StringComparison]::OrdinalIgnoreCase) -and
        [IO.Path]::GetFileName($full) -ceq 'com.dsworkspace.agent.json' -and
        [IO.Path]::GetFileName([IO.Path]::GetDirectoryName($full)) -ceq 'NativeMessagingHosts' -and
        $full -notmatch '(?i)[\\/](?:Application|[^\\/]+\.app)[\\/]'
}

function Get-NormalizedVersion {
    param([System.Diagnostics.FileVersionInfo]$VersionInfo)

    foreach ($value in @($VersionInfo.ProductVersion, $VersionInfo.FileVersion)) {
        if (-not [string]::IsNullOrWhiteSpace($value)) {
            $match = [regex]::Match($value.Trim(), '\d+(?:\.\d+)+')
            if ($match.Success) {
                return $match.Value
            }
        }
    }
    return ''
}

function Resolve-NativeAgentPath {
    param(
        [string]$ManifestPath,
        [string]$ConfiguredPath
    )

    if ([string]::IsNullOrWhiteSpace($ConfiguredPath)) {
        return ''
    }

    try {
        $candidatePath = $ConfiguredPath
        if (-not [System.IO.Path]::IsPathRooted($candidatePath)) {
            $manifestFullPath = [System.IO.Path]::GetFullPath($ManifestPath)
            $manifestDirectory = [System.IO.Path]::GetDirectoryName($manifestFullPath)
            if ([string]::IsNullOrWhiteSpace($manifestDirectory)) {
                return ''
            }
            $candidatePath = Join-Path $manifestDirectory $candidatePath
        }
        return [System.IO.Path]::GetFullPath($candidatePath)
    } catch {
        return ''
    }
}

function Test-BrowserRunning {
    param(
        [string]$Brand,
        [string]$ExecutablePath
    )

    $resolvedExpected = [System.IO.Path]::GetFullPath($ExecutablePath)
    foreach ($process in @(Get-Process -Name $Brand -ErrorAction SilentlyContinue)) {
        try {
            if ($process.Path -and [System.IO.Path]::GetFullPath($process.Path) -ieq $resolvedExpected) {
                return $true
            }
        } catch {
            continue
        }
    }
    return $false
}

# Discovery never launches the old manifest path; only the Skill package supplies executables.
function Test-NativeHostManifest {
    param([object]$Manifest)
    if ($null -eq $Manifest -or $Manifest.name -cne 'com.dsworkspace.agent' -or $Manifest.type -cne 'stdio') { return $false }
    if ($Manifest.allowed_origins -isnot [Array] -or $Manifest.allowed_origins.Count -eq 0) { return $false }
    foreach ($origin in $Manifest.allowed_origins) {
        if ($origin -isnot [string] -or $origin -cnotmatch '^chrome-extension://[a-p]{32}/$') { return $false }
    }
    if ($Manifest.PSObject.Properties.Name -contains 'path' -and $Manifest.path -isnot [string]) { return $false }
    return $true
}

function Get-BrowserCandidate {
    param([string]$Brand)

    # OEM builds use their own product key; a generic Chromium registration
    # does not establish registration for either supported browser brand.
    $candidateRegistryRoot = if ($RegistryRoot) { $RegistryRoot } else { "Software\$Brand" }
    $applicationRoot = Join-Path $env:LOCALAPPDATA "$Brand\Application"
    $executablePath = Join-Path $applicationRoot "$Brand.exe"
    # Per-user first, then standard machine-wide installation locations.
    foreach ($basePath in @($env:LOCALAPPDATA, $env:ProgramFiles, ${env:ProgramFiles(x86)}) | Where-Object { $_ }) {
        $candidateExe = Join-Path $basePath "$Brand\Application\$Brand.exe"
        if (Test-Path -LiteralPath $candidateExe -PathType Leaf) {
            $executablePath = $candidateExe
            $applicationRoot = Split-Path -Parent $candidateExe
            break
        }
    }
    $installed = Test-Path -LiteralPath $executablePath -PathType Leaf
    $running = $false
    $version = ''
    $versionDir = ''
    $hostDir = Join-Path $env:LOCALAPPDATA 'dsphere\NativeMessagingHosts'
    $manifestPath = Join-Path $hostDir 'com.dsworkspace.agent.json'
    $sourceManifestPath = ''
    $manifestSource = 'new'
    $registrationPath = ''
    $registrationView = ''
    $nativeAgentPath = ''
    $registrationCompatible = $true
    $registrationIssue = ''
    $manifestCompatible = $false
    $issue = 'not-installed'

    if ($installed) {
        $running = Test-BrowserRunning -Brand $Brand -ExecutablePath $executablePath
        $version = Get-NormalizedVersion -VersionInfo ([System.Diagnostics.FileVersionInfo]::GetVersionInfo($executablePath))
        if ($version) { $versionDir = Join-Path $applicationRoot $version }
    }

    # Registration is inspected independently of browser installation because
    # setup binds both supported Chromium brands to the same user manifest.
    try {
        $registration = Get-UserNativeHostRegistration -RegistryRoot $candidateRegistryRoot
        $registrationPath = $registration.path
        $registrationView = $registration.view
        if ($registration.exists) {
            if (-not [IO.Path]::IsPathRooted($registrationPath) -or [IO.Path]::GetFileName($registrationPath) -cne 'com.dsworkspace.agent.json') {
                throw 'Invalid user registry manifest path.'
            }
            if (Test-UserManifestLocation $registrationPath) {
                $manifestPath = [IO.Path]::GetFullPath($registrationPath)
                $hostDir = Split-Path -Parent $manifestPath
            }
            if (Test-Path -LiteralPath $registrationPath) {
                $sourceManifestPath = $registrationPath
                $manifestSource = 'user-registry'
            }
        }
        if (Test-Path -LiteralPath $manifestPath) {
            if ($sourceManifestPath -and $sourceManifestPath -ine $manifestPath) { throw 'Conflicting user manifests; inspect before migration.' }
            $sourceManifestPath = $manifestPath
            $manifestSource = 'user-file'
        }
        # No browser-owned NativeMessagingHosts directory is inspected or required.
        if ($sourceManifestPath) {
            $manifest = Get-Content -LiteralPath $sourceManifestPath -Raw | ConvertFrom-Json
            if (-not (Test-NativeHostManifest $manifest)) { throw 'Invalid user manifest.' }
            if ($ExtensionId -and "chrome-extension://$ExtensionId/" -cnotin $manifest.allowed_origins) { throw 'Selected extension is not authorized by the existing user manifest.' }
            $nativeAgentPath = Resolve-NativeAgentPath -ManifestPath $sourceManifestPath -ConfiguredPath ([string]$manifest.path)
        }
    } catch {
        $registrationCompatible = $false
        $registrationIssue = 'user-registration-invalid'
    }

    if ($installed) {
        $manifestCompatible = $registrationCompatible
        $issue = $registrationIssue
    }

    return [ordered]@{
        brand = $Brand
        installed = $installed
        running = $running
        appPath = $executablePath
        version = $version
        versionDir = $versionDir
        hostDir = $hostDir
        manifestPath = $manifestPath
        sourceManifestPath = $sourceManifestPath
        manifestSource = $manifestSource
        registryRoot = $candidateRegistryRoot
        registeredManifestPath = $registrationPath
        registryView = $registrationView
        extensionId = $ExtensionId
        nativeAgentPath = $nativeAgentPath
        registrationCompatible = $registrationCompatible
        registrationIssue = $registrationIssue
        manifestCompatible = $manifestCompatible
        issue = $issue
    }
}

if (-not $RunningOnWindows -and $PSVersionTable.PSVersion.Major -ge 6) {
    [ordered]@{
        schemaVersion = 3
        os = 'windows'
        status = 'unsupported-platform'
        nextAction = 'use-macos-detector'
        selectionRequired = $false
        selectedCandidate = $null
        compatibleCandidates = @()
        registrationTargets = @()
        candidates = @()
    } | ConvertTo-Json -Depth 8 -Compress
    exit 2
}

$candidates = @(
    Get-BrowserCandidate -Brand 'Dsphere'
    Get-BrowserCandidate -Brand 'DuokaiBrowser'
    Get-BrowserCandidate -Brand 'DsWorkspace'
)
$installedCandidates = @($candidates | Where-Object { $_.installed })
$compatibleCandidates = @($candidates | Where-Object { $_.manifestCompatible })
$registrationTargets = @($candidates | ForEach-Object {
    [ordered]@{
        brand = $_.brand
        registryRoot = $_.registryRoot
        installed = $_.installed
        manifestPath = $_.manifestPath
        registeredManifestPath = $_.registeredManifestPath
        registryView = $_.registryView
        registrationCompatible = $_.registrationCompatible
        issue = $_.registrationIssue
    }
})
$selectionRequired = $false
$selectedCandidate = $null
$status = 'registration-blocked'
$nextAction = 'repair-user-registration'

if ($installedCandidates.Count -eq 0) {
    $status = 'browser-not-installed'
    $nextAction = 'install-browser'
} elseif (@($registrationTargets | Where-Object { $_.installed -and -not $_.registrationCompatible }).Count -eq 0) {
    # Dsphere is the preferred task target, then DuokaiBrowser, but registration
    # covers every installed brand and is not complete until each root passes
    # readback.
    $selectedCandidate = $compatibleCandidates[0]
    $status = 'manifest-ready'
    $nextAction = 'install-user-native-host'
}

[ordered]@{
    schemaVersion = 3
    os = 'windows'
    status = $status
    nextAction = $nextAction
    selectionRequired = $selectionRequired
    selectedCandidate = $selectedCandidate
    compatibleCandidates = $compatibleCandidates
    registrationTargets = $registrationTargets
    candidates = $candidates
} | ConvertTo-Json -Depth 8 -Compress
