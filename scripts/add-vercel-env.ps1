# Helper: Add SUPABASE_SERVICE_ROLE_KEY to Vercel environment
# Run this script once after logging into Vercel CLI

$envFile = Join-Path $PSScriptRoot "..\\.env.local"
$lines = Get-Content $envFile
$key = ($lines | Where-Object { $_ -match "^SUPABASE_SERVICE_ROLE_KEY=" } | Select-Object -First 1) -replace '^SUPABASE_SERVICE_ROLE_KEY=["'']*', '' -replace '["'']*$', '' -replace "`r",""

if (-not $key) {
    Write-Error "SUPABASE_SERVICE_ROLE_KEY not found in .env.local"
    exit 1
}

Write-Host "Adding SUPABASE_SERVICE_ROLE_KEY to Vercel (production)..."
$key | npx vercel env add SUPABASE_SERVICE_ROLE_KEY production --force
Write-Host "Done! Now redeploy: npx vercel --prod"
