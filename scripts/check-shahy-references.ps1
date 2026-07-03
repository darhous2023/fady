param(
  [string]$Root = (Get-Location).Path,
  [switch]$Strict
)

$ErrorActionPreference = "Stop"
$rootPath = [IO.Path]::GetFullPath($Root)
$allowed = @(
  "MASTER_EXECUTION_SPEC.md",
  "MASTER_TEMPLATE_MANIFEST.json",
  "PROJECT_CONTEXT.md",
  "execution/",
  "docs/",
  "PLAN.md",
  "public/shahy-store-context.md",
  "public/ai-image-prompt.md",
  "scripts/check-shahy-references.ps1",
  "scripts/validate-environment.ps1"
)
$patterns = @(
  "pggmpvhyuxfetifzesws",
  "shah-y-store.vercel.app",
  "Darhous/ShahY-Store",
  "https://github.com/Darhous/ShahY-Store"
)

$hits = @()
foreach ($pattern in $patterns) {
  $rg = & rg --fixed-strings --line-number --hidden --glob "!node_modules" --glob "!.git" --glob "!.next" --glob "!.vercel" $pattern $rootPath 2>$null
  foreach ($line in $rg) {
    $relative = $line -replace [regex]::Escape($rootPath + [IO.Path]::DirectorySeparatorChar), ""
    $normalized = $relative -replace "\\", "/"
    $isAllowed = $false
    foreach ($prefix in $allowed) {
      if ($normalized.StartsWith($prefix, [StringComparison]::OrdinalIgnoreCase) -or $normalized -eq $prefix.TrimEnd("/")) {
        $isAllowed = $true
      }
    }
    $hits += [pscustomobject]@{ Pattern = $pattern; Location = $normalized; Allowed = $isAllowed }
  }
}

$blocked = $hits | Where-Object { -not $_.Allowed }
if ($hits.Count -gt 0) {
  $hits | Sort-Object Allowed, Location | Format-Table -AutoSize
}
if ($blocked.Count -gt 0) {
  Write-Error "Blocked ShahY production references found outside allowed historical documentation."
}
if ($Strict -and $hits.Count -gt 0) {
  Write-Error "Strict mode rejects all ShahY references."
}
Write-Host "ShahY reference check completed. Hits=$($hits.Count); Blocked=$($blocked.Count)"
