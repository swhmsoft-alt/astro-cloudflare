---
title: "Titanium Welding Parameters and Procedures"
description: "Welding parameters for titanium alloys including TIG MIG parameters shielding gas requirements and joint preparation."
locale: en
evidenceCategory: process-capabilities
source: "AWS D1.9 Structural Welding Code - Titanium"
sourceUrl: ""
sourceAuthority: "MEDIUM"
claimSupport: "PARTIALLY_SUPPORTED"
claimScope: "MANUFACTURER_RECOMMENDATION"
dataPoints:
  - property: "TIG Current (1.5mm)"
    value: "60-90"
    unit: "A"
    notes: "Typical starting value"
  - property: "TIG Current (3.0mm)"
    value: "100-140"
    unit: "A"
    notes: ""
  - property: "TIG Current (6.0mm)"
    value: "160-220"
    unit: "A"
    notes: ""
  - property: "Torch Argon Flow"
    value: "10-15"
    unit: "L/min"
    notes: "99.995% Ar"
  - property: "Trailing Argon Flow"
    value: "15-25"
    unit: "L/min"
    notes: ""
  - property: "Backing Argon Flow"
    value: "5-10"
    unit: "L/min"
    notes: ""
materials:
  - grade-2-titanium
  - grade-5-titanium
  - grade-9-titanium
  - grade-23-titanium
processes:
  - welding
---
## TIG Welding Parameters
| Thickness (mm) | Current (A) | Voltage (V) | Travel Speed (mm/min) | Filler Dia (mm) |
|---------------|------------|-------------|---------------------|----------------|
| 1.5 | 60-90 | 10-12 | 100-150 | 1.6 |
| 3.0 | 100-140 | 10-14 | 80-120 | 2.4 |
| 6.0 | 160-220 | 12-16 | 60-100 | 3.2 |
## Shielding Gas Requirements
| Zone | Gas | Flow Rate |
|------|-----|-----------|
| Torch | 99.995% Ar | 10-15 L/min |
| Trailing | 99.995% Ar | 15-25 L/min |
| Backing | 99.995% Ar | 5-10 L/min |
## Joint Preparation
- Clean within 2 hours of welding: degrease, acid etch, DI water rinse
- Remove oxide layer to bright metal
- Wire brush with stainless steel brush (titanium-only)
- No chlorinated solvents (causes stress corrosion cracking)

## Evidence Basis

Based on AWS D1.9 (Structural Welding Code — Titanium) for welding procedure qualification and shielding requirements, plus typical TIG parameters. AWS D1.9 governs procedure/operator qualification and weld quality, not fixed current/voltage values — the parameters here are typical starting values.

## Engineering Interpretation (titanium.blog)

(titanium.blog) Titanium must be welded under a fully inert argon shield (torch, trailing, and backing zones) because it absorbs oxygen/nitrogen above ~540°C, embrittling the weld. AWS D1.9 defines the acceptance criteria and procedure-qualification route; the listed currents are typical starting points to be validated in a qualified procedure. Shielding is non-negotiable.
