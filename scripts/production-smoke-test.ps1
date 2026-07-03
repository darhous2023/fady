param(
  [Parameter(Mandatory=$true)][string]$Url
)

$ErrorActionPreference = "Stop"
$base = $Url.TrimEnd("/")
$routes = @("/", "/faq", "/cart", "/signin", "/admin/login")
foreach ($route in $routes) {
  $target = "$base$route"
  $res = Invoke-WebRequest -Uri $target -Method GET -MaximumRedirection 5 -TimeoutSec 30
  [pscustomobject]@{ Route = $route; Status = [int]$res.StatusCode; Length = $res.RawContentLength }
  if ($res.StatusCode -ge 400) { throw "Smoke test failed for $target with $($res.StatusCode)" }
}
Write-Host "Production smoke test completed. No data was modified."
