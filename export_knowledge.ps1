$root = "c:\Users\User\Desktop\astro-cloudflare-starter-main\src\content"
$output = [System.IO.Path]::GetTempPath() + "knowledge-pages-20260719.csv"
$baseUrl = "https://cametbol.com"

# URL routing map
$routeMap = @{
    "core\materials"        = "/knowledge/materials"
    "core\processes"        = "/knowledge/processes"
    "core\standards"        = "/knowledge/standards"
    "core\equipment"        = "/knowledge/equipment"
    "core\surface-finishes" = "/knowledge/surface-finishes"
    "core\industries"       = "/knowledge/industries"
    "derived\evidence"      = "/knowledge/evidence"
    "derived\comparisons"   = "/compare"
    "derived\guides"        = "/guides"
    "derived\cases"         = "/knowledge/cases"
    "derived\procurement"   = "/knowledge/procurement"
    "applications"          = "/knowledge/applications"
}

$categoryName = @{
    "core\materials"        = "Materials"
    "core\processes"        = "Processes"
    "core\standards"        = "Standards"
    "core\equipment"        = "Equipment"
    "core\surface-finishes" = "Surface Finishes"
    "core\industries"       = "Industries"
    "derived\evidence"      = "Evidence"
    "derived\comparisons"   = "Comparisons"
    "derived\guides"        = "Guides"
    "derived\cases"         = "Cases"
    "derived\procurement"   = "Procurement"
    "applications"          = "Applications"
}

$rows = @()

foreach ($relDir in $routeMap.Keys) {
    $fullDir = Join-Path $root $relDir
    if (-not (Test-Path $fullDir)) { continue }
    
    $files = Get-ChildItem -Path $fullDir -Filter "*.md" | Where-Object { $_.CreationTime -ge [DateTime]"2026-07-19" }
    
    $prefix = $routeMap[$relDir]
    $cat = $categoryName[$relDir]
    
    foreach ($f in $files) {
        $slug = $f.BaseName
        $url = "$baseUrl$prefix/$slug/"
        
        # Read frontmatter for title and description
        $content = Get-Content -Path $f.FullName -Raw -ErrorAction SilentlyContinue
        $title = $slug
        $desc = ""
        if ($content -match "^---\s*\n(.*?\n)---") {
            $fm = $Matches[1]
            if ($fm -match "title:\s*""?(.+?)""?(\r?\n|$)") { $title = $Matches[1] }
            if ($fm -match "description:\s*""?(.+?)""?(\r?\n|$)") { $desc = $Matches[1] }
        }
        
        $rows += [PSCustomObject]@{
            Category = $cat
            Title = $title
            URL = $url
            Slug = $slug
            Created = $f.CreationTime.ToString("yyyy-MM-dd HH:mm")
            SizeBytes = $f.Length
        }
    }
}

# Sort by category then title
$rows = $rows | Sort-Object Category, Title

# Export to CSV (UTF8 BOM for Excel compatibility)
$rows | Export-Csv -Path $output -Encoding UTF8 -NoTypeInformation

Write-Host "========================================"
Write-Host "  Knowledge Pages Export Complete"
Write-Host "========================================"
Write-Host "  Base URL:  $baseUrl"
Write-Host "  Output:    $output"
Write-Host "  Total:     $($rows.Count) pages"
Write-Host "========================================"

# Show summary by category
$rows | Group-Object Category | ForEach-Object {
    Write-Host ("  " + $_.Name + ": " + $_.Count + " pages")
}

Write-Host "========================================"
Write-Host "  Open in Excel: File → Open → $output"
Write-Host "========================================"
