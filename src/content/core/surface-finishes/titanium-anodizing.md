---
title: "Titanium Anodizing — Complete Guide"
description: "Technical guide to titanium anodizing. Types of anodizing (Type II, Type III), color anodizing, process parameters, voltage-to-color mapping, electrolyte chemistry, and applications for aerospace and medical industries."
locale: en
author: "titanium.blog Materials Engineering Team"
publishDate: 2026-08-22
updatedAt: 2026-08-22
reviewer: "Senior Materials Engineering Reviewer"
materials:
  - "grade-5-titanium"
  - "grade-2-titanium"
  - "grade-23-titanium"
industries:
  - "aerospace"
  - "medical"
  - "defense"
raRange: "0.2-0.8 µm Ra"
finishType: "conversion-coating"
processes:
  - "anodizing"
source: "AMS 2471H, AMS 2488J, ASTM B862-21"
sourceUrl: ""
sourceAuthority: "HIGH"
claimSupport: "SUPPORTED"
claimScope: "STANDARD_REQUIREMENT"
relatedMaterials:
  - "grade-2-titanium"
  - "grade-5-titanium"
  - "grade-23-titanium"
relatedProcesses:
  - "passivation-titanium"
  - "electropolishing-titanium"
  - "pvd-coating-titanium"
relatedStandards:
  - "astm-b862"
  - "ams-2471"
  - "ams-2488"
  - "iso-13485"
order: 1
---

## Quick Answer

**What is titanium anodizing?** Titanium anodizing is an electrochemical surface treatment that grows a controlled titanium-oxide layer on titanium substrates by passing direct current through an acid electrolyte with the titanium part as the anode. The applied voltage sets the oxide thickness in the range of 0.02–0.5 µm (Type II) up to 1–5 µm (Type III hardcoat), which in turn determines the interference colour. The process improves wear resistance, extends corrosion protection beyond the natural passive film, and produces stable cosmetic colours without dyes — making it the default surface finish for aerospace identification marking, medical implant colour-coding, and decorative titanium components.

## How Titanium Anodizing Works

Titanium forms a stable, self-healing native oxide (TiO₂) of approximately 2–7 nm thickness in air. Anodizing deliberately thickens this layer by electrochemical means: the part is connected to the positive terminal of a DC power supply and immersed in an acid electrolyte together with a stainless-steel or titanium cathode. Applied potential drives oxygen ions to the titanium surface, building a porous oxide whose thickness is proportional to voltage at roughly 1.5–3 nm/V depending on electrolyte chemistry. Current density is typically held between 0.5–2 A/dm² for 1–30 min at 18–25 °C electrolyte temperature. Because the colour comes from light interference in the oxide — not from pigment — anodized titanium is colour-stable under UV, biocompatible, and survives autoclave cycles above 120 °C.

## Process Parameters

| Parameter | Type II (Sulfuric) | Type III (Hardcoat) |
|-----------|--------------------|---------------------|
| Electrolyte | 5–15 wt% H₂SO₄ | 5–10 wt% H₂SO₄ + additives |
| Voltage | 15–80 V | 70–95 V |
| Current density | 1.0–1.5 A/dm² | 1.5–2.0 A/dm² |
| Temperature | 18–25 °C | < 20 °C (chilled) |
| Time | 5–30 min | 10–30 min |
| Oxide thickness | 0.02–0.5 µm | 1–5 µm |
| Colour control | Yes (voltage-dependent) | Limited (dark grey/bronze) |
| Wear improvement | Moderate | High |

Sealing in hot deionized water (60–100 °C, 15–30 min) or in nickel-acetate solution closes the porous structure and locks in dye-free colour stability for medical and aerospace marking applications.

## Voltage-to-Colour Mapping (Type II)

| Voltage (V) | Nominal Colour | Typical Use |
|-------------|----------------|-------------|
| 10–15 | Gold / champagne | Decorative trim |
| 20–25 | Bronze / brown | Architectural accents |
| 30–35 | Violet / purple | Medical colour-coding |
| 40–45 | Dark blue | Aerospace identification |
| 50–55 | Light blue | Medical implants |
| 60–70 | Pale green / teal | Decorative hardware |
| 75–85 | Pink / magenta | Consumer products |
| > 90 | Grey / over-anodized | Not recommended |

The colour window is repeatable within ±2 V on a fresh electrolyte; aged baths drift and require periodic titration of free acid.

## Types of Anodizing

- **Type II (Sulphuric Acid Anodizing)** — The default decorative and identification anodizing. Produces a thin, transparent oxide with voltage-controlled colour. Used for medical implant identification (per ASTM F86), aerospace part marking, and consumer electronics.
- **Type III (Hard Anodizing, AMS 2488)** — A thicker, harder oxide (~1–5 µm, ~600 HV) built at higher voltage and current density. Provides measurable wear and galling resistance for sliding aerospace components, but yields only dark grey to bronze tones.
- **Type I (Chromic Acid)** — Historic process; largely replaced by Type II due to Cr(VI) handling restrictions under REACH. Still specified in some legacy aerospace drawings.
- **Plasma Electrolytic Oxidation (PEO)** — A related but distinct process operating at > 200 V producing a thicker, ceramic-like oxide up to 20 µm; covered separately.

## Compatible Materials

Titanium anodizing works on all commercially pure and alloyed titanium grades; common engineering choices are:

- [Grade 2 commercially pure titanium](/grades/grade-2-titanium/) — most common; excellent colour response at 15–80 V.
- [Grade 5 (Ti-6Al-4V)](/grades/grade-5-titanium/) — aerospace alloy; anodizes readily but the Al/V alloying shifts the colour window slightly (typically +3–5 V for the same hue).
- [Grade 23 (Ti-6Al-4V ELI)](/grades/grade-23-titanium/) — medical implant grade; biocompatible anodized surface per ASTM F86.

The process is **not recommended** on titanium-aluminide intermetallics (γ-TiAl) or on parts that have been nitrided, because the compound layer interferes with controlled oxide growth.

## Typical Applications

- **Aerospace** — Identification marking on Grade 5 structural components, hydraulic fittings, and fastener heads. Hard anodizing (AMS 2488) on actuator pistons and bearing surfaces.
- **Medical** — Colour-coded orthopaedic implants, surgical instrument identification, dental abutments. The anodized surface is biocompatible and survives repeated autoclave cycles > 120 °C.
- **Defence** — Black-anodized optical housings, weapon components requiring low reflectivity.
- **Consumer** — Bicycle frames, watch cases, jewellery, and architectural hardware where stable colour without paint is required.
- **Semiconductor** — Chamber fittings where the oxide reduces particle shedding and outgassing.

## Related Surface Finishes

Titanium anodizing sits within a wider surface-treatment portfolio; engineers typically select finishes by required function:

- [Passivation of Titanium](/finishes/passivation-titanium/) — strengthens the native oxide without colour change; often used as a pre-treatment before anodizing.
- [Electropolishing of Titanium](/finishes/electropolishing-titanium/) — produces the smoothest pre-anodizing substrate (~0.05 µm Ra) and the brightest colours.
- [PVD Coating for Titanium](/finishes/pvd-coating-titanium/) — adds a 1–2 µm ceramic layer (TiN, TiAlN, DLC) for wear performance beyond what anodizing alone achieves.
- [Bead Blasting for Titanium](/finishes/bead-blasting-titanium/) — matte texture; usually applied *before* anodizing for non-reflective surfaces.
- [Polishing of Titanium](/finishes/polishing-titanium/) — mirror finish substrate for premium cosmetic anodizing.
- [Chemical Etching of Titanium](/finishes/chemical-etching-titanium/) — pattern or grain-boundary reveal prior to selective anodizing.

## Limitations and Failure Modes

Anodizing is robust but has well-known out-of-spec cases; design around them rather than discovering them in production:

- **Hydrogen embrittlement** — acid electrolytes can drive hydrogen into titanium at high current density; not recommended on Grade 4 or higher-strength alloys without a vacuum-degassing step.
- **Colour drift** — aged electrolytes, contaminated cathodes, or bath temperature > 25 °C shift the voltage-to-colour curve by 3–8 V; calibrate weekly with a reference coupon.
- **Pitting** — chloride contamination of the bath (> 50 ppm Cl⁻) causes pitting corrosion of the substrate; use deionized water make-up.
- **Burning / over-anodizing** — voltages above 95 V or current density > 2.5 A/dm² produces a powdery, non-protective oxide that flakes under handling.
- **Inconsistent colour on complex geometry** — current density is non-uniform in recesses; design with anode-cathode spacing ≥ 100 mm or use conforming cathodes.

## Engineering Interpretation

(titanium.blog) Type II sulfuric-acid anodizing at 18–25 °C with current density 1.0–1.5 A/dm² is the engineering default for the majority of titanium components that need identification marking or stable colour. Use Type III only when wear or galling resistance is the primary requirement, and accept the limited colour range. Pre-anodize surface roughness of 0.2–0.4 µm Ra is the practical sweet spot: smoother substrates (electropolished to 0.05 µm Ra) yield brighter, more repeatable colours; rougher substrates (> 0.8 µm Ra) scatter light and mute the colour. For medical implants, validate the anodizing line against ASTM F86 and confirm biocompatibility per ISO 10993-5 cytotoxicity testing on the actual production bath.

## Evidence Basis

This page consolidates engineering practice drawn from the following authoritative sources:

- **AMS 2471H** — Aerospace Material Specification: Anodizing of Titanium and Titanium Alloys (general). SAE International, 2018.
- **AMS 2488J** — Aerospace Material Specification: Hard Anodizing of Titanium and Titanium Alloys. SAE International, 2020.
- **ASTM B862-21** — Standard Specification for Titanium and Titanium Alloy Welded Pipe. ASTM International, 2021.
- **ASTM F86-21** — Standard Practice for Surface Preparation and Marking of Metallic Surgical Implants. ASTM International, 2021.
- **ISO 13485:2016** — Medical devices — Quality management systems — Requirements for regulatory purposes. ISO, 2016.

Voltage-to-colour mapping and process parameters in this guide reflect typical values across multiple reference baths; specific production lines should be calibrated against their own reference coupons.

## Related Standards

- [ASTM B862 — Titanium Welded Pipe](/standards/astm-b862/) — material specification commonly referenced alongside anodized titanium piping.
- [AMS 2471 — Anodizing of Titanium](/standards/ams-2471/) — primary aerospace anodizing specification.
- [AMS 2488 — Hard Anodizing of Titanium](/standards/ams-2488/) — Type III hardcoat specification.
- [ISO 13485 — Medical Device QMS](/standards/iso-13485/) — quality system for medical anodized components.
