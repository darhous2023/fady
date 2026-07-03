param(
  [string]$Root = (Get-Location).Path
)

$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $Root

function Test-Command($Name, $Required = $true) {
  $cmd = Get-Command $Name -ErrorAction SilentlyContinue
  if (-not $cmd -and $Required) { throw "Required command not found: $Name" }
  [pscustomobject]@{ Tool = $Name; Present = [bool]$cmd; Path = $cmd.Source }
}

$tools = @(
  Test-Command "node",
  Test-Command "npm",
  Test-Command "git",
  Test-Command "gh" $false,
  Test-Command "supabase" $false,
  Test-Command "vercel" $false,
  Test-Command "rg"
)

$requiredFiles = @("package.json", "package-lock.json", ".env.example", "AGENTS.md", "PROMPT.md", "PROJECT_CONTEXT.md")
$missing = $requiredFiles | Where-Object { -not (Test-Path -LiteralPath $_) }

$tools | Format-Table -AutoSize
if ($missing.Count -gt 0) { throw "Missing required files: $($missing -join ', ')" }
Write-Host "Preflight completed."
