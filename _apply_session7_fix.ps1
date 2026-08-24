# Session 7 bulk-fix script (v3) — EN-only cleanup for 37 src/ files
# (evidence/index.astro already fixed via editor; preserved by _revert_session7.ps1).
# Idempotent: safe to re-run; no-op when already converted.
#
# Patterns (apply in order):
#   1) Remove `import { resolveRoute } from "<...>/i18n/routes";`
#   2) Replace `const (locale|lc|L) = (Astro.currentLocale || ??  "en") as (Locale|L);`
#      with `const $1 = "en";`
#   3) Replace `resolveRoute((locale|lc), X)` with bare `X`
#   4) Remove `import type { Locale as L } from "<...>/config/site.config";`
#      (the `as L` cast is gone after step 2)
#   5) Heuristic: remove `import type { Locale } from "<...>/config/site.config";`
#      only if Locale is no longer referenced elsewhere in the file
#      (e.g., Props uses `Locale` -> KEEP the import; otherwise remove).

$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

# Skip evidence/index.astro — already fixed via editor in session 7
$files = @(
  'src/components/CTA.astro',
  'src/components/blog/BlogCard.astro',
  'src/components/hero/Hero.astro',
  'src/components/showcase/PagesOverview.astro',
  'src/pages/404.astro',
  'src/pages/compare.astro',
  'src/pages/guides.astro',
  'src/pages/index.astro',
  'src/pages/_shared/_CaseStudyDetail.astro',
  'src/pages/applications/index.astro',
  'src/pages/cases/index.astro',
  'src/pages/compare/[slug].astro',
  'src/pages/corrosion/index.astro',
  'src/pages/equipment/index.astro',
  'src/pages/failures/index.astro',
  'src/pages/finishes/index.astro',
  'src/pages/grades/index.astro',
  'src/pages/guides/[slug].astro',
  'src/pages/heat-treatment/index.astro',
  'src/pages/industries/index.astro',
  'src/pages/industries/aerospace/index.astro',
  'src/pages/industries/automotive/index.astro',
  'src/pages/industries/chemical-processing/index.astro',
  'src/pages/industries/defence/index.astro',
  'src/pages/industries/marine/index.astro',
  'src/pages/industries/medical/index.astro',
  'src/pages/industries/oil-and-gas/index.astro',
  'src/pages/industries/semiconductor/index.astro',
  'src/pages/processes/index.astro',
  'src/pages/procurement/index.astro',
  'src/pages/selection/index.astro',
  'src/pages/solutions/index.astro',
  'src/pages/solutions/systems/5axis-cnc-machining.astro',
  'src/pages/solutions/systems/additive-manufacturing.astro',
  'src/pages/solutions/systems/turn-mill-machining.astro',
  'src/pages/standards/index.astro',
  'src/pages/tools/grade-comparison.astro',
  'src/pages/tools/hardness-converter.astro',
  'src/pages/tools/index.astro'
)

# Patterns
$patImport       = '(?m)^[ \t]*import\s*\{\s*resolveRoute\s*\}\s*from\s*"[^"]*i18n/routes";\r?\n'
$patInit         = '(?m)^[ \t]*const\s+(locale|lc|L)\s*=\s*\(\s*Astro\.currentLocale\s+(?:\|\||\?\?)\s*["'']en["'']\s*\)\s*as\s+(Locale|L)\s*;\s*\r?\n'
$patResolve      = 'resolveRoute\((locale|lc),\s*((?:[^()]+|\([^()]*\))*)\)'
$patLocaleTypeL  = '(?m)^[ \t]*import\s+type\s+\{\s*Locale\s+as\s+L\s*\}\s+from\s+"[^"]*config/site\.config";\r?\n'
$patLocaleType   = '(?m)^[ \t]*import\s+type\s+\{\s*Locale\s*\}\s+from\s+"[^"]*config/site\.config";\r?\n'

# Replacement strings — PowerShell-corrected so .NET regex sees backreferences:
#   - `$1 inside a double-quoted PS string = literal `$1` (PS escapes `$`)
#   - `r`n` inside a double-quoted PS string = literal CR + LF
#   - single-quoted `'$2'` = literal `$2` (no PS escape processing)
$replInit        = "const `$1 = ""en"";`r`n"
$replResolve     = '$2'
$replLocaleTypeL = ''
$replLocaleType  = ''

$summary = @()

foreach ($rel in $files) {
  $path = Join-Path $projectRoot $rel
  if (-not (Test-Path -LiteralPath $path)) {
    $summary += "MISSING: $rel"
    continue
  }
  $orig = [System.IO.File]::ReadAllText($path)
  $content = $orig

  # 1) Remove i18n/routes import line
  $content = [regex]::Replace($content, $patImport, $replLocaleTypeL)

  # 2) Replace locale cast init with literal "en"
  $content = [regex]::Replace($content, $patInit, $replInit)

  # 3) Unwrap resolveRoute((locale|lc), X) -> X
  $content = [regex]::Replace($content, $patResolve, $replResolve)

  # 4) Remove `Locale as L` type import (the alias is now unused after step 2)
  $content = [regex]::Replace($content, $patLocaleTypeL, $replLocaleTypeL)

  # 5) Heuristic: remove bare `Locale` type import only if Locale
  #    is no longer referenced anywhere else in the file
  $m = [regex]::Match($content, $patLocaleType)
  if ($m.Success) {
    $without = [regex]::Replace($content, $patLocaleType, $replLocaleType, 1)
    if (-not [regex]::IsMatch($without, '\bLocale\b')) {
      $content = $without
    }
  }

  if ($content -ne $orig) {
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($path, $content, $utf8NoBom)
    $summary += "MODIFIED: $rel"
  } else {
    $summary += "no-change: $rel"
  }
}

$summary | ForEach-Object { Write-Host $_ }
Write-Host ""
Write-Host "Total files processed: $($files.Count)"
Write-Host "Modified:              $(($summary | Where-Object { $_ -like 'MODIFIED:*' }).Count)"
Write-Host "No-change:             $(($summary | Where-Object { $_ -like 'no-change:*' }).Count)"
Write-Host "Missing:               $(($summary | Where-Object { $_ -like 'MISSING:*' }).Count)"