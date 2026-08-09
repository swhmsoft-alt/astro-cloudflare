---
title: "Grade 5 Titanium Turning Parameters"
description: "CNC turning parameters for Grade 5 titanium Ti-6Al-4V speeds feeds tooling."
locale: en
evidenceCategory: cutting-parameters
source: "Sandvik Coromant"
sourceUrl: ""
sourceAuthority: "MEDIUM"
claimSupport: "PARTIALLY_SUPPORTED"
claimScope: "MANUFACTURER_RECOMMENDATION"
dataPoints:
  - property: "Turning Speed (Rough OD)"
    value: "200-300"
    unit: "SFM"
    notes: "AlTiN-coated carbide CNMG inserts"
  - property: "Turning Speed (Finish OD)"
    value: "250-350"
    unit: "SFM"
    notes: ""
  - property: "Turning Speed (Boring)"
    value: "200-300"
    unit: "SFM"
    notes: ""
  - property: "Feed (Rough OD)"
    value: "0.008-0.015"
    unit: "IPR"
    notes: ""
  - property: "Feed (Finish OD)"
    value: "0.004-0.008"
    unit: "IPR"
    notes: ""
  - property: "Feed (Boring)"
    value: "0.004-0.010"
    unit: "IPR"
    notes: ""
  - property: "Depth of Cut (Rough)"
    value: "0.100-0.200"
    unit: "in"
    notes: ""
  - property: "Depth of Cut (Finish)"
    value: "0.010-0.050"
    unit: "in"
    notes: ""
  - property: "Tool Edge Life @ 250 SFM"
    value: "30-45"
    unit: "min"
    notes: "AlTiN-coated carbide CNMG inserts"

materials:
  - grade-5-titanium
processes:
  - cnc-turning
---
## Turning Parameters
| Operation | Speed (SFM) | Feed (IPR) | DOC (in) |
|-----------|-------------|------------|----------|
| Rough OD | 200-300 | 0.008-0.015 | 0.100-0.200 |
| Finish OD | 250-350 | 0.004-0.008 | 0.010-0.050 |
| Boring | 200-300 | 0.004-0.010 | 0.030-0.100 |
| Threading | 150-200 | per pitch | multiple passes |
## Tool Life
At 250 SFM: 30-45 min edge life. Use AlTiN-coated carbide CNMG inserts.

## Evidence Basis

Based on machining recommendations from Sandvik Coromant's titanium machining guide (tooling-maker application data). These are manufacturer-recommended starting points, not guaranteed outcomes — they must be validated per machine, tooling, and setup rigidity.

## Engineering Interpretation (titanium.blog)

(titanium.blog) Grade 5 turning parameters run well below steel because titanium's low thermal conductivity concentrates heat at the cutting edge. The 200-350 SFM band with AlTiN-coated carbide reflects that reality; start at the conservative end, keep the tool engaged, and use high-pressure coolant to manage edge temperature. These are starting recommendations, not absolutes.
