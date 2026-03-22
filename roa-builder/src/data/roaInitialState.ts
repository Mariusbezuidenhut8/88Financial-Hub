import type { ROAState } from "../types/roa.types";

export function makeInitialROAState(): ROAState {
  return {
    roaId:  `roa_${Date.now()}`,
    status: "draft",

    clientConfirmed:  false,
    adviserName:      "",
    adviserFSPNumber: "",
    meetingDate:      new Date().toISOString().slice(0, 10),
    meetingType:      "face_to_face",

    primaryObjective:  "",
    clientRiskProfile: "",
    keyCircumstances:  "",

    adviceItems: [
      { area: "retirement",  areaLabel: "Retirement Planning",  included: true, clientNeedIdentified: "", adviceGiven: "", basisForAdvice: "", productOrAction: "" },
      { area: "protection",  areaLabel: "Life & Protection",    included: true, clientNeedIdentified: "", adviceGiven: "", basisForAdvice: "", productOrAction: "" },
      { area: "estate",      areaLabel: "Estate Planning",      included: true, clientNeedIdentified: "", adviceGiven: "", basisForAdvice: "", productOrAction: "" },
      { area: "investment",  areaLabel: "Investment Planning",  included: true, clientNeedIdentified: "", adviceGiven: "", basisForAdvice: "", productOrAction: "" },
    ],

    recommendations: [],

    conflictsOfInterest:         "None",
    adviserDeclarationConfirmed: false,
  };
}
