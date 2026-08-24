# Session 7 revert — restore 38 files to git HEAD (Session 6 state).
# Idempotent: git checkout HEAD is a no-op when already at HEAD.
# Preserves the manual fix for src/pages/evidence/index.astro via _evidence_FIXED.txt.

$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

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

$summary = @()
foreach ($rel in $files) {
  $ok = $true
  try {
    # Use LiteralPath so [slug] paths aren't treated as wildcards
    $literalTarget = Join-Path $projectRoot $rel
    git checkout HEAD -- $literalTarget 2>&1 | Out-Null
  } catch {
    $ok = $false
  }
  if ($ok) { $summary += "REVERTED: $rel" } else { $summary += "FAIL: $rel" }
}

# Restore the manual Session 7 fix for evidence/index.astro
$evidenceFixed = Join-Path $projectRoot '_evidence_FIXED.txt'
$evidenceDst = Join-Path $projectRoot 'src/pages/evidence/index.astro'
if (Test-Path -LiteralPath $evidenceFixed) {
  Copy-Item -LiteralPath $evidenceFixed -Destination $evidenceDst -Force
  $summary += "RESTORED: src/pages/evidence/index.astro (Session 7 manual fix)"
} else {
  $summary += "MISSING_BACKUP: _evidence_FIXED.txt"
}

$summary | ForEach-Object { Write-Host $_ }
Write-Host ""
Write-Host "Total files reverted: $(($summary | Where-Object { $_ -like 'REVERTED:*' }).Count)"
Write-Host "Restored evidence:    $(($summary | Where-Object { $_ -like 'RESTORED:*' }).Count)"
Write-Host "Failures:             $(($summary | Where-Object { $_ -like 'FAIL:*' }).Count)"