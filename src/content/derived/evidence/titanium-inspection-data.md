---
title: "Titanium Component Inspection Methods and Standards"
description: "Inspection methods for titanium components including NDT techniques CMM inspection and surface measurement."
locale: en
evidenceCategory: tolerances
source: "AS9100D ASME Y14.5"
sourceUrl: ""
sourceAuthority: "MEDIUM"
claimSupport: "PARTIALLY_SUPPORTED"
claimScope: "STANDARD_REQUIREMENT"
dataPoints:
  - property: "CMM Accuracy"
    value: "±0.001"
    unit: "mm"
    notes: "Zeiss-class CMM"
  - property: "Bore Gauge Accuracy"
    value: "±0.002"
    unit: "mm"
    notes: ""
  - property: "Dye Penetrant Detection"
    value: ">1"
    unit: "mm surface crack"
    notes: "ASTM E1417"
  - property: "Ultrasonic Detection"
    value: ">0.5"
    unit: "mm subsurface"
    notes: "ASTM E2375"
  - property: "Eddy Current Detection"
    value: ">0.1"
    unit: "mm surface crack"
    notes: "ASTM E3097"
  - property: "X-Ray Detection"
    value: ">1"
    unit: "% porosity"
    notes: "ASTM E1742"
---
## Dimensional Inspection
| Method | Accuracy | Application |
|--------|----------|-------------|
| CMM (Zeiss) | ±0.001 mm | All dimensions, GD&T |
| Optical Comparator | ±0.010 mm | 2D profiles, thread forms |
| Laser Scanner | ±0.020 mm | Organic shapes, reverse engineering |
| Bore Gauges | ±0.002 mm | Hole diameter verification |
## Non-Destructive Testing
| Method | Detection Capability | Standard |
|--------|---------------------|----------|
| Dye Penetrant | Surface cracks > 1 mm | ASTM E1417 |
| Ultrasonic | Subsurface > 0.5 mm | ASTM E2375 |
| X-Ray | Internal porosity > 1% | ASTM E1742 |
| Eddy Current | Surface cracks > 0.1 mm | ASTM E3097 |

## Evidence Basis

Based on AS9100D quality-system requirements and ASME Y14.5 dimensioning/tolerancing, plus NDT standards ASTM E1417 / E2375 / E1742 / E3097. Method accuracies and detection limits are typical instrument capabilities.

## Engineering Interpretation (titanium.blog)

(titanium.blog) Match the inspection method to the defect type and criticality: eddy current finds fine surface cracks (0.1 mm), ultrasonic finds subsurface flaws (0.5 mm), and dye penetrant finds surface cracks above 1 mm. CMM is the dimensional authority for GD&T; pair it with process control for titanium's springback tendency.
