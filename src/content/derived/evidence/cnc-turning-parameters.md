---
title: "CNC Turning Parameters for Titanium Alloys"
description: "Cutting parameters for CNC turning of titanium alloys by grade."
locale: en
evidenceCategory: cutting-parameters
source: "Sandvik Coromant, Machining Data Handbook"
sourceUrl: ""
sourceAuthority: "MEDIUM"
claimSupport: "PARTIALLY_SUPPORTED"
claimScope: "MANUFACTURER_RECOMMENDATION"
dataPoints:
  - property: "Turning Speed (Grade 5)"
    value: "200-250"
    unit: "SFM"
    notes: "Sandvik / Machining Data Handbook"
  - property: "Turning Speed (Grade 23)"
    value: "200-250"
    unit: "SFM"
    notes: ""
  - property: "Turning Speed (Grade 2)"
    value: "250-400"
    unit: "SFM"
    notes: ""
  - property: "Turning Speed (Grade 9)"
    value: "250-400"
    unit: "SFM"
    notes: ""
  - property: "Turning Feed (Grade 5/23)"
    value: "0.005-0.012"
    unit: "IPR"
    notes: ""
  - property: "Turning Feed (Grade 2)"
    value: "0.006-0.015"
    unit: "IPR"
    notes: ""
  - property: "Turning Feed (Grade 9)"
    value: "0.006-0.014"
    unit: "IPR"
    notes: ""
  - property: "Depth of Cut"
    value: "0.050-0.150"
    unit: "in"
    notes: "All grades"
materials:
  - grade-5-titanium
  - grade-23-titanium
  - grade-2-titanium
  - grade-9-titanium
processes:
  - cnc-turning
---
## Turning Parameters by Grade
| Grade | Speed (SFM) | Feed (IPR) | DOC (in) |
|-------|-------------|------------|----------|
| Grade 5 | 200–250 | 0.005–0.012 | 0.050–0.150 |
| Grade 23 | 200–250 | 0.005–0.012 | 0.050–0.150 |
| Grade 2 | 250–400 | 0.006–0.015 | 0.050–0.150 |
| Grade 9 | 250–400 | 0.006–0.014 | 0.050–0.150 |

## Evidence Basis

Based on turning application data from Sandvik Coromant and the Machining Data Handbook (Metcut). These are manufacturer-recommended starting parameters, not guaranteed outcomes — they must be validated per machine and tooling.

## Engineering Interpretation (titanium.blog)

(titanium.blog) CP grades (2, 9) turn faster than Ti-6Al-4V because they are softer and less work-hardening, so edge heat generation is lower. Grade 5/23 are held to 200-250 SFM to protect edge life; use sharp, positive-geometry inserts and high-pressure coolant. These are starting recommendations, not absolutes.
