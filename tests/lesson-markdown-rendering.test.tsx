import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MarkdownContent } from "../app/components/lesson-materials";
import { extractLessonMath, LessonMath } from "../app/components/lesson-math";

describe("lesson Markdown rendering", () => {
  it("renders professional decision tables as semantic, responsive table markup", () => {
    const markup = renderToStaticMarkup(
      <MarkdownContent>{`| Format | Best used for | Limitation |
|---|---|---|
| Notebook | Investigation | Hidden state |`}</MarkdownContent>,
    );

    expect(markup).toContain("<table>");
    expect(markup).toContain("<th>Format</th>");
    expect(markup).toContain("<td>Notebook</td>");
    expect(markup).not.toContain("|---|");
  });

  it("places lesson diagrams in a contained responsive inspection frame", () => {
    const markup = renderToStaticMarkup(
      <MarkdownContent>{`![A scientific workflow diagram](lesson-media/images/workflow.svg)`}</MarkdownContent>,
    );

    expect(markup).toContain('<figure class="lesson-visual-frame">');
    expect(markup).toContain('class="lesson-visual-scroll"');
    expect(markup).toContain("swipe horizontally");
  });

  it("renders inline and display formulas as accessible MathML", () => {
    const markup = renderToStaticMarkup(
      <MarkdownContent>{String.raw`Let the observed value be \(y_i\) and the prediction be \(\hat{y}_i\).

\[
MAE = \frac{1}{n}\sum_{i=1}^{n}|y_i-\hat{y}_i|
\]`}</MarkdownContent>,
    );

    expect(markup).toContain("lesson-math-inline");
    expect(markup).toContain("lesson-math-display");
    expect(markup).toContain("<math");
    expect(markup).toContain("<mfrac>");
    expect(markup).toContain("<msubsup>");
    expect(markup).toContain("application/x-tex");
  });

  it("does not interpret formula-like text inside fenced code", () => {
    const source = [
      "```python",
      String.raw`label = "\(not_math\)"`,
      "```",
      "",
      String.raw`\[`,
      "x_i = 4",
      String.raw`\]`,
    ].join("\n");
    const result = extractLessonMath(source);

    expect(result.expressions).toEqual([{ display: true, tex: "x_i = 4" }]);
    expect(result.markdown).toContain(String.raw`label = "\(not_math\)"`);
  });

  it("typesets every formula currently published in Module 3", () => {
    const lessonDirectory = join(process.cwd(), "content/lessons/module-3");
    const expressions = readdirSync(lessonDirectory)
      .filter((file) => file.endsWith(".md"))
      .flatMap((file) => extractLessonMath(readFileSync(join(lessonDirectory, file), "utf8")).expressions);

    expect(expressions.length).toBeGreaterThan(60);
    for (const [index, expression] of expressions.entries()) {
      const markup = renderToStaticMarkup(<LessonMath {...expression} />);
      expect(markup, `formula ${index + 1}: ${expression.tex}`).toContain("<math");
      expect(markup, `formula ${index + 1}: ${expression.tex}`).toContain("<semantics>");
    }
  });
});
