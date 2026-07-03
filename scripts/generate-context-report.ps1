$ErrorActionPreference = "Stop"
$out = "docs/verification/context-report.txt"
New-Item -ItemType Directory -Force -Path "docs/verification" | Out-Null
@(
  "Generated: $(Get-Date -Format o)",
  "Branch: $(git branch --show-current 2>$null)",
  "Latest commit: $(git rev-parse --short HEAD 2>$null)",
  "Files: $((rg --files | Measure-Object -Line).Lines)",
  "Package: $((Get-Content package.json -Raw | ConvertFrom-Json).name)"
) | Set-Content -LiteralPath $out -Encoding UTF8
Get-Content -LiteralPath $out
