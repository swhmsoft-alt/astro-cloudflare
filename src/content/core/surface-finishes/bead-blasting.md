---
title: "Bead Blasting for Titanium Components — Complete Guide"
description: "Engineering guide to bead blasting of titanium alloys. Glass-bead and ceramic-bead media, pressure and mesh parameters, achievable Ra range, residual-stress profile, and applications for aerospace, medical, and semiconductor industries."
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
  - "aerospace"
  - "medical"
  - "semiconductor"
  - "industrial"
  - "defense"
raRange: "0.4-3.2 µm Ra"
finishType: "mechanical"
processes:
  - "bead-blasting"
  - "surface-finishing"
source: "AMS 2430C, AMS 2431B, ASTM F86-21, ASTM B600-21, AMS 2700E, ISO 13485:2016"
sourceUrl: ""
sourceAuthority: "HIGH"
claimSupport: "SUPPORTED"
claimScope: "STANDARD_REQUIREMENT"
dataPoints:
  - property: "Glass-bead media mesh"
    value: "60-100"
    unit: "mesh"
    notes: "AMS 2430 soda-lime glass bead; fine matte finish"
  - property: "Ceramic-bead media mesh"
    value: "80-120"
    unit: "mesh"
    notes: "AMS 2431 zirconia or alumina bead; satin finish"
  - property: "Blasting pressure (glass bead)"
    value: "2-4"
    unit: "bar"
    notes: "Pressure cabinet; below 2 bar gives uneven peening"
  - property: "Blasting pressure (ceramic bead)"
    value: "3-5"
    unit: "bar"
    notes: "Pressure cabinet; higher pressure for satin texture"
  - property: "Nozzle standoff"
    value: "100-200"
    unit: "mm"
    notes: "Manual cabinet; controls coverage and embed risk"
  - property: "Achievable Ra (glass bead)"
    value: "0.8-1.6"
    unit: "µm Ra"
    notes: "60-100 mesh at 2-4 bar on Grade 2 substrate"
  - property: "Achievable Ra (ceramic bead)"
    value: "1.2-3.2"
    unit: "µm Ra"
    notes: "80-120 mesh at 3-5 bar on Grade 5 substrate"
  - property: "Surface compressive stress"
    value: "-300 to -500"
    unit: "MPa"
    notes: "Glass-bead peening, Almen A intensity 6-10A"
  - property: "Coverage time to full peening"
    value: "30-90"
    unit: "s"
    notes: "Typical aerospace coupon; 200% Almen coverage"
  - property: "Glass-bead recycle life"
    value: "8-15"
    unit: "cycles"
    notes: "Before media replacement to avoid Fe contamination"
relatedMaterials:
  - "grade-1-titanium"
  - "grade-2-titanium"
  - "grade-5-titanium"
  - "grade-9-titanium"
  - "grade-23-titanium"
relatedProcesses:
  - "passivation"
  - "electropolishing"
  - "polishing"
  - "titanium-anodizing"
  - "pvd-coating"
  - "chemical-etching"
relatedStandards:
  - "astm-f86"
  - "ams-2700"
  - "iso-13485"
order: 2
---

## Quick Answer

**What is bead blasting for titanium?** Bead blasting (also called bead peening or glass-bead blasting) propels fine spherical media — most commonly glass beads per AMS 2430 or ceramic beads per AMS 2431 — at a titanium surface under controlled pressure in a suction or pressure cabinet. The impinging beads remove light surface contamination, create a uniform matte texture of 0.4–3.2 µm Ra depending on media and pressure, and induce a shallow layer of compressive residual stress (typically −300 to −500 MPa at Almen A 6–10A intensity) that improves fatigue performance on aerospace components. Bead blasting is the default mechanical surface-prep step before [anodizing](/finishes/titanium-anodizing/), [passivation](/finishes/passivation/), adhesive bonding, or cosmetic finishing of titanium medical implants, semiconductor chamber parts, and aerospace structural components.

## How Bead Blasting Works

Bead blasting is a **mechanical** surface treatment — not a chemical one. The driving mechanism is the kinetic energy of spherical media striking the titanium surface at controlled velocity, followed by the bead ricocheting off (or, in some cases, fracturing on impact). The energy density at the impact zone is set by three variables: media mass (governed by mesh size and bead density), nozzle velocity (set by air pressure and media-to-air ratio), and exposure time. The key physical effects on the titanium substrate are four-fold: mechanical surface cleaning, plastic micro-peening, compressive residual-stress introduction, and surface-area increase.

The first effect, mechanical surface cleaning, knocks off light oils, oxide films from heat treatment, fingerprints, and shop dust without chemical attack. Bead blasting is therefore the preferred pre-clean before [passivation](/finishes/passivation/) of medical implants where chemical residue must be minimized. The second effect, plastic micro-peening, plastically deforms a small volume of surface metal at each impact; successive overlapping impacts create a uniform matte texture with controlled roughness in the 0.4–3.2 µm Ra range. The third effect, compressive residual stress, places the near-surface layer (typically 50–200 µm deep depending on intensity) in compression, which delays fatigue-crack initiation — the same mechanism exploited by shot peening of landing-gear steels, but applied more gently to titanium because lower media hardness avoids micro-cracking the alpha-case.

The fourth effect, surface-area increase, raises the effective surface area of the part, which improves adhesive bonding and paint adhesion for subsequent coatings such as [PVD](/finishes/pvd-coating/). Unlike [electropolishing](/finishes/electropolishing/), bead blasting does not remove the alpha-case or the work-hardened layer from prior machining; it compresses it. Unlike chemical etching, it adds no hydrogen and requires no rinse chemistry. Unlike [polishing](/finishes/polishing/), it does not produce a directional scratch pattern, which is why bead-blasted surfaces are the preferred pre-anodize texture for matte and non-reflective aerospace housings.

## Process Parameters

| Parameter | Glass Bead (AMS 2430) | Ceramic Bead (AMS 2431) |
|-----------|-----------------------|-------------------------|
| Media mesh | 60–100 | 80–120 |
| Media hardness | 5–6 Mohs (soda-lime glass) | 7–9 Mohs (zirconia / alumina) |
| Blasting pressure | 2–4 bar | 3–5 bar |
| Nozzle standoff | 100–200 mm | 100–200 mm |
| Nozzle angle | 60–90° | 60–90° |
| Achievable Ra | 0.8–1.6 µm | 1.2–3.2 µm |
| Compressive stress | −300 to −500 MPa | −200 to −400 MPa |
| Media embed risk | Low | Moderate (alumina) |
| Recyclable life | 8–15 cycles | 30–60 cycles |
| Cost per kg | Low ($3–8) | High ($40–80) |
| Typical use | Medical, aerospace pre-passivation | Cosmetic satin, pre-coating prep |

Ceramic beads last longer per cycle but cost 5–10× more per kilogram than glass. Glass beads are the default for medical implants because they leave no ceramic residue and do not contaminate downstream acid baths. Pressure above 5 bar on thin-wall titanium components (Grade 9 tubing, sheet-metal covers) can warp the part; pressure below 2 bar produces uneven peening coverage and should be avoided.

## Types of Bead Blasting

- **Glass-bead blasting (AMS 2430)** — the default medical and aerospace prep. Soda-lime glass spheres, 60–100 mesh. Produces a low-Ra matte (0.8–1.6 µm) with no media embed on titanium. Used as the pre-treatment step before [ASTM F86](/standards/astm-f86/) passivation.
- **Ceramic-bead blasting (AMS 2431)** — zirconia or alumina spheres, 80–120 mesh. Produces a slightly more aggressive satin (1.2–3.2 µm) and longer media life. Used for cosmetic finishing of consumer titanium goods and for aerospace housings where a slightly more pronounced texture is desired.
- **Plastic-media blasting** — urea or acrylic media, 12–16 mesh. Used when the part must not be cold-worked (e.g., thin-wall medical tubing where compressive stress would distort dimensional tolerances).
- **Walnut-shell / corn-cob blasting** — soft organic media for delicate deburring of titanium threaded fittings. Removes burrs without altering surface roughness; common in aerospace fastener finishing.
- **Wet bead blasting (slurry blast)** — glass beads suspended in water slurry, used when dust suppression is mandatory (cleanroom semiconductor parts and titanium medical devices assembled under ISO 14644-1 Class 7 or cleaner).

## Compatible Materials

Bead blasting is compatible with all commercially pure and alloyed titanium grades; the relevant engineering choice is **media selection**, not grade selection. The matrix below maps the recommended blasting parameters by titanium grade.

- [Grade 1 commercially pure titanium](/grades/grade-1-titanium/) — softest CP grade; blast at 2–3 bar to avoid surface rippling on thin sections.
- [Grade 2 commercially pure titanium](/grades/grade-2-titanium/) — the most common CP substrate for chemical, medical, and industrial service; standard 2–4 bar glass-bead parameters apply, finish holds 0.8–1.6 µm Ra consistently.
- [Grade 5 (Ti-6Al-4V)](/grades/grade-5-titanium/) — aerospace alloy; accepts glass or ceramic media; ceramic produces a marginally more pronounced satin. The standard pre-coat prep for [PVD TiN](/finishes/pvd-coating/).
- [Grade 23 (Ti-6Al-4V ELI)](/grades/grade-23-titanium/) — medical implant grade; the standard medical pre-treatment per [ASTM F86](/standards/astm-f86/) — fine glass beads at 2–4 bar followed by nitric-acid [passivation](/finishes/passivation/).
- [Grade 9 (Ti-3Al-2.5V)](/grades/grade-9-titanium/) — tubing alloy; bead blast is acceptable but cosmetic-critical applications prefer [polishing](/finishes/polishing/) to preserve tube-section tolerance.

Bead blasting is **not recommended** on titanium-aluminide intermetallics (γ-TiAl) because the impact energy can initiate micro-cracks in the brittle gamma-phase microstructure. It is also not used on nitrided titanium surfaces (TiN diffusion layers) because the compound layer spalls under bead impact and produces unacceptable surface debris.

## Typical Applications

- **Medical implants** — uniform matte finish on hip stems, knee femoral components, dental abutments, and trauma plates. The blasted surface texture promotes osseointegration on cementless implants and is the pre-treatment baseline before [ASTM F86](/standards/astm-f86/) nitric-acid passivation.
- **Aerospace structural** — pre-anodize texture for Grade 5 bulkhead fittings, hydraulic manifolds, and non-reflective housings. Bead blasting is the cheapest way to meet MIL-A-8625 Type II Class 1 matte requirements on titanium airframe components.
- **Semiconductor** — chamber walls, gas-line fittings, and showerheads where a controlled matte reduces light scatter in optical inspection and minimizes particle adhesion. Wet bead blasting is preferred in cleanroom applications.
- **Industrial / chemical processing** — pre-coating prep for titanium vessels, piping, and heat-exchanger components; the matte texture improves primer adhesion for [PVD](/finishes/pvd-coating/) and paint systems.
- **Defence** — non-reflective finish on optical mounts, weapon housings, and signature-management components where stray-light control is mandatory.
- **Consumer goods** — uniform satin on watch cases, bicycle frames, jewellery, golf-club heads, and architectural hardware where a premium tactile feel is required.

## Related Surface Finishes

Bead blasting sits in the middle of the titanium surface-prep sequence. It is usually preceded by [polishing](/finishes/polishing/) or chemical etching and is followed by [passivation](/finishes/passivation/), [anodizing](/finishes/titanium-anodizing/), or [PVD coating](/finishes/pvd-coating/) depending on the end use. The matrix below summarises where bead blasting fits relative to its sibling finishes.

- [Polishing](/finishes/polishing/) — produces a lower Ra (0.1–0.4 µm) but adds a directional scratch pattern; bead blasting is preferred where an isotropic, non-directional matte is required.
- [Electropolishing](/finishes/electropolishing/) — chemical removal of surface metal; reduces Ra and removes alpha-case, but does not introduce compressive stress. Used when fatigue improvement is not the goal and metallurgical cleanliness is.
- [Passivation](/finishes/passivation/) — the standard post-blast chemical treatment for medical and aerospace components; bead blasting produces the matte texture that the nitric-acid passivation bath preserves.
- [Titanium anodizing](/finishes/titanium-anodizing/) — the matte produced by bead blasting is the standard pre-anodize texture; without it, anodized colour uniformity is inconsistent.
- [PVD coating](/finishes/pvd-coating/) — bead blasting improves TiN and DLC adhesion on titanium by increasing the effective surface area for mechanical interlock.
- [Chemical etching](/finishes/chemical-etching/) — alternative prep for medical implants where beading is acceptable but a slightly rougher texture is desired; etches cannot introduce compressive stress.

## Limitations and Failure Modes

Bead blasting is not a universal answer for titanium. The principal failure modes to anticipate during process design are:

- **Media embedment** — fractured ceramic beads can become lodged in the surface layer; on medical implants, embedded alumina particles complicate downstream acid etching and can be flagged in [ASTM F86](/standards/astm-f86/) inspection. Glass beads rarely embed on titanium because the Mohs hardness of soda-lime glass (5–6) is below the surface hardness of CP titanium (~150 HV) and Ti-6Al-4V (~340 HV).
- **Dimensional drift** — high-pressure blasting (>5 bar) on thin-wall components reduces wall thickness by 5–20 µm per side and shifts tolerances outside drawing limits. For close-tolerance thin-wall parts, switch to [electropolishing](/finishes/electropolishing/) or controlled-depth chemical etching.
- **Surface contamination from spent media** — glass beads that have been recycled 8–15 cycles accumulate Fe from prior steel work in the cabinet. For medical or semiconductor work, dedicate a glass-bead cabinet and replace media before the Fe contamination crosses the threshold defined by [AMS 2700](/standards/ams-2700/).
- **Alpha-case spallation** — on heat-treated Grade 5 components with alpha-case >5 µm, bead impact can locally fracture the brittle oxide layer. Pre-blast chemical milling (HF/HNO3 pickle) is required to remove the alpha-case before bead blasting.
- **Unwanted compressive stress on fatigue-critical thin sections** — bead blasting introduces compressive stress that improves fatigue on most aerospace parts but can warp thin diaphragms and bellows. For such parts, switch to plastic-media blasting or skip mechanical surface-prep entirely.
- **Non-uniform coverage on complex geometries** — internal passages and deep recesses receive little bead coverage in pressure-blast cabinets; tumble-blast or rotary-table fixtures are required.

## Engineering Interpretation (titanium.blog)

For procurement and process-engineering teams, the most consequential design choice for bead blasting is **glass versus ceramic media**. Glass is the right default for medical and aerospace pre-passivation work because it leaves no ceramic residue, holds 0.8–1.6 µm Ra consistently, and is forgiving of substrate roughness variation. Ceramic is the right choice for cosmetic satin finishes on consumer goods and for pre-coat prep where a slightly higher Ra (1.2–3.2 µm) improves coating adhesion; ceramic also lasts longer per cycle, which lowers the per-part media cost on long production runs.

**Pressures above 5 bar should be reserved for thick-section forgings.** On thin-wall sheet, tube, and plate (below 2 mm wall), high-pressure blast can warp the part and shift dimensions outside drawing tolerances. Drop to 2–3 bar glass-bead and accept a slightly higher Ra (1.0–1.8 µm) on thin-wall components.

**The pre-blast condition of the substrate matters more than the blasting parameters themselves.** Heat-treated components with an alpha-case layer >5 µm must be chemically pickled (HF/HNO3) before bead blasting to prevent alpha-case spallation. Cold-rolled CP components with work-hardened surfaces >20 % cold reduction should be stress-relieved before blasting to prevent distortion. A bead-blast finish is essentially a fingerprint of the substrate condition; fixing the substrate is a higher-leverage move than tuning blasting parameters.

**When bead blasting is not enough**, switch to [electropolishing](/finishes/electropolishing/) for chemical cleanliness and Ra reduction without compressive stress, or [passivation](/finishes/passivation/) alone if the only goal is contamination removal without surface texture change. For cosmetic finishes on premium consumer titanium goods where tactile feel matters, [polishing](/finishes/polishing/) followed by light glass-bead satin is the standard luxury-watch finishing route.

## Evidence Basis

The process parameters and Ra values in this guide are derived from the standards and reference works listed below. Each parameter is anchored to a primary standard or peer-reviewed source; the Engineering Interpretation section above is the only place where site judgement is mixed with the cited facts.

Based on:

- **AMS 2430C** — *Peening of Metals, Glass Bead*. SAE Aerospace Material Specification. Defines glass-bead media grades (60–100 mesh), Almen A intensity ranges for peening (6–10A), and coverage requirements (200% Almen coverage for fatigue-critical parts).
- **AMS 2431B** — *Peening of Metals, Ceramic Bead*. SAE Aerospace Material Specification. Defines zirconia and alumina ceramic-bead media (80–120 mesh) and the corresponding pressure and standoff for satin finishes.
- **ASTM F86-21** — *Standard Practice for Surface Preparation and Marking of Metallic Surgical Implants*. Defines bead-blast + nitric-acid passivation sequence for titanium implants (Grade 2 and Grade 23).
- **ASTM B600-21** — *Standard Guide for Descaling and Cleaning Titanium and Titanium Alloy Surfaces*. Defines pre-blast chemical cleaning and alpha-case removal sequence for heat-treated titanium.
- **AMS 2700E** — *Passivation of Corrosion-Resistant Steels and Titanium Alloys*. Defines the nitric-acid passivation step that follows bead blasting on corrosion-resistant titanium components.
- **ISO 13485:2016** — *Medical devices — Quality management systems — Requirements for regulatory purposes*. Defines the process-control framework for bead blasting of medical implants, including media-life traceability and Fe-contamination limits.
- **MIL-A-8625** — *Anodic Coatings for Aluminum and Titanium*. Defines the matte-anodize requirements (Type II Class 1) that bead blasting is used to support on titanium aerospace housings.

> Site-judgement claims (the Engineering Interpretation section above) are distinguished from the standard-derived facts above by the (titanium.blog) marker. The standard-derived Ra ranges, media mesh sizes, pressures, and compressive-stress values are anchored to the cited specifications; the engineering judgement (when to use glass versus ceramic, when to switch to electropolishing, etc.) is titanium.blog interpretation.

> All parameter ranges quoted in this guide (Ra, mesh, pressure, MPa, seconds) are typical values from the cited standards and reference works for the material and process combinations listed. They are not guaranteed values for any specific part; the user is responsible for qualifying the process on their own components per the controlling specification.

## Related Standards

- [ASTM F86 — Standard Practice for Surface Preparation and Marking of Metallic Surgical Implants](/standards/astm-f86/) — the controlling standard for bead-blast + nitric-acid passivation sequence on titanium medical implants.
- [AMS 2700 — Passivation of Corrosion-Resistant Steels and Titanium Alloys](/standards/ams-2700/) — defines the Fe-contamination limits for media-recycle life in titanium bead-blast cabinets.
- [ISO 13485 — Medical Devices Quality Management Systems](/standards/iso-13485/) — process-control framework for bead blasting under medical-device quality systems.
- [AS9100D — Aerospace Quality Management System](/standards/as9100d/) — aerospace QMS framework controlling bead-blast process qualification for AS9100-certified titanium parts.
- [ASTM F136 — Wrought Ti-6Al-4V ELI for Medical Implants](/standards/astm-f136/) — material specification for Grade 23 implant substrates that bead blasting supports as the standard pre-passivation prep.
- [ISO 9001 — Quality Management Systems](/standards/iso-9001/) — general QMS framework under which bead-blast process control, calibration, and traceability are typically documented for non-medical/non-aerospace industrial components.

For the cross-cluster procurement context, see the [procurement](/procurement/) module (process selection and vendor qualification) and the [surface finishes hub](/finishes/) (full catalog of finish types).
