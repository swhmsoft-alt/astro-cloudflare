---
title: "Ti-6Al-4V Fatigue Properties and S-N Data"
description: "Fatigue endurance data for Ti-6Al-4V titanium alloy in various conditions."
locale: en
evidenceCategory: material-properties
source: "ASM Handbook Volume 19"
sourceAuthority: "MEDIUM"
claimSupport: "SUPPORTED"
claimScope: "GENERAL_PROPERTY"
dataPoints:
  - property: "Fatigue Strength (Annealed)"
    value: "480-550"
    unit: "MPa"
    notes: "Endurance limit at 10^7 cycles, rotating bending"
  - property: "Fatigue Strength (STA)"
    value: "620-700"
    unit: "MPa"
    notes: "Endurance limit at 10^7 cycles, rotating bending"
---
## Fatigue Properties
| Condition | Endurance Limit (10⁷cycles) | Test Method |
|-----------|------------------------------|-------------|
| Annealed | 480-550 MPa | Rotating bending |
| STA | 620-700 MPa | Rotating bending |
| HIP + Annealed | 550-620 MPa | Rotating bending |
## Surface Finish Effect on Fatigue
| Surface Condition | Fatigue Strength Factor |
|------------------|----------------------|
| Polished (Ra 0.1 µm) | 1.0 baseline |
| Machined (Ra 0.8 µm) | 0.85 |
| As-DMLS | 0.60-0.70 |
| Bead Blasted | 0.90-0.95 (compressive stress) |
## Engineering Interpretation

The endurance values are from ASM Handbook Volume 19 (Fatigue and Fracture). Engineering interpretation (titanium.blog): surface condition has a first-order effect on fatigue life; a machined surface (Ra 0.8) reduces endurance to roughly 0.85x a polished surface, and as-built DMLS is markedly lower (0.60-0.70x). For fatigue-critical titanium parts, specify finishing and avoid as-built additive surfaces unless HIP plus finishing is applied.
## Evidence Basis

Based on published fatigue data from ASM Handbook Volume 19 (Fatigue and Fracture).
