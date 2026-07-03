param(
  [string]$EnvFile = ".env.local"
)

$ErrorActionPreference = "Stop"
if (-not (Test-Path -LiteralPath $EnvFile)) { throw "Missing environment file: $EnvFile" }
$content = Get-Content -LiteralPath $EnvFile
$required = @("NEXT_PUBLIC_APP_URL","NEXT_PUBLIC_SUPABASE_URL","NEXT_PUBLIC_SUPABASE_ANON_KEY","DATABASE_URL","BETTER_AUTH_SECRET","BETTER_AUTH_URL","SUPABASE_SERVICE_ROLE_KEY")
$names = $content | Where-Object { $_ -match "^\s*[^#][A-Za-z0-9_]+\s*=" } | ForEach-Object { ($_ -split "=",2)[0].Trim() }
$missing = $required | Where-Object { $_ -notin $names }
if ($missing.Count -gt 0) { throw "Missing required variables: $($missing -join ', ')" }
if ($content -match "pggmpvhyuxfetifzesws|shah-y-store\.vercel\.app") { throw "Environment points to ShahY production. Use isolated resources." }
Write-Host "Environment validation completed without printing secret values."
