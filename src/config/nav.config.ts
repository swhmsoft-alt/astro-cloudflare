/**
 * Navigation configuration — Centralized navigation structure
 * Defines main navigation links, mega menu groups, and footer sections
 * Used by Header and Footer components for consistent navigation
 */

export interface NavItem {
  /** Navigation link URL */
  href: string;
  /** Translation key for localized label */
  labelKey: string;
  /** Optional icon name for icon-only navigation items */
  icon?: string;
  /** Whether this is an external link (opens in new tab) */
  external?: boolean;
  /** Sub-navigation items for dropdown menus */
  children?: NavItem[];
  /** Group label for mega menu columns */
  groupLabel?: string;
}

/** Mega menu group for Services hub */
export const serviceMegaMenu: NavItem[][] = [
  [
    {
      href: "/services/",
      labelKey: "nav.byProcess",
      groupLabel: "nav.byProcess",
      children: [
        { href: "/services/titanium-cnc-machining/", labelKey: "nav.titaniumCnc" },
        { href: "/services/5-axis-titanium-machining/", labelKey: "nav.titanium5axis" },
        { href: "/services/titanium-milling/", labelKey: "nav.titaniumMilling" },
        { href: "/services/titanium-turning/", labelKey: "nav.titaniumTurning" },
        { href: "/services/titanium-wire-edm/", labelKey: "nav.titaniumWireEdm" },
        { href: "/services/titanium-additive-manufacturing/", labelKey: "nav.titaniumAdditive" },
      ],
    },
    {
      href: "/services/",
      labelKey: "nav.byMaterial",
      groupLabel: "nav.byMaterial",
      children: [
        { href: "/services/grade-5-titanium-machining/", labelKey: "nav.grade5Machining" },
        { href: "/services/grade-23-titanium-machining/", labelKey: "nav.grade23Machining" },
      ],
    },
    {
      href: "/services/",
      labelKey: "nav.byIndustry",
      groupLabel: "nav.byIndustry",
      children: [
        { href: "/services/aerospace-titanium-components/", labelKey: "nav.aerospaceComp" },
        { href: "/services/medical-titanium-components/", labelKey: "nav.medicalComp" },
        { href: "/services/semiconductor-titanium-parts/", labelKey: "nav.semiconductorComp" },
      ],
    },
  ],
  [
    {
      href: "/rfq/upload-drawing/",
      labelKey: "nav.uploadDrawing",
      icon: "lucide:upload",
    },
    {
      href: "/rfq/request-quote/",
      labelKey: "nav.requestQuote",
      icon: "lucide:file-text",
    },
  ],
];

/** Main navigation items for header */
export const mainNav: NavItem[] = [
  { href: "/", labelKey: "nav.home" },
  {
    href: "/knowledge/",
    labelKey: "nav.knowledge",
    children: [
      { href: "/compare/", labelKey: "nav.compare" },
      { href: "/guides/", labelKey: "nav.guides" },
      { href: "/faq/", labelKey: "nav.faq" },
    ],
  },
  {
    href: "/services/",
    labelKey: "nav.services",
    children: [],
  },
  {
    href: "/industries/",
    labelKey: "nav.industries",
    children: [
      { href: "/industries/aerospace/", labelKey: "nav.aerospace" },
    ],
  },
  {
    href: "/rfq/",
    labelKey: "nav.rfq",
    children: [
      { href: "/rfq/upload-drawing/", labelKey: "nav.uploadDrawing" },
      { href: "/rfq/request-quote/", labelKey: "nav.requestQuote" },
      { href: "/rfq/dfm-review/", labelKey: "nav.dfmReview" },
      { href: "/rfq/prototype-request/", labelKey: "nav.prototypeRequest" },
    ],
  },
] as const;

/** Mega menu group for Knowledge hub */
export const knowledgeMegaMenu: NavItem[][] = [
  [
    {
      href: "/knowledge/materials/",
      labelKey: "nav.materials",
      groupLabel: "nav.materials",
      children: [
        { href: "/knowledge/materials/grade-1-titanium/", labelKey: "nav.grade1" },
        { href: "/knowledge/materials/grade-2-titanium/", labelKey: "nav.grade2" },
        { href: "/knowledge/materials/grade-5-titanium-ti6al4v/", labelKey: "nav.grade5" },
        { href: "/knowledge/materials/grade-23-titanium-eli/", labelKey: "nav.grade23" },
        { href: "/knowledge/materials/", labelKey: "nav.viewAllMaterials" },
      ],
    },
    {
      href: "/knowledge/processes/",
      labelKey: "nav.processes",
      groupLabel: "nav.processes",
      children: [
        { href: "/knowledge/processes/cnc-machining/", labelKey: "nav.cncMachining" },
        { href: "/knowledge/processes/5-axis-machining/", labelKey: "nav.5axis" },
        { href: "/knowledge/processes/milling/", labelKey: "nav.milling" },
        { href: "/knowledge/processes/turning/", labelKey: "nav.turning" },
        { href: "/knowledge/processes/wire-edm/", labelKey: "nav.wireEdm" },
        { href: "/knowledge/processes/additive-manufacturing/", labelKey: "nav.additive" },
        { href: "/knowledge/processes/", labelKey: "nav.viewAllProcesses" },
      ],
    },
    {
      href: "/knowledge/industries/",
      labelKey: "nav.industries",
      groupLabel: "nav.industries",
      children: [
        { href: "/knowledge/industries/aerospace-titanium-parts/", labelKey: "nav.aerospace" },
        { href: "/knowledge/industries/medical-titanium-implants/", labelKey: "nav.medical" },
        { href: "/knowledge/industries/semiconductor-titanium/", labelKey: "nav.semiconductor" },
        { href: "/knowledge/industries/robotics-titanium/", labelKey: "nav.robotics" },
        { href: "/knowledge/industries/energy-titanium/", labelKey: "nav.energy" },
        { href: "/knowledge/industries/", labelKey: "nav.viewAllIndustries" },
      ],
    },
  ],
  [
    {
      href: "/knowledge/standards/",
      labelKey: "nav.standards",
      groupLabel: "nav.standards",
      children: [
        { href: "/knowledge/standards/astm-b265/", labelKey: "nav.astmB265" },
        { href: "/knowledge/standards/astm-b348/", labelKey: "nav.astmB348" },
        { href: "/knowledge/standards/astm-f136/", labelKey: "nav.astmF136" },
        { href: "/knowledge/standards/as9100d/", labelKey: "nav.as9100d" },
        { href: "/knowledge/standards/iso-13485/", labelKey: "nav.iso13485" },
        { href: "/knowledge/standards/", labelKey: "nav.viewAllStandards" },
      ],
    },
    {
      href: "/knowledge/surface-finishes/",
      labelKey: "nav.surfaceFinishes",
      groupLabel: "nav.surfaceFinishes",
      children: [
        { href: "/knowledge/surface-finishes/titanium-anodizing/", labelKey: "nav.anodizing" },
        { href: "/knowledge/surface-finishes/bead-blasting/", labelKey: "nav.beadBlasting" },
        { href: "/knowledge/surface-finishes/passivation/", labelKey: "nav.passivation" },
        { href: "/knowledge/surface-finishes/polishing/", labelKey: "nav.polishing" },
        { href: "/knowledge/surface-finishes/", labelKey: "nav.viewAllFinishes" },
      ],
    },
    {
      href: "/knowledge/equipment/",
      labelKey: "nav.equipment",
      groupLabel: "nav.equipment",
      children: [
        { href: "/knowledge/equipment/mazak-5-axis/", labelKey: "nav.mazak" },
        { href: "/knowledge/equipment/dmg-mori-dmu/", labelKey: "nav.dmgMori" },
        { href: "/knowledge/equipment/charmilles-wire-edm/", labelKey: "nav.wireEdmMachines" },
        { href: "/knowledge/equipment/", labelKey: "nav.viewAllEquipment" },
      ],
    },
  ],
];

/** Footer navigation grouped by section */
export const footerNav = {
  /** Knowledge base links */
  knowledge: [
    { href: "/knowledge/materials/", labelKey: "nav.materials" },
    { href: "/knowledge/processes/", labelKey: "nav.processes" },
    { href: "/knowledge/industries/", labelKey: "nav.industries" },
    { href: "/knowledge/standards/", labelKey: "nav.standards" },
    { href: "/knowledge/surface-finishes/", labelKey: "nav.surfaceFinishes" },
    { href: "/knowledge/equipment/", labelKey: "nav.equipment" },
    { href: "/knowledge/evidence/", labelKey: "nav.evidence" },
    { href: "/knowledge/cases/", labelKey: "nav.cases" },
    { href: "/knowledge/applications/", labelKey: "nav.applications" },
    { href: "/compare/", labelKey: "nav.compare" },
    { href: "/guides/", labelKey: "nav.guides" },
    { href: "/knowledge/procurement/", labelKey: "nav.procurement" },
  ] as const,
  /** Services links */
  services: [
    { href: "/services/titanium-cnc-machining/", labelKey: "nav.titaniumCnc" },
    { href: "/services/5-axis-titanium-machining/", labelKey: "nav.titanium5axis" },
    { href: "/services/titanium-milling/", labelKey: "nav.titaniumMilling" },
    { href: "/services/titanium-turning/", labelKey: "nav.titaniumTurning" },
    { href: "/services/titanium-wire-edm/", labelKey: "nav.titaniumWireEdm" },
    { href: "/services/titanium-additive-manufacturing/", labelKey: "nav.titaniumAdditive" },
  ] as const,
  /** Resources links */
  resources: [
    { href: "/guides/", labelKey: "nav.guides" },
    { href: "/faq/", labelKey: "nav.faq" },
    { href: "/blog/", labelKey: "nav.blog" },
    { href: "/docs/", labelKey: "nav.docs" },
    { href: "/rfq/", labelKey: "nav.rfq" },
  ] as const,
  /** Company links */
  company: [
    { href: "/about/", labelKey: "nav.about" },
    { href: "/contact/", labelKey: "nav.contact" },
    { href: "/privacy/", labelKey: "footer.privacy" },
    { href: "/terms/", labelKey: "footer.terms" },
  ] as const,
  /** Legal pages and terms */
  legal: [
    { href: "/privacy/", labelKey: "footer.privacy" },
    { href: "/terms/", labelKey: "footer.terms" },
  ] as const,
} as const;

/** Helper function to get navigation items by section */
export function getFooterNav(section: keyof typeof footerNav): NavItem[] {
  return footerNav[section] as unknown as NavItem[];
}
