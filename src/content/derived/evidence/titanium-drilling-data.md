---
title: "Drilling Parameters for Titanium Alloys"
description: "Drilling speeds feeds pecking cycles for titanium alloys by hole diameter and grade."
locale: en
evidenceCategory: cutting-parameters
source: "Guhring OSG Application Data"
sourceUrl: ""
sourceAuthority: "MEDIUM"
claimSupport: "PARTIALLY_SUPPORTED"
claimScope: "MANUFACTURER_RECOMMENDATION"
dataPoints:
  - property: "Drill Speed Grade 5 (6mm)"
    value: "60-100"
    unit: "SFM"
    notes: "Guhring / OSG"
  - property: "Drill Speed Grade 5 (20mm)"
    value: "50-80"
    unit: "SFM"
    notes: ""
  - property: "Drill Speed Grade 2 (6mm)"
    value: "100-150"
    unit: "SFM"
    notes: ""
  - property: "Drill Feed Grade 5 (6mm)"
    value: "0.003-0.006"
    unit: "IPR"
    notes: ""
  - property: "Drill Feed Grade 5 (20mm)"
    value: "0.005-0.010"
    unit: "IPR"
    notes: ""
  - property: "Peck Depth (small holes)"
    value: "0.5-1.0"
    unit: "mm"
    notes: "Under 6mm dia"
  - property: "Peck Depth (large holes)"
    value: "1.0-2.0"
    unit: "mm"
    notes: ""
materials:
  - grade-5-titanium
  - grade-23-titanium
  - grade-2-titanium
  - grade-9-titanium
processes:
  - cnc-machining
---
## Drilling by Diameter
| Dia (mm) | Grade 5 (SFM) | Feed (IPR) | Grade 2 (SFM) | Feed (IPR) |
|----------|--------------|------------|--------------|------------|
| 3 mm | 50-80 | 0.002-0.004 | 80-120 | 0.003-0.006 |
| 6 mm | 60-100 | 0.003-0.006 | 100-150 | 0.004-0.008 |
| 10 mm | 60-100 | 0.004-0.008 | 100-150 | 0.005-0.010 |
| 20 mm | 50-80 | 0.005-0.010 | 80-120 | 0.006-0.012 |
## Peck Cycle
0.5-1.0 mm peck for holes under 6 mm. 1.0-2.0 mm for larger holes. Use coolant-fed drills above 3x dia depth.

## Evidence Basis

Based on drilling application data from Guhring and OSG (drill manufacturers). These are recommended starting parameters by hole diameter and grade; actual values depend on drill type, coolant delivery, and machine.

## Engineering Interpretation (titanium.blog)

(titanium.blog) Drilling titanium requires aggressive pecking and coolant-fed drills because chips weld to the edge under heat, causing tool breakage. CP grades (2, 9) drill faster than Ti-6Al-4V. Use coolant-fed drills above 3x-diameter depth. These are starting recommendations, not absolutes.
