---
title: "Titanium Bead Blasting — Surface Roughness Data"
description: "Surface roughness ranges achieved by bead blasting titanium components. Media type, pressure, and distance parameters with quantified Ra values."
locale: en
evidenceCategory: "surface-roughness"
source: "ASM Handbook Volume 5: Surface Engineering"
sourceAuthority: "MEDIUM"
claimSupport: "PARTIALLY_SUPPORTED"
claimScope: "TYPICAL_VALUE"

relatedMaterials:
  - "grade-5-titanium"
  - "grade-2-titanium"
relatedProcesses:
  - "cnc-machining"
  - "additive-manufacturing"
relatedStandards:
  - "astm-b265"
dataPoints:
  - property: "Typical Ra Range (Bead Blasted)"
    value: "0.8-3.2"
    unit: "µm Ra"
    notes: "Glass bead media, 4-6 bar pressure"
  - property: "Typical Ra Range (Machined)"
    value: "0.4-1.6"
    unit: "µm Ra"
    notes: "Standard CNC machining finish"
  - property: "Typical Ra Range (Polished)"
    value: "0.05-0.2"
    unit: "µm Ra"
    notes: "Mechanical polishing"
  - property: "Bead Size Range"
    value: "50-250"
    unit: "µm"
    notes: "Glass beads, larger = rougher finish"
  - property: "Blasting Pressure"
    value: "4-8"
    unit: "bar"
    notes: "Higher pressure = deeper surface deformation"
order: 3
faqs:
  - question: "Does bead blasting affect titanium fatigue strength?"
    answer: "Yes. Bead blasting introduces compressive residual stresses that can improve fatigue life. However, excessive pressure can cause surface damage. Controlled peening is preferred for fatigue-critical applications."
---

## Quick Answer

Bead blasting titanium produces surface roughness of 0.8-3.2 µm Ra depending on media size (50-250 µm glass beads) and pressure (4-8 bar). It creates a uniform matte finish suitable for cosmetic and functional applications.

## Surface Roughness Comparison

| Finish Type | Ra Range (µm) | Application |
|---|---|---|
| Machined (Standard) | 0.4-1.6 | General purpose |
| Bead Blasted | 0.8-3.2 | Cosmetic matte, uniform texture |
| Polished | 0.05-0.2 | Medical implants, wear surfaces |
| Anodized | 0.2-0.8 | Corrosion protection + color |
| Passivated | 0.4-1.6 | Corrosion resistance (no change) |

## Process Parameters

| Parameter | Typical Range | Effect on Ra |
|---|---|---|
| Bead Size | 50-250 µm | Larger beads = higher Ra |
| Pressure | 4-8 bar | Higher pressure = higher Ra |
| Distance | 100-300 mm | Greater distance = lower impact |
| Angle | 60-90° | 90° = maximum texture |
| Duration | Until uniform appearance | Over-blasting can pit surface |

## Engineering Notes

- Bead blasting hides machining marks and creates a uniform appearance
- Does not change part dimensions significantly (material removal < 1 µm)
- Can be used before anodizing for consistent color appearance
- Not recommended for sealing surfaces or bearing journals
- For fatigue-critical parts, consult with the engineering team about shot peening as an alternative

## Evidence Basis

Based on surface-engineering guidance from ASM Handbook Volume 5 and ASTM B600. ASM documents the general bead-blasting process capability; the specific Ra bands listed here are typical/indicative values derived from industry practice, not certified finish guarantees for every configuration.

## Engineering Interpretation (titanium.blog)

(titanium.blog) Bead blasting is a surface-conditioning process, not a precision-finishing one: treat the 0.8-3.2 µm Ra band as a capability range, not a guaranteed tolerance. It is suitable for cosmetic matte finishes and pre-anodizing texture; for fatigue-critical or sealing surfaces, prefer controlled shot peening or machined finishes instead.

## Sources

- ASM Handbook Volume 5: Surface Engineering
- ASTM B600 — Standard Guide for Descaling and Cleaning Titanium Surfaces
