/**
 * Navigation configuration
 */
export interface NavItem {
  href: string;
  labelKey: string;
  icon?: string;
  external?: boolean;
  children?: NavItem[];
  groupLabel?: string;
}

export const mainNav: NavItem[] = [
  { href: "/", labelKey: "nav.home" },
  { href: "/grades/", labelKey: "nav.grades" },
  { href: "/processes/", labelKey: "nav.processes" },
  { href: "/solutions/", labelKey: "nav.solutions", children: [
    { href: "/solutions/aerospace-defense/", labelKey: "nav.solutionsAerospaceDefense" },
    { href: "/solutions/semiconductor/", labelKey: "nav.solutionsSemiconductor" },
    { href: "/solutions/medical-device/", labelKey: "nav.solutionsMedicalDevice" },
    { href: "/solutions/marine-offshore/", labelKey: "nav.solutionsMarineOffshore" },
    { href: "/solutions/chemical-processing/", labelKey: "nav.solutionsChemicalProcessing" },
    { href: "/solutions/energy/", labelKey: "nav.solutionsEnergy" },
    { href: "/solutions/general-industrial/", labelKey: "nav.solutionsGeneralIndustrial" },
  ]},
  { href: "/standards/", labelKey: "nav.standards" },
  { href: "/industries/", labelKey: "nav.industries" },
  { href: "/tools/", labelKey: "nav.tools" },
] as const;


export const knowledgeMegaMenu: NavItem[][] = [
  [
    { href: "/grades/", labelKey: "nav.materials", groupLabel: "nav.materials", children: [
      { href: "/grades/grade-1-titanium/", labelKey: "nav.grade1" },
      { href: "/grades/grade-2-titanium/", labelKey: "nav.grade2" },
      { href: "/grades/grade-5-titanium-ti6al4v/", labelKey: "nav.grade5" },
      { href: "/grades/grade-23-titanium-eli/", labelKey: "nav.grade23" },
      { href: "/grades/", labelKey: "nav.viewAllMaterials" },
    ]},
    { href: "/processes/", labelKey: "nav.processes", groupLabel: "nav.processes", children: [
      { href: "/processes/cnc-machining/", labelKey: "nav.cncMachining" },
      { href: "/processes/5-axis-machining/", labelKey: "nav.5axis" },
      { href: "/processes/milling/", labelKey: "nav.milling" },
      { href: "/processes/turning/", labelKey: "nav.turning" },
      { href: "/processes/wire-edm/", labelKey: "nav.wireEdm" },
      { href: "/processes/additive-manufacturing/", labelKey: "nav.additive" },
      { href: "/processes/", labelKey: "nav.viewAllProcesses" },
    ]},
    { href: "/industries/", labelKey: "nav.industries", groupLabel: "nav.industries", children: [
      { href: "/industries/aerospace/", labelKey: "nav.aerospace" },
      { href: "/industries/medical/", labelKey: "nav.medical" },
      { href: "/industries/semiconductor/", labelKey: "nav.semiconductor" },
      { href: "/industries/energy/", labelKey: "nav.energy" },
      { href: "/industries/", labelKey: "nav.viewAllIndustries" },
    ]},
  ],
  [
    { href: "/standards/", labelKey: "nav.standards", groupLabel: "nav.standards", children: [
      { href: "/standards/astm-b265/", labelKey: "nav.astmB265" },
      { href: "/standards/astm-b348/", labelKey: "nav.astmB348" },
      { href: "/standards/astm-f136/", labelKey: "nav.astmF136" },
      { href: "/standards/as9100d/", labelKey: "nav.as9100d" },
      { href: "/standards/nadcap/", labelKey: "nav.nadcap" },
      { href: "/standards/iso-13485/", labelKey: "nav.iso13485" },
      { href: "/standards/", labelKey: "nav.viewAllStandards" },
    ]},
    { href: "/finishes/", labelKey: "nav.surfaceFinishes", groupLabel: "nav.surfaceFinishes", children: [
      { href: "/finishes/anodizing/", labelKey: "nav.anodizing" },
      { href: "/finishes/bead-blasting/", labelKey: "nav.beadBlasting" },
      { href: "/finishes/passivation/", labelKey: "nav.passivation" },
      { href: "/finishes/polishing/", labelKey: "nav.polishing" },
      { href: "/finishes/", labelKey: "nav.viewAllFinishes" },
    ]},
    { href: "/select/", labelKey: "nav.materialSelection", groupLabel: "nav.materialSelection", children: [
      { href: "/select/", labelKey: "nav.materialSelection" },
    ]},
    { href: "/failures/", labelKey: "nav.failureAnalysis", groupLabel: "nav.failureAnalysis", children: [
      { href: "/failures/", labelKey: "nav.failureAnalysis" },
    ]},
  ],
  [
    { href: "/heat-treatment/", labelKey: "nav.heatTreatment", groupLabel: "nav.heatTreatment", children: [
      { href: "/heat-treatment/", labelKey: "nav.heatTreatment" },
    ]},
    { href: "/corrosion/", labelKey: "nav.corrosionResistance", groupLabel: "nav.corrosionResistance", children: [
      { href: "/corrosion/", labelKey: "nav.corrosionResistance" },
    ]},
    { href: "/tools/", labelKey: "nav.tools", groupLabel: "nav.tools", children: [
      { href: "/tools/grade-comparison/", labelKey: "nav.gradeComparison" },
      { href: "/tools/hardness-converter/", labelKey: "nav.hardnessConverter" },
    ]},
  ],
];

export const footerNav = {
  knowledge: [
    { href: "/grades/", labelKey: "nav.materials" },
    { href: "/processes/", labelKey: "nav.processes" },
    { href: "/industries/", labelKey: "nav.industries" },
    { href: "/standards/", labelKey: "nav.standards" },
    { href: "/finishes/", labelKey: "nav.surfaceFinishes" },
    { href: "/select/", labelKey: "nav.materialSelection" },
    { href: "/failures/", labelKey: "nav.failureAnalysis" },
    { href: "/heat-treatment/", labelKey: "nav.heatTreatment" },
    { href: "/corrosion/", labelKey: "nav.corrosionResistance" },
    { href: "/compare/", labelKey: "nav.compare" },
    { href: "/guides/", labelKey: "nav.guides" },
  ] as const,
  resources: [
    { href: "/solutions/", labelKey: "nav.solutions" },
    { href: "/guides/", labelKey: "nav.guides" },
    { href: "/faq/", labelKey: "nav.faq" },
    { href: "/tools/", labelKey: "nav.tools" },
  ] as const,
  company: [
    { href: "/about/", labelKey: "nav.about" },
    { href: "/privacy/", labelKey: "footer.privacy" },
    { href: "/terms/", labelKey: "footer.terms" },
  ] as const,
  legal: [
    { href: "/privacy/", labelKey: "footer.privacy" },
    { href: "/terms/", labelKey: "footer.terms" },
  ] as const,
} as const;

export function getFooterNav(section: keyof typeof footerNav): NavItem[] {
  return footerNav[section] as unknown as NavItem[];
}
