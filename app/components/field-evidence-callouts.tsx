import type { ReactNode } from "react";

export function FromFieldCallout({ children, title = "From the Field" }: { children: ReactNode; title?: string }) {
  return <aside className="from-field-callout"><strong>{title}</strong><p>{children}</p></aside>;
}

export function WhereThisGoesNext({ label, steps }: { label: string; steps: string[] }) {
  return <div className="where-next"><strong>{label}</strong><div>{steps.map((step, index) => <span key={step}>{step}{index < steps.length - 1 ? " →" : ""}</span>)}</div></div>;
}
