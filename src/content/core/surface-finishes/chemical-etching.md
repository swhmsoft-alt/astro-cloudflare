---
title: "Chemical Etching of Titanium Components — Complete Guide"
description: "Engineering guide to chemical etching of titanium alloys: masking, chemical milling, surface texturing, material compatibility, safety controls, and aerospace and medical applications."
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
  - "semiconductor"
  - "chemical-processing"
processes:
  - "chemical-etching"
  - "surface-finishing"
source: "ASTM F86-21, AMS 2700F, ASTM B600-21, ISO 13485:2016, AS9100D, ISO 9001:2015, ASTM F136-13"
sourceUrl: "https://www.astm.org/f0086-21.html"
sourceAuthority: "HIGH"
claimSupport: "PARTIALLY_SUPPORTED"
claimScope: "TYPICAL_VALUE"
surfaceFinish: "0.4–1.6 µm Ra (typical etched surface)"
raRange: "0.4–1.6 µm Ra"
finishType: "chemical"
dataPoints:
  - property: "Typical etched-surface Ra"
    value: "0.4–1.6"
    unit: "µm Ra"
    notes: "Comparison value from the titanium finishes hub; qualify on the actual alloy, mask, bath, and drawing requirement"
  - property: "Relative cost"
    value: "15–35"
    unit: "USD/m²"
    notes: "Site comparison range for chemical etching; not a supplier quotation"
  - property: "Typical lot size"
    value: "50–2,000"
    unit: "parts"
    notes: "Site comparison range; masking and inspection change the practical batch size"
  - property: "Typical lead time"
    value: "5–10"
    unit: "business days"
    notes: "Planning range, excluding mask design, special tooling, or source inspection"
  - property: "Implant roughness example"
    value: "0.4–1.6"
    unit: "µm Ra"
    notes: "Illustrative ASTM F86 dental-implant surface range; not a chemical-etch acceptance criterion"
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
  - "pvd-coating"
relatedStandards:
  - "astm-f86"
  - "ams-2700"
  - "iso-13485"
  - "as9100d"
  - "iso-9001"
  - "astm-f136"
order: 6
---
title: "Chemical Etching of Titanium Components"
description: "Complete guide to chemical etching of titanium alloys. Process parameters, material removal rates, and applications for surface texturing and weight reduction."
locale: en
finishType: chemical
materials:
  - grade-5-titanium
  - grade-23-titanium
  - grade-2-titanium
industries:
  - aerospace
  - medical
  - semiconductor
processes:
  - surface-finishing
surfaceFinish: "1.6–3.3 µm Ra (etched)"
order: 6
---
## Quick Answer

**What is chemical etching for titanium?** Chemical etching is a controlled acid-assisted material-removal process. A temporary mask protects selected areas while the exposed titanium is dissolved or selectively attacked. The result can be a controlled-depth recess, a clean textured surface, a part mark, or a chemical-milled pocket.

Chemical etching is not anodizing. Anodizing builds an oxide in an electrolytic cell, where the component, anode, cathode, voltage, and current are process variables. Chemical etching does not use an external voltage or an anodizing color setpoint. A production drawing must therefore define the alloy, exposed area, removal depth, edge condition, roughness, residual chemistry, and inspection method instead of treating the operation as a generic “etched finish.”

**What should a purchaser specify?** Specify the titanium grade and condition, the pre-cleaning and masking method, the area to be etched, the allowable material removal or final thickness, the required roughness and surface appearance, any post-etch neutralization or passivation, and the acceptance tests. Do not approve a bath recipe from a generic web page: the controlling process specification and qualified supplier data take precedence.

## How Chemical Etching Works

Titanium forms a stable oxide film very quickly, so a qualified pretreatment is required before the chemical can contact the base metal consistently. A typical process flow is: inspect and identify the part; clean and degrease the surface; condition or remove the native oxide; apply the mask; etch the exposed areas; rinse in stages; neutralize and verify residual chemistry; remove the mask; and complete final inspection.

The mask is part of the engineering process, not a consumable detail. It must adhere to the metal during the complete exposure, tolerate the chemistry, release without damaging the part, and reproduce the drawing pattern. Mask defects can produce under-etching, edge bleed, local attack, or an unacceptable out-of-spec condition. For complex titanium sheet, chemical milling is often selected when a uniform pocket would be expensive or inaccessible with ordinary milling.

The chemistry, concentration, temperature, exposure time, agitation, and removal rate are supplier-qualified variables. They are not interchangeable between Grade 2, Grade 5, and Grade 23 solely because all three are titanium. The same nominal bath can produce a different response when the alloy condition, heat treatment, residual stress, surface finish, and bath history change.

A robust traveler records the alloy certification, lot, mask revision, bath identification, time, temperature, agitation, pre/post thickness, rinse sequence, operator, and inspection result. The traveler should also record any deviation, rework, or partial etch. Without those records, a visually acceptable part is not a fully traceable aerospace or medical component.

## Process Steps and Controls

The following table is a process-control checklist, not a recipe. The exact sequence and limits must come from the controlling drawing, customer specification, qualified process, and applicable standard.

| Stage | Control objective | What the supplier documents |
|---|---|---|
| Incoming identification | Confirm alloy, heat, and part condition | Material certificate and internal lot traceability |
| Pre-clean | Remove oil, shop contamination, and loose debris | Cleaner concentration, rinse condition, and drying result |
| Surface conditioning | Obtain repeatable access to the base metal | Method, time, temperature, and bath qualification record |
| Mask application | Protect every non-etched area | Mask type, revision, coverage check, and defect disposition |
| Etch | Control exposed area and material removal | Bath ID, exposure, temperature, agitation, and weight or thickness result |
| Rinse and neutralize | Stop the reaction and control residues | Rinse stages, neutralization verification, and water quality |
| Mask removal | Recover the part without edge damage | Removal method and final visual inspection |
| Final acceptance | Confirm drawing requirements | Thickness, roughness, visual, dimensional, and cleanliness results |

Thickness measurement is normally more useful than a bath-time assumption. Measure the starting and finished thickness at defined witness points when the drawing permits. Use witness coupons only when their material, thickness, heat treatment, and surface condition represent the production part. The actual removal target and tolerance are **[MISSING SPECIFICATION: obtain from the drawing and qualified process]**, not inferred from the finish name.

> **Safety note — OSHA.** The [Occupational Chemical Database](https://www.osha.gov/chemicaldata/chemResult.html?recNo=172) states that employers must comply with applicable OSHA chemical standards and identifies the Hazard Communication standard (29 CFR 1910.1200), respiratory protection (29 CFR 1910.134), protective clothing, and eye/face protection as relevant controls for chemical hazards. It does not supply a titanium-etch bath recipe. A qualified EHS review, local regulation, ventilation assessment, and supplier safety data are mandatory before work.

## Types and Variants

The process name describes a family of operations. The operation selected depends on whether the objective is depth removal, controlled texture, marking, or cleaning.

**Chemical milling** removes a defined region from sheet, thin plate, or a pocket to reduce mass or create a uniform depth. It is appropriate when the geometry would require many machining setups, when a thin wall must be held, or when a smooth transition is needed between machined and etched areas. Chemical milling can be more repeatable for a broad exposed area, but it still requires edge definition and final thickness control.

**Selective etching** masks part of the surface so that a recess, channel, or feature is produced without removing the entire component. Selective etching is useful for flow-path features, lightweighting, and controlled-depth details. The mask drawing, mask registration, and allowable undercut determine whether the result is acceptable.

**Micro-etching and surface texturing** intentionally changes the surface at a smaller scale for adhesion, coating preparation, marking, or a defined texture. Texture is not synonymous with roughness: a process may change the topography without meeting a required Ra value, and an Ra specification does not define the complete surface morphology.

**Pickling and alpha-case conditioning** remove a contaminated or heat-affected near-surface layer before a subsequent finish. This is a cleaning or preparation operation, not automatically a structural material-removal allowance. The acceptable endpoint depends on the alloy, heat treatment, prior process, and drawing requirement.

**Etch marking and identification** can produce a controlled mark in a low-stress location. The mark must remain legible after cleaning, sterilization, service, and any required coating or passivation. The final drawing and the applicable medical or aerospace specification control whether a mark is acceptable at a minimum section or near a fatigue-critical feature. Type II and Type III classifications belong to anodizing discussions; they must not be copied into a chemical-etch specification without an explicit contract requirement.

## Compatible Materials

Titanium is not a single material response. Commercial-purity grades, alpha-beta alloys, and ELI variants require qualified processing and different inspection emphasis.

| Material family | Typical use in this page | Selection and process notes |
|---|---|---|
| Grade 1 CP titanium | Formed sheet, chemical-milled details, ductile parts | Lowest strength family; prioritize elongation, masking, and thickness control |
| Grade 2 CP titanium | General aerospace and industrial parts | Common balance of formability, corrosion resistance, and availability |
| Grade 5 Ti-6Al-4V | Higher-strength aerospace components | Qualify removal response after heat treatment and machining sequence |
| Grade 9 Ti-3Al-2.5V | Thin-wall and tubing-related components | Confirm final thickness and fatigue-sensitive transition geometry |
| Grade 23 Ti-6Al-4V ELI | Medical and fracture-critical applications | Require the most conservative cleanliness, biocompatibility, and dimensional controls |

The material certificate should identify the alloy and heat. For Grade 23 and medical applications, ASTM F136-13 defines the wrought Ti-6Al-4V ELI material basis, while ISO 13485:2016 supplies the quality-system framework. These documents do not create a universal chemical-etch recipe. They identify the material and process-control context in which the supplier must qualify the actual operation.

The surface condition before etching also matters. A rough, contaminated, heat-affected, or previously blasted surface may not respond like a clean machined surface. The process traveler should identify the prior operation and the surface preparation so that the result can be reproduced at the next batch or supplier.


## Typical Applications

Chemical etching is selected when the value comes from selective material removal or a controlled surface state rather than simply “making the part look matte.”

- **Aerospace lightweighting:** chemical milling of sheet and thin-wall pockets can remove material from broad areas while maintaining a smooth transition and controlled final thickness.
- **Aerospace marking and identification:** controlled etching can create a legible mark where the drawing permits, provided fatigue and minimum-section requirements are satisfied.
- **Medical implant surfaces:** controlled texture or selective etching may support a defined surface requirement, but any medical use requires a validated process, cleanliness verification, and evidence of biocompatibility. ASTM F86-21 is a relevant surface-preparation reference, not permission to substitute etch chemistry without qualification.
- **Semiconductor equipment:** selective removal or controlled cleaning can support a specified flow path or surface condition when contamination control, rinsing, and final packaging are defined.
- **Chemical-processing hardware:** a controlled etched surface may support a defined cleaning or surface-treatment requirement, but corrosion resistance and residual chemistry must be verified after processing.

The application drives the acceptance evidence. An aerospace buyer may need first-article dimensional inspection and a special-process traveler. A medical buyer may need cleanliness, biocompatibility, and sterilization evidence. A semiconductor buyer may need particle and ionic-contamination controls. The same visual result does not satisfy all three programs.

## Process Economics and Lot Planning

Chemical etching is often attractive for a complex shallow pocket because it can reduce machining time and fixture complexity. The cost is not only the bath time. Mask design, masking labor, inspection, thickness mapping, rework, disposal, safety controls, and documentation can dominate a small lot.

| Planning factor | Cost or schedule influence | Engineering question |
|---|---|---|
| Mask and artwork | New tooling, revision control, and setup | Is the mask geometry controlled by the drawing or customer approval? |
| Exposed area and depth | Larger or deeper removal usually increases exposure and verification | What final thickness and edge condition are required? |
| Alloy and condition | Different grades and heat treatments can require separate qualification | Was the exact material heat processed before etching? |
| Lot and batch size | Mask changeover and inspection affect cost per part | Is the order a stable lot or a frequent revision? |
| Lead time | Mask design, source inspection, and special testing can extend delivery | Which tests must be completed before release? |

As a planning comparison only, the surface-finishes hub gives chemical etching a typical roughness of 0.4–1.6 µm Ra, relative cost of 15–35 USD/m², 8–25 USD/part, a 5–10-business-day lead time, and a 50–2,000-part lot-size range. These are not purchase specifications and must be replaced by supplier quotations and the controlling drawing.

For a prototype, request a small qualification lot with witness coupons and a documented inspection plan before committing a production batch. For production, keep the mask revision, bath record, inspection method, and disposition under change control. That reduces the risk of paying for a nominal finish that is actually out of tolerance.


## Limitations and Safety Controls

Chemical etching has important limits. It removes material rather than correcting a design that lacks a defined removal allowance. It can create local geometry changes at a mask edge, and it can be difficult to maintain a uniform result on a complex part with deep recesses, trapped rinse areas, or a large variation in exposed area.

The following failure modes must be controlled and documented:

- **Under-etching or over-etching:** final thickness, removal depth, and surface condition can fall outside the drawing. Re-qualify the exposure and witness method rather than adding time ad hoc.
- **Mask lift or bleed:** chemistry can attack the protected zone. Inspect mask registration, adhesion, and edge definition before release.
- **Residual chemistry:** incomplete rinse or neutralization can affect later passivation, coating, cleanliness, or corrosion performance. Verify the required residue criterion on the actual part.
- **Hydrogen embrittlement risk:** hydrogen uptake and its consequences must be considered for the selected alloy, heat treatment, bath, and post-process. The production route must be qualified and monitored; no universal safe exposure time is stated here.
- **Fatigue and notch sensitivity:** a recess, edge transition, or mark at a critical section can change the fatigue response. Review the drawing and the applicable fatigue requirement before etching.
- **Wear and handling damage:** a thin, rough, or chemically affected surface can be more vulnerable to handling and subsequent abrasion. Define the handling and packaging sequence.
- **Safety and environmental burden:** acid handling, ventilation, effluent treatment, and waste disposal require an approved EHS plan. The process must not be scaled from a generic concentration recommendation.

For a medical part, the process is not accepted by visual appearance alone. Surface cleanliness, biocompatibility evidence, sterilization compatibility, packaging, and traceability must be addressed under the applicable quality system. For an aerospace part, a special-process traveler and source inspection may be required even when the geometric result is acceptable.

## Related Surface Finishes

Chemical etching occupies a different decision space from the other titanium surface-finish spokes. The related links below are engineering contrasts, not a recommendation to combine every operation.

- [Titanium anodizing](/finishes/titanium-anodizing/) uses an electrolytic cell, anode, cathode, voltage, and oxide growth; it is selected for oxide color, identification, dielectric behavior, or wear-related functions.
- [Passivation](/finishes/passivation/) uses a controlled chemical treatment to stabilize cleanliness and the natural oxide. It is not a substitute for a defined chemical-milling allowance.
- [Electropolishing](/finishes/electropolishing/) removes material electrochemically and is often selected when a smoother, cleaner surface or low contamination is required.
- [Mechanical polishing](/finishes/polishing/) changes topography by abrasion. It can be used before or after etching when the drawing requires a defined finish sequence.
- [Bead blasting](/finishes/bead-blasting/) adds a matte or controlled texture by media impact. It is not chemical removal and may mask the original etched condition.
- [PVD coating](/finishes/pvd-coating/) adds a hard coating after the substrate is prepared. Etching does not eliminate the need to qualify the substrate and the coating interface.
- [Surface finishes hub](/finishes/) provides the broader comparison matrix and the other finish spokes.

When choosing a sequence, identify the primary failure mode first. If mass reduction is the objective, chemical milling may be the central operation. If corrosion cleanliness is the objective, passivation may be the required baseline. If cosmetic color is the objective, anodizing may be added after surface preparation. If a medical implant needs a defined texture, the medical surface specification and biocompatibility evidence control the final sequence.


## Engineering Interpretation

(titanium.blog) The key engineering decision is not whether “chemical etching” sounds more precise than “pickling.” The decision is whether the drawing defines a measurable result and the supplier can reproduce it on the exact alloy, heat, geometry, and lot. For new aerospace parts, require a defined material-removal allowance, mask revision, final-thickness inspection, and process record before releasing the first article. For medical parts, add cleanliness, biocompatibility, sterilization, and traceability requirements to the process scope.

Use chemical milling when a broad, shallow, geometry-driven removal is the primary objective. Use a lighter selective etch when the objective is a defined mark, texture, or preparation step. Do not use a nominal Ra value as proof of depth removal, and do not infer etch success from color or brightness. If the part is fatigue-critical, a medical implant, or a thin-wall flow component, require a dedicated qualification review.

The site comparison values in the frontmatter and economics table are useful for early planning only. They are not a substitute for the drawing, the applicable ASTM/AMS/ISO document, supplier qualification data, or a current quotation.

## Evidence Basis

This page consolidates process context, comparison guidance, and safety controls from the following sources. The list distinguishes documents that govern material, surface preparation, or quality systems from the missing supplier-specific chemical-etch specification.

- [ASTM F86-21](https://www.astm.org/f0086-21.html) — *Standard Practice for Surface Preparation and Marking of Metallic Surgical Implants*. Used for medical surface-preparation and marking context; it does not prescribe a universal titanium-etch bath.
- **AMS 2700F** — *Passivation of Corrosion-Resistant Steels and Titanium Alloys*. Used for the passivation and post-etch cleanliness distinction.
- **ASTM B600-21** — *Standard Guide for Descaling and Cleaning Titanium and Titanium Alloy Surfaces*. Used for surface-cleaning and alpha-case preparation context.
- **ISO 13485:2016** — *Medical devices — Quality management systems — Requirements for regulatory purposes*. Used for medical-device process control and traceability context.
- **AS9100D** — *Quality Management Systems — Requirements for Aviation, Space, and Defense Organizations*. Used for aerospace quality-system and special-process traceability context.
- **ISO 9001:2015** — *Quality management systems — Requirements*. Used for general process-control and record context.
- **ASTM F136-13** — *Standard Specification for Wrought Titanium-6Aluminum-4Vanadium ELI (Extra Low Interstitial) Alloy for Surgical Implant Applications*. Used for Grade 23 material context.
- [U.S. OSHA Occupational Chemical Database](https://www.osha.gov/chemicaldata/chemResult.html?recNo=172) — official government resource for chemical identification, exposure limits, sampling information, and related safety standards; it is a safety reference, not a process recipe.

> **Evidence gap.** The available repository references do not provide a single authoritative public document that specifies a universal HF/HNO3 concentration, temperature, exposure time, or removal rate for every titanium grade and geometry. Those values are intentionally not invented here. Obtain the qualified process, customer specification, and supplier safety data for the actual part.

## Related Standards and Materials

For procurement and design review, connect the finish to the controlling material and quality documents:

- [ASTM F86 — Surface Preparation and Marking of Metallic Surgical Implants](/standards/astm-f86/)
- [AMS 2700 — Passivation of Titanium and Corrosion-Resistant Steels](/standards/ams-2700/)
- [ISO 13485 — Medical Device Quality Management Systems](/standards/iso-13485/)
- [AS9100D — Aerospace Quality Management System](/standards/as9100d/)
- [ISO 9001 — Quality Management Systems](/standards/iso-9001/)
- [ASTM F136 — Wrought Ti-6Al-4V ELI for Medical Implants](/standards/astm-f136/)
- [Grade 1 titanium](/grades/grade-1-titanium/) — commercially pure, highly formable family
- [Grade 2 titanium](/grades/grade-2-titanium/) — general-purpose commercially pure titanium
- [Grade 5 titanium](/grades/grade-5-titanium/) — Ti-6Al-4V alpha-beta alloy
- [Grade 9 titanium](/grades/grade-9-titanium/) — Ti-3Al-2.5V alloy
- [Grade 23 titanium](/grades/grade-23-titanium/) — Ti-6Al-4V ELI alloy

For the cross-cluster procurement context, see [procurement](/procurement/) for supplier qualification and process selection. For the complete process comparison, return to the [surface finishes hub](/finishes/).

## Decision Checklist

Before release, confirm that the part record answers all of the following:

1. What titanium grade, heat, and starting surface condition were processed?
2. What area was exposed and what final thickness or depth was required?
3. Which mask revision and controlled process parameters were used?
4. How were rinse, neutralization, residual chemistry, and cleanliness verified?
5. What dimensional, roughness, visual, fatigue, and cleanliness evidence supports release?
6. Which post-etch process—passivation, anodizing, polishing, coating, or none—is actually required?
7. What deviation, rework, and disposition records are traceable to the lot?

If any answer is unavailable, hold the lot for engineering review. A “clean” visual result cannot replace a defined tolerance, a validated process, or the required evidence.

