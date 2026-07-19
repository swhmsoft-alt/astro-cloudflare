export default {
  entityType: "materials",
  aliases: ["Ti-6Al-4V", "Grade 5", "TC4", "Ti64"],
  guideType: null,
  comparisons: [],
  evidence: [
    { title: "Grade 5 Milling Parameters", slug: "grade-5-milling-parameters", category: "cutting-parameters", reason: "supports machining recommendations" },
    { title: "Grade 5 Material Properties", slug: "grade-5-properties", category: "material-properties", reason: "provides material specification data" },
  ],
  knownRelations: {
    processes: ["5-axis-cnc-machining", "cnc-turning", "wire-edm", "additive-manufacturing"],
    standards: ["astm-b265", "astm-b348"],
    industries: ["aerospace", "medical"],
  },
};
