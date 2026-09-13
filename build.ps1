$ErrorActionPreference = "Continue"
Set-Location 'c:\Users\User\Desktop\astro-cloudflare-starter-main'
$env:PATH = 'C:\Users\User\AppData\Roaming\npm;' + $env:PATH
& 'C:\Users\User\AppData\Roaming\npm\pnpm.cmd' build 2>&1 | Out-File -Encoding utf8 'C:\Users\User\Desktop\build-out.txt'
exit $LASTEXITCODE