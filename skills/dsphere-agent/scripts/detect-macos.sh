#!/usr/bin/env bash

set -u

if [[ "$(uname -s)" != "Darwin" ]]; then
  printf '%s\n' '{"schemaVersion":3,"os":"macos","status":"unsupported-platform","nextAction":"use-windows-detector","downloadUrl":"https://work.dsphereai.com/download/index.html","websiteUrl":"https://www.dsphereai.com/","selectionRequired":false,"selectedCandidate":null,"compatibleCandidates":[],"candidates":[]}'
  exit 2
fi

json_string() {
  /usr/bin/osascript -l JavaScript \
    -e 'function run(argv) { return JSON.stringify(String(argv[0] || "")); }' \
    -- "${1-}"
}

read_json_string_field() {
  /usr/bin/osascript -l JavaScript \
    -e 'ObjC.import("Foundation"); function run(argv) { try { var s = $.NSString.stringWithContentsOfFileEncodingError(argv[0], $.NSUTF8StringEncoding, null); if (!s) return ""; var o = JSON.parse(ObjC.unwrap(s)); var v = o[argv[1]]; return typeof v === "string" ? v : ""; } catch (_) { return ""; } }' \
    -- "$1" "$2"
}

# Read-only discovery for dsphere-agent; never execute an old manifest path.
# An existing user manifest must authorize the built-in DSphere extension.
manifest_is_valid() {
  /usr/bin/osascript -l JavaScript \
    -e 'ObjC.import("Foundation"); function run(argv) { try { var s = $.NSString.stringWithContentsOfFileEncodingError(argv[0], $.NSUTF8StringEncoding, null); var m = JSON.parse(ObjC.unwrap(s)); return m.name === "com.dsworkspace.agent" && m.type === "stdio" && Array.isArray(m.allowed_origins) && m.allowed_origins.length > 0 && m.allowed_origins.every(function(o) { return typeof o === "string" && /^chrome-extension:\/\/[a-p]{32}\/$/.test(o); }) && m.allowed_origins.indexOf("chrome-extension://dkpedeeoceglnpignjhiblgfgofpmmik/") !== -1 && (!("path" in m) || typeof m.path === "string") ? "true" : "false"; } catch (_) { return "false"; } }' \
    -- "$1"
}

join_json_array() {
  local first=true
  local item
  printf '['
  for item in "$@"; do
    if [[ "$first" == true ]]; then
      first=false
    else
      printf ','
    fi
    printf '%s' "$item"
  done
  printf ']'
}

# Only the Dsphere browser is set up; when it is missing the result names the
# official download page.
brand="Dsphere"
extension_id="dkpedeeoceglnpignjhiblgfgofpmmik"
download_url="https://work.dsphereai.com/download/index.html"
website_url="https://www.dsphereai.com/"

app_path="/Applications/${brand}.app"
plist_path="${app_path}/Contents/Info.plist"
installed=false
running=false
version=""
# The browser has no registry on macOS: it reads Native Messaging hosts from its
# own user-data folder. Setup creates the manifest there; the app ships none.
host_dir="${HOME}/Library/Application Support/${brand}/NativeMessagingHosts"
manifest_path="${host_dir}/com.dsworkspace.agent.json"
source_manifest_path=""
manifest_source="new"
native_agent_path=""
registration_compatible=true
registration_issue=""
manifest_compatible=false
issue="not-installed"

if [[ -d "$app_path" ]]; then
  installed=true
  if [[ -f "$plist_path" ]]; then
    version="$(/usr/bin/plutil -extract CFBundleShortVersionString raw -o - "$plist_path" 2>/dev/null || true)"
    if [[ -z "$version" ]]; then
      version="$(/usr/bin/plutil -extract CFBundleVersion raw -o - "$plist_path" 2>/dev/null || true)"
    fi
    executable_name="$(/usr/bin/plutil -extract CFBundleExecutable raw -o - "$plist_path" 2>/dev/null || true)"
    if [[ -n "$executable_name" ]] && /usr/bin/pgrep -f "${app_path}/Contents/MacOS/${executable_name}" >/dev/null 2>&1; then
      running=true
    fi
  fi
fi

# An existing user manifest is authoritative, including when invalid: report it
# rather than replacing its permissions. A symbolic link is never followed.
if [[ -e "$manifest_path" || -L "$manifest_path" ]]; then
  source_manifest_path="$manifest_path"
  manifest_source="user-file"
  if [[ ! -L "$manifest_path" && -f "$manifest_path" && "$(manifest_is_valid "$manifest_path")" == "true" ]]; then
    native_agent_path="$(read_json_string_field "$manifest_path" path)"
  else
    registration_compatible=false
    registration_issue="user-registration-invalid"
  fi
fi

if [[ "$installed" == true ]]; then
  manifest_compatible=$registration_compatible
  issue=$registration_issue
fi

candidate="{\"brand\":$(json_string "$brand"),\"installed\":${installed},\"running\":${running},\"appPath\":$(json_string "$app_path"),\"version\":$(json_string "$version"),\"hostDir\":$(json_string "$host_dir"),\"manifestPath\":$(json_string "$manifest_path"),\"sourceManifestPath\":$(json_string "$source_manifest_path"),\"manifestSource\":$(json_string "$manifest_source"),\"extensionId\":$(json_string "$extension_id"),\"nativeAgentPath\":$(json_string "$native_agent_path"),\"registrationCompatible\":${registration_compatible},\"registrationIssue\":$(json_string "$registration_issue"),\"manifestCompatible\":${manifest_compatible},\"issue\":$(json_string "$issue")}"

selected_candidate="null"
compatible_json="[]"
status="registration-blocked"
next_action="repair-user-registration"
if [[ "$installed" != true ]]; then
  status="browser-not-installed"
  next_action="install-browser"
elif [[ "$manifest_compatible" == true ]]; then
  selected_candidate="$candidate"
  compatible_json="$(join_json_array "$candidate")"
  status="manifest-ready"
  next_action="install-user-native-host"
fi

printf '{"schemaVersion":3,"os":"macos","status":%s,"nextAction":%s,"downloadUrl":%s,"websiteUrl":%s,"selectionRequired":false,"selectedCandidate":%s,"compatibleCandidates":%s,"candidates":%s}\n' \
  "$(json_string "$status")" "$(json_string "$next_action")" "$(json_string "$download_url")" "$(json_string "$website_url")" \
  "$selected_candidate" "$compatible_json" "$(join_json_array "$candidate")"
