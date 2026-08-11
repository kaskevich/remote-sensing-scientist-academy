import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MarkdownContent } from "../app/components/lesson-materials";

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
});
