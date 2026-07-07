param(
  [string]$Root = (Get-Location).Path
)

$ErrorActionPreference = "Stop"
$rootPath = [IO.Path]::GetFullPath($Root)
$secretFilePatterns = @(".env", ".env.local", ".env.production", ".env.development")
$blockedFiles = @()
foreach ($name in $secretFilePatterns) {
  $path = Join-Path $rootPath $name
  if (Test-Path -LiteralPath $path) {
    $relative = $path.Substring($rootPath.Length).TrimStart([IO.Path]::DirectorySeparatorChar, [IO.Path]::AltDirectorySeparatorChar)
    $isTracked = $false
    $previousErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    & git -C $rootPath ls-files --error-unmatch -- $relative 1>$null 2>$null
    $trackedExitCode = $LASTEXITCODE
    $ErrorActionPreference = $previousErrorActionPreference
    if ($trackedExitCode -eq 0) { $isTracked = $true }

    $isIgnored = $false
    $previousErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    & git -C $rootPath check-ignore -q -- $relative 1>$null 2>$null
    $ignoredExitCode = $LASTEXITCODE
    $ErrorActionPreference = $previousErrorActionPreference
    if ($ignoredExitCode -eq 0) { $isIgnored = $true }

    if ($isTracked -or -not $isIgnored) { $blockedFiles += $path }
  }
}
if ($blockedFiles.Count -gt 0) {
  $blockedFiles | ForEach-Object { Write-Error "Secret file must not be committed: $_" }
}

$patterns = @(
  "^\s*SUPABASE_SERVICE_ROLE_KEY\s*=\s*['""]?(?!YOUR_|$).+",
  "^\s*DATABASE_URL\s*=\s*['""]?postgresql://(?!USER:PASSWORD@HOST).+",
  "^\s*VERCEL_TOKEN\s*=\s*['""]?.+",
  "^\s*GITHUB_TOKEN\s*=\s*['""]?.+",
  "-----BEGIN (RSA |OPENSSH |EC |)PRIVATE KEY-----"
)

$findings = @()
Push-Location $rootPath
try {
  foreach ($pattern in $patterns) {
    $matches = & rg --pcre2 --line-number --hidden --glob "!node_modules" --glob "!.git" --glob "!.next" --glob "!.vercel" --glob "!execution/destination-initial-backup-*" -- $pattern . 2>$null
    foreach ($m in $matches) {
      $findings += ($m -replace "^\.[\\/]", "")
    }
  }
} finally {
  Pop-Location
}

if ($findings.Count -gt 0) {
  $findings | Sort-Object -Unique | ForEach-Object { Write-Host "Potential secret pattern: $($_ -replace '(:).*','$1 [REDACTED]')" }
  Write-Error "Potential secrets found. Review and redact before commit."
}

Write-Host "Secret check completed. No active secret patterns detected."
