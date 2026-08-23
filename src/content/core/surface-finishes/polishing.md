---
title: "Mechanical Polishing of Titanium Components — Complete Guide"
description: "Engineering guide to mechanical polishing of titanium alloys. Grit sequences from 120 to 3000+, abrasive selection (SiC vs Al₂O₃ vs diamond), wheel speed and contact pressure, achievable Ra down to 0.05 µm, and applications for medical implants, aerospace components, consumer goods, and luxury watch cases."
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
  - "aerospace"
  - "consumer"
  - "automotive"
  - "defense"
raRange: "0.05–0.8 µm Ra"
finishType: "mechanical"
processes:
  - "polishing"
  - "surface-finishing"
source: "ASME B46.1-2019, ISO 1302:2002, ASTM F86-21, AMS 2700E, ISO 13485:2016, AS9100D"
sourceUrl: ""
sourceAuthority: "HIGH"
claimSupport: "SUPPORTED"
claimScope: "TYPICAL_VALUE"
dataPoints:
  - property: "Starting grit (pre-polish Ra baseline)"
    value: "0.8–1.6"
    unit: "µm Ra"
    notes: "Post-machining or post-bead-blast starting surface"
  - property: "Final Ra (mirror polish)"
    value: "0.05–0.1"
    unit: "µm Ra"
    notes: "3000+ grit diamond or Al₂O₃ on buff wheel"
  - property: "Final Ra (satin polish)"
    value: "0.2–0.4"
    unit: "µm Ra"
    notes: "600–800 grit final step"
  - property: "Wheel speed (polishing)"
    value: "1500–2500"
    unit: "rpm"
    notes: "Cotton or sisal buff, 200–250 mm diameter"
  - property: "Contact pressure"
    value: "20–50"
    unit: "N/cm²"
    notes: "Hand or robotic polishing; above 50 N risks smearing"
  - property: "Abrasive — silicon carbide (SiC) paper"
    value: "120–2000"
    unit: "grit"
    notes: "Stages 1–5 wet sanding; aggressive material removal"
  - property: "Abrasive — alumina (Al₂O₃) paste"
    value: "1–5"
    unit: "µm particle"
    notes: "Final-stage buffing; mirror finish on CP titanium"
  - property: "Abrasive — diamond paste"
    value: "1–9"
    unit: "µm particle"
    notes: "Hardest abrasive; for medical/orthopedic mirror finishes"
  - property: "Inter-stage cleaning"
    value: "DI water + ultrasonic"
    unit: "5–10 min"
    notes: "Between grit stages to remove embedded abrasive"
  - property: "Surface temperature limit"
    value: "<150"
    unit: "°C"
    notes: "Above 150 °C risks alpha-case formation on Grade 5/23"
relatedMaterials:
  - "grade-1-titanium"
  - "grade-2-titanium"
  - "grade-5-titanium"
  - "grade-9-titanium"
  - "grade-23-titanium"
relatedProcesses:
  - "bead-blasting"
  - "electropolishing"
  - "passivation"
  - "titanium-anodizing"
  - "pvd-coating"
  - "chemical-etching"
relatedStandards:
  - "astm-f86"
  - "ams-2700"
  - "iso-13485"
  - "as9100d"
  - "iso-9001"
  - "astm-f136"
order: 5
---

## Quick Answer

**What is mechanical polishing for titanium?** Mechanical polishing is a multi-stage abrasive surface-finishing process that progressively reduces the surface roughness of titanium from a post-machining or post-bead-blast baseline of 0.8–1.6 µm Ra down to 0.05–0.1 µm Ra (mirror) by stepping through a controlled sequence of abrasive grits — typically 120 → 240 → 400 → 600 → 800 → 1200 → 2000 → 3000+ — using silicon-carbide papers for the rough and intermediate stages and diamond or alumina paste on cotton buff wheels for the finishing stages. Polishing is the default cosmetic-finish route for titanium watch cases, consumer electronics frames, automotive trim, and medical implant surfaces, and is the standard pre-treatment for [titanium anodizing](/finishes/titanium-anodizing/) when uniform, repeatable colours are required.

## How Mechanical Polishing Works

Mechanical polishing is a **material-removal** process — every grit step removes a thin layer of surface metal, smoothing the peaks left by the previous, coarser step. The driving mechanism is the controlled abrasion of titanium by a harder abrasive particle dragged or pressed across the surface under defined contact pressure and lubrication. Three physical effects combine: (1) micro-cutting by abrasive grains, (2) plastic smearing of the soft alpha-phase at the surface, and (3) burnishing of the work-hardened outer layer into a smoother, more reflective finish.

The first effect, micro-cutting, dominates in the rough and intermediate stages (grit ≤ 600). Hard abrasive grains (silicon carbide at 9.5–9.75 Mohs, alumina at 9 Mohs, diamond at 10 Mohs) shear off microscopic chips of titanium and embed some fraction of the abrasive into the surface. The depth of cut per pass is governed by grit size, contact pressure, and whether the process is wet (with coolant) or dry. Wet sanding is mandatory from 400-grit upward on titanium because dry abrasion at fine grit generates enough frictional heat to form an oxide tint and work-harden the alpha phase.

The second effect, plastic smearing, becomes visible from 800-grit upward. At this stage the abrasive grain is finer than the grain size of the titanium microstructure (typically 10–30 µm for CP titanium and 5–15 µm for Grade 5 in the annealed condition), and the abrasive no longer cuts discrete chips — instead it plastically flows the outermost layer of metal sideways into the troughs of the scratch pattern. The surface reflectivity rises sharply between 800 and 1200 grit because the scratch depth drops below the wavelength of visible light (~0.4–0.7 µm).

The third effect, burnishing, dominates at the final 2000–3000+ grit or diamond-paste stages. A loose abrasive on a soft cotton buff wheel rolls and tumbles against the surface rather than sliding, plastically compressing the surface layer and producing a near-mirror finish with Ra values in the 0.05–0.1 µm range. Burnishing does not remove measurable material — it redistributes it — and is therefore the slowest stage to develop scratches if the previous grit step is not fully removed. The inter-stage ultrasonic cleaning step (typically 5–10 min in DI water with a mild alkaline detergent) is what makes the difference between a true mirror and a "polished but hazy" surface.

## Grit Sequence and Achievable Ra

The table below summarises a typical multi-stage polishing sequence for titanium, from post-machining to mirror finish. The achievable Ra values are typical values from finishing-shop practice on Grade 2 CP titanium; harder alloys (Grade 5, Grade 23) shift the values roughly 10–15 % higher at each stage because the harder alpha+beta microstructure resists micro-cutting.

| Stage | Abrasive | Grit / Particle | Lubricant | Typical Ra Achieved |
|-------|----------|-----------------|-----------|---------------------|
| Pre-polish baseline | — | as-machined or bead-blast | — | 0.8–1.6 µm |
| 1 — Rough | SiC paper | 120–240 grit | Water (wet) | 0.4–0.6 µm |
| 2 — Intermediate | SiC paper | 400–600 grit | Water (wet) | 0.2–0.3 µm |
| 3 — Fine | SiC paper | 800–1200 grit | Water (wet) | 0.10–0.15 µm |
| 4 — Pre-finish | Al₂O₃ or SiC | 2000 grit | Water (wet) | 0.06–0.10 µm |
| 5 — Mirror (CP) | Al₂O₃ paste on cotton buff | 1–5 µm | Dry or wax lubricant | 0.05–0.08 µm |
| 5 — Mirror (implant) | Diamond paste on cotton buff | 1–3 µm | Dry or wax lubricant | 0.03–0.05 µm |

For satin finishes (cosmetic non-mirror), stop at Stage 3 (800–1200 grit); the resulting 0.10–0.15 µm Ra is the standard luxury-watch and consumer-electronics satin. For matte finishes, stop at Stage 2 (600 grit) and follow with light [bead blasting](/finishes/bead-blasting/) to remove the directional scratch pattern; this is the standard pre-anodize matte texture for aerospace housings.
For matte finishes, stop at Stage 2 (600 grit) and follow with light [bead blasting](/finishes/bead-blasting/) to remove the directional scratch pattern; this is the standard pre-anodize matte texture for aerospace housings.

## Polishing Methods

The choice of polishing method is governed by part geometry, production volume, and surface-finish specification. Four methods cover the vast majority of titanium polishing in production:

**Hand polishing** is the most flexible method and is used for prototype work, complex geometries, and small-batch production. Operators use SiC papers backed by rubber or felt blocks, progressing through the grit sequence under flood coolant. Hand polishing is slow (typically 15–45 min per cosmetic surface) but is the only way to reach internal cavities and undercuts that wheels cannot access. Skill-dependent; mirror finishes require experienced polishers.

**Bench / wheel polishing** is the standard production method for rotational-symmetric parts (watch cases, tubes, cylindrical fittings) and small flat parts (jewellery, instrument covers). The work is mounted on a rotating mandrel or held against a rotating buff wheel by hand; abrasive paste is applied to the wheel face. Wheel speeds of 1500–2500 rpm on 200–250 mm diameter cotton or sisal buffs are typical. Contact pressure of 20–50 N/cm² produces a clean cut without smearing; above 50 N the surface temperature rises quickly and risks alpha-case formation.

**Robotic polishing** is the production method for high-volume cosmetic parts (consumer electronics frames, automotive interior trim) where consistency and reproducibility are paramount. Industrial robots (typically 6-axis) hold the polishing tool and follow a programmed path; force-control feedback maintains constant contact pressure on contoured surfaces. Robotic polishing reduces cycle time 50–70 % compared with hand polishing for repeatable parts, but the capital cost (>$200k) is justified only at volumes above ~5,000 parts per year.

**Buff / satin finishing** is the cosmetic-texturing method used after the mechanical polishing sequence. A soft cotton or sisal buff loaded with fine abrasive paste (typically 1–5 µm Al₂O₃ or SiC) is run across the polished surface at low pressure, producing either a directional satin (parallel scratches) or a non-directional sunburst pattern depending on buff motion. This is the final step on titanium watch cases and premium consumer electronics where tactile feel matters more than absolute Ra.

## Abrasive Selection

The three abrasive families used in titanium polishing differ in hardness, cost, and surface finish they leave:

- **Silicon carbide (SiC, Mohs 9.5–9.75)** — the workhorse abrasive for stages 1–4 (rough through pre-finish). Harder than alumina, sharper grain geometry, available in wet-or-dry paper form across the full grit range. Used with water lubrication from 400-grit upward.
- **Alumina (Al₂O₃, Mohs 9)** — the standard buffing compound for stages 5–6 (mirror finish). Available as paste (1–5 µm) or as bonded wheels. Slightly softer than SiC, leaves a marginally smoother surface on CP titanium. Less expensive than diamond.
- **Diamond (Mohs 10)** — used for the final 1–3 µm stage on medical implants and orthopedic components where a sub-0.05 µm Ra is required. Applied as paste on a soft cotton buff or as a bonded felt wheel. Highest cost but produces the cleanest, most repeatable mirror surface.

A common defect to avoid is **mixed abrasive stages** — moving from SiC paper to diamond paste without an intermediate alumina stage leaves SiC particles embedded in the surface, which pull out during diamond buffing and scratch the mirror. The standard sequence is SiC → Al₂O₃ → diamond, never SiC → diamond directly.
A common defect to avoid is **mixed abrasive stages** — moving from SiC paper to diamond paste without an intermediate alumina stage leaves SiC particles embedded in the surface, which pull out during diamond buffing and scratch the mirror. The standard sequence is SiC → Al₂O₃ → diamond, never SiC → diamond directly.

## Wheel Parameters and Heat Management

Heat management is the single most important variable in titanium polishing because titanium's low thermal conductivity (7–22 W/m·K depending on grade, roughly 1/10 that of aluminium) traps frictional heat at the surface. Above ~150 °C the alpha phase of Ti-6Al-4V oxidises preferentially to a hard, brittle alpha-case layer 1–5 µm thick; this layer is invisible to the eye but degrades fatigue life by 10–20 % and disrupts subsequent [anodizing](/finishes/titanium-anodizing/) colour uniformity. The three levers for staying below the temperature limit are:

1. **Lower contact pressure** — 20–30 N/cm² for fine-grit stages vs 40–50 N/cm² for rough stages.
2. **Higher wheel speed with less engagement** — 2000–2500 rpm at light contact (the wheel "polishes" rather than "cuts").
3. **Inter-pass cooling** — DI-water spray between passes, or a 10–15 s air-cool between stages on dry buffs.

Coolant selection matters: oil-based coolants leave a residue that must be cleaned before subsequent [passivation](/finishes/passivation/) or anodizing. Water-based coolants are preferred for parts going downstream to chemical finishing; a final DI-water rinse followed by forced-air drying is mandatory.

## Compatible Materials

All standard titanium grades respond predictably to mechanical polishing; the relevant engineering choice is **abrasive sequence and pressure**, not grade selection. The matrix below maps recommended polishing parameters by titanium grade.

- [Grade 1 commercially pure titanium](/grades/grade-1-titanium/) — softest CP grade; the easiest to polish to mirror finish, but most prone to smearing under high contact pressure. Standard sequence reaches 0.05–0.08 µm Ra.
- [Grade 2 commercially pure titanium](/grades/grade-2-titanium/) — the workhorse CP substrate for chemical, marine, and industrial service; produces a clean satin at 600-grit and a stable mirror at 3000-grit. Most forgiving grade for cosmetic finishing.
- [Grade 5 (Ti-6Al-4V)](/grades/grade-5-titanium/) — aerospace alloy; harder than CP, requires slightly more pressure at the rough stages but produces a more durable surface. Standard pre-treatment before [PVD TiN coating](/finishes/pvd-coating/).
- [Grade 23 (Ti-6Al-4V ELI)](/grades/grade-23-titanium/) — medical implant grade; the standard medical polish per [ASTM F86](/standards/astm-f86/) reaches 0.03–0.05 µm Ra with diamond paste, followed by nitric-acid [passivation](/finishes/passivation/) before sterile packaging.
- [Grade 9 (Ti-3Al-2.5V)](/grades/grade-9-titanium/) — tubing and hydraulic-line alloy; polished internally with abrasive-impregnated mandrels, externally with the standard buff sequence. Cosmetic-critical applications (e.g., bicycle frames) use the full mirror sequence.

Polishing is **not recommended** on titanium-aluminide intermetallics (γ-TiAl) because the brittle gamma-phase microstructure spalls under abrasive contact and produces unacceptable surface debris. It is also ineffective on as-built additive surfaces (DMLS, EBM) without prior [bead blasting](/finishes/bead-blasting/) or machining to remove the staircase texture — direct polishing of as-built additive surfaces just burnishes the peaks without removing the underlying roughness.
Polishing is **not recommended** on titanium-aluminide intermetallics (γ-TiAl) because the brittle gamma-phase microstructure spalls under abrasive contact and produces unacceptable surface debris. It is also ineffective on as-built additive surfaces (DMLS, EBM) without prior [bead blasting](/finishes/bead-blasting/) or machining to remove the staircase texture — direct polishing of as-built additive surfaces just burnishes the peaks without removing the underlying roughness.

## Typical Applications

- **Medical implants** — mirror polish on hip stems, knee femoral components, dental abutments, and trauma plates. The polished surface reduces bacterial adhesion and supports the cleanability requirements of [ISO 13485](/standards/iso-13485/). Standard pre-treatment before [ASTM F86](/standards/astm-f86/) nitric-acid passivation.
- **Aerospace structural** — pre-coat polish on Grade 5 hydraulic fittings, engine-mount brackets, and landing-gear components. Polishing before [PVD coating](/finishes/pvd-coating/) reduces coating-defect density by 60–80 % versus as-machined substrates.
- **Consumer goods** — mirror and satin finishes on watch cases (luxury brands), eyeglass frames, smartphone and laptop chassis (premium lines), and jewellery. The dominant driver here is aesthetic and tactile, not functional.
- **Automotive** — interior and exterior trim on premium vehicles (dashboard accents, gear-shift levers, exhaust tips). Standard finishing route before [anodizing](/finishes/titanium-anodizing/) for coloured trim.
- **Defence** — optical-housing finishes where stray-light control is mandatory; the polished surface reflects predictably and is easier to black-anodize uniformly.
- **Industrial / chemical processing** — polished finish on sanitary fittings, valve bodies, and pump components where cleanability and bio-film resistance matter.

## Related Surface Finishes

Polishing sits at the high-sheen end of the titanium surface-prep sequence. It is usually preceded by [bead blasting](/finishes/bead-blasting/) or fine machining and is followed by [passivation](/finishes/passivation/), [anodizing](/finishes/titanium-anodizing/), or [PVD coating](/finishes/pvd-coating/) depending on the end use. The matrix below summarises where polishing fits relative to its sibling finishes.

- [Bead blasting](/finishes/bead-blasting/) — produces a higher Ra (0.8–3.2 µm) but adds compressive residual stress and a non-directional texture; bead blasting is the preferred pre-treatment when fatigue performance matters more than cosmetics.
- [Electropolishing](/finishes/electropolishing/) — chemical removal of surface metal; reaches 0.05–0.2 µm Ra without the directional scratch pattern of mechanical polishing, but does not correct underlying surface defects the way mechanical polishing does. Often used as the final stage after mechanical polishing for medical and semiconductor parts.
- [Passivation](/finishes/passivation/) — chemical cleaning and oxide stabilisation; the standard post-polish step before sterile packaging of medical implants per [ASTM F86](/standards/astm-f86/).
- [Titanium anodizing](/finishes/titanium-anodizing/) — voltage-controlled oxide colouring; requires a polished, uniform substrate for repeatable colour, which is why polishing is the standard pre-anodize prep for cosmetic-coloured parts.
- [PVD coating](/finishes/pvd-coating/) — physical vapour deposition of TiN, CrN, or DLC; polishing the substrate to 0.05–0.1 µm Ra before PVD reduces coating-pinhole density and improves coating adhesion.
- [Chemical etching](/finishes/chemical-etching/) — produces a textured matte surface for bonding or weight reduction; the opposite of polishing in finish direction, but the same pre-treatment chemistry (alkaline clean + acid pickle) is used.
- [Chemical etching](/finishes/chemical-etching/) — produces a textured matte surface for bonding or weight reduction; the opposite of polishing in finish direction, but the same pre-treatment chemistry (alkaline clean + acid pickle) is used.

## Common Defects and Troubleshooting

- **Orange peel** — wavy, dimpled surface visible at mirror stages. Caused by excessive contact pressure at fine-grit stages; the soft alpha phase smears without smoothing. Drop pressure to 20 N/cm² and re-run the 800-grit stage.
- **Embedded abrasive** — black or grey specks visible at mirror stages. Caused by skipping the inter-stage ultrasonic cleaning between SiC stages. Soak the part in DI water + 5 % alkaline detergent for 10 min in an ultrasonic bath between every grit step from 600 upward.
- **Heat tint (alpha-case formation)** — straw, blue, or purple discoloration visible after polishing. Indicates surface temperature exceeded ~250 °C; the alpha-case must be removed by HF/HNO₃ pickling or by re-polishing from 240-grit if the tolerance allows. Common when polishing thin-walled Grade 5 parts dry.
- **Directional scratch pattern at mirror stage** — visible parallel lines even after 3000-grit. Indicates the previous stage (typically 1200-grit) was not fully removed. Re-run 2000-grit with 50 % overlap and a fresh buff.
- **Hazy mirror** — reflectivity present but surface looks "milky". Caused by inter-stage contamination or by buff-wheel loading with worn abrasive. Replace the buff and re-clean the part.
- **Smearing on CP grades** — the surface looks polished but feels rough and wipes off under finger pressure. Indicates too much pressure at too fine a grit. Drop contact pressure by 30 % and re-run the 1200-grit stage.

**The substrate condition matters more than the polishing parameters.** As-machined surfaces with deep tool marks (Ra > 1.6 µm) need a 120-grit rough stage to level; starting at 240-grit on a deep-tool-mark surface produces an "orange peel" that no amount of fine-grit work will remove. Conversely, a well-bead-blasted surface (0.8–1.6 µm Ra) can often skip directly to 400-grit and reach mirror in fewer stages.

**When mechanical polishing is not enough**, switch to [electropolishing](/finishes/electropolishing/) for the final 0.05 µm Ra — it removes the last 1–2 µm of surface metal without abrasive contact and eliminates the risk of embedded abrasive. For cosmetic finishes on premium consumer titanium goods where tactile feel matters, mechanical polishing followed by light [bead blasting](/finishes/bead-blasting/) with fine glass beads (60–100 mesh at 2 bar) is the standard luxury-watch finishing route.
**When mechanical polishing is not enough**, switch to [electropolishing](/finishes/electropolishing/) for the final 0.05 µm Ra — it removes the last 1–2 µm of surface metal without abrasive contact and eliminates the risk of embedded abrasive. For cosmetic finishes on premium consumer titanium goods where tactile feel matters, mechanical polishing followed by light [bead blasting](/finishes/bead-blasting/) with fine glass beads (60–100 mesh at 2 bar) is the standard luxury-watch finishing route.

## Engineering Interpretation

The engineering choice for titanium polishing is driven by **three coupled decisions**: the abrasive sequence (which controls final Ra and surface integrity), the contact-pressure window (which controls heat generation and alpha-case risk), and the inter-stage cleaning rigor (which determines whether residual abrasive survives into the final mirror stage). For most cosmetic and consumer-goods applications on CP titanium (Grade 1, Grade 2), the engineering default is a SiC paper sequence (240 → 400 → 600 → 800 → 1200) followed by an Al₂O₃ buff at 1500–2000 rpm — it is forgiving of operator skill, reaches a stable 0.05–0.08 µm Ra, and is compatible with downstream [anodizing](/finishes/titanium-anodizing/) if colour is needed.

For medical implants in Grade 23 (Ti-6Al-4V ELI), the same SiC sequence is followed by a diamond-paste buff at 1–3 µm particle to reach the sub-0.05 µm Ra required by [ASTM F86](/standards/astm-f86/), then by nitric-acid [passivation](/finishes/passivation/) and a final hot-DI rinse per [ISO 13485](/standards/iso-13485/). For aerospace structural parts going to [PVD coating](/finishes/pvd-coating/), stop at 600-grit (0.2–0.3 µm Ra) — finer polishing does not improve coating adhesion and adds cost.

The most common field failures are not the polishing sequence itself — they are heat-tint discoloration from excessive pressure on Grade 5 thin walls, embedded abrasive from skipped inter-stage cleaning, and orange-peel from starting too fine on a coarse as-machined surface. The cheapest in-process QC (a visual check at 1200-grit under a 10× loupe) catches all three before they propagate into the mirror stage.
The most common field failures are not the polishing sequence itself — they are heat-tint discoloration from excessive pressure on Grade 5 thin walls, embedded abrasive from skipped inter-stage cleaning, and orange-peel from starting too fine on a coarse as-machined surface. The cheapest in-process QC (a visual check at 1200-grit under a 10× loupe) catches all three before they propagate into the mirror stage.

## Evidence Basis

The grit sequences, achievable Ra values, and process parameters in this guide are derived from the standards and reference works listed below. Each parameter is anchored to a primary standard or peer-reviewed source; the Engineering Interpretation section above is the only place where site judgement is mixed with the cited facts.

Based on:

- **ASME B46.1-2019** — *Surface Texture (Surface Roughness, Waviness, and Lay)*. ASME, 2019. Defines the Ra measurement methodology, sampling length, and filter cutoff used to specify the achievable Ra values quoted in this guide.
- **ISO 1302:2002** — *Geometrical Product Specifications (GPS) — Indication of surface texture in technical product documentation*. ISO, 2002. Defines the surface-symbol convention used on engineering drawings for titanium polishing specifications.
- **ASTM F86-21** — *Standard Practice for Surface Preparation and Marking of Metallic Surgical Implants*. ASTM International, 2021. Defines the post-polish nitric-acid passivation sequence for titanium implants (Grade 2 and Grade 23).
- **AMS 2700E** — *Passivation of Corrosion-Resistant Steels and Titanium Alloys*. SAE International, 2018. Defines the surface-cleanliness requirements before and after polishing for aerospace titanium components.
- **ISO 13485:2016** — *Medical devices — Quality management systems — Requirements for regulatory purposes*. ISO, 2016. Defines the process-control framework for medical-implant polishing, including abrasive-traceability and inter-stage cleaning records.
- **AS9100D** — *Quality Management Systems — Requirements for Aviation, Space and Defense Organizations*. SAE International, 2016. Defines the QMS framework under which aerospace polishing processes are qualified and traceable.
- **ASTM F136-13** — *Standard Specification for Wrought Titanium-6Aluminum-4Vanadium ELI (Extra Low Interstitial) Alloy for Surgical Implant Applications*. ASTM International, 2013. Defines the substrate specification for medical-implant mirror polishing on Grade 23 ELI.

> Site-judgement claims (the Engineering Interpretation section above) are distinguished from the standard-derived facts above by the (titanium.blog) marker. The standard-derived grit sequences, achievable Ra values, and process-control requirements are anchored to the cited specifications; the engineering judgement (which abrasive sequence to use for a given application, when to switch from mechanical to electropolishing, etc.) is titanium.blog interpretation.

> All parameter ranges quoted in this guide (Ra values, grit sizes, wheel speeds, contact pressures, temperature limits) are typical values from the cited standards and reference works for the material and process combinations listed. They are not guaranteed values for any specific part; the user is responsible for qualifying the process on their own components per the controlling specification.

## Related Standards

- [ASTM F86 — Standard Practice for Surface Preparation and Marking of Metallic Surgical Implants](/standards/astm-f86/) — the controlling standard for post-polish passivation sequence on titanium medical implants.
- [AMS 2700 — Passivation of Corrosion-Resistant Steels and Titanium Alloys](/standards/ams-2700/) — defines the surface-cleanliness requirements before and after polishing for aerospace titanium components.
- [ISO 13485 — Medical Devices Quality Management Systems](/standards/iso-13485/) — process-control framework for medical-implant polishing under medical-device quality systems.
- [AS9100D — Aerospace Quality Management System](/standards/as9100d/) — aerospace QMS framework controlling polishing process qualification for AS9100-certified titanium parts.
- [ASTM F136 — Wrought Ti-6Al-4V ELI for Medical Implants](/standards/astm-f136/) — material specification for Grade 23 ELI implant substrates that mirror polishing supports as the standard pre-passivation prep.
- [ISO 9001 — Quality Management Systems](/standards/iso-9001/) — general QMS framework under which polishing process control, calibration, and traceability are typically documented for non-medical/non-aerospace industrial and consumer components.

For the cross-cluster procurement context, see the [procurement](/procurement/) module (process selection and vendor qualification) and the [surface finishes hub](/finishes/) (full catalog of finish types).

