---
title: "Titanium Passivation — Complete Guide"
description: "Engineering guide to chemical passivation of titanium alloys. Nitric and citric acid processes, ASTM F86 / ASTM A967 / AMS 2700 compliance, oxide-thickness growth, and applications for medical, aerospace, and chemical-processing industries."
locale: en
author: "titanium.blog Materials Engineering Team"
publishDate: 2026-08-23
updatedAt: 2026-08-23
reviewer: "Senior Materials Engineering Reviewer"
lastReviewedBy: "Senior Materials Engineering Reviewer"
materials:
  - "grade-2-titanium"
  - "grade-5-titanium"
  - "grade-23-titanium"
  - "grade-7-titanium"
  - "grade-9-titanium"
industries:
  - "medical"
  - "aerospace"
  - "chemical-processing"
  - "semiconductor"
raRange: "0.4-0.8 µm Ra"
finishType: "chemical-cleaning"
processes:
  - "passivation"
source: "ASTM F86-21, ASTM A967-17, AMS 2700E, ISO 13485:2016"
sourceUrl: ""
sourceAuthority: "HIGH"
claimSupport: "SUPPORTED"
claimScope: "STANDARD_REQUIREMENT"
dataPoints:
  - property: "Nitric acid concentration"
    value: "20-40"
    unit: "wt%"
    condition: "ASTM F86 conventional bath"
  - property: "Bath temperature"
    value: "20-40"
    unit: "°C"
    condition: "HNO3 conventional; higher reduces time"
  - property: "Immersion time"
    value: "15-30"
    unit: "min"
    condition: "Standard HNO3 process"
  - property: "Native oxide thickness (pre-passivation)"
    value: "2-7"
    unit: "nm"
    condition: "Air-formed TiO2"
  - property: "Post-passivation oxide thickness"
    value: "8-20"
    unit: "nm"
    condition: "After HNO3 passivation"
relatedMaterials:
  - "grade-2-titanium"
  - "grade-5-titanium"
  - "grade-23-titanium"
  - "grade-7-titanium"
relatedProcesses:
  - "anodizing"
  - "electropolishing"
  - "chemical-etching"
relatedStandards:
  - "astm-f86"
  - "astm-a967"
  - "ams-2700"
  - "iso-13485"
order: 3
---



## Quick Answer

**What is titanium passivation?** Titanium passivation is a chemical surface treatment that removes metallic and organic surface contamination and promotes the growth of the natural, self-healing titanium dioxide (TiO₂) passive layer. Unlike stainless steel passivation — whose primary job is to dissolve free iron embedded in the surface — titanium passivation cleans the surface and stabilizes the existing TiO₂ layer, thickening it from the air-formed 2–7 nm baseline to roughly 8–20 nm. The standard treatment is a 20–40 wt% nitric-acid bath at 20–40 °C for 15–30 minutes per ASTM F86 (medical) and ASTM A967 / AMS 2700 (industrial / aerospace). Passivation is the default final-rinse step before autoclaving, packaging, or further surface finishing such as [anodizing](/finishes/titanium-anodizing/) or [electropolishing](/finishes/electropolishing/).

## How Titanium Passivation Works

Titanium spontaneously forms a continuous, adherent oxide (TiO₂, anatase / rutile mixture) on contact with air or water. This native film is what gives titanium its corrosion resistance in oxidizing environments. The passivation process is **not** about creating an oxide where none exists — it is about ensuring the oxide that is there is clean, dense, and at its equilibrium thickness for the operating environment.

The mechanism is two-step:

1. **Surface cleaning.** Acid dissolves smears of tool-steel or carbide embedded during machining (free-iron contamination is the most common cause of surface discoloration and pitting under service). Organic residues from cutting fluids, finger oils, and shop dust are removed in a pre-passivation alkaline clean, typically a 5–10 wt% NaOH or commercial alkaline cleaner at 50–70 °C for 5–15 min, followed by DI rinse.
2. **Oxide stabilization and growth.** The nitric-acid bath slightly etches the amorphous outermost layer of TiO₂ and exposes fresh metal; once the part returns to air (or to the final rinse water) the oxide reforms to its equilibrium thickness, now on a chemically clean surface. The bath also oxidizes any residual metallic contaminants to soluble salts that rinse away.

The same end-state is achievable with citric acid (typically 4–10 wt% citric acid at 50–70 °C for 15–30 min), which is increasingly preferred because it eliminates nitric-acid fumes and the associated waste-treatment burden. Citric passivation is recognized under ASTM A967 and is widely used in semiconductor wet-bench and medical-device applications.

## Process Parameters

| Parameter | Nitric Acid (ASTM F86) | Citric Acid (ASTM A967) | Aerospace (AMS 2700) |
|-----------|------------------------|-------------------------|----------------------|
| Concentration | 20–40 wt% HNO₃ | 4–10 wt% citric acid | 20–45 wt% HNO₃ or approved alternative |
| Temperature | 20–40 °C | 50–70 °C | 20–50 °C |
| Time | 15–30 min | 15–30 min | 20–60 min |
| Pre-clean | Alkaline degrease | Alkaline degrease | Alkaline degrease + deoxidize |
| Final rinse | DI water, ≥ 1 MΩ·cm resistivity | DI water, ≥ 1 MΩ·cm resistivity | DI water, ≥ 1 MΩ·cm resistivity |
| Drying | Clean-room air or nitrogen | Clean-room air or nitrogen | Forced clean air, ≤ 60 °C |
| Test | Visual + water-break test | Visual + water-break test | Visual + CuSO₄ spot test |

**Aerospace note.** AMS 2700E requires a documented deoxidation step before passivation on parts that have been heat-treated, chemically milled, or welded. The deoxidizing solution is typically a nitric-hydrofluoric acid mixture (e.g., 30 wt% HNO₃ + 2 wt% HF) at 20–30 °C for 1–5 min, which strips the alpha-case and heat-tint oxide. The fluoride step is aggressive and requires HF-trained operators and PPE — it is **not** used for medical implants or food-contact parts.

## Material Compatibility

All standard titanium grades respond predictably to passivation:

- **CP titanium (Grade 1, Grade 2, Grade 4)** — uniform oxide growth; passivation gives a slightly darker, satin appearance on previously bright-machined surfaces. The protective effect is most visible on grades that have been heavily cold-worked.
- **Grade 5 (Ti-6Al-4V)** — alpha+beta microstructure; both phases passivate at similar rates; no preferential attack. The standard aerospace grade for fasteners, structural fittings, and engine components.
- **Grade 23 (Ti-6Al-4V ELI)** — extra-low interstitial variant; the cleanest surface chemistry for medical implants. ASTM F86 passivation is mandatory before packaging sterile implants per ISO 13485.
- **Grade 7 (Ti-0.15Pd)** — the palladium-bearing grade for reducing-acid service; passivation is not strictly required (the Pd additions provide the corrosion resistance), but cleaning is recommended before service.
- **Grade 9 (Ti-3Al-2.5V)** — tubing and hydraulic-line alloy; passivation after bending / welding is required to restore the oxide at heat-affected zones.

**Avoid.** Hydrofluoric acid (HF) and fluoride-containing pickles on parts destined for medical or food-contact service — fluoride ions can be retained in the oxide and cause delayed cytotoxicity issues. Use nitric-hydroxide or citric-only chemistries for these applications.




## Comparison with Related Surface Finishes

Passivation is almost always the last step in a finishing sequence — it cleans and stabilizes the surface but does not change colour, roughness, or geometry. It is complementary to, not a substitute for, the following:

- [Titanium Anodizing](/finishes/titanium-anodizing/) — anodizing thickens the oxide to 0.02–5 µm for colour and wear. Anodized parts are typically passivation-cleaned *before* anodizing, not after, because the anodizing bath is itself a clean acid environment.
- [Electropolishing](/finishes/electropolishing/) — electropolishing removes 5–25 µm of surface material and produces the smoothest pre-passivation substrate (~0.05 µm Ra). Passivation after electropolishing is optional but recommended for medical implants.
- [Bead Blasting](/finishes/bead-blasting/) — bead blasting roughens the surface to 0.8–2.5 µm Ra. Passivation after blasting restores the oxide on the freshly exposed metal; without passivation, the blasted surface can show rust staining from embedded media within hours.
- [PVD Coating](/finishes/pvd-coating/) — PVD is a vacuum deposition process that requires a clean, oxide-stable substrate. Passivation before PVD is required to remove residual contaminants that would outgas in the vacuum chamber.
- [Chemical Etching](/finishes/chemical-etching/) — chemical etching is itself an aggressive surface preparation; passivation after etching neutralizes residual acid and grows back a uniform oxide.

## Limitations and Failure Modes

Passivation is forgiving, but several failure modes show up in production:

- **Water-break test failure** — if rinse water does not sheet off the part uniformly, the surface still carries hydrophobic contamination; re-clean and re-passivate. The test is the cheapest in-process QC available and is mandatory under both ASTM F86 and AMS 2700.
- **Flash rust on tool-steel smears** — when free iron is mechanically embedded and is not fully dissolved by the acid bath, brown staining appears within 24 h. Use a longer bath (up to 60 min at 40 °C) or add a fluoride-free chelator (e.g., EDTA) to the bath.
- **Etch pitting on thin walls** — nitric acid at > 45 wt% or temperature > 50 °C can visibly attack thin sections (< 0.5 mm wall) and polished surfaces. Use the lowest concentration / temperature that passes the water-break test.
- **Incomplete drying** — residual rinse water leaves mineral spots and can re-contaminate the surface. Forced-air drying at ≤ 60 °C or nitrogen blow-off is required for medical and semiconductor applications.
- **Hydrogen uptake** — prolonged exposure to reducing-acid baths (especially HF-containing) embrittles titanium. Passivation per ASTM F86 (nitric) and ASTM A967 (citric) is non-embrittling; deviations from these chemistries should be qualified by hydrogen-analysis per ASTM E1447.
- **Not recommended for matte black finishes** — passivation slightly etches and brightens the surface; if the previous step produced a matte black oxide (e.g., from a controlled heat-treatment tint), the passivation step will partially remove it. Mask or accept the visual change.

## Engineering Interpretation

The engineering choice for titanium passivation is driven by **three coupled decisions**: the bath chemistry (nitric vs citric vs aerospace deoxidation), the bath temperature/time window (which controls oxide thickness without attacking tolerance), and the pre-clean rigor (which determines whether residual free-iron or organics survive into service). For most indoor and mildly corrosive service on CP titanium or Ti-6Al-4V, the engineering default is a 20–40 wt% nitric-acid bath at 20–40 °C for 15–30 minutes per ASTM F86 — it is forgiving of bath age, requires no exotic chemistry, and is compatible with downstream [titanium anodizing](/finishes/titanium-anodizing/) if colour identification is needed.

For medical implants in Grade 23 (Ti-6Al-4V ELI), the same nitric passivation is mandatory before sterile packaging per ISO 13485, but it must be paired with a final hot-DI rinse (≥ 60 °C, ≥ 5 min, resistivity ≥ 1 MΩ·cm) and the bath validated quarterly with a CuSO₄ spot test. For semiconductor wet-bench parts where nitric fumes are unacceptable in cleanrooms, switch to 4–10 wt% citric-acid passivation at 50–70 °C for 15–30 minutes per ASTM A967 — this is qualified by most major equipment OEMs and eliminates the nitric waste-treatment burden.

For aerospace and defence parts on AMS 2700E (heat-treated, welded, or chemically milled), an HF-containing deoxidation step (typically 30 wt% HNO₃ + 2 wt% HF at 20–30 °C for 1–5 min) is required before passivation to strip the alpha-case. This step is aggressive and demands HF-trained operators, full PPE, and a documented hydrogen-analysis qualification per ASTM E1447; it is **never** used on medical or food-contact parts because retained fluoride ions in the oxide can cause delayed cytotoxicity.

The most common field failures are not the passivation chemistry itself — they are rinse-water spotting, incomplete drying, and residual contamination from a marginal pre-clean. The cheapest in-process QC (the water-break test) catches all three.



## Evidence Basis

- **ASTM F86-21** — Standard Practice for Surface Preparation and Marking of Metallic Surgical Implants. ASTM International, 2021. Covers nitric-acid passivation, alkaline pre-clean, water-break test, and inspection requirements for titanium and Ti-6Al-4V ELI implants.
- **ASTM A967-17** — Standard Specification for Chemical Passivation Treatments for Stainless Steel Parts. ASTM International, 2017. Extended to titanium via the citric-acid passivation section; widely cited for non-medical industrial applications.
- **AMS 2700E** — Aerospace Material Specification: Passivation of Corrosion-Resistant Steels and Titanium Alloys. SAE International, 2018. Mandatory for aerospace and defense components; includes the CuSO₄ spot test and deoxidation procedure.
- **ISO 13485:2016** — Medical devices — Quality management systems — Requirements for regulatory purposes. ISO, 2016. The QMS framework that requires documented passivation validation for sterile implant manufacture.
- **ASTM E1447-22** — Standard Test Method for Determination of Hydrogen in Titanium and Titanium Alloys by the Inert Gas Fusion Thermal Conductivity Method. ASTM International, 2022. Used to qualify that a passivation process is non-embrittling.

Voltage-to-process parameters in this guide reflect typical production values; specific lines must be qualified against their own reference coupons per the cited standards.

## Related Standards

- [ASTM F86 — Surface Preparation for Surgical Implants](/standards/astm-f86/) — the canonical passivation standard for medical titanium implants.
- [ASTM A967 — Chemical Passivation Treatments](/standards/astm-a967/) — the canonical passivation standard for industrial and aerospace stainless and titanium parts.
- [AMS 2700 — Passivation of Corrosion-Resistant Alloys](/standards/ams-2700/) — the aerospace passivation specification; mandatory for many defense and aerospace components.
- [ISO 13485 — Medical Device QMS](/standards/iso-13485/) — the QMS framework under which implant passivation is validated.

## Related Materials

- [Grade 2 (CP Titanium)](/grades/grade-2-titanium/) — the workhorse CP grade; the easiest grade to passivate and the most forgiving of bath variation.
- [Grade 5 (Ti-6Al-4V)](/grades/grade-5-titanium/) — the structural aerospace alloy; requires ASTM F86 / AMS 2700 passivation for most service environments.
- [Grade 23 (Ti-6Al-4V ELI)](/grades/grade-23-titanium/) — the implant-grade alloy; F86 passivation is mandatory before sterile packaging.
- [Grade 7 (Ti-0.15Pd)](/grades/grade-7-titanium/) — the reducing-acid grade; passivation is supplementary to the Pd-alloy corrosion resistance.

(titanium.blog) For the majority of titanium components that will see indoor, mildly corrosive service, nitric-acid passivation per ASTM F86 at 25 °C / 30 min is the engineering default. It is forgiving of bath age, requires no exotic chemistry, and is compatible with subsequent [anodizing](/finishes/titanium-anodizing/) if cosmetic identification is needed. For medical implants (Grade 23 ELI), pair F86 passivation with a final hot-DI rinse (≥ 60 °C, ≥ 5 min) and validate the bath quarterly with a CuSO₄ spot test to confirm the surface is fully passivated. For semiconductor wet-bench parts, switch to citric-acid passivation — it eliminates nitric fumes in cleanrooms, is recognized under ASTM A967, and is qualified by most major equipment OEMs. Always finish the process with a resistivity-checked DI rinse (≥ 1 MΩ·cm) and forced-dry; the most common field failures are rinse-water spotting and residual contamination, not the passivation chemistry itself.
