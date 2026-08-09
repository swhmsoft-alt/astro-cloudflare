---
title: "DMLS Process Parameters for Ti-6Al-4V"
description: "DMLS laser parameters and mechanical properties for Ti-6Al-4V titanium."
locale: en
evidenceCategory: process-capabilities
source: "EOS Material Data Sheet"
sourceUrl: ""
sourceAuthority: "MEDIUM"
claimSupport: "PARTIALLY_SUPPORTED"
claimScope: "MANUFACTURER_RECOMMENDATION"
dataPoints:
  - property: "Laser Power (Standard)"
    value: "200-400"
    unit: "W"
    notes: "EOS Material Data Sheet"
  - property: "Scan Speed (Standard)"
    value: "1000-2000"
    unit: "mm/s"
    notes: ""
  - property: "Layer Thickness"
    value: "30-60"
    unit: "µm"
    notes: ""
  - property: "Tensile Strength (XY)"
    value: "1150"
    unit: "MPa"
    notes: "As-built"
  - property: "Tensile Strength (Z)"
    value: "1080"
    unit: "MPa"
    notes: "As-built"
  - property: "Yield Strength (XY)"
    value: "1050"
    unit: "MPa"
    notes: ""
  - property: "Elongation (XY)"
    value: "12"
    unit: "%"
    notes: ""
materials:
  - grade-5-titanium
  - grade-23-titanium
processes:
  - dmls
---
## Standard Parameters
| Parameter | Standard | High-Resolution |
|-----------|----------|----------------|
| Laser Power | 200–400 W | 100–400 W |
| Scan Speed | 1000–2000 mm/s | 500–2000 mm/s |
| Layer Thickness | 30–60 µm | 20–60 µm |
## Mechanical Properties
| Property | XY | Z |
|----------|----|---|
| Tensile Strength | 1150 MPa | 1080 MPa |
| Yield Strength | 1050 MPa | 990 MPa |
| Elongation | 12% | 10% |

## Evidence Basis

Based on EOS Ti-6Al-4V Material Data Sheet (machine manufacturer). Laser parameters are manufacturer-recommended process windows; mechanical properties are as-built typical values from that manufacturer's data sheet and may vary with heat treatment and build orientation.

## Engineering Interpretation (titanium.blog)

(titanium.blog) DMLS parts are anisotropic: XY strength exceeds Z because layer bonding governs Z properties. As-built tensile (1080-1150 MPa) meets wrought Grade 5 minima but elongation (10-12%) is lower than wrought; specify stress relief/annealing and build-orientation reviews for load-bearing applications. Manufacturer data, not an absolute guarantee across all machines.
