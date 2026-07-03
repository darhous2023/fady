param(
  [Parameter(Mandatory=$true)][string]$Destination,
  [Parameter(Mandatory=$true)][string]$StoreName,
  [string]$TemplateRoot = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = "Stop"
$template = [IO.Path]::GetFullPath($TemplateRoot)
$dest = [IO.Path]::GetFullPath($Destination)
if (Test-Path -LiteralPath $dest) {
  if ((Get-ChildItem -LiteralPath $dest -Force | Measure-Object).Count -gt 0) {
    throw "Destination exists and is not empty: $dest"
  }
} else {
  New-Item -ItemType Directory -Path $dest -Force | Out-Null
}

robocopy $template $dest /E /XD .git node_modules .next .vercel .claude .agents execution /XF .env .env.local .env.production .env.development *.log tsconfig.tsbuildinfo /R:1 /W:1 /NFL /NDL /NP | Out-Host
if ($LASTEXITCODE -ge 8) { throw "Robocopy failed with code $LASTEXITCODE" }

Copy-Item -LiteralPath (Join-Path $dest ".env.example") -Destination (Join-Path $dest ".env.local") -Force
git -C $dest init | Out-Host
git -C $dest branch -M main | Out-Host

Write-Host "Created new store workspace: $dest"
Write-Host "Store name: $StoreName"
Write-Host "Next: fill .env.local with isolated Supabase/Vercel values, run scripts/check-shahy-references.ps1, then validate and deploy."
