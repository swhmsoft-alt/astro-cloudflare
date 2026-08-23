---
title: "ASTM B912 — Passivation of Titanium and Titanium Alloys by Electropolishing"
description: "Engineering reference for ASTM B912-02(2018), the standard specification for electropolishing titanium and titanium alloys. Covers electrochemical process parameters, bath chemistries (perchloric-acetic, sulfuric-phosphoric, non-aqueous), voltage and current density ranges, material compatibility, and acceptance criteria for medical, aerospace, semiconductor, and pharmaceutical applications."
locale: en
standardType: "process"
materials:
  - grade-1-titanium
  - grade-2-titanium
  - grade-5-titanium
  - grade-9-titanium
  - grade-23-titanium
industries:
  - medical
  - semiconductor
  - aerospace
  - pharmaceutical
  - food-processing
issuingBody: "ASTM International"
order: 32
---

## TLDR

ASTM B912-02(2018) is the ASTM International specification for **passivation of titanium and titanium alloys by electropolishing**. It defines the electrochemical process parameters, bath chemistries, and acceptance criteria for the anodic-dissolution surface-finishing process used to produce sub-0.2 µm Ra passivated titanium surfaces for medical implants, semiconductor UHV hardware, aerospace fluid-system components, and pharmaceutical processing equipment.

## Quick Answer

**What does ASTM B912 cover?**  
ASTM B912-02(2018) defines the electrochemical parameters (voltage, current density, bath temperature, immersion time), the three primary bath chemistries (perchloric-acetic, sulfuric-phosphoric, non-aqueous), and the acceptance criteria for electropolishing of titanium and titanium alloys. The standard treats electropolishing as a *passivation method* — the process simultaneously removes surface material (10–40 µm per side) and re-forms the native TiO₂ oxide layer, producing a bright, smooth, chemically clean surface that meets or exceeds the corrosion-resistance performance of nitric/citric acid passivation per [AMS 2700](/standards/ams-2700/).

## Scope

ASTM B912 applies to commercially pure titanium (CP, Grade 1 / Grade 2) and titanium alloys (Grade 5, Grade 9, Grade 23, and other α / α+β alloys) intended for service in:

- Medical and dental implants and surgical instruments
- Semiconductor ultra-high-vacuum (UHV) chamber components
- Aerospace hydraulic and fuel-system components
- Pharmaceutical and food-processing equipment (sanitary / hygienic)
- Analytical and optical instrument hardware
- Marine and chemical-process service where surface chemistry control is critical

The standard specifically excludes electropolishing for decorative purposes (cosmetic mirror finishes without functional passivation requirement) — those applications are typically governed by [ASTM F86](/standards/astm-f86/) for medical implants or by OEM internal specifications for consumer and industrial cosmetic parts.

## Process Steps

The standard prescribes a defined sequence for titanium electropolishing:

1. **Pre-clean.** Degrease per ASTM D740, alkaline clean, and acid pickle to remove machining residue, embedded iron, and surface oxide scale. For heat-treated components with alpha-case, the ASTM B600 descaling/cleaning sequence is required prior to electropolishing.
2. **Rinse.** Deionized water rinse until conductivity ≤ 1 µS/cm.
3. **Mask (optional).** Apply wax, lacquer, or mechanical masking to areas that must be protected from anodic dissolution (e.g., threaded holes, bearing surfaces already at final tolerance, marking areas).
4. **Electropolish.** Immerse in the specified bath chemistry at the specified voltage and current density. Bath temperature and immersion time are per the controlling OEM specification.
5. **Rinse.** Deionized water rinse, then a final neutralizing rinse if required by the bath chemistry (particularly for perchloric-acid baths).
6. **Dry.** Forced-air dry at ≤ 70 °C or vacuum dry. Avoid high-temperature drying that could induce hydrogen diffusion in [Grade 5](/grades/grade-5-titanium/) or [Grade 23](/grades/grade-23-titanium/).
7. **Inspect.** Visual under 10× magnification; surface-roughness measurement per ASME B46.1; hydrogen content verification on Grade 5/23 lots.
8. **Post-passivate (optional).** A separate nitric- or citric-acid passivation per [AMS 2700](/standards/ams-2700/) is generally not required because the electropolished surface is already passivated; however, some OEM specifications require a post-electropolish passivation step for traceability and process documentation.

## Bath Chemistry Comparison

ASTM B912 recognizes three primary bath chemistries for titanium electropolishing. Each has distinct operating characteristics.

| Parameter | Perchloric/Acetic (Type II) | Sulfuric/Phosphoric (Type II) | Non-aqueous Methanol-Based (Type III) |
|---|---|---|---|
| Composition | 5–10 % HClO₄ + glacial acetic | 30–40 % H₂SO₄ + 40–50 % H₃PO₄ | Methanol + HClO₄ or H₂SO₄ |
| Operating temperature | 20–35 °C | 40–80 °C | 15–25 °C |
| Achievable Ra | 0.05–0.1 µm | 0.1–0.2 µm | 0.02–0.05 µm |
| Hydrogen risk | Moderate | Low | Very low |
| Regulatory burden | High (EU restriction > 35 °C) | Standard | Explosion-proof required |
| Primary application | Medical implants | Aerospace, fluid systems | Semiconductor UHV, optics |

The label "Type II" / "Type III" follows the SAE AMS convention for **electrolytic surface-finishing processes** — Type II is conventional direct-current operation; Type III is the pulsed-current or non-aqueous variant for ultra-low outgassing and minimum hydrogen pickup.
## Process Parameters

The standard defines the typical operating envelope for titanium electropolishing on the three primary bath chemistries:

- **Voltage (DC).** 8–20 V cathode-to-anode potential for conventional mixed-acid baths; 20–40 V peak for pulsed Type III operation.
- **Current density.** 5–30 A/dm² in the limiting-current regime; pulsed-current operation allows effective densities up to 50 A/dm² without hydrogen pickup.
- **Bath temperature.** 20–35 °C for perchloric-acid systems; 40–80 °C for mixed-acid systems; 15–25 °C for non-aqueous systems.
- **Immersion time.** 2–20 minutes typical, function of starting Ra and target Ra.
- **Material removal.** 10–40 µm per surface per cycle, controlled by time × current density.

## Material Compatibility

ASTM B912 covers the full range of commercially pure and alloyed titanium grades typically specified for medical, aerospace, and industrial service.

- **[Grade 1](/grades/grade-1-titanium/)** (CP titanium, lowest interstitials) — most uniform dissolution; lowest hydrogen pickup; standard substrate for chemical-process and marine service.
- **[Grade 2](/grades/grade-2-titanium/)** (CP titanium, workhorse grade) — standard electropolish substrate for medical and food-contact service; typical Ra 0.05–0.1 µm; hydrogen pickup < 5 ppm under standard DC conditions.
- **[Grade 5](/grades/grade-5-titanium/)** (Ti-6Al-4V) — good electropolish response but the two-phase α+β microstructure produces slightly higher final Ra (0.1–0.2 µm); pulsed current recommended for fatigue-critical aerospace components.
- **[Grade 9](/grades/grade-9-titanium/)** (Ti-3Al-2.5V) — standard substrate for hydraulic tubing; interior-surface electropolishing per AMS 2700F is the typical specification.
- **[Grade 23](/grades/grade-23-titanium/)** (Ti-6Al-4V ELI) — medical-implant grade per [ASTM F136](/standards/astm-f136/); pulsed current required to keep hydrogen below the 30 ppm medical threshold.

## Common Pitfalls

- **Hydrogen pickup on Grade 5/23.** Titanium is a hydride-forming metal; under cathodic-side conditions or high over-voltage, atomic hydrogen can be absorbed into the surface and diffuse into the bulk. Hydrogen above 30–50 ppm causes hydride formation and reduced fatigue life. Pulsed-current operation and tight voltage control are the standard mitigations.
- **Bath age and chemistry drift.** Perchloric-acid baths accumulate dissolved Ti⁴⁺ and lose activity; sulfuric-phosphoric baths absorb atmospheric water and change density. Production baths are typically replaced every 50–200 batches depending on workload; bath chemistry is monitored by titration and specific-gravity measurement.
- **Insufficient pre-cleaning.** Embedded iron, alpha-case, or carbon-steel particles from prior machining cannot be removed by electropolishing; they will create etch pitting and surface defects. The ASTM B600 pre-clean sequence is mandatory for heat-treated components.
- **Operating below the limiting-current plateau.** Low current density gives etching rather than smoothing; the bath must be operated at the voltage that places the anode on the limiting-current plateau of its polarization curve.
- **Masking failures.** Wax or lacquer that lifts at the bath edge leaves a visible boundary line; mechanical masking can shadow the current density at the masked/unmasked transition. Both produce defective parts that are visually obvious.

## Typical Applications

- **Medical implants.** Hip stems, knee femoral components, dental abutments, spinal rods — surfaces electropolished to ≤ 0.05 µm Ra per [ASTM F86](/standards/astm-f86/); biocompatibility validation per ISO 10993-5.
- **Semiconductor UHV chamber components.** Chamber liners, gas-delivery tubes, showerheads in [Grade 2](/grades/grade-2-titanium/) — electropolished to ≤ 0.1 µm Ra for minimum H₂ outgassing.
- **Aerospace fluid-system components.** Hydraulic fittings, fuel-system manifolds, pump bodies in [Grade 5](/grades/grade-5-titanium/) — interior-surface electropolishing per AMS 2700F; hydrogen pickup below the OEM-specified threshold.
- **Pharmaceutical and food-processing equipment.** Reactor vessels, mixers, valve bodies in [Grade 2](/grades/grade-2-titanium/) — bright, easily-cleaned finish that meets 3-A Sanitary Standards and EHEDG requirements.
- **Analytical and optical instrument components.** Mass-spectrometer inlet parts, optical mirror substrates — Type III non-aqueous bath for sub-0.05 µm Ra and minimum metallic contamination.

## Related Materials

- **Grade 2 Titanium** — workhorse electropolishing substrate for medical and food-contact service
- **Grade 5 Titanium (Ti-6Al-4V)** — aerospace structural and fluid-system substrate
- **Grade 23 Titanium (Ti-6Al-4V ELI)** — medical-implant substrate per [ASTM F136](/standards/astm-f136/)

## Related Standards

- **[AMS 2700](/standards/ams-2700/)** — Passivation of Corrosion-Resistant Steels and Titanium Alloys. Defines the chemical passivation that electropolishing produces in a single step.
- **[ASTM F86](/standards/astm-f86/)** — Surface Preparation and Marking of Metallic Surgical Implants. Defines the implant-surface preparation sequence in which electropolishing is the typical final step.
- **ASTM B600-21** — Descaling and Cleaning Titanium and Titanium Alloy Surfaces. Defines the pre-electropolish cleaning sequence for heat-treated titanium components (no rendered cross-link; standard MD not present in titanium.blog).
- **[ISO 13485](/standards/iso-13485/)** — Medical Devices Quality Management Systems. Defines the QMS framework for medical-implant electropolishing process control and traceability.
- **[ASTM F136](/standards/astm-f136/)** — Wrought Ti-6Al-4V ELI for Surgical Implants. Defines the material specification for Grade 23 ELI implant substrates that electropolishing is applied to.

For an overview of where electropolishing fits in the broader titanium surface-finish landscape, see the [surface finishes hub](/finishes/) and the dedicated [electropolishing guide](/finishes/electropolishing/).