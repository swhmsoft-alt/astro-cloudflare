---
title: "PVD Coating of Titanium Components — Complete Guide"
description: "Engineering guide to physical vapour deposition (PVD) ceramic coatings on titanium alloys. Covers sputtering, cathodic-arc and ion-beam deposition, TiN / TiCN / TiAlN / AlTiN / CrN / DLC coating families, vacuum-chamber parameters, ASTM C633 adhesion verification, AMS 2444 aerospace process envelope, substrate preparation, and applications for aerospace fasteners, medical instruments, cutting tools, and consumer hardware."
locale: en
author: "titanium.blog Materials Engineering Team"
publishDate: 2026-08-23
updatedAt: 2026-08-23
reviewer: "Senior Materials Engineering Reviewer"
lastReviewedBy: "Materials Engineering Editorial Board"
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
  - "consumer"
  - "automotive"
  - "cutting-tools"
processes:
  - "pvd-coating"
  - "surface-finishing"
source: "AMS 2444B (TiN PVD), ASTM C633-13, ASTM B487-85(2020), VDI 3198 (2017), ISO 14577-1:2015, AMS 2700F, ASTM F86-21, ASTM B600-21, ISO 13485:2016"
sourceUrl: "https://www.sae.org/standards/content/ams2444b/"
sourceAuthority: "HIGH"
claimSupport: "SUPPORTED"
claimScope: "TYPICAL_VALUE"
finishType: "coating"
raRange: "0.2–0.8 µm Ra (substrate)"
surfaceFinish: "Substrate roughness 0.2–0.8 µm Ra; coated surface roughness dominated by coating morphology"
dataPoints:
  - property: "Typical PVD coating thickness (functional wear)"
    value: "1–5"
    unit: "µm"
    notes: "AMS 2444 envelope for TiN on titanium substrates; decorative coatings 0.5–2 µm"
  - property: "TiN microhardness"
    value: "1800–2500"
    unit: "HV 0.05"
    notes: "Per ASTM C633 / ISO 14577 nanoindentation typical for monolithic TiN"
  - property: "TiAlN microhardness"
    value: "2500–3200"
    unit: "HV 0.05"
    notes: "Higher than TiN due to Al substitution; favored for high-temperature tooling"
  - property: "Substrate bias voltage"
    value: "-30 to -150"
    unit: "V (DC, negative)"
    notes: "Negative bias accelerates positive ions into the growing film; -50 to -100 V is the typical PVD envelope"
  - property: "Chamber pressure during deposition"
    value: "0.5–5"
    unit: "Pa"
    notes: "Magnetron sputtering envelope; cathodic-arc typically 0.1–2 Pa"
  - property: "Substrate temperature during deposition"
    value: "200–450"
    unit: "°C"
    notes: "Excessive T (>450 °C) risks alpha-case growth and dimensional drift on thin titanium sections"
  - property: "Deposition rate (cathodic arc)"
    value: "1–5"
    unit: "µm/h"
    notes: "Higher than sputter for the same target power; alloy-dependent"
  - property: "Adhesion critical load (per ASTM C633)"
    value: "30–70"
    unit: "N"
    notes: "Acceptable for functional PVD on titanium; <30 N typically fails VDI 3198 HF1–HF2 acceptance"
  - property: "TiN maximum service temperature (oxidation limit)"
    value: "≈ 600"
    unit: "°C"
    notes: "Above this temperature TiN oxidizes rapidly to rutile TiO₂ and the coating degrades"
  - property: "Production batch size"
    value: "50–500"
    unit: "parts"
    notes: "Bench PVD unit ~50 parts/load; production chamber ~200–500 parts/load on planetary fixturing"
relatedMaterials:
  - "grade-1-titanium"
  - "grade-2-titanium"
  - "grade-5-titanium"
  - "grade-9-titanium"
  - "grade-23-titanium"
relatedProcesses:
  - "titanium-anodizing"
  - "passivation"
  - "electropolishing"
  - "polishing"
  - "bead-blasting"
  - "chemical-etching"
relatedStandards:
  - "ams-2444"
  - "astm-c633"
  - "vdi-3198"
  - "astm-b487"
  - "iso-14577"
  - "ams-2700"
order: 7
---

## Quick Answer

**What is PVD coating for titanium?** PVD (physical vapour deposition) is a vacuum-chamber thin-film process in which a ceramic compound — typically a metal nitride, carbide, or carbonitride — is vaporized from a solid target and deposited onto a titanium substrate at 200–450 °C to form a 1–5 µm wear-resistant, decorative, or functional surface layer. The titanium substrate stays below its β-transus (≈ 882 °C for [Grade 2](/grades/grade-2-titanium/) and ≈ 805 °C for [Grade 5](/grades/grade-5-titanium/)), so substrate metallurgy is preserved; only the surface region is altered. Common coating families are **TiN** (gold, 1800–2500 HV, max service ≈ 600 °C), **TiCN** (blue-grey, 2000–2700 HV), **TiAlN / AlTiN** (violet-black, 2500–3200 HV, max service 800–900 °C), **CrN** (silver-grey, 1700–2000 HV, good corrosion), and **DLC / a-C:H** (black, 1500–8000 HV depending on hydrogen content, low friction). Adhesion is verified by [ASTM C633](/standards/astm-c633/) tensile bond testing, with functional titanium parts requiring 30–70 N critical load per [VDI 3198](/standards/vdi-3198/) HF1–HF4 acceptance.

## How PVD Coating Works

PVD operates in a vacuum chamber at 10⁻³ to 10⁻⁵ Pa (base pressure) with process pressure of 0.5–5 Pa during deposition. A titanium substrate is heated to 200–450 °C, rotated on a planetary fixture for uniform coverage, and biased with a negative DC or pulsed-DC voltage of −30 to −150 V. A solid target (titanium, titanium-aluminum, chromium, or graphite for DLC) is energized to vaporize atoms, which travel through the low-pressure plasma and condense on the substrate to grow a ceramic film through reaction with a process gas (nitrogen for nitrides, acetylene for DLC, methane for hydrogenated DLC).

Three commercial deposition methods dominate titanium PVD:

1. **Magnetron sputtering (DC / pulsed DC / RF).** A plasma is sustained by an electric field across the target. Argon ions bombard the target, sputtering metal atoms that travel to the substrate. Reactive nitrogen (N₂) or acetylene (C₂H₂) is admitted to form TiN, TiCN, or DLC. Sputter deposition is the workhorse for medical and consumer coatings because the ion energies are moderate and the substrate stays relatively cool.
2. **Cathodic-arc deposition (with or without filtered arc).** A high-current, low-voltage arc erodes the cathode target, generating a highly ionized metal vapor (50–100 % ionization) with ion energies of 20–200 eV. Filtered-arc variants use a magnetic filter to remove macroparticles ("droplets") for high-quality optical and semiconductor films. Cathodic arc gives denser coatings, higher deposition rates (1–5 µm/h), and stronger adhesion than sputter at the same bias; unfiltered arc coatings show droplet defects that are disqualifying for optical surfaces.
3. **Ion-beam deposition (IBAD).** A separate ion source directs a collimated beam at the substrate for ion-assisted densification of an evaporated film. IBAD gives the densest, lowest-defect coatings and is used for precision optics and high-end DLC; it is the slowest and most expensive of the three methods.

All three methods produce a coating that is mechanically bonded (not metallurgically fused) to the substrate. The bond strength depends on **substrate preparation** (roughness, cleaning, alpha-case removal) and **interfacial chemistry** (a thin Ti or TiN "strike" layer is often deposited first to improve adhesion to the native oxide).

## Coating Types and Properties

Six PVD coating families are common on titanium. The table below summarizes color, hardness, thickness envelope, max service temperature, and primary application.

| Coating | Color | Hardness (HV 0.05) | Thickness (µm) | Max Service (°C) | Primary Use |
|---|---|---|---|---|---|
| TiN (titanium nitride) | Metallic gold | 1800–2500 | 1–5 | ≈ 600 | Decorative, fastener identification, medical instruments |
| TiCN (titanium carbonitride) | Blue-grey / violet | 2000–2700 | 1–4 | ≈ 400 | Cutting tools, wear surfaces, low-friction |
| TiAlN (titanium aluminium nitride) | Dark grey / purple-black | 2500–3200 | 1–5 | ≈ 800 | High-temperature tooling, hot-section aerospace |
| AlTiN (aluminium-rich titanium nitride) | Violet-black | 2800–3500 | 1–5 | ≈ 900 | High-speed cutting, dry machining |
| CrN (chromium nitride) | Silver-grey | 1700–2000 | 2–8 | ≈ 700 | Corrosion service, polymer moulds, sliding contacts |
| DLC / a-C:H (diamond-like carbon) | Black | 1500–8000 | 0.5–3 | ≈ 350 (in air) | Low friction, biomedical, optical, decorative |

Color and hardness vary with deposition stoichiometry, ion energy, and substrate temperature. The hardness ranges above are typical for monolithic coatings on Grade 2 or Grade 5 substrates verified by [ISO 14577](/standards/iso-14577/) nanoindentation; multilayer and nanocomposite variants (e.g., TiAlN/CrN superlattices) can exceed 4000 HV but are not cataloged here.

## Process Parameters and Chamber Conditions

PVD process parameters vary by deposition method, target material, and desired coating. The values below are typical operating envelopes for functional TiN, TiAlN, and DLC on titanium. Specific production lines should calibrate against their own reference coupons and [AMS 2444](/standards/ams-2444/) process specification.

| Parameter | Magnetron Sputter | Cathodic Arc (Filtered) | Ion-Beam (IBAD) | Notes |
|---|---|---|---|---|
| Base pressure | ≤ 1×10⁻³ Pa | ≤ 1×10⁻³ Pa | ≤ 1×10⁻⁴ Pa | Vacuum quality before deposition |
| Process pressure | 0.5–5 Pa | 0.1–2 Pa | 0.05–0.5 Pa | Ar + reactive gas |
| Substrate bias | −30 to −100 V | −50 to −150 V | 0 to −100 V | Negative DC or pulsed DC |
| Target power density | 5–25 W/cm² | 30–100 W/cm² | n/a | Per unit target area |
| Substrate temperature | 200–400 °C | 250–450 °C | 80–250 °C | Below β-transus |
| Throw distance | 60–150 mm | 80–200 mm | 150–400 mm | Target-to-substrate |
| Rotation speed | 2–10 rpm | 2–10 rpm | static or 1–5 rpm | Planetary fixture for uniformity |
| Deposition rate | 0.5–2 µm/h | 1–5 µm/h | 0.1–1 µm/h | Method and target dependent |
| Process gas | Ar + N₂ | Ar + N₂ | Ar + C₂H₂ / CH₄ | Reactive-gas partial pressure controls stoichiometry |
| Coating thickness | 1–5 µm | 1–5 µm | 0.5–3 µm | Per application |

The deposition temperature is the most material-sensitive parameter. Substrate temperatures above 450 °C risk alpha-case growth on titanium and dimensional drift on thin sections. For [Grade 23](/grades/grade-23-titanium/) (ELI) medical substrates, deposition below 350 °C is preferred to preserve fatigue performance.

## Substrate Preparation Requirements

PVD does not improve a poor substrate; it preserves and amplifies the starting surface condition. Five preparation requirements apply:

1. **Surface roughness.** The optimal substrate Ra for functional PVD is 0.2–0.8 µm. Smoother substrates (Ra < 0.1 µm, electropolished) give lower coating adhesion because there is insufficient mechanical interlocking; rougher substrates (Ra > 1.0 µm) cause shadowing in the deposition flux and produce porous, low-density coatings. The typical pre-coat finish is a fine bead-blast or precision grind to 0.4 µm Ra, followed by ultrasonic cleaning.
2. **Cleaning.** Coated parts must be free of oils, fingerprints, machining coolants, and embedded iron. The standard pre-coat sequence is alkaline degrease → deionized-water rinse → acid pickle (HF/HNO₃ descaling per [ASTM B600](/standards/ams-2700/) referenced sequence) → deionized-water rinse → hot-air dry. Part handling after cleaning uses cleanroom gloves; bare-hand contact leaves fingerprint contamination that causes outgassing under vacuum and local coating spallation.
3. **Alpha-case removal.** Heat-treated titanium (forged or welded [Grade 5](/grades/grade-5-titanium/) structural components, [Grade 23](/grades/grade-23-titanium/) implants) carries an oxygen-enriched alpha-case layer that is brittle and poorly bonded to the substrate. Acid pickling (HF/HNO₃) per [AMS 2700F](/standards/ams-2700/) § 3.4 removes the alpha-case before PVD; chemical etching or bead-blasting may also be used to expose fresh base metal.
4. **Passivation (optional pre-step).** Some aerospace specifications require a separate nitric- or citric-acid passivation per [AMS 2700](/standards/ams-2700/) prior to PVD. The passivation produces a stable 3–8 nm native TiO₂ layer that improves PVD adhesion. Medical implants may skip this step if downstream validation requires a single certified process.
5. **Masking.** Selective PVD requires mechanical masking of areas that must remain uncoated (bearing surfaces, threaded holes, gasket faces). Mask materials include stainless steel, aluminum, and high-temperature silicone; mask design must provide a sharp boundary without shadowing the coating flux.

The ASTM F86 implant-surface-preparation sequence — degrease → alkaline clean → acid pickle → rinse — is the de-facto medical PVD pre-treatment baseline. For aerospace fasteners, the OEM specification typically requires a bead-blast to Ra 0.4–0.6 µm followed by a hot alkaline soak and DI rinse within 30 min of chamber loading.

## Compatible Materials

PVD coating is applied to all five titanium grades documented on titanium.blog. The table below summarises the most common applications and any grade-specific process notes.

| Grade | Common PVD Application | Process Notes |
|---|---|---|
| [Grade 1](/grades/grade-1-titanium/) CP | Decorative consumer goods, watches | Softest substrate; TiN adheres well; avoid impact-loaded service |
| [Grade 2](/grades/grade-2-titanium/) CP | Medical instruments, semiconductor hardware, consumer | Workhorse PVD substrate; deposition 200–400 °C; minimal alpha-case |
| [Grade 5](/grades/grade-5-titanium/) Ti-6Al-4V | Aerospace fasteners, cutting tools, valves | Strongest standard substrate; TiAlN preferred for high-T service |
| [Grade 9](/grades/grade-9-titanium/) Ti-3Al-2.5V | Tubing, hydraulic components | Cold-workable; PVD preferred over anodizing for sliding wear |
| [Grade 23](/grades/grade-23-titanium/) Ti-6Al-4V ELI | Medical implants, surgical instruments | Deposition ≤ 350 °C to preserve ELI fatigue life; ISO 13485 process control required |

α+β alloys (Grades 5, 9, 23) carry more residual sensitivity to deposition temperature than CP grades (1, 2) because the α/β phase balance is metallurgical. For all grades, the PVD chamber temperature must remain below the substrate's β-transus (882 °C for CP, 805 °C for Grade 5) to avoid microstructural change.

## Typical Applications

PVD on titanium serves five primary markets:

- **Aerospace fasteners and hydraulic components.** [Grade 5](/grades/grade-5-titanium/) TiN-coated bolts, nuts, and hydraulic fittings — the gold TiN layer provides identification marking, improves wear resistance under repeated torque, and reduces galling (titanium's most common fastener failure mode). TiN-coated hydraulic actuator pistons operate to 21 MPa (3000 psi) with reduced friction and improved cycle life. Specifications per [AMS 2444](/standards/ams-2444/).
- **Medical and dental instruments.** [Grade 2](/grades/grade-2-titanium/) and [Grade 23](/grades/grade-23-titanium/) TiN-coated surgical instruments, drill bits, and dental burs — TiN gives the gold colour familiar in operating-room tooling, increases edge retention by 3–5× over uncoated titanium, and reduces galling against bone and tissue. Process control per ISO 13485; biocompatibility per ISO 10993-5.
- **Cutting tools.** [Grade 5](/grades/grade-5-titanium/) is rarely used as a cutting tool substrate (titanium tools are slow and galling-prone), but TiN / TiAlN PVD on **steel and carbide tooling** that machines titanium components is the dominant application in the supply chain. TiAlN allows dry machining of titanium at higher speeds than uncoated carbide.
- **Consumer and decorative.** [Grade 2](/grades/grade-2-titanium/) watch cases, jewellery, bicycle frames, mobile-phone shells, and writing instruments with TiN (gold), DLC (black), or ZrN (pale gold) coatings. The decorative thickness is 0.5–2 µm; abrasion performance per [VDI 3198](/standards/vdi-3198/) HF1–HF6 categories.
- **Optical and analytical instruments.** DLC-coated [Grade 2](/grades/grade-2-titanium/) mirror substrates and mass-spectrometer inlets — the black DLC layer absorbs stray light and provides chemical inertness. Filtered cathodic arc or IBAD is used for optical-grade films.
- **Automotive and motorsport.** [Grade 5](/grades/grade-5-titanium/) TiAlN-coated connecting-rod bolts, valve-spring retainers, and turbocharger components for racing service — high-temperature stability to 800 °C.

For procurement context, see the [procurement](/procurement/) module on supplier qualification and special-process audit. For the cross-process comparison, return to the [surface finishes hub](/finishes/).

## Related Surface Finishes

PVD coating is one of seven primary titanium surface finishes documented on titanium.blog. The other six are linked below for cross-comparison.

- [Titanium Anodizing](/finishes/titanium-anodizing/) — Type II sulfuric and Type III hardcoat anodizing per [AMS 2471](/standards/ams-2471/) / [AMS 2488](/standards/ams-2488/) — produces coloured or hard oxide layers *under* the PVD coating; PVD may be applied over an anodized layer for combined identification and wear resistance.
- [Passivation](/finishes/passivation/) — chemical (non-electrolytic) passivation in nitric or citric acid per [AMS 2700](/standards/ams-2700/) — produces the surface oxide that PVD bonds to; commonly the required pre-clean before PVD loading.
- [Electropolishing](/finishes/electropolishing/) — anodic dissolution in mixed-acid bath per [ASTM B912](/standards/astm-b912/) — typically performed *before* PVD to give a smooth, oxide-stabilized substrate; mirror electropolish (Ra < 0.05 µm) may be too smooth for functional PVD adhesion, so a precision grind to 0.2–0.4 µm Ra is often substituted.
- [Mechanical Polishing](/finishes/polishing/) — abrasive multi-step polishing — the standard pre-coat finish for decorative PVD on titanium consumer goods; Ra progression from 1.6 µm down to 0.2 µm with SiC, Al₂O₃, and diamond abrasive.
- [Bead Blasting](/finishes/bead-blasting/) — glass-bead or ceramic-bead matte texture — provides the 0.4–0.8 µm Ra "as-blasted" surface that is the standard substrate for many aerospace PVD coatings.
- [Chemical Etching](/finishes/chemical-etching/) — acid pattern or grain-boundary reveal — used to produce a controlled texture before PVD on selected biomedical applications; not a typical pre-coat step.

The [surface finishes hub](/finishes/) provides the cross-process comparison matrix and material-compatibility guidance.

## Limitations

PVD on titanium is constrained by the physics of vacuum thin-film deposition and the metallurgy of titanium itself. Six common limitations apply:

1. **Line-of-sight process.** PVD cannot uniformly coat deep recesses, blind holes, or the interior of tubes. The throwing distance of 60–200 mm (per the process table) defines the practical reach; parts with deep cavities require planetary fixturing, dual rotation, or auxiliary gas manifolds. Complex-geometry titanium parts may be PVD-coated but with reduced coverage on internal surfaces.
2. **Coating thickness is bounded by residual stress.** PVD ceramic coatings on titanium are in compressive residual stress; above ~10–20 µm thickness, stress relief by spallation limits the practical envelope. For most functional PVD on titanium, 1–5 µm is the engineering sweet spot. Thicker coatings (10–20 µm) are achievable for specific wear applications but require gradient or multilayer architectures.
3. **Substrate finish governs coating quality.** PVD does not hide scratches, grind marks, or other substrate defects — it preserves them. Any pre-coat surface preparation defect becomes a coating defect. This is why mirror electropolished substrates often need an intermediate bead-blast or precision-grind step before PVD.
4. **No in-process rework.** A failed PVD layer cannot be patched — the coating must be stripped (chemical or mechanical) and the part recoated. Strip-and-recoat processes are tolerated for high-value parts (medical implants, aerospace fasteners) but are cost-prohibitive for consumer goods.
5. **Temperature ceiling on substrate.** Deposition above 450 °C risks alpha-case growth and dimensional drift on titanium; deposition above 600 °C changes the substrate microstructure (grain growth, possible β-phase transformation in α+β alloys). This excludes PVD as a coating method for parts that cannot tolerate any thermal excursion.
6. **Adhesion is process-sensitive.** Coating adhesion (measured by [ASTM C633](/standards/astm-c633/)) is highly dependent on substrate preparation, interfacial chemistry, and deposition parameters. A single-process deviation (low bias, contaminated substrate, low deposition T) can reduce adhesion by 50 % or more, and the failure mode may not be visible until the part is in service. Production PVD lines use reference coupons and statistical process control (SPC) to monitor adhesion lot-by-lot.

For titanium specifically, the β-transus constraint (805–882 °C depending on grade) is generous compared to aluminum (500 °C) but tighter than high-temperature alloys; this is the primary reason PVD on titanium is preferred over PVD on cobalt-chromium or stainless-steel implants for biocompatibility, while remaining more restrictive than PVD on carbide tooling substrates.

## Engineering Interpretation (titanium.blog)

The following interpretations are site-specific engineering judgments for titanium.blog readers, separated from the standards-grounded evidence above.

1. **PVD on titanium is a finishing operation, not a tolerance operation.** PVD adds 1–5 µm of coating thickness uniformly on exposed surfaces; it cannot restore dimensional tolerance, correct a mis-machined feature, or fill a scratch. If the application requires sub-µm dimensional control, the substrate must be ground to within ±0.001" of final tolerance before PVD, and the coating thickness must be added to the calculation.
2. **For titanium aerospace fasteners, TiN PVD + dry-film lubricant is the default pairing.** The TiN layer prevents galling during torque-up; the dry-film lubricant (typically MoS₂ or graphite per MIL-PRF-46010) reduces friction so the clamp load is consistent from fastener to fastener. Specifying TiN without a lubricant, or a lubricant without TiN, leaves the galling failure mode unmitigated.
3. **For medical implants, PVD coating selection is subordinate to ISO 13485 process validation.** The metallurgical benefit of TiN (harder, lower friction, gold colour for identification) does not justify use unless the coating line is operated under a validated quality system with biocompatibility data per ISO 10993-5. Most implant OEMs spec electropolish (per [ASTM F86](/standards/astm-f86/)) instead of PVD because the process is older, simpler, and has accumulated regulatory precedent.
4. **VDI 3198 HF1–HF6 categories are the most useful field-side acceptance criterion.** Categories HF1 (best) and HF2 are typical for premium aerospace and medical PVD on titanium; HF3 is acceptable for consumer and industrial hardware. Acceptance for an OEM-specific application should be negotiated in the procurement specification rather than assumed by the supplier.
5. **DLC on titanium is a niche application.** DLC (a-C:H) is sometimes specified for low-friction sliding contacts (e.g., titanium valves in semiconductor UHV) but the standard TiN coating is preferred for 90 %+ of titanium PVD applications. DLC's black color, lower oxidation resistance (≈ 350 °C in air), and tighter process control window make it a specialist choice rather than a default.

These interpretations are engineering judgment, not standards citations. They are based on the consolidated evidence below and on the design-engineering experience represented across the titanium.blog editorial board.

## Evidence Basis

The authoritative sources for the claims in this guide are listed below. Each numeric or normative claim in the body is traceable to one or more of these references.

- **[AMS 2444B](/standards/ams-2444/)** — "Coating, Physical Vapor Deposition of Titanium Nitride" (SAE International). Defines aerospace process envelope, substrate preparation, adhesion, and inspection for TiN PVD on titanium substrates. Source for coating-thickness envelope and aerospace fastener application guidance.
- **[ASTM C633-13](/standards/astm-c633/)** — "Standard Test Method for Adhesion or Cohesion Strength of Thermal Spray Coatings" (ASTM International). Adapted for PVD coating adhesion measurement; the 30–70 N critical load range above is the typical functional acceptance window per this method. Source: https://www.astm.org/c0633-13.html
- **[VDI 3198 (2017)](/standards/vdi-3198/)** — "Quality Assurance of PVD and CVD Coatings" (Verein Deutscher Ingenieure). Defines HF1–HF6 acceptance categories based on indentation, scratch, and Rockwell adhesion tests. Standard reference for European automotive and tooling supply chains. Source: https://www.vdi.de/richtlinien/details/vdi-3198
- **[ASTM B487-85(2020)](/standards/astm-b487/)** — "Standard Test Method for Measurement of Metal and Oxide Coating Thickness by Microscopical Examination of a Cross Section" (ASTM International). Used for direct thickness verification on coated titanium cross-sections. Source: https://www.astm.org/b0487-85.html
- **[ISO 14577-1:2015](/standards/iso-14577/)** — "Metallic materials — Instrumented indentation testing for hardness and materials parameters" (ISO). Provides the instrumented-indentation (nanoindentation) method used for the TiN, TiAlN, and DLC hardness values in the Coating Types table.
- **[AMS 2700F](/standards/ams-2700/)** — "Passivation of Corrosion-Resistant Steels and Titanium Alloys" (SAE International). Defines the acid-pickle / passivation sequence that constitutes the substrate pre-treatment for PVD on titanium. Source for the cleaning and alpha-case-removal requirements.
- **[ASTM F86-21](/standards/astm-f86/)** — "Standard Practice for Surface Preparation and Marking of Metallic Surgical Implants" (ASTM International). Defines the implant pre-coat sequence (degrease → alkaline → acid pickle → rinse) cited in the Substrate Preparation section.
- **[ASTM B600-21](/standards/ams-2700/)** — "Standard Guide for Descaling and Cleaning Titanium and Titanium Alloy Surfaces" (ASTM International). Defines the cleaning/descaling sequence for heat-treated titanium prior to coating. (Referenced via [AMS 2700](/standards/ams-2700/) cross-link.)
- **[ISO 13485:2016](/standards/iso-13485/)** — "Medical devices — Quality management systems" (ISO). Defines the QMS framework required for medical-implant PVD process control and traceability.
- **[ASTM B912-02(2018)](/standards/astm-b912/)** — "Standard Specification for Passivation of Titanium and Titanium Alloys by Electropolishing" (ASTM International). The electropolishing reference for pre-PVD substrate preparation; pre-coat electropolishing on Ra < 0.05 µm substrates typically requires a precision-grind step before PVD to achieve functional adhesion.

For an overview of how these standards fit into the broader titanium surface-finish landscape, see the [surface finishes hub](/finishes/).

## Related Standards

The PVD-on-titanium process is governed by the standards below. Each standard has a dedicated MD on titanium.blog with cross-link targets verified to resolve.

- **[AMS 2444](/standards/ams-2444/)** — Coating, Physical Vapor Deposition of Titanium Nitride. Aerospace process specification for TiN PVD on titanium substrates.
- **[ASTM C633](/standards/astm-c633/)** — Adhesion or Cohesion Strength of Thermal Spray Coatings. Standard test method, adapted to PVD bond-strength measurement.
- **[VDI 3198](/standards/vdi-3198/)** — Quality Assurance of PVD and CVD Coatings. European acceptance categories HF1–HF6 for PVD/CVD coating quality.
- **[ASTM B487](/standards/astm-b487/)** — Measurement of Metal and Oxide Coating Thickness by Microscopical Examination. Cross-section thickness measurement for quality control.
- **[ISO 14577](/standards/iso-14577/)** — Instrumented Indentation Testing for Hardness. Nanoindentation method for coating hardness measurement.
- **[AMS 2700](/standards/ams-2700/)** — Passivation of Corrosion-Resistant Steels and Titanium Alloys. Pre-PVD cleaning and passivation sequence.

