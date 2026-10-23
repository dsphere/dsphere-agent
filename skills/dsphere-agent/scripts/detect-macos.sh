#!/usr/bin/env bash

set -u

if [[ "$(uname -s)" != "Darwin" ]]; then
  printf '%s\n' '{"schemaVersion":2,"os":"macos","status":"unsupported-platform","nextAction":"use-windows-detector","selectionRequired":false,"selectedCandidate":null,"compatibleCandidates":[],"candidates":[]}'
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

# Read-only discovery for dsphere-agent; never execute an old browser manifest path.
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

brands=("Dsphere" "DuokaiBrowser" "DsWorkspace")
candidates=()
compatible_candidates=()
installed_count=0

for brand in "${brands[@]}"; do
  app_path="/Applications/${brand}.app"
  plist_path="${app_path}/Contents/Info.plist"
  installed=false
  running=false
  version=""
  version_dir=""
  host_dir=""
  manifest_path=""
  native_agent_path=""
  manifest_compatible=false
  issue="not-installed"

  if [[ -d "$app_path" ]]; then
    installed=true
    installed_count=$((installed_count + 1))
    issue="version-unavailable"

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

    # The supported user-level direct manifest takes precedence over app resources.
    # Keep an invalid existing user manifest selected so setup reports it, rather
    # than silently modifying a different (possibly signed) configuration.
    user_host_dir="${HOME}/Library/Application Support/${brand}/NativeMessagingHosts"
    user_manifest="${user_host_dir}/com.dsworkspace.agent.json"
    # Versions/Current names the active framework version; the plist version is
    # only a fallback (CFBundleVersion can differ from the directory name).
    current_dir="${app_path}/Contents/Frameworks/${brand} Framework.framework/Versions/Current"
    if [[ -d "$current_dir" ]]; then
      version_dir="$current_dir"
    elif [[ -n "$version" ]]; then
      version_dir="${app_path}/Contents/Frameworks/${brand} Framework.framework/Versions/${version}"
    fi
    if [[ -e "$user_manifest" || -L "$user_manifest" ]]; then
      host_dir="$user_host_dir"
      manifest_path="$user_manifest"
    elif [[ -n "$version_dir" ]]; then
      host_dir="${version_dir}/NativeMessagingHosts"
      issue="active-version-directory-missing"
      if [[ -d "$version_dir" ]]; then
        issue="native-host-manifest-missing"
        nested_manifest="${host_dir}/com.dsworkspace.agent/com.dsworkspace.agent.json"
        direct_manifest="${host_dir}/com.dsworkspace.agent.json"
        if [[ -f "$nested_manifest" ]]; then
          manifest_path="$nested_manifest"
        elif [[ -f "$direct_manifest" ]]; then
          manifest_path="$direct_manifest"
        fi
      fi
    fi
    if [[ -n "$manifest_path" ]]; then
      if [[ "$(manifest_is_valid "$manifest_path")" == "true" ]]; then
        native_agent_path="$(read_json_string_field "$manifest_path" path)"
        manifest_compatible=true
        issue=""
      else
        issue="native-host-manifest-invalid"
      fi
    fi
  fi

  candidate="{\"brand\":$(json_string "$brand"),\"installed\":${installed},\"running\":${running},\"appPath\":$(json_string "$app_path"),\"version\":$(json_string "$version"),\"versionDir\":$(json_string "$version_dir"),\"hostDir\":$(json_string "$host_dir"),\"manifestPath\":$(json_string "$manifest_path"),\"nativeAgentPath\":$(json_string "$native_agent_path"),\"manifestCompatible\":${manifest_compatible},\"issue\":$(json_string "$issue")}"
  candidates+=("$candidate")
  if [[ "$manifest_compatible" == true ]]; then
    compatible_candidates+=("$candidate")
  fi
  # Stop at the first installed brand, including when its manifest needs repair.
  # A stopped Dsphere still takes precedence over a running DuokaiBrowser or
  # DsWorkspace, and a stopped DuokaiBrowser over a running DsWorkspace.
  if [[ "$installed" == true ]]; then
    break
  fi
done

compatible_count=${#compatible_candidates[@]}
selection_required=false
selected_candidate="null"
status="upgrade-required"
next_action="upgrade-browser"

if [[ "$installed_count" -eq 0 ]]; then
  status="browser-not-installed"
  next_action="install-browser"
elif [[ "$compatible_count" -eq 1 ]]; then
  selected_candidate="${compatible_candidates[0]}"
  status="manifest-ready"
  next_action="configure-skill-native-host"
fi

printf '{"schemaVersion":2,"os":"macos","status":%s,"nextAction":%s,"selectionRequired":%s,"selectedCandidate":%s,"compatibleCandidates":' \
  "$(json_string "$status")" "$(json_string "$next_action")" "$selection_required" "$selected_candidate"
# macOS ships Bash 3.2, where an empty array is unset under nounset.
if [[ "$compatible_count" -gt 0 ]]; then
  join_json_array "${compatible_candidates[@]}"
else
  printf '[]'
fi
printf ',"candidates":'
join_json_array "${candidates[@]}"
printf '}\n'
