---
title: "ASTM C633 — Adhesion or Cohesion Strength of Thermal Spray Coatings"
description: "Engineering reference for ASTM C633-13, the standard tensile-bond test method for adhesion or cohesion strength of thermal-spray and PVD coatings. Covers test specimen preparation, fixture design, tensile loading procedure, and acceptance criteria for ceramic and metallic coatings on metal substrates including titanium."
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
  - "defense"
  - "automotive"
  - "cutting-tools"
issuingBody: "ASTM International"
order: 25
---

## TLDR

ASTM C633-13 is the ASTM International standard test method for **determining the adhesion or cohesion strength of thermal-spray and physical-vapour-deposited coatings by tensile loading**. It is the de-facto bond-strength test for PVD (TiN, TiAlN, DLC) coatings on titanium substrates, with functional aerospace and medical acceptance typically in the 30–70 N critical-load range.

## Quick Answer

**What does ASTM C633 cover?**  
ASTM C633 specifies the test-specimen geometry, fixture design, loading-fixture adhesive, tensile loading procedure, and calculation of adhesion (or cohesion) strength for ceramic and metallic coatings on metal substrates. The method was developed for thermal-spray coatings but is widely adapted to PVD coatings on titanium. Acceptance for functional PVD on titanium is typically ≥ 30 N (HF1–HF4 per [VDI 3198](/standards/vdi-3198/)).

## Scope

ASTM C633 applies to coatings applied by thermal-spray, physical-vapour-deposition (PVD), and chemical-vapour-deposition (CVD) processes on metallic substrates. For titanium PVD, the method is the workhorse bond-strength test referenced by [AMS 2444](/standards/ams-2444/), [VDI 3198](/standards/vdi-3198/), and most aerospace / medical OEM specifications.

**Key test parameters:**

- **Specimen diameter:** 25.4 mm (1 in) standard cylindrical button
- **Loading rate:** 1.0 mm/min (crosshead displacement)
- **Failure modes:** adhesive (coating/substrate), cohesive (within coating), adhesive (coating/adhesive)
- **Acceptance (TiN PVD on titanium):** 30–70 N critical load for HF1–HF4 acceptance
## Test Procedure

1. **Mount.** Align substrate and coupling buttons in the tensile fixture; verify concentric loading.
2. **Pre-load.** Apply 10 N preload to seat the assembly.
3. **Load.** Pull at 1.0 mm/min crosshead displacement until failure; record peak load (N) and failure mode.
4. **Inspect.** Document fracture surface — classify failure as adhesive (coating/substrate interface), cohesive (within coating), or adhesive failure at the epoxy/coupling interface (invalid test).
5. **Report.** Report peak load (N), calculated stress (MPa = load / area), failure mode, and any visible defects.

## Calculations

The bond strength is calculated as:

```
σ = F / A
```

where:
- **σ** = adhesion or cohesion strength (MPa)
- **F** = peak tensile load at failure (N)
- **A** = cross-sectional area of the test button (mm²), typically 506.7 mm² for the 25.4 mm diameter

For a 25.4 mm button, peak loads of 30–70 N correspond to bond strengths of approximately 0.06–0.14 MPa — these low values are characteristic of PVD and are typically reported as critical load (N) rather than stress (MPa).

## Acceptance Criteria

The acceptance window depends on the application and the OEM specification. Typical functional acceptance windows:

| Application | Critical Load (N) | VDI 3198 Category | Notes |
|---|---|---|---|
| Decorative consumer | ≥ 15 | HF4–HF6 | Gold color, low wear |
| Aerospace fastener (TiN) | ≥ 30 | HF1–HF4 | Functional wear / identification |
| Medical implant (TiN) | ≥ 30 | HF1–HF3 | Biocompatibility + wear |
| Cutting tool (TiAlN) | ≥ 50 | HF1–HF2 | High-stress service |
| Optical DLC | ≥ 30 | HF1–HF2 | Adhesion critical for low-friction |

## Common Pitfalls

- **Epoxy failure (invalid test).** If the epoxy bond at the coupling interface fails before the coating, the test is invalid; the epoxy tensile strength must exceed the expected coating bond strength.
- **Substrate failure (invalid test).** For thin substrates or low-strength grades (e.g., [Grade 1](/grades/grade-1-titanium/)) the substrate itself can yield before the coating fails; use a thicker substrate or a higher-strength grade for the test coupon.
- **Off-center loading.** Misaligned fixtures create bending stress that lowers the apparent bond strength.
- **Inconsistent surface prep.** Test coupons must be prepared with the same surface prep as the production part; a "polished lab coupon" gives higher bond strength than a "production coupon" and is not representative.
- **Single-test reporting.** Bond strength is process-dependent; report a minimum of 5 coupons per lot and use the mean ± standard deviation.

## Related Standards

- **[AMS 2444](/standards/ams-2444/)** — Coating, Physical Vapor Deposition of Titanium Nitride. Aerospace process specification for TiN PVD on titanium; ASTM C633 is the bond-strength test method.
- **[VDI 3198](/standards/vdi-3198/)** — Quality Assurance of PVD and CVD Coatings. European acceptance categories HF1–HF6; maps onto ASTM C633 critical loads.
- **[ASTM B487](/standards/astm-b487/)** — Microscopical Cross-Section Thickness Measurement. Companion test method for coating thickness verification.
- **[ISO 14577](/standards/iso-14577/)** — Instrumented Indentation Testing. Nanoindentation method for coating hardness; complements C633 for coating mechanical-property characterization.
- **[AMS 2700](/standards/ams-2700/)** — Passivation of Corrosion-Resistant Steels and Titanium Alloys. Pre-PVD cleaning sequence affecting C633 result.

For an overview of where PVD fits in the broader titanium surface-finish landscape, see the [surface finishes hub](/finishes/) and the dedicated [PVD coating guide](/finishes/pvd-coating/).
- **Cross-reference:** [VDI 3198](/standards/vdi-3198/) HF1–HF6 category mapping; [ISO 14577](/standards/iso-14577/) instrumented-indentation complement

## Test Specimens

1. **Substrate button.** Cylindrical substrate, 25.4 mm diameter × 25.4 mm length; substrate material must match production part (e.g., [Grade 2](/grades/grade-2-titanium/) or [Grade 5](/grades/grade-5-titanium/) titanium per the application).
2. **Coupling button.** Identical geometry to substrate; bonded to the coated face of the substrate.
3. **Surface preparation.** Substrate face is prepared per the production process — pre-clean, mask, and coat as if it were a production part.
4. **Coupling adhesive.** High-strength epoxy (typically FM 1000 or equivalent) cured per adhesive manufacturer's specification; adhesive tensile strength must exceed the expected coating bond strength.