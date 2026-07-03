param(
  [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"
$required = @(
  "AGENTS.md","CLAUDE.md","PROMPT.md","PROJECT_CONTEXT.md","STORE_IDENTITY_TEMPLATE.md",
  "README.md","تعليمات التشغيل.md",".env.example","docs/ADMIN_CAPABILITY_MATRIX.md",
  "docs/DATA_OWNERSHIP.md","docs/PRODUCTION_ACCEPTANCE.md"
)
$missing = $required | Where-Object { -not (Test-Path -LiteralPath $_) }
if ($missing.Count -gt 0) { throw "Missing required files: $($missing -join ', ')" }

& "$PSScriptRoot/check-secrets.ps1"
& "$PSScriptRoot/check-shahy-references.ps1"
npm run lint
npm run typecheck
if (-not $SkipBuild) { npm run build }
Write-Host "Template verification completed."
