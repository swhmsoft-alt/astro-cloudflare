$f = "src\content.config.ts"
$c = [System.IO.File]::ReadAllText((Resolve-Path $f))

# Helper: find a multi-line block by start marker and remove it
$svcStart = $c.IndexOf("const services = defineCollection({")
$svcEnd = $c.IndexOf("};", $svcStart) + 2
$c = $c.Remove($svcStart, $svcEnd - $svcStart)

$eqStart = $c.IndexOf("const equipment = defineCollection({")
$eqEnd = $c.IndexOf("};", $eqStart) + 2
$c = $c.Remove($eqStart, $eqEnd - $eqStart)

# Remove export references
$c = $c.Replace("`r`n  services,", "")
$c = $c.Replace("`r`n  equipment,", "")

[System.IO.File]::WriteAllText((Resolve-Path $f), $c, [System.Text.UTF8Encoding]::new($false))
Write-Host "done"
