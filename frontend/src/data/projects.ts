export interface Project {
  id: string;
  name: string;
  image: string;
  company: string;
  role: string;
  year: string;
  descrShort: string;
  problem: string;
  built: string;
  learned: string;
  language: string[];
  liveLink: string;
  sourceLink: string;
}

export const projects: Project[] = [
  {
    id: "1",
    name: "AmannaTrust",
    image: "/images/amannatrust.webp",
    company: "Solo project",
    role: "Full Stack",
    year: "2023",
    descrShort:
      "A website for a non-profit organisation helping underprivileged children access education, built with HTML, CSS, and JavaScript.",
    problem:
      "The organisation had no online presence to communicate their mission or attract donors and volunteers. They needed a site that loaded fast globally and was easy to navigate.",
    built:
      "Designed and built a fully static site using semantic HTML, vanilla CSS, and JavaScript — no frameworks — prioritising accessibility, fast load times, and a clear content hierarchy.",
    learned:
      "Practiced building a polished, production-ready UI without a framework, sharpening skills in semantic markup, CSS layout, and responsive design from first principles.",
    language: ["HTML", "CSS", "JavaScript"],
    liveLink: "https://noellincoln.github.io/first-capstone-project/",
    sourceLink: "https://github.com/NoelLincoln/first-capstone-project",
  },
];
