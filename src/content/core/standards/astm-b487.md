---
title: "ASTM B487 — Coating Thickness by Microscopical Cross-Section Examination"
description: "Engineering reference for ASTM B487-85(2020), the standard test method for direct measurement of metal and oxide coating thickness on metal substrates by microscopical examination of a metallographic cross section. Used for PVD coating thickness verification on titanium, anodized layer thickness on titanium, and electroplated coating thickness across metal-finishing applications."
locale: en
standardType: "process"
materials:
  - "grade-1-titanium"
  - "grade-2-titanium"
  - "grade-5-titanium"
  - "grade-9-titanium"
  - "grade-23-titanium"
industries:
  - "aerospace"
  - "medical"
  - "automotive"
  - "cutting-tools"
  - "consumer"
issuingBody: "ASTM International"
order: 27
---

## TLDR

ASTM B487-85(2020) is the ASTM International standard test method for **direct measurement of metal and oxide coating thickness by microscopical examination of a metallographic cross section**. It is the most precise coating-thickness method for PVD coatings on titanium (TiN, TiAlN, DLC), anodized layers per [AMS 2471](/standards/ams-2471/), and passivation layers per [AMS 2700](/standards/ams-2700/).

## Quick Answer

**What does ASTM B487 cover?**  
ASTM B487 specifies the sectioning, mounting, polishing, and microscopic examination procedure for direct measurement of coating thickness on a metallographic cross-section. The method is destructive but gives a direct, calibrated measurement (versus XRF or eddy-current which are indirect) and is the referee method for disputes between producer and user.

## Scope

ASTM B487 applies to metallic and oxide coatings on metallic substrates including PVD coatings (TiN, TiAlN, CrN, DLC), anodized layers, electroplated coatings, and chemical-conversion coatings. For titanium PVD, it is the standard thickness-verification method referenced by [AMS 2444](/standards/ams-2444/), [AMS 2471](/standards/ams-2471/), and [VDI 3198](/standards/vdi-3198/).

**Key test parameters:**

- **Section orientation:** perpendicular to the coating surface (90° cross-section)
- **Mounting:** epoxy or phenolic resin mount; vacuum impregnation for porous coatings
- **Polishing:** standard metallographic sequence — SiC papers (120 → 600 grit) followed by diamond or alumina polishing (down to 0.05 µm)
- **Etching:** optional; may be required to reveal coating/substrate interface
## Reporting

The report should include:

- Sample identification and section location
- Coating thickness measurements (individual values + mean ± standard deviation)
- Coating uniformity characterization
- Substrate material and surface preparation
- Magnification and measurement reference (e.g., calibrated reticle or image-analysis system)
- Photomicrographs at the measurement locations

For PVD coatings on titanium, a typical report might be:

```
TiN PVD on Grade 5 Ti-6Al-4V, AMS 2444
Cross-section B487 measurement @ 1000×
Measurements (µm): 2.8, 3.0, 2.9, 3.1, 2.9
Mean ± SD: 2.94 ± 0.11 µm
Acceptance: 1–5 µm per AMS 2444 — PASS
```

## Common Pitfalls

- **Edge rounding during polishing.** Insufficient mount hardness or excessive polishing pressure causes the coating edge to round, making thickness measurement artificially low. Use a hard mount (filled epoxy) and minimal final-polish pressure.
- **Coating pull-out.** Soft or poorly-adhered coatings can pull out of the mount during polishing, leaving a gap. Vacuum impregnation prevents this.
- **Inclined section.** A non-perpendicular section makes the coating appear thicker than it actually is; verify 90° orientation before mounting.
- **Coating damage during cutting.** Slow-speed cutting with adequate coolant prevents heat-affected damage to thin (1–5 µm) PVD coatings.
- **Single-point measurement.** A single thickness measurement does not characterize uniformity; take ≥ 5 measurements across the section and report mean ± standard deviation.

## Related Standards

- **[AMS 2444](/standards/ams-2444/)** — Coating, Physical Vapor Deposition of Titanium Nitride. Aerospace process specification for TiN PVD on titanium; B487 is the coating-thickness test method.
- **[AMS 2471](/standards/ams-2471/)** — Anodizing of Titanium and Titanium Alloys. Aerospace anodizing standard; B487 is used for anodized-layer thickness measurement.
- **[ASTM C633](/standards/astm-c633/)** — Adhesion or Cohesion Strength of Thermal Spray Coatings. Companion test method for adhesion; B487 is for thickness.
- **[VDI 3198](/standards/vdi-3198/)** — Quality Assurance of PVD and CVD Coatings. European acceptance categories; B487 verifies thickness consistency.
- **[ISO 14577](/standards/iso-14577/)** — Instrumented Indentation Testing. Nanoindentation method for coating hardness; complements B487 for mechanical-property characterization.
- **[AMS 2700](/standards/ams-2700/)** — Passivation of Corrosion-Resistant Steels and Titanium Alloys. Pre-treatment standard for PVD; B487 verifies the passivation / oxide layer thickness.

For an overview of where PVD fits in the broader titanium surface-finish landscape, see the [surface finishes hub](/finishes/) and the dedicated [PVD coating guide](/finishes/pvd-coating/).
- **Magnification:** 500–1000× for PVD coatings (1–5 µm); 100–500× for thicker anodized layers
- **Typical accuracy:** ±0.1 µm at 1000× magnification

## Test Procedure

1. **Section.** Cut the coated part perpendicular to the coating surface using a slow-speed saw with coolant to avoid coating damage. The cut should expose a clean cross-section through the coating and substrate.
2. **Mount.** Mount the section in epoxy or phenolic resin; use vacuum impregnation for porous or friable coatings to prevent edge-rounding during polishing.
3. **Grind.** Progress through SiC papers (120, 240, 400, 600 grit) with water lubrication; rinse between grits to avoid carry-over.
4. **Polish.** Diamond or alumina polishing (6 µm, 1 µm, 0.25 µm, optional 0.05 µm); final polish is critical for accurate coating-thickness measurement.
5. **Etch (optional).** Apply a chemical etch (e.g., Kroll's reagent for titanium substrate) to reveal the coating/substrate interface if it is not visible from metallographic contrast alone.
6. **Examine.** Measure the coating thickness under calibrated optical microscopy at 500–1000×. Take 5+ measurements along the section to characterize thickness uniformity.