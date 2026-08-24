# Test regex replacements on one file (corrosion/index.astro) — dry-run only.

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

$rel = 'src/pages/corrosion/index.astro'
$path = Join-Path $projectRoot $rel
$orig = [System.IO.File]::ReadAllText($path)

$patImport       = '(?m)^[ \t]*import\s*\{\s*resolveRoute\s*\}\s*from\s*"[^"]*i18n/routes";\r?\n'
$patInit         = '(?m)^[ \t]*const\s+(locale|lc|L)\s*=\s*\(\s*Astro\.currentLocale\s+(?:\|\||\?\?)\s*["'']en["'']\s*\)\s*as\s+(Locale|L)\s*;\s*\r?\n'
$patResolve      = 'resolveRoute\((locale|lc),\s*((?:[^()]+|\([^()]*\))*)\)'
$patLocaleTypeL  = '(?m)^[ \t]*import\s+type\s+\{\s*Locale\s+as\s+L\s*\}\s+from\s+"[^"]*config/site\.config";\r?\n'
$patLocaleType   = '(?m)^[ \t]*import\s+type\s+\{\s*Locale\s*\}\s+from\s+"[^"]*config/site\.config";\r?\n'

$replInit        = "const `$1 = ""en"";`r`n"
$replResolve     = '$2'

Write-Host "=== ORIGINAL (first 12 lines) ==="
$orig -split "`r?`n" | Select-Object -First 12 | ForEach-Object { Write-Host "  $_" }

Write-Host ""
Write-Host "=== After patImport (i18n/routes import removal) ==="
$t1 = [regex]::Replace($orig, $patImport, '')
$t1 -split "`r?`n" | Select-Object -First 12 | ForEach-Object { Write-Host "  $_" }

Write-Host ""
Write-Host "=== After patInit (locale cast init) ==="
$t2 = [regex]::Replace($t1, $patInit, $replInit)
$t2 -split "`r?`n" | Select-Object -First 12 | ForEach-Object { Write-Host "  $_" }

Write-Host ""
Write-Host "=== After patResolve (unwrap resolveRoute) ==="
$t3 = [regex]::Replace($t2, $patResolve, $replResolve)
$t3 -split "`r?`n" | Select-Object -First 15 | ForEach-Object { Write-Host "  $_" }

Write-Host ""
Write-Host "=== After patLocaleTypeL ==="
$t4 = [regex]::Replace($t3, $patLocaleTypeL, '')
$t4 -split "`r?`n" | Select-Object -First 12 | ForEach-Object { Write-Host "  $_" }

Write-Host ""
Write-Host "=== After patLocaleType (heuristic) ==="
$m = [regex]::Match($t4, $patLocaleType)
if ($m.Success) {
  $without = [regex]::Replace($t4, $patLocaleType, '', 1)
  if (-not [regex]::IsMatch($without, '\bLocale\b')) {
    Write-Host "  Would remove bare Locale import (Locale no longer referenced)"
    $t5 = $without
  } else {
    Write-Host "  Would keep bare Locale import (Locale still referenced somewhere)"
    $t5 = $t4
  }
} else {
  Write-Host "  No bare Locale import found"
  $t5 = $t4
}
$t5 -split "`r?`n" | Select-Object -First 15 | ForEach-Object { Write-Host "  $_" }

Write-Host ""
Write-Host "=== Sanity: any literal backticks in final output? ==="
$backtickCount = ([regex]::Matches($t5, '`')).Count
Write-Host "  Backtick count: $backtickCount (should be 0)"