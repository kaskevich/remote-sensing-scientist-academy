import { readFileSync } from "node:fs";

const files = [
  "app/field-labs/page.tsx",
  "app/field-labs/uav-coastal-wetlands/page.tsx",
  "app/field-labs/uav-coastal-wetlands/drone-lab/page.tsx",
  "app/components/uav-field-lab-explorer.tsx",
  "app/components/uav-field-lab-tutorial.tsx",
  "app/components/uav-field-lab-interactions.tsx",
  "app/components/uav-drone-lab.tsx",
  "lib/uav-field-lab.ts",
  "public/field-labs/uav-coastal-wetlands/ebee-postflight-checklist.md",
  "public/field-labs/uav-coastal-wetlands/complete-mission-checklist.md",
  "public/field-labs/uav-coastal-wetlands/examples/provenance.json",
  "docs/field-labs/uav-field-lab-07-publication-audit.md",
];

const forbidden = [
  { label: "local user path", pattern: /(?:\/Users\/|C:\\Users\\)/i },
  { label: "credential label", pattern: /\b(?:user(?:name)?|password)\s*:\s*\S+/i },
  { label: "embedded email address", pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i },
  { label: "URL credential/query token", pattern: /https?:\/\/[^\s]*(?:access_token|api_key|password|secret)=/i },
  { label: "private URL", pattern: /https?:\/\/(?:localhost|127\.0\.0\.1|[^\s/]*\.local)(?:[/:]|\b)/i },
];

const failures = [];
for (const file of files) {
  const text = readFileSync(file, "utf8");
  for (const rule of forbidden) {
    if (rule.pattern.test(text)) failures.push(`${file}: ${rule.label}`);
  }
}

if (failures.length) {
  console.error(`UAV publication security scan failed:\n${failures.join("\n")}`);
  process.exit(1);
}

console.log(`UAV publication security scan passed for ${files.length} public-release files.`);
