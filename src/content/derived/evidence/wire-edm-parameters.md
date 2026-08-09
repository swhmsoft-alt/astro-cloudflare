---
title: "Wire EDM Parameters for Titanium Alloys"
description: "Wire EDM cutting parameters for titanium by thickness and multi-pass finishing data."
locale: en
evidenceCategory: cutting-parameters
source: "GF Machining Solutions Application Data"
sourceUrl: ""
sourceAuthority: "MEDIUM"
claimSupport: "PARTIALLY_SUPPORTED"
claimScope: "MANUFACTURER_RECOMMENDATION"
dataPoints:
  - property: "Cut Speed (25mm)"
    value: "3.5"
    unit: "mm/min"
    notes: "GF Machining Solutions"
  - property: "Cut Speed (50mm)"
    value: "2.8"
    unit: "mm/min"
    notes: ""
  - property: "Cut Speed (100mm)"
    value: "1.8"
    unit: "mm/min"
    notes: ""
  - property: "Rough Surface (25mm)"
    value: "1.2"
    unit: "µm Ra"
    notes: ""
  - property: "Rough Surface (100mm)"
    value: "1.6"
    unit: "µm Ra"
    notes: ""
  - property: "Trim 1 Finish"
    value: "0.6-0.8"
    unit: "µm"
    notes: ""
  - property: "Trim 3 Finish"
    value: "0.1-0.2"
    unit: "µm"
    notes: ""
  - property: "Wire Diameter"
    value: "0.25-0.30"
    unit: "mm"
    notes: "By thickness"
materials:
  - grade-5-titanium
  - grade-23-titanium
  - grade-2-titanium
  - grade-9-titanium
processes:
  - wire-edm
---
## Parameters by Thickness
| Thickness | Wire Dia | Cut Speed | Surface (Rough) |
|-----------|----------|-----------|-----------------|
| 25 mm | 0.25 mm | 3.5 mm/min | 1.2 µm Ra |
| 50 mm | 0.25 mm | 2.8 mm/min | 1.4 µm Ra |
| 100 mm | 0.30 mm | 1.8 mm/min | 1.6 µm Ra |
## Multi-Pass Finishing
| Pass | Surface Finish |
|------|---------------|
| Rough | 1.2–1.6 µm |
| Trim 1 | 0.6–0.8 µm |
| Trim 2 | 0.3–0.4 µm |
| Trim 3 | 0.1–0.2 µm |

## Evidence Basis

Based on wire EDM application data from GF Machining Solutions (machine manufacturer). Cut speeds and surface finishes are typical for titanium at the stated thicknesses; actual values depend on machine, wire, and flushing.

## Engineering Interpretation (titanium.blog)

(titanium.blog) Wire EDM is well suited to titanium because it cuts without cutting forces (no springback) and without a heat-affected cutting tool. Cut speed drops with thickness, but multi-pass trim finishing recovers surface quality down to 0.1-0.2 µm. These are manufacturer-typical values, not guarantees.
