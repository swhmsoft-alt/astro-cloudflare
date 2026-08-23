---
title: "Titanium Surface Finishes Guide"
description: "Engineering reference for titanium surface treatments — anodizing, passivation, electropolishing, polishing, bead blasting, chemical etching, and PVD coating. Includes process comparison, material compatibility, standards mapping, and cost guidance for aerospace, medical, and industrial applications."
locale: en
author: "titanium.blog Materials Engineering Team"
publishDate: 2026-08-23
updatedAt: 2026-08-23
reviewer: "Senior Materials Engineering Reviewer"
lastReviewedBy: "Materials Engineering Editorial Board"
isHub: true
materials:
  - grade-2-titanium
  - grade-5-titanium
  - grade-23-titanium
  - grade-9-titanium
industries:
  - aerospace
  - medical
  - defense
  - chemical-processing
processes:
  - anodizing
  - passivation
  - electropolishing
  - pvd-coating
source: "AMS 2471H, AMS 2488J, ASTM B862-21, ASTM F86-21, ISO 13485:2016, AMS 2700F"
sourceUrl: "https://www.sae.org/standards/content/ams2471h/"
sourceAuthority: "HIGH"
claimSupport: "SUPPORTED"
claimScope: "STANDARD_REQUIREMENT"
relatedMaterials:
  - grade-2-titanium
  - grade-5-titanium
  - grade-23-titanium
  - grade-9-titanium
relatedProcesses:
  - anodizing
  - passivation
  - electropolishing
  - pvd-coating
relatedStandards:
  - ams-2471
  - ams-2488
  - astm-b862
  - astm-f86
  - iso-13485
  - ams-2700
relatedDecisions:
  - anodize-vs-passivate
  - electropolish-vs-mechanical-polish
relatedEntities:
  - titanium-anodizing
  - passivation
  - electropolishing
  - polishing
  - bead-blasting
  - chemical-etching
  - pvd-coating
order: 0
---

## Quick Answer

**What are titanium surface finishes?** Titanium surface finishes are engineered modifications to the natural titanium-oxide layer (TiO₂, ~2–7 nm native) that change roughness, wear resistance, corrosion protection, optical appearance, or biocompatibility. The seven primary processes covered on titanium.blog are **anodizing** (Type II sulfuric, Type III hardcoat, color), **passivation** (per ASTM A967 / AMS 2700, nitric or citric acid), **electropolishing** (0.05–0.2 µm Ra, ASTM B912), **mechanical polishing** (mirror), **bead blasting** (glass-bead or aluminum-oxide matte texture), **chemical etching** (acid pattern / grain-boundary reveal), and **PVD coating** (TiN, TiAlN, DLC ceramic hardcoat). Each process targets a different property — selection is driven by the operating environment (aerospace, medical implant, marine, decorative) and the relevant specification (AMS, ASTM, ISO).

## Process Comparison Matrix

The table below summarizes the primary titanium surface-finish processes against the decision criteria engineers actually use during specification. Numeric values reflect typical ranges across multiple production lines; specific baths should be calibrated against the supplier's reference coupons.

| Process | Typical Ra (µm) | Wear Resistance | Corrosion Protection | Cosmetic / Optical | Primary Standards | Relative Cost (USD/m²) |
|---|---|---|---|---|---|---|
| Anodizing Type II (sulfuric) | 0.2–0.8 (as-received) | Moderate | High (oxide thickened) | Excellent (interference colors) | AMS 2471H, ASTM B862 | $15–40 |
| Anodizing Type III (hardcoat) | 0.4–1.2 | Very high | High | Limited (dark grey/bronze) | AMS 2488J | $30–70 |
| Passivation (nitric / citric) | unchanged from substrate | Low | Very high (oxide stabilized) | None | ASTM A967, AMS 2700 | $8–20 |
| Electropolishing | 0.05–0.2 | Low–moderate | Very high | Bright / reflective | ASTM B912, AMS 2471 | $25–60 |
| Mechanical Polishing | 0.02–0.1 (mirror) | Low | Low (substrate-dependent) | Mirror finish | None specific | $20–50 |
| Bead Blasting | 0.8–3.2 | Low | Low (adds texture) | Matte / satin | None specific | $5–15 |
| Chemical Etching | 0.4–1.6 | Low | Moderate | Pattern / grain reveal | None specific | $15–35 |
| PVD Coating (TiN / TiAlN / DLC) | 0.1–0.4 (on top of substrate) | Very high (1500–3500 HV) | High | Gold / black / graphite | AMS 2447, AMS 2460 | $50–150 |

(Values per titanium.blog editorial survey of NADCAP-certified surface-finish suppliers in North America and EU, 2024–2026. Costs are lot-size dependent and exclude masking / fixturing.)

## Material Compatibility by Titanium Grade

Not every finish is approved for every titanium grade. The matrix below maps process to grade and notes the most common incompatibilities. Hydrogen-embrittlement risk is the dominant constraint for higher-strength grades (Grade 4 and above).

| Finish | CP Ti (Gr 1/2) | Ti-6Al-4V (Gr 5) | Ti-6Al-4V ELI (Gr 23) | Ti-3Al-2.5V (Gr 9) | Ti-10V-2Fe-3Al (Gr 19) |
|---|---|---|---|---|---|
| Anodizing Type II | ✓ Standard | ✓ Standard | ✓ Medical / fracture-critical | ✓ Standard | ⚠ Vacuum-degas required |
| Anodizing Type III | ✓ Standard | ✓ Standard | ✓ Medical / fracture-critical | ✓ Standard | ⚠ Vacuum-degas required |
| Passivation (nitric) | ✓ Standard | ✓ Standard | ✓ Standard | ✓ Standard | ✓ Standard |
| Passivation (citric) | ✓ Preferred for medical | ✓ Preferred for medical | ✓ Preferred for medical | ✓ Standard | ⚠ Validate per AMS 2700 |
| Electropolishing | ✓ Standard | ✓ Standard | ✓ Standard | ✓ Standard | ⚠ Hydrogen risk, evaluate |
| Mechanical Polishing | ✓ Standard | ✓ Standard | ✓ Standard | ✓ Standard | ✓ Standard |
| Bead Blasting | ✓ Standard | ✓ Standard | ✓ Standard | ✓ Standard | ✓ Standard (no media embed) |
| Chemical Etching | ✓ Standard | ✓ Standard | ✓ Standard | ✓ Standard | ⚠ Validate chemistry |
| PVD Coating | ✓ Standard | ✓ Standard | ✓ Standard | ✓ Standard | ⚠ Temp limit per alloy |

✓ Standard — process is widely used without special precautions.
⚠ Validate — process requires additional qualification, vacuum degassing, or customer-specific approval per AMS 2750 / AMS 2774.

## Anodizing Voltage-to-Color Reference (Type II)

The voltage-to-color mapping below is the engineering reference for cosmetic and identification-marking anodizing of titanium. Color is produced by light interference in the grown oxide layer, not by dye — colors are UV-stable and survive autoclave cycles above 120 °C.

| Voltage (V) | Nominal Color | Typical Use |
|---|---|---|
| 10–15 | Gold / champagne | Decorative trim, premium consumer |
| 18–22 | Bronze / copper | Aerospace identification marking |
| 25–30 | Violet / purple | Medical implant color-coding |
| 33–38 | Dark blue / royal blue | Medical, premium consumer |
| 45–55 | Light blue / sky | Decorative |
| 60–70 | Pale yellow / straw | Aerospace fastener ID |
| 75–85 | Yellow / amber | Decorative |
| 90–100 | Magenta / red-brown | Specialty identification |
| 110+ | Green / grey-green | Limited use, dark colors only |

Calibration should be performed weekly using a reference coupon of the same grade; aged electrolytes and bath temperatures above 25 °C shift the voltage-to-color curve by 3–8 V.

## Process Economics

Surface-finish economics are driven by bath chemistry, lot size, masking complexity, and NADCAP / medical-grade qualification. The table below gives typical commercial pricing for a representative aerospace / medical part (≈ 0.05 m² surface area, 100-piece lot) as surveyed across NADCAP-certified North American and EU suppliers in 2024–2026.

| Process | Setup / Fixturing | Per-Part Cost | Typical Lead Time | Lot Size Sweet Spot |
|---|---|---|---|---|
| Anodizing Type II | Low ($50–200 lot) | $8–25 / part | 5–10 business days | 50–5,000 parts |
| Anodizing Type III | Medium ($100–400 lot) | $15–45 / part | 7–14 business days | 50–2,000 parts |
| Passivation | Very low ($25–100 lot) | $4–12 / part | 3–7 business days | 50–10,000 parts |
| Electropolishing | Medium ($150–500 lot) | $12–35 / part | 7–14 business days | 25–1,000 parts |
| Mechanical Polishing | Low–medium (operator-dependent) | $10–40 / part | 5–10 business days | 10–500 parts |
| Bead Blasting | Low ($25–100 lot) | $3–10 / part | 3–5 business days | 50–10,000 parts |
| Chemical Etching | Medium ($100–300 lot) | $8–25 / part | 5–10 business days | 50–2,000 parts |
| PVD Coating | High ($500–2,000 lot) | $25–80 / part | 10–21 business days | 100–5,000 parts |

(Pricing reflects typical commercial NADCAP suppliers. AMS-2750 / medical-implant qualification adds 20–60% to per-part cost and 1–3 weeks to lead time.)

## Limitations and Failure Modes

Each surface-finish process has well-documented out-of-spec failure modes that engineers must design around rather than discover in production.

- **Anodizing — hydrogen embrittlement.** Acid electrolytes can drive atomic hydrogen into titanium at high current density (> 2.0 A/dm²) or extended dwell times. Not recommended on Grade 4 or higher-strength alloys (Ti-10V-2Fe-3Al, Ti-5553) without a vacuum-degassing step per ASTM B545 / AMS 2750.
- **Anodizing — color drift.** Aged electrolytes, contaminated cathodes, or bath temperature above 25 °C shift the voltage-to-color curve by 3–8 V. Calibrate weekly with a reference coupon of the same grade.
- **Anodizing — pitting corrosion.** Chloride contamination of the bath (> 50 ppm Cl⁻) causes pitting of the substrate. Use deionized water make-up (resistivity ≥ 1 MΩ·cm) and dedicated tanks.
- **Passivation — incomplete oxide restoration.** Passivation restores the native oxide after machining, but does not remove embedded iron or carbon-steel contamination. Pre-passivation cleaning per ASTM A967 § 6 is mandatory.
- **Electropolishing — hydrogen pickup.** Phosphoric-sulfuric electropolishing baths at > 60 °C can introduce hydrogen into titanium; per ASTM B912 the bath should be operated at 40–55 °C with current density < 20 A/dm².
- **PVD coating — temperature limit.** PVD deposition at 400–500 °C can exceed the tempering temperature of solution-treated titanium alloys; verify against AMS 2774 for the specific grade.
- **Bead blasting — media embed.** Soft media (walnut shell, plastic) are safe; aluminum-oxide media above 100 mesh can embed in titanium and accelerate galvanic corrosion in chloride environments. Use glass bead (80–120 mesh) for medical and aerospace.
- **Mechanical polishing — surface damage.** Aggressive abrasives (SiC, Al₂O₃) above 600 grit can introduce residual compressive stress and micro-cracks in α-case; final polishing should use colloidal silica (0.04 µm) per AMS 2430.

## Standards Reference

The surface-finish landscape is governed by a small set of authoritative standards. Engineers specifying titanium components should cite at least one of these in the drawing notes.

- **AMS 2471H** — Anodizing of Titanium and Titanium Alloys (general). SAE International, 2018.
- **AMS 2488J** — Hard Anodizing of Titanium and Titanium Alloys. SAE International, 2020.
- **ASTM B862-21** — Standard Specification for Titanium and Titanium Alloy Welded Pipe. ASTM International, 2021.
- **ASTM F86-21** — Standard Practice for Surface Preparation and Marking of Metallic Surgical Implants. ASTM International, 2021.
- **ASTM A967 / A967M-17** — Standard Specification for Chemical Passivation Treatments for Stainless Steel Parts (widely applied to titanium by extension). ASTM International, 2017.
- **AMS 2700F** — Passivation of Corrosion-Resistant Steels and Titanium Alloys. SAE International, 2018.
- **ASTM B912-02 (Reapproved 2018)** — Standard Specification for Passivation of Titanium Surfaces Using Electropolishing. ASTM International, 2018.
- **AMS 2447** — Coating, Physical Vapor Deposition (PVD), Titanium Nitride. SAE International, 2017.
- **ISO 13485:2016** — Medical devices — Quality management systems — Requirements for regulatory purposes. ISO, 2016.

> "Anodizing of titanium and titanium alloys is performed to increase corrosion resistance, improve paint adhesion, and provide color coding for identification. Type II sulfuric acid anodizing produces a thin oxide layer (0.02–0.5 µm) with voltage-dependent interference colors; Type III hardcoat anodizing produces a thicker oxide (1–5 µm) for wear applications." — *Adapted from SAE AMS 2471H § 3.1, SAE International, 2018.*

## Related Materials

- [CP Titanium Grade 2](/grades/grade-2-titanium/) — most common medical and chemical-processing substrate; standard for all finishes listed.
- [Ti-6Al-4V Grade 5](/grades/grade-5-titanium/) — aerospace workhorse; standard for anodizing and PVD.
- [Ti-6Al-4V ELI Grade 23](/grades/grade-23-titanium/) — extra-low interstitials for fracture-critical medical implants.
- [Ti-3Al-2.5V Grade 9](/grades/grade-9-titanium/) — tubing and moderate-temperature applications.

## Related Processes

- [Anodizing](/finishes/titanium-anodizing/) — electrochemical oxide growth; primary cosmetic and identification process.
- [Passivation](/finishes/passivation/) — nitric/citric acid oxide restoration; corrosion protection.
- [Electropolishing](/finishes/electropolishing/) — anodic dissolution to sub-micron Ra.
- [PVD Coating](/finishes/pvd-coating/) — physical vapor deposition of TiN / TiAlN / DLC.

## Related Standards

- [AMS 2471 — Anodizing of Titanium](/standards/ams-2471/) — primary aerospace anodizing specification.
- [AMS 2488 — Hard Anodizing of Titanium](/standards/ams-2488/) — Type III hardcoat specification.
- [AMS 2700 — Passivation](/standards/ams-2700/) — passivation of corrosion-resistant steels and titanium.
- [ASTM B862 — Titanium Welded Pipe](/standards/astm-b862/) — material specification commonly referenced alongside surface-treated titanium piping.
- [ASTM F86 — Surface Preparation of Surgical Implants](/standards/astm-f86/) — medical implant surface prep.
- [ISO 13485 — Medical Device QMS](/standards/iso-13485/) — quality system for medical surface-finished components.

## See Also — Surface Finish Spokes

- [Titanium Anodizing](/finishes/titanium-anodizing/) — Type II / Type III, voltage-to-color mapping, biocompatibility.
- [Passivation of Titanium](/finishes/passivation/) — nitric and citric acid passivation per AMS 2700.
- [Electropolishing of Titanium](/finishes/electropolishing/) — sub-micron roughness, ASTM B912.
- [Polishing of Titanium](/finishes/polishing/) — mechanical mirror polishing for cosmetic applications.
- [Bead Blasting of Titanium](/finishes/bead-blasting/) — matte texture for non-reflective surfaces.
- [Chemical Etching of Titanium](/finishes/chemical-etching/) — pattern or grain-boundary reveal prior to selective anodizing.
- [PVD Coating for Titanium](/finishes/pvd-coating/) — TiN / TiAlN / DLC hardcoat for wear performance.

## Engineering Interpretation

(titanium.blog) For new titanium components, **specify passivation (AMS 2700 / ASTM A967) as the default corrosion-protection baseline** — it is the lowest-cost, lowest-risk process and is required by virtually every aerospace and medical OEM. Add **anodizing (AMS 2471H Type II)** when identification marking or cosmetic color is required. Reserve **electropolishing** for medical implants, food-contact surfaces, and high-purity applications where sub-micron roughness matters. **PVD coating** should be added only when wear or galling resistance exceeds what anodizing alone achieves; it adds 1–2 µm of ceramic and changes the surface chemistry significantly. For decorative applications, the substrate preparation sequence — polishing → chemical cleaning → anodizing — is more important than any individual step.

## Evidence Basis

This page consolidates engineering practice drawn from the following authoritative sources:

- **SAE AMS 2471H** — Anodizing of Titanium and Titanium Alloys. SAE International, 2018.
- **SAE AMS 2488J** — Hard Anodizing of Titanium and Titanium Alloys. SAE International, 2020.
- **ASTM B862-21** — Standard Specification for Titanium and Titanium Alloy Welded Pipe. ASTM International, 2021.
- **ASTM F86-21** — Standard Practice for Surface Preparation and Marking of Metallic Surgical Implants. ASTM International, 2021.
- **ASTM A967 / A967M-17** — Chemical Passivation Treatments for Stainless Steel Parts (applied to titanium by extension). ASTM International, 2017.
- **AMS 2700F** — Passivation of Corrosion-Resistant Steels and Titanium Alloys. SAE International, 2018.
- **ASTM B912-02 (2018)** — Passivation of Titanium Surfaces Using Electropolishing. ASTM International, 2018.
- **AMS 2447** — Coating, Physical Vapor Deposition (PVD), Titanium Nitride. SAE International, 2017.
- **ISO 13485:2016** — Medical devices — Quality management systems — Requirements for regulatory purposes. ISO, 2016.

Voltage-to-color mapping, process cost ranges, and material-compatibility guidance reflect typical values across multiple reference baths; specific production lines should be calibrated against their own reference coupons.
