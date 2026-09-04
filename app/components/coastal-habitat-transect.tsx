import { useId } from "react";
import { habitatCodes, habitatDefinitions, type HabitatCode, type HabitatEvidence } from "@/lib/species-atlas";

export function CoastalHabitatTransect({
  highlighted = [],
  compact = false,
  evidence,
}: {
  highlighted?: HabitatCode[];
  compact?: boolean;
  evidence?: Partial<Record<HabitatCode, HabitatEvidence>>;
}) {
  const active = new Set(highlighted);
  const patternId = `transect-hatch-${useId().replaceAll(":", "")}`;
  const label = highlighted.length
    ? `Coastal meadow gradient; recorded habitats: ${highlighted.map((code) => `${code}, ${habitatDefinitions[code].name}, ${evidence?.[code]?.occupiedPlots ?? 0} of ${evidence?.[code]?.totalPlots ?? 30} plots`).join("; ")}`
    : "Coastal meadow gradient with no occurrence in the sampled plots";

  return (
    <div className={`coastal-transect-frame${compact ? " is-compact" : ""}`}>
      <svg
        className={`coastal-transect${compact ? " coastal-transect-compact" : ""}`}
        viewBox="0 0 1000 270"
        role="img"
        aria-label={label}
      >
      <defs>
        <pattern id={patternId} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeWidth="3" />
        </pattern>
      </defs>
      <path className="transect-sea" d="M0 145 C60 132 105 158 170 143 L170 270 L0 270 Z" />
      <path className="transect-land" d="M150 155 C280 153 330 145 420 137 C520 126 606 114 690 95 C785 76 865 66 1000 58 L1000 270 L150 270 Z" />
      <path className="transect-ground-line" d="M150 155 C280 153 330 145 420 137 C520 126 606 114 690 95 C785 76 865 66 1000 58" />
      {!compact && <>
        <text x="32" y="118" className="transect-context">SEA</text>
        <text x="920" y="36" className="transect-context">INLAND</text>
        <path className="transect-wave" d="M20 164 q22 -13 44 0 t44 0 t44 0" />
        <path className="transect-vegetation transect-vegetation-low" d="M260 151 v-22 m18 20 v-30 m21 27 v-19 M452 132 v-34 m24 31 v-46 m24 42 v-31" />
        <path className="transect-vegetation transect-vegetation-high" d="M675 98 v-64 m24 58 v-73 m24 68 v-49 M842 69 v-61 m26 57 v-56 m28 53 v-44" />
      </>}
      {habitatCodes.map((code, index) => {
        const x = 170 + index * 205;
        const isActive = active.has(code);
        const value = evidence?.[code];
        const frequencyClass = value ? ` frequency-${Math.min(4, Math.ceil(value.occurrenceFrequency * 4))}` : "";
        return (
          <g key={code} className={`transect-band${isActive ? " is-active" : ""}${frequencyClass}`}>
            <rect x={x} y="168" width="185" height={compact ? 58 : 72} rx="3" />
            {isActive && <rect className="transect-hatch" x={x + 3} y="171" width="179" height={compact ? 52 : 66} rx="2" fill={`url(#${patternId})`} />}
            <text x={x + 14} y={compact ? 192 : 195} className="transect-code">{code}{value ? ` ${Math.round(value.occurrenceFrequency * 100)}%` : ""}</text>
            {!compact && <text x={x + 14} y="220" className="transect-name">{habitatDefinitions[code].name}</text>}
            <title>{value ? `${code}: ${value.occupiedPlots} / ${value.totalPlots} plots · ${Math.round(value.occurrenceFrequency * 100)}% occurrence` : `${code}: no study evidence available`}</title>
          </g>
        );
      })}
      {!compact && <text x="170" y="258" className="transect-note">community bands form a gradient · boundaries are not rigid</text>}
      </svg>
    </div>
  );
}
