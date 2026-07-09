/**
 * Curated keyword list used to extract skills from free-text job postings
 * (title/description/tags) and to score matches against a user's resume
 * skills. Deliberately static and deterministic — no AI call needed for
 * the bulk job list; Gemini is reserved for the per-job explanation.
 */
export const SKILL_TAXONOMY: string[] = [
  // Languages (single/double-letter tokens like "R", "C", "Go" are deliberately
  // excluded — they collide too often with ordinary words in free-text job
  // postings, especially non-English ones; "Golang"/"C++"/"C#" cover those
  // languages unambiguously instead)
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Golang", "Rust", "Ruby",
  "PHP", "Swift", "Kotlin", "Scala", "MATLAB", "Perl", "Dart", "Elixir", "Haskell",

  // Frontend
  "React", "React.js", "Vue", "Vue.js", "Angular", "Svelte", "Next.js", "Nuxt.js", "Redux",
  "HTML", "CSS", "Sass", "Tailwind CSS", "Bootstrap", "jQuery", "Webpack", "Vite", "GraphQL",

  // Backend
  "Node.js", "Express", "Express.js", "NestJS", "Django", "Flask", "FastAPI", "Spring", "Spring Boot",
  "Ruby on Rails", "Laravel", ".NET", "ASP.NET", "gRPC", "REST API", "RESTful API", "Microservices",

  // Data / ML
  "SQL", "NoSQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "DynamoDB", "SQLite",
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Keras", "Scikit-learn", "Pandas",
  "NumPy", "Data Science", "Data Engineering", "ETL", "Spark", "Hadoop", "Kafka", "Airflow",
  "NLP", "Computer Vision", "LLM", "Generative AI", "OpenAI API", "Gemini API",

  // Cloud / DevOps
  "AWS", "Azure", "GCP", "Google Cloud", "Docker", "Kubernetes", "Terraform", "Ansible", "Jenkins",
  "CI/CD", "GitHub Actions", "GitLab CI", "Linux", "Nginx", "Serverless", "Lambda", "CloudFormation",

  // Mobile
  "iOS", "Android", "React Native", "Flutter", "SwiftUI", "Xcode",

  // Tools / practices
  "Git", "GitHub", "GitLab", "Jira", "Agile", "Scrum", "Kanban", "TDD", "Unit Testing",
  "Jest", "Cypress", "Playwright", "Selenium", "Postman", "Figma", "UX Design", "UI Design",

  // Security / Networking
  "Cybersecurity", "OAuth", "JWT", "Networking", "Penetration Testing",

  // Other roles / domains
  "Product Management", "Project Management", "Technical Writing", "Sales", "Marketing",
  "SEO", "Salesforce", "SAP", "Excel", "Power BI", "Tableau", "Blockchain", "Solidity",
  "Web3", "IoT", "Embedded Systems", "Game Development", "Unity", "Unreal Engine",
];

const NORMALIZED_TAXONOMY = SKILL_TAXONOMY.map((skill) => ({ skill, lower: skill.toLowerCase() }));

/**
 * Extracts taxonomy skills mentioned in free text via whole-word,
 * case-insensitive matching. Returns the canonical (taxonomy-cased) forms.
 */
export function extractSkillsFromText(text: string): string[] {
  const lowerText = ` ${text.toLowerCase()} `;
  const found = new Set<string>();

  for (const { skill, lower } of NORMALIZED_TAXONOMY) {
    const escaped = lower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`, "i");
    if (pattern.test(lowerText)) {
      found.add(skill);
    }
  }

  return Array.from(found);
}

/**
 * Case-insensitive comparison of a skill against a list, used to reconcile
 * taxonomy-cased job skills against however the user's resume skills were cased.
 */
export function skillsOverlap(jobSkills: string[], userSkills: string[]): { matched: string[]; missing: string[] } {
  const userLower = new Set(userSkills.map((s) => s.toLowerCase()));
  const matched: string[] = [];
  const missing: string[] = [];

  for (const skill of jobSkills) {
    if (userLower.has(skill.toLowerCase())) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  }

  return { matched, missing };
}
