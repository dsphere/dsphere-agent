[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]$SkillExe,

  [string]$RegistryRoots = '',

  [string]$ManifestPath,

  [string]$TemplatePath,

  [Parameter(Mandatory = $true)]
  [ValidatePattern('^[A-Za-z0-9_-]{16,64}$')]
  [string]$Challenge
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$Executable = (Get-Item -LiteralPath $SkillExe -Force).FullName
if (-not (Test-Path -LiteralPath $Executable -PathType Leaf)) {
  throw 'SkillExe must identify the verified Native Agent executable.'
}

$RegistrationTargets = @()
$ExpectedManifestPath = $ManifestPath
# Receipt evidence comes only from this user's own detection scan. Caller-supplied
# roots or paths are never reported as scan evidence, so the receipt stays empty.
$ScannedTargets = @()
$ScannedManifestPath = $null
if ($RegistryRoots) {
  $RegistrationTargets = @($RegistryRoots.Split(';', [StringSplitOptions]::RemoveEmptyEntries) | ForEach-Object {
    [pscustomobject]@{ brand = 'Custom'; registryRoot = $_.Trim() }
  })
  # Only the DSphere browser is supported; the installer refuses any other root
  # apart from isolated roots under the automated-test namespace.
  if (@($RegistrationTargets | Where-Object { $_.registryRoot -ine 'Software\Dsphere' -and $_.registryRoot -notmatch '^Software\\DSphereNativeHostTests\\[^\\]+' }).Count) {
    throw 'Only the DSphere browser is supported: RegistryRoots may only name Software\Dsphere.'
  }
} else {
  $Detector = Join-Path $PSScriptRoot 'detect-windows.ps1'
  $DetectionRaw = & $Detector
  try {
    $Detection = (($DetectionRaw -join [Environment]::NewLine) | ConvertFrom-Json)
  } catch {
    throw 'Browser detection did not return valid JSON.'
  }
  if ($Detection.status -eq 'browser-not-installed') {
    throw "The DSphere browser is not installed. Download it from $($Detection.downloadUrl) (or $($Detection.websiteUrl)), install it, then run this command again."
  }
  if ($Detection.status -ne 'manifest-ready' -or -not $Detection.selectedCandidate) {
    throw "External browser detection blocked registration: $($Detection.status)"
  }
  $Candidate = $Detection.selectedCandidate
  $ScannedManifestPath = [IO.Path]::GetFullPath([string]$Candidate.manifestPath)
  if (-not $ManifestPath) {
    $ExpectedManifestPath = [string]$Candidate.manifestPath
    if ($Candidate.manifestSource -ne 'new') { $ManifestPath = $ExpectedManifestPath }
  }
  if (-not $TemplatePath -and $Candidate.sourceManifestPath -and
      $Candidate.sourceManifestPath -ine $Candidate.manifestPath) {
    $TemplatePath = [string]$Candidate.sourceManifestPath
  }
  $RegistrationTargets = @($Detection.registrationTargets | Where-Object { $_.installed } | ForEach-Object {
    [pscustomobject]@{ brand = [string]$_.brand; registryRoot = [string]$_.registryRoot }
  })
  $ScannedTargets = @($RegistrationTargets)
}
$RegistrationRoots = @($RegistrationTargets | ForEach-Object { $_.registryRoot })
if ($RegistrationTargets.Count -eq 0 -or @($RegistrationRoots | Select-Object -Unique).Count -ne $RegistrationTargets.Count) {
  throw 'No unique installed-browser registry roots were detected.'
}

function Invoke-NativeAgentJson {
  param([string[]]$Arguments)

  $Raw = & $Executable @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "Native Agent registration command failed with exit code $LASTEXITCODE."
  }
  try {
    return (($Raw -join [Environment]::NewLine) | ConvertFrom-Json)
  } catch {
    throw 'Native Agent registration command did not return valid JSON.'
  }
}

function Get-Sha256Hex {
  param([Parameter(Mandatory = $true)][string]$Path)

  $Stream = [IO.File]::OpenRead($Path)
  $Hasher = [Security.Cryptography.SHA256]::Create()
  try {
    return ([BitConverter]::ToString($Hasher.ComputeHash($Stream))).Replace('-', '').ToLowerInvariant()
  } finally {
    $Hasher.Dispose()
    $Stream.Dispose()
  }
}

$VerifiedRegistrations = @()
$PublishedManifestPath = $ManifestPath
for ($Index = 0; $Index -lt $RegistrationTargets.Count; $Index++) {
  $RegistrationTarget = $RegistrationTargets[$Index]
  $RegistryRoot = $RegistrationTarget.registryRoot
  $InstallArgs = @('integrations', 'native-host', 'install', '--registry-root', $RegistryRoot)
  if ($PublishedManifestPath) {
    $InstallArgs += @('--manifest', $PublishedManifestPath)
  }
  if ($Index -eq 0 -and $TemplatePath) {
    $InstallArgs += @('--template', $TemplatePath)
  }

  $Preflight = Invoke-NativeAgentJson ($InstallArgs + @('--check'))
  if ($Preflight.status -notin @('registered', 'registration-required')) {
    throw "Unexpected registration preflight status for ${RegistryRoot}: $($Preflight.status)"
  }

  if ($Preflight.status -eq 'registration-required') {
    $Installed = Invoke-NativeAgentJson $InstallArgs
    if ($Installed.status -notin @('registered', 'unchanged')) {
      throw "Unexpected registration write status for ${RegistryRoot}: $($Installed.status)"
    }
  }

  $Verified = Invoke-NativeAgentJson ($InstallArgs + @('--check'))
  if ($Verified.status -ne 'registered') {
    throw "Registration verification did not return registered for ${RegistryRoot}: $($Verified.status)"
  }
  if (-not [string]::Equals($Verified.registryRoot, $RegistryRoot, [StringComparison]::OrdinalIgnoreCase)) {
    throw 'Registration verification returned a different registry root.'
  }
  if (-not [string]::Equals([IO.Path]::GetFullPath($Verified.nativeAgentPath), $Executable, [StringComparison]::OrdinalIgnoreCase)) {
    throw 'Registration verification returned a different Native Agent path.'
  }
  if (-not [string]::Equals([IO.Path]::GetFullPath($Verified.descriptor.command), $Executable, [StringComparison]::OrdinalIgnoreCase)) {
    throw 'Registration verification returned a different MCP command.'
  }
  $DescriptorArgs = @($Verified.descriptor.args)
  if ($DescriptorArgs.Count -ne 3 -or $DescriptorArgs[0] -ne 'mcp' -or $DescriptorArgs[1] -ne 'serve' -or $DescriptorArgs[2] -ne '--stdio') {
    throw 'Registration verification returned unexpected MCP arguments.'
  }

  $ActualManifestPath = [IO.Path]::GetFullPath($Verified.manifestPath)
  if ($ExpectedManifestPath -and -not [string]::Equals([IO.Path]::GetFullPath($ExpectedManifestPath), $ActualManifestPath, [StringComparison]::OrdinalIgnoreCase)) {
    throw 'Registration verification differs from the external detection manifest.'
  }
  if ($PublishedManifestPath -and -not [string]::Equals([IO.Path]::GetFullPath($PublishedManifestPath), $ActualManifestPath, [StringComparison]::OrdinalIgnoreCase)) {
    throw 'Registration verification returned a different shared manifest path.'
  }
  $PublishedManifestPath = $ActualManifestPath
  $VerifiedRegistrations += [ordered]@{
    brand = $RegistrationTarget.brand
    registryRoot = $Verified.registryRoot
    status = $Verified.status
  }
}

$Manifest = Get-Content -Raw -LiteralPath $PublishedManifestPath | ConvertFrom-Json
if (-not [string]::Equals([IO.Path]::GetFullPath($Manifest.path), $Executable, [StringComparison]::OrdinalIgnoreCase)) {
  throw 'Manifest readback does not point to the verified Native Agent.'
}

[ordered]@{
  schemaVersion = 1
  status = 'registered'
  verification = 'passed'
  challenge = $Challenge
  detectedTargets = @($ScannedTargets)
  expectedManifestPath = $ScannedManifestPath
  manifestPath = $PublishedManifestPath
  manifestSha256 = Get-Sha256Hex -Path $PublishedManifestPath
  nativeAgentPath = $Executable
  registrations = $VerifiedRegistrations
  descriptor = $Verified.descriptor
} | ConvertTo-Json -Depth 8 -Compress
