import { createElement, Fragment, type ReactNode } from "react";

export type LessonMathExpression = {
  display: boolean;
  tex: string;
};

type MathNode =
  | { kind: "row"; children: MathNode[] }
  | { kind: "identifier"; value: string }
  | { kind: "number"; value: string }
  | { kind: "operator"; value: string }
  | { kind: "text"; value: string }
  | { kind: "space"; width: string }
  | { kind: "fraction"; numerator: MathNode; denominator: MathNode }
  | { kind: "root"; value: MathNode }
  | { kind: "script"; base: MathNode; sub?: MathNode; sup?: MathNode }
  | { kind: "accent"; value: MathNode; mark: string }
  | { kind: "cases"; rows: Array<[MathNode, MathNode?]> };

const commandSymbols: Record<string, string> = {
  alpha: "α",
  eta: "η",
  gamma: "γ",
  lambda: "λ",
  Omega: "Ω",
  partial: "∂",
  sum: "∑",
  tau: "τ",
  times: "×",
  le: "≤",
  ge: "≥",
  mid: "∣",
  in: "∈",
  lceil: "⌈",
  rceil: "⌉",
  ldots: "…",
};

const operatorCharacters = new Set(["+", "−", "-", "=", "<", ">", "|", ",", ";", ":", "(", ")", "[", "]", "{", "}"]);

function row(children: MathNode[]): MathNode {
  return children.length === 1 ? children[0] : { kind: "row", children };
}

class LessonMathParser {
  private position = 0;

  constructor(private readonly source: string) {}

  parse(): MathNode {
    return row(this.parseRow());
  }

  private parseRow(stopAtBrace = false): MathNode[] {
    const nodes: MathNode[] = [];

    while (this.position < this.source.length) {
      if (stopAtBrace && this.source[this.position] === "}") {
        this.position += 1;
        break;
      }

      if (/\s/.test(this.source[this.position])) {
        this.position += 1;
        continue;
      }

      const base = this.parseAtom();
      if (!base) continue;

      let sub: MathNode | undefined;
      let sup: MathNode | undefined;
      while (this.source[this.position] === "_" || this.source[this.position] === "^") {
        const marker = this.source[this.position];
        this.position += 1;
        const script = this.parseScript();
        if (marker === "_") sub = script;
        if (marker === "^") sup = script;
      }

      nodes.push(sub || sup ? { kind: "script", base, sub, sup } : base);
    }

    return nodes;
  }

  private parseScript(): MathNode {
    while (/\s/.test(this.source[this.position] ?? "")) this.position += 1;
    if (this.source[this.position] === "{") {
      this.position += 1;
      return row(this.parseRow(true));
    }
    return this.parseAtom() ?? { kind: "text", value: "" };
  }

  private parseGroup(): MathNode {
    while (/\s/.test(this.source[this.position] ?? "")) this.position += 1;
    if (this.source[this.position] !== "{") return this.parseAtom() ?? { kind: "text", value: "" };
    this.position += 1;
    return row(this.parseRow(true));
  }

  private readGroupText(): string {
    while (/\s/.test(this.source[this.position] ?? "")) this.position += 1;
    if (this.source[this.position] !== "{") return "";
    this.position += 1;
    const start = this.position;
    let depth = 1;
    while (this.position < this.source.length && depth > 0) {
      if (this.source[this.position] === "{") depth += 1;
      if (this.source[this.position] === "}") depth -= 1;
      this.position += 1;
    }
    return this.source.slice(start, Math.max(start, this.position - 1));
  }

  private parseCases(): MathNode {
    const endMarker = "\\end{cases}";
    const end = this.source.indexOf(endMarker, this.position);
    const casesSource = end === -1 ? this.source.slice(this.position) : this.source.slice(this.position, end);
    this.position = end === -1 ? this.source.length : end + endMarker.length;

    const rows = casesSource
      .split(/\\\\/)
      .map((caseRow) => caseRow.trim())
      .filter(Boolean)
      .map((caseRow): [MathNode, MathNode?] => {
        const [value, condition] = caseRow.split("&", 2);
        return [new LessonMathParser(value.trim()).parse(), condition ? new LessonMathParser(condition.trim()).parse() : undefined];
      });

    return { kind: "cases", rows };
  }

  private parseCommand(): MathNode {
    this.position += 1;
    if (this.source[this.position] === " ") {
      this.position += 1;
      return { kind: "space", width: "0.45em" };
    }

    const commandStart = this.position;
    while (/[A-Za-z]/.test(this.source[this.position] ?? "")) this.position += 1;
    const command = this.source.slice(commandStart, this.position);

    if (!command) {
      const escaped = this.source[this.position] ?? "";
      this.position += 1;
      return { kind: "operator", value: escaped };
    }
    if (command === "frac") return { kind: "fraction", numerator: this.parseGroup(), denominator: this.parseGroup() };
    if (command === "sqrt") return { kind: "root", value: this.parseGroup() };
    if (command === "hat" || command === "widehat" || command === "bar") {
      return { kind: "accent", value: this.parseGroup(), mark: command === "bar" ? "¯" : "ˆ" };
    }
    if (command === "text" || command === "operatorname") {
      return { kind: command === "operatorname" ? "identifier" : "text", value: this.readGroupText().replace(/\\ /g, " ") };
    }
    if (command === "mathcal") {
      const value = this.readGroupText();
      return { kind: "identifier", value: value === "L" ? "ℒ" : value };
    }
    if (command === "begin") {
      const environment = this.readGroupText();
      if (environment === "cases") return this.parseCases();
      return { kind: "text", value: environment };
    }
    if (command === "left" || command === "right") return this.parseAtom() ?? { kind: "text", value: "" };
    if (command === "qquad") return { kind: "space", width: "2em" };
    if (command === "quad") return { kind: "space", width: "1em" };
    if (commandSymbols[command]) return { kind: "operator", value: commandSymbols[command] };

    return { kind: "identifier", value: command };
  }

  private parseAtom(): MathNode | null {
    const character = this.source[this.position];
    if (!character) return null;

    if (character === "{") {
      this.position += 1;
      return row(this.parseRow(true));
    }
    if (character === "\\") return this.parseCommand();

    if (/[0-9.]/.test(character)) {
      const start = this.position;
      while (/[0-9.]/.test(this.source[this.position] ?? "")) this.position += 1;
      return { kind: "number", value: this.source.slice(start, this.position) };
    }

    if (/[A-Za-z]/.test(character)) {
      const start = this.position;
      while (/[A-Za-z]/.test(this.source[this.position] ?? "")) this.position += 1;
      return { kind: "identifier", value: this.source.slice(start, this.position) };
    }

    this.position += 1;
    return { kind: operatorCharacters.has(character) ? "operator" : "text", value: character };
  }
}

function renderMathNode(node: MathNode, key: string): ReactNode {
  switch (node.kind) {
    case "row":
      return createElement("mrow", { key }, node.children.map((child, index) => renderMathNode(child, `${key}-${index}`)));
    case "identifier":
      return createElement("mi", { key, mathvariant: node.value.length > 1 ? "normal" : undefined }, node.value);
    case "number":
      return createElement("mn", { key }, node.value);
    case "operator":
      return createElement("mo", { key }, node.value === "-" ? "−" : node.value);
    case "text":
      return createElement("mtext", { key }, node.value);
    case "space":
      return createElement("mspace", { key, width: node.width });
    case "fraction":
      return createElement("mfrac", { key }, renderMathNode(node.numerator, `${key}-n`), renderMathNode(node.denominator, `${key}-d`));
    case "root":
      return createElement("msqrt", { key }, renderMathNode(node.value, `${key}-root`));
    case "script": {
      const base = renderMathNode(node.base, `${key}-base`);
      if (node.sub && node.sup) {
        return createElement("msubsup", { key }, base, renderMathNode(node.sub, `${key}-sub`), renderMathNode(node.sup, `${key}-sup`));
      }
      if (node.sub) return createElement("msub", { key }, base, renderMathNode(node.sub, `${key}-sub`));
      return createElement("msup", { key }, base, renderMathNode(node.sup!, `${key}-sup`));
    }
    case "accent":
      return createElement(
        "mover",
        { key, accent: "true" },
        renderMathNode(node.value, `${key}-value`),
        createElement("mo", { key: `${key}-mark`, stretchy: "true" }, node.mark),
      );
    case "cases":
      return createElement(
        "mrow",
        { key },
        createElement("mo", { key: `${key}-brace`, stretchy: "true" }, "{"),
        createElement(
          "mtable",
          { key: `${key}-table`, columnalign: "left left", columnspacing: "1em", rowspacing: "0.35em" },
          node.rows.map(([value, condition], index) => createElement(
            "mtr",
            { key: `${key}-row-${index}` },
            createElement("mtd", { key: `${key}-value-${index}` }, renderMathNode(value, `${key}-value-node-${index}`)),
            condition ? createElement("mtd", { key: `${key}-condition-${index}` }, renderMathNode(condition, `${key}-condition-node-${index}`)) : null,
          )),
        ),
      );
  }
}

function accessibleMathLabel(tex: string) {
  return tex
    .replace(/\\frac/g, " fraction ")
    .replace(/\\sqrt/g, " square root ")
    .replace(/\\sum/g, " sum ")
    .replace(/\\times/g, " times ")
    .replace(/\\le/g, " less than or equal to ")
    .replace(/\\ge/g, " greater than or equal to ")
    .replace(/\\mid/g, " given ")
    .replace(/\\(text|operatorname|mathcal|hat|widehat|bar|left|right|qquad|quad)/g, " ")
    .replace(/[{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function LessonMath({ tex, display }: LessonMathExpression) {
  const parsed = new LessonMathParser(tex).parse();
  return (
    <span className={display ? "lesson-math lesson-math-display" : "lesson-math lesson-math-inline"}>
      {createElement(
        "math",
        {
          xmlns: "http://www.w3.org/1998/Math/MathML",
          display: display ? "block" : "inline",
          "aria-label": accessibleMathLabel(tex),
        },
        createElement(
          "semantics",
          null,
          renderMathNode(parsed, "expression"),
          createElement("annotation", { encoding: "application/x-tex" }, tex),
        ),
      )}
    </span>
  );
}

export function extractLessonMath(markdown: string) {
  const expressions: LessonMathExpression[] = [];
  const segments = markdown.split(/(```[\s\S]*?```)/g);

  const normalized = segments.map((segment, segmentIndex) => {
    if (segmentIndex % 2 === 1) return segment;

    const withBlocks = segment.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (_match, tex: string) => {
      const index = expressions.push({ display: true, tex: tex.trim() }) - 1;
      return `\n\n%%lesson-math-block-${index}%%\n\n`;
    });

    return withBlocks.replace(/\\\(([\s\S]*?)\\\)/g, (_match, tex: string) => {
      const index = expressions.push({ display: false, tex: tex.trim() }) - 1;
      return `%%lesson-math-inline-${index}%%`;
    });
  }).join("");

  return { markdown: normalized, expressions };
}

export function renderInlineLessonMath(children: ReactNode, expressions: LessonMathExpression[], keyPrefix = "inline"): ReactNode {
  if (Array.isArray(children)) {
    return children.map((child, index) => (
      <Fragment key={`${keyPrefix}-${index}`}>{renderInlineLessonMath(child, expressions, `${keyPrefix}-${index}`)}</Fragment>
    ));
  }
  if (typeof children !== "string") return children;

  const tokenPattern = /%%lesson-math-inline-(\d+)%%/g;
  const output: ReactNode[] = [];
  let cursor = 0;
  for (const match of children.matchAll(tokenPattern)) {
    const start = match.index ?? 0;
    if (start > cursor) output.push(children.slice(cursor, start));
    const expression = expressions[Number(match[1])];
    if (expression) output.push(<LessonMath key={`${keyPrefix}-math-${match[1]}`} {...expression} />);
    cursor = start + match[0].length;
  }
  if (cursor < children.length) output.push(children.slice(cursor));

  return output.length > 0 ? output : children;
}
