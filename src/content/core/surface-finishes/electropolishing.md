---
title: "Electropolishing of Titanium Components — Complete Guide"
description: "Engineering guide to electropolishing titanium alloys. Process parameters, bath chemistry, achievable surface finishes down to 0.05 µm Ra, hydrogen embrittlement risk, and applications for medical implants, semiconductor UHV components, aerospace fuel-system hardware, and pharmaceutical processing equipment."
locale: en
author: "titanium.blog Materials Engineering Team"
publishDate: 2026-08-23
updatedAt: 2026-08-23
reviewer: "Senior Materials Engineering Reviewer"
lastReviewedBy: "Senior Materials Engineering Reviewer"
materials:
  - "grade-1-titanium"
  - "grade-2-titanium"
  - "grade-5-titanium"
  - "grade-9-titanium"
  - "grade-23-titanium"
industries:
  - "medical"
  - "semiconductor"
  - "aerospace"
  - "pharmaceutical"
  - "food-processing"
raRange: "0.05–0.2 µm Ra"
finishType: "electrochemical"
processes:
  - "electropolishing"
  - "surface-finishing"
source: "ASTM B912-02(2018), ASTM F86-21, AMS 2700F, ASTM B600-21, ISO 13485:2016, ASTM F136-13, ISO 9001:2015"
sourceUrl: ""
sourceAuthority: "HIGH"
claimSupport: "SUPPORTED"
claimScope: "TYPICAL_VALUE"
dataPoints:
  - property: "Final Ra (mirror-grade on Grade 2 CP)"
    value: "0.05–0.1"
    unit: "µm Ra"
    notes: "Starting Ra 0.4–0.8 µm; perchloric-acid bath at 20–30 °C"
  - property: "Final Ra (typical on Grade 5)"
    value: "0.1–0.2"
    unit: "µm Ra"
    notes: "Starting Ra 0.6–1.0 µm; sulfuric-phosphoric bath at 40–60 °C"
  - property: "Material removal (per surface)"
    value: "10–40"
    unit: "µm"
    notes: "Typical cycle removes 10–40 µm per side; controlled by time × current density"
  - property: "Voltage (DC operation)"
    value: "8–20"
    unit: "V"
    notes: "Cathode-to-anode potential for titanium in mixed-acid bath"
  - property: "Current density"
    value: "5–30"
    unit: "A/dm²"
    notes: "Higher values risk hydrogen pickup on Grade 5/23"
  - property: "Bath temperature"
    value: "20–80"
    unit: "°C"
    notes: "Perchloric-acid baths ≤ 35 °C; mixed-acid baths 40–80 °C"
  - property: "Immersion time"
    value: "2–20"
    unit: "min"
    notes: "Time is function of starting roughness and target Ra"
  - property: "Surface oxide thickness after electropolish"
    value: "3–8"
    unit: "nm"
    notes: "Native TiO₂ layer re-formed; chemically identical to passivated surface"
  - property: "Hydrogen pickup (Grade 5, typical cycle)"
    value: "<5"
    unit: "ppm"
    notes: "Below AMS 2700F 30 ppm threshold; pulsed current reduces further"
  - property: "Production bath lot size"
    value: "50–500"
    unit: "L"
    notes: "Bench scale 50 L; production line 200–500 L per working tank"
relatedMaterials:
  - "grade-1-titanium"
  - "grade-2-titanium"
  - "grade-5-titanium"
  - "grade-9-titanium"
  - "grade-23-titanium"
relatedProcesses:
  - "passivation"
  - "polishing"
  - "bead-blasting"
  - "titanium-anodizing"
  - "pvd-coating"
  - "chemical-etching"
relatedStandards:
  - "astm-b912"
  - "astm-f86"
  - "ams-2700"
  - "iso-13485"
  - "iso-9001"
  - "astm-f136"
order: 4
---
## Quick Answer

**What is electropolishing for titanium?** Electropolishing is an **electrochemical surface-finishing process** in which a titanium component is made the **anode** in an electrolytic cell; controlled anodic dissolution removes a thin, uniform layer of surface material (typically 10–40 µm per side) to produce a bright, smooth, passivated finish with **Ra values down to 0.05 µm**. Unlike mechanical polishing — which physically abrades peaks into valleys — electropolishing preferentially dissolves surface micro-peaks under the action of a viscous electrolyte boundary layer (the Jacquet layer), leaving a chemically clean, oxide-stabilized surface that is functionally equivalent to nitric/citric acid passivation per [AMS 2700](/standards/ams-2700/).

## How Electropolishing Works

Electropolishing is governed by anodic dissolution under diffusion-limited current conditions. The titanium workpiece is connected to the positive terminal of a DC rectifier and immersed in a temperature-controlled acid bath; the tank wall or a stainless-steel or lead cathode completes the cell. When voltage is applied across the **cathode** and **anode**, current flows through the **electrolyte** (typically a mixture of perchloric acid and acetic anhydride, or sulfuric acid and phosphoric acid, or a non-aqueous methanol-based bath), and titanium atoms are removed from the surface as soluble Ti⁴⁺ ions.

Two competing mechanisms operate simultaneously:

1. **Activation control (low current density, low voltage).** Metal removal is uniform and proportional to local current density; the surface remains matte and rough.
2. **Diffusion / mass-transport control (high current density, in the limiting-current regime).** A viscous, metal-ion-rich boundary layer (the Jacquet layer) forms over surface micro-peaks and limits further dissolution, while micro-valleys retain fresh electrolyte and continue to dissolve preferentially. The result is selective leveling of asperities — the surface becomes smoother and more reflective with time, until the limiting current plateau is reached and dissolution essentially stops.

The diffusion-limited regime is the engineering target for electropolishing: voltage and current density are chosen so that the anode operates **on the limiting-current plateau** of its polarization curve, where smoothing rate is maximal and surface brightening is reproducible. Operating below the plateau gives etching; operating above it risks oxygen evolution, pitting, and bath decomposition (especially with perchloric-acid systems).

The freshly exposed surface immediately re-forms a 3–8 nm native TiO₂ layer in the acidic bath, leaving the part **chemically passivated** in the same operation — a critical advantage over mechanical polishing, which requires a separate nitric- or citric-acid passivation step per [AMS 2700](/standards/ams-2700/) to restore the oxide layer disturbed by abrasive contact.
## Process Parameters & Bath Chemistry

Electropolishing of titanium is controlled by five interrelated parameters. The values below are typical for mixed-acid aqueous baths on [Grade 2](/grades/grade-2-titanium/) and [Grade 5](/grades/grade-5-titanium/); specific production lines should be calibrated against their own reference coupons.

| Parameter | Typical Range | Notes |
|---|---|---|
| Voltage (DC) | 8–20 V | Cathode-to-anode potential; pulse mode (Type III) at 20–40 V peak |
| Current density | 5–30 A/dm² | Higher values give faster smoothing but increase hydrogen pickup on Grade 5/23 |
| Bath temperature | 20–80 °C | Perchloric-acid baths ≤ 35 °C; mixed-acid baths 40–80 °C |
| Immersion time | 2–20 min | Function of starting Ra and target Ra |
| Electrolyte composition | perchloric/acetic, sulfuric/phosphoric, or non-aqueous | See bath comparison table below |

Three bath chemistries dominate commercial titanium electropolishing. Each has distinct advantages in terms of achievable finish, hydrogen risk, and regulatory acceptance.

| Bath Type | Composition | Operating Temp | Achievable Ra | Hydrogen Risk | Regulatory |
|---|---|---|---|---|---|
| Perchloric/acetic (Type II) | 5–10 % HClO₄ + glacial acetic | 20–35 °C | 0.05–0.1 µm | Moderate | Restricted in EU (explosive risk above 35 °C) |
| Sulfuric/phosphoric (Type II) | 30–40 % H₂SO₄ + 40–50 % H₃PO₄ | 40–80 °C | 0.1–0.2 µm | Low | Standard aerospace bath |
| Non-aqueous methanol-based (Type III) | Methanol + HClO₄ or H₂SO₄ | 15–25 °C | 0.02–0.05 µm | Very low | Used for ultra-high-purity semiconductor |

The label "Type II" / "Type III" follows the SAE AMS convention for **electrolytic surface-finishing processes** — Type II is the conventional direct-current operation, Type III is the pulsed-current or non-aqueous variant. Both operate on the same anodic-dissolution principle but with different bath chemistries and different voltage/time regimes. Type III baths achieve the smoothest finishes and the lowest hydrogen pickup but require explosion-proof ventilation and are restricted to specialty applications (semiconductor UHV, nuclear, optical mirror substrates).

For most medical and aerospace applications the sulfuric-phosphoric bath (Type II) is the workhorse: lower regulatory burden, lower hydrogen risk, and adequate Ra for implant bearing surfaces and aerospace fluid-system components. For semiconductor and analytical-instrument components the non-aqueous bath (Type III) is preferred for its ultra-low outgassing and mirror-grade finish.

## Achievable Surface Roughness & Material Removal

The achievable final Ra is governed by the **starting surface roughness**. Electropolishing is a leveling process — it removes a fixed thickness of material per cycle, so the smoother the starting surface, the smoother the final surface. The table below shows typical Ra reduction on Grade 2 CP titanium using a sulfuric-phosphoric bath at 50 °C, 15 A/dm², 10 minutes.

| Starting Ra (µm) | Final Ra (µm) | Material Removed per Side (µm) | Visual Appearance |
|---|---|---|---|
| 0.8–1.6 (post-machining) | 0.15–0.25 | 25–40 | Satin-bright |
| 0.4–0.8 (post-grinding) | 0.08–0.15 | 15–25 | Bright reflective |
| 0.2–0.4 (post-600 grit) | 0.05–0.10 | 10–15 | Mirror |
| 0.1–0.2 (pre-polished) | 0.02–0.05 | 5–10 | Optical mirror |

Material removal is roughly linear in time × current density within the limiting-current regime. Doubling the current density approximately halves the required time to reach the same Ra, but increases hydrogen pickup proportionally on [Grade 5](/grades/grade-5-titanium/) and [Grade 23](/grades/grade-23-titanium/) — a key trade-off for fatigue-critical aerospace components.


## Types & Variants

Electropolishing installations fall into three practical categories that determine production cost, throughput, and achievable finish.

**DC bath electropolishing (Type II — conventional).** The standard configuration: a polypropylene or PTFE-lined tank, a DC rectifier (typically 20–50 V, 100–2000 A depending on part size), a stainless or lead cathode, and a chiller/heater for bath temperature control. Used for the bulk of medical and aerospace production. Throughput is limited by batch loading density and per-rack current capacity.

**Pulsed-current electropolishing (Type III — pulsed).** A square-wave or pulse-reverse waveform is applied instead of steady DC. The reverse pulse discharges the viscous boundary layer between forward pulses, improving mass transport and allowing higher effective current densities without hydrogen pickup. Used for [Grade 23](/grades/grade-23-titanium/) medical implants where hydrogen embrittlement is a concern; reduces bath cycle time by 30–50 % on high-current production lines.

**In-situ or partial-immersion electropolishing.** Used for large components (tank shells, chamber bodies, aerospace structural panels) that cannot be immersed in a production bath. Cathode geometry is custom-tooled to the part; electrolyte is recirculated locally through masking dams. Achievable Ra is typically limited to 0.2–0.4 µm because current density uniformity is harder to control than in a full-immersion bath, but the process enables finishes on parts too large for any production tank.

## Compatible Materials

Electropolishing is broadly applicable across **CP titanium (Grade 1, Grade 2)** and titanium alloys (Grade 5, Grade 9, Grade 23), with the following qualifications.

- **[Grade 1](/grades/grade-1-titanium/) (CP titanium, lowest interstitials).** Excellent electropolish response — most uniform dissolution because of single-phase α microstructure; typical Ra 0.05–0.1 µm achievable; lowest hydrogen pickup. Standard substrate for chemical-process and marine equipment.
- **[Grade 2](/grades/grade-2-titanium/) (CP titanium, workhorse grade).** Standard electropolish substrate for medical and food-contact applications. Two-phase α+β microstructure is absent (CP is single-phase α) so dissolution is uniform. Typical Ra 0.05–0.1 µm. Hydrogen pickup <5 ppm under standard DC conditions.
- **[Grade 5](/grades/grade-5-titanium/) (Ti-6Al-4V, α+β aerospace alloy).** Good electropolish response but the two-phase microstructure produces slightly higher final Ra than CP titanium under identical bath conditions (0.1–0.2 µm vs 0.05–0.1 µm). Hydrogen pickup 5–15 ppm under DC conditions; pulsed current recommended for fatigue-critical components. Heat-treated (solution-treated + aged) material must be electropolished before final aging to avoid hydrogen retention in the β phase.
- **[Grade 9](/grades/grade-9-titanium/) (Ti-3Al-2.5V).** Used for tubing (e.g., aerospace hydraulic lines, bicycle frames). Interior-surface electropolishing is the standard specification per AMS 2700F; bath geometry is designed for tube ID access. Hydrogen pickup minimal because of the alloy's low β-phase fraction.
- **[Grade 23](/grades/grade-23-titanium/) (Ti-6Al-4V ELI, medical-implant grade).** Same electropolish response as Grade 5 but with tighter interstitial limits (Fe ≤ 0.25 %, O ≤ 0.13 %). Standard substrate for medical implants per [ASTM F136](/standards/astm-f136/); pulsed current recommended to keep hydrogen below the AMS 2700F medical threshold (≤ 30 ppm). Surface preparation sequence per [ASTM F86](/standards/astm-f86/) § 5.2 electropolish → nitric/citric acid passivation.

## Typical Applications

Electropolishing is specified where the operating environment demands a **chemically clean, low-surface-area, passivated finish** — particularly when the part is exposed to body fluids, high-purity chemicals, vacuum, or cyclic fatigue loading.

- **Medical implants.** Hip-stem bearing surfaces, knee femoral components, dental abutments, spinal rods. The electropolished surface is smoother than any mechanical polish can reliably achieve (≤ 0.05 µm Ra), and the simultaneous passivation eliminates the separate nitric/citric acid step. [ASTM F86](/standards/astm-f86/) governs the surface preparation; [ISO 13485](/standards/iso-13485/) governs the QMS. Biocompatibility is validated per ISO 10993-5 cytotoxicity testing on production-bath coupons.
- **Semiconductor UHV chamber components.** Electropolished 304L stainless steel is standard for semiconductor vacuum chambers; electropolished [Grade 2](/grades/grade-2-titanium/) is specified for chamber liners, gas-delivery tubes, and showerheads where Ti⁺ sputter contamination must be minimized. Ra ≤ 0.1 µm and H₂ outgassing ≤ 1×10⁻¹⁰ Torr·L/s·cm² are typical acceptance criteria.
- **Aerospace fluid-system components.** Hydraulic fittings, fuel-system manifolds, and Ti-6Al-4V pump bodies per AMS 2700F are typically electropolished on interior surfaces to reduce fatigue initiation sites and to minimize particulate generation. Hydrogen pickup must be verified below the OEM-specified threshold; pulsed current is standard for fracture-critical components.
- **Pharmaceutical and food-processing equipment.** Reactor vessels, mixers, valve bodies, and transfer piping in [Grade 2](/grades/grade-2-titanium/) or [Grade 1](/grades/grade-1-titanium/) are electropolished to a bright, easily-cleaned finish that meets USDA and FDA sanitary requirements (3-A Sanitary Standards, EHEDG). The smooth surface reduces biofilm adhesion and CIP/SIP chemical consumption.
- **Analytical and optical instrument components.** Mass-spectrometer inlet parts, optical mirror substrates, and high-purity gas lines use the Type III non-aqueous bath for sub-0.05 µm Ra and minimum metallic contamination.
## Related Surface Finishes

Electropolishing is one of seven primary titanium surface finishes documented on titanium.blog. The other six are linked below for cross-comparison.

- [Titanium Anodizing](/finishes/titanium-anodizing/) — Type II sulfuric and Type III hardcoat anodizing per [AMS 2471](/standards/ams-2471/) / [AMS 2488](/standards/ams-2488/) — produces colored or hard oxide layers; distinct from electropolishing which removes material.
- [Passivation](/finishes/passivation/) — chemical (non-electrolytic) passivation in nitric or citric acid per [AMS 2700](/standards/ams-2700/) — produces the same surface oxide that electropolishing does, but without the smoothing.
- [Mechanical Polishing](/finishes/polishing/) — abrasive multi-step polishing — required as a pre-step before electropolishing when starting Ra exceeds 0.8 µm.
- [Bead Blasting](/finishes/bead-blasting/) — glass-bead or ceramic-bead matte texture — typically performed *before* electropolishing (the bead-blasted surface is the starting surface for electro-smoothing).
- [PVD Coating](/finishes/pvd-coating/) — TiN / TiAlN / DLC ceramic hardcoat — typically performed *after* electropolishing to provide wear resistance on the smooth substrate.
- [Chemical Etching](/finishes/chemical-etching/) — acid pattern or grain-boundary reveal — uses similar chemistries to electropolishing but at lower current density and longer time, producing a controlled matte texture.

The [surface finishes hub](/finishes/) provides the cross-process comparison matrix and material-compatibility guidance.

## Limitations & Hydrogen Embrittlement Risk

Electropolishing is not a universal solution. Five engineering limitations constrain its use:

- **Hydrogen pickup on α+β alloys.** Titanium is a hydride-forming metal; under cathodic-side conditions (transient during current ramp-down, or at high over-voltage), atomic hydrogen can be absorbed into the surface and diffuse into the bulk. On [Grade 5](/grades/grade-5-titanium/) and [Grade 23](/grades/grade-23-titanium/), hydrogen above 30–50 ppm can cause hydride formation and reduced fatigue life. Pulsed-current operation and tight voltage control are the standard mitigations. AMS 2700F § 3.4 specifies the maximum hydrogen limit for aerospace titanium.
- **Limited smoothing on rough starting surfaces.** Starting Ra above 1.6 µm cannot be reduced below 0.2 µm by electropolishing alone — material removal becomes prohibitive. Pre-polishing or pre-grinding is required.
- **Geometric limitations on internal passages.** Deep narrow channels (< 5 mm diameter) cannot be electropolished uniformly because current density falls off with depth and the viscous boundary layer cannot be sustained in the channel. Long-bore tubing requires specialty through-flow cells.
- **Masking complexity.** Selective electropolishing (finishing only one face of a part) requires wax, lacquer, or mechanical masking of the areas to be protected. Mask removal and post-mask surface cleaning add cost and lead time to the cycle, and risk cross-contamination.
- **Bath age and chemistry drift.** Perchloric-acid baths accumulate dissolved Ti⁴⁺ and lose activity; sulfuric-phosphoric baths absorb water from the atmosphere and change density. Production baths are typically replaced every 50–200 batches depending on workload; bath chemistry is monitored by titration and specific-gravity measurement. Aging bath is the single most common root cause of electropolishing defects (etch pitting, dull finish, hydrogen spikes).

The fatigue impact of electropolishing is generally favorable (it removes the machining-disturbed layer and the tensile-residual-stress surface), but this benefit is only realized if hydrogen pickup is controlled. Hydrogen-controlled electropolishing is the default for fracture-critical aerospace components.
## Engineering Interpretation (titanium.blog)

> (titanium.blog) Electropolishing is **the right answer** for medical implants, semiconductor UHV hardware, and pharmaceutical/food-contact surfaces where sub-0.1 µm Ra plus simultaneous passivation justify the higher per-part cost (typically 2–4× the cost of mechanical polishing to the same nominal Ra, primarily due to fixturing, masking, and bath chemistry control). It is **the wrong answer** for cosmetic consumer finishes (mechanical polishing is faster and cheaper), for rough machined surfaces (pre-grinding is required and the total cost rivals a full mechanical-polish sequence), and for fatigue-critical aerospace components where the hydrogen risk outweighs the surface-smoothing benefit unless pulsed current and lot-by-lot hydrogen analysis are specified.

Three practical rules from production experience:

1. **Always electropolish before final passivation, never after.** The electropolished surface is itself passivated in the bath; a separate post-electropolish nitric/citric acid step adds cycle time without changing the surface chemistry.
2. **Specify pulsed current (Type III) on Grade 5/23 fatigue-critical hardware.** The 30–50 % cycle-time penalty is repaid by reduced hydrogen pickup and tighter Ra control.
3. **Lot-track every bath.** Hydrogen content, dissolved-Ti concentration, and specific gravity must be logged per lot; a bath that drifts outside spec produces defective parts that are not visually distinguishable from good parts until the next inspection step.

> All parameter ranges quoted in this guide (voltage, current density, temperature, time, material removal, hydrogen limits) are typical values from the cited standards and reference works for the material and process combinations listed. They are not guaranteed values for any specific part; the user is responsible for qualifying the process on their own components per the controlling specification.

## Evidence Basis

This page consolidates engineering practice drawn from the following authoritative sources:

- **ASTM B912-02(2018)** — *Passivation of Titanium and Titanium Alloys by Electropolishing*. ASTM International, 2018. Defines the electrochemical process parameters, bath chemistries, and acceptance criteria for titanium electropolishing — the primary specification cited in this guide.
- **ASTM F86-21** — *Standard Practice for Surface Preparation and Marking of Metallic Surgical Implants*. ASTM International, 2021. Defines the surface preparation sequence including electropolishing for titanium implants.
- **AMS 2700F** — *Passivation of Corrosion-Resistant Steels and Titanium Alloys*. SAE International, 2018. Defines the chemical passivation step that follows electropolishing when a separate passivation is specified.
- **ASTM B600-21** — *Standard Guide for Descaling and Cleaning Titanium and Titanium Alloy Surfaces*. ASTM International, 2021. Defines the pre-electropolish surface preparation sequence including alpha-case removal.
- **ISO 13485:2016** — *Medical devices — Quality management systems — Requirements for regulatory purposes*. ISO, 2016. Defines the process-control framework for medical-implant electropolishing.
- **ASTM F136-13** — *Standard Specification for Wrought Titanium-6Aluminum-4Vanadium ELI (Extra Low Interstitial) Alloy for Surgical Implant Applications*. ASTM International, 2013. Defines the substrate specification for medical-implant electropolishing on Grade 23 ELI.
- **ISO 9001:2015** — *Quality management systems — Requirements*. ISO, 2015. Defines the QMS framework under which electropolishing process control, calibration, and traceability are typically documented for non-medical industrial and consumer components.

> Site-judgement claims (the Engineering Interpretation section above) are distinguished from the standard-derived facts above by the (titanium.blog) marker. The standard-derived voltage, current density, temperature, and material-removal values are anchored to the cited specifications; the engineering judgement (when to use Type II vs Type III, how to mitigate hydrogen risk, when to choose electropolish over mechanical polish) is titanium.blog interpretation.

## Related Standards

- [ASTM B912 — Passivation of Titanium by Electropolishing](/standards/astm-b912/) — the primary specification for titanium electropolishing cited throughout this guide.
- [ASTM F86 — Surface Preparation and Marking of Metallic Surgical Implants](/standards/astm-f86/) — defines the implant-surface preparation sequence that electropolishing supports.
- [AMS 2700 — Passivation of Corrosion-Resistant Steels and Titanium Alloys](/standards/ams-2700/) — defines the chemical passivation baseline that electropolishing produces in a single step.
- [ISO 13485 — Medical Devices Quality Management Systems](/standards/iso-13485/) — QMS framework for medical-implant electropolishing process control and traceability.
- [ISO 9001 — Quality Management Systems](/standards/iso-9001/) — general QMS framework for non-medical industrial electropolishing process documentation.
- [ASTM F136 — Wrought Ti-6Al-4V ELI for Medical Implants](/standards/astm-f136/) — material specification for Grade 23 ELI implant substrates that electropolishing is applied to.

For the cross-cluster procurement context, see the [procurement](/procurement/) module (process selection and vendor qualification) and the [surface finishes hub](/finishes/) (full catalog of finish types).