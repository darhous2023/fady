$ErrorActionPreference = "Stop"
$branch = git branch --show-current 2>$null
$status = git status --short 2>$null
$commits = git log --oneline -5 2>$null
$handoff = if (Test-Path "docs/FINAL_HANDOFF.md") { Get-Content "docs/FINAL_HANDOFF.md" -TotalCount 80 } else { "No FINAL_HANDOFF.md yet." }

Write-Host "Branch: $branch"
Write-Host "Status:"
$status
Write-Host "Latest commits:"
$commits
Write-Host "Handoff excerpt:"
$handoff
