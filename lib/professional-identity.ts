import { academyUrl } from "@/lib/site-paths";

export const volhaKaskevich = {
  name: "Volha Kaskevich",
  github: "https://github.com/kaskevich",
  orcid: "https://orcid.org/0000-0003-2801-4490",
  etis: "https://www.etis.ee/CV/Volha_Kaskevich/eng/",
  university: "https://www.emu.ee/en/contacts/volha-kaskevich",
  linkedin: "https://ee.linkedin.com/in/volha-kaskevich-b13439b3",
} as const;

export const academyEntityId = `${academyUrl("/")}#academy`;
export const creatorEntityId = `${academyUrl("/")}#volha-kaskevich`;

export function creatorReference() {
  return {
    "@type": "Person",
    "@id": creatorEntityId,
    name: volhaKaskevich.name,
    url: academyUrl("/about/"),
  };
}

export function creatorEntity() {
  return {
    ...creatorReference(),
    jobTitle: ["Junior Research Fellow", "PhD Researcher"],
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "Estonian University of Life Sciences",
      url: "https://www.emu.ee/",
    },
    sameAs: [
      volhaKaskevich.github,
      volhaKaskevich.orcid,
      volhaKaskevich.etis,
      volhaKaskevich.university,
      volhaKaskevich.linkedin,
    ],
    knowsAbout: [
      "Geographic information systems",
      "Remote sensing",
      "Earth observation",
      "UAV remote sensing",
      "Geospatial analysis",
      "Environmental monitoring",
      "Machine learning",
    ],
  };
}
