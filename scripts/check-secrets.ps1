param(
  [string]$Root = (Get-Location).Path
)

$ErrorActionPreference = "Stop"
$rootPath = [IO.Path]::GetFullPath($Root)
$secretFilePatterns = @(".env", ".env.local", ".env.production", ".env.development")
$blockedFiles = @()
foreach ($name in $secretFilePatterns) {
  $path = Join-Path $rootPath $name
  if (Test-Path -LiteralPath $path) { $blockedFiles += $path }
}
if ($blockedFiles.Count -gt 0) {
  $blockedFiles | ForEach-Object { Write-Error "Secret file must not be committed: $_" }
}

$patterns = @(
  "SUPABASE_SERVICE_ROLE_KEY\s*=\s*['""]?(?!YOUR_|$).+",
  "DATABASE_URL\s*=\s*['""]?postgresql://(?!USER:PASSWORD@HOST).+",
  "VERCEL_TOKEN\s*=\s*['""]?.+",
  "GITHUB_TOKEN\s*=\s*['""]?.+",
  "-----BEGIN (RSA |OPENSSH |EC |)PRIVATE KEY-----"
)

$findings = @()
foreach ($pattern in $patterns) {
  $matches = & rg --pcre2 --line-number --hidden --glob "!node_modules" --glob "!.git" --glob "!.next" --glob "!.vercel" --glob "!execution/destination-initial-backup-*" -- $pattern $rootPath 2>$null
  foreach ($m in $matches) {
    $findings += ($m -replace [regex]::Escape($rootPath + [IO.Path]::DirectorySeparatorChar), "")
  }
}

if ($findings.Count -gt 0) {
  $findings | Sort-Object -Unique | ForEach-Object { Write-Host "Potential secret pattern: $($_ -replace '(:).*','$1 [REDACTED]')" }
  Write-Error "Potential secrets found. Review and redact before commit."
}

Write-Host "Secret check completed. No active secret patterns detected."
