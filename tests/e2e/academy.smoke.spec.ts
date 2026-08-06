import { expect, test } from "@playwright/test";
import { LEARNER_PROGRESS_STORAGE_KEY } from "../../lib/learner-progress";

const viewports = [
  { name: "small mobile", width: 320, height: 568 },
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

test("lesson completion and notes persist after refresh", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.evaluate((storageKey) => window.localStorage.removeItem(storageKey), LEARNER_PROGRESS_STORAGE_KEY);
  await page.reload();

  await expect(page).toHaveTitle(/Remote Sensing Scientist Academy/);
  await expect(page.locator(".academy-account-panel")).toBeVisible();

  const firstLesson = page.locator("#lesson-01");
  const completion = firstLesson.getByRole("checkbox");
  const notes = page.locator("#lesson-01-notes");
  const noteText = "Explain why notebook execution is not scientific interpretation.";

  await completion.check();
  await notes.fill(noteText);

  await expect
    .poll(() =>
      page.evaluate(
        ({ storageKey, lessonId }) => {
          const stored = window.localStorage.getItem(storageKey);
          if (!stored) return null;
          return JSON.parse(stored).lessonNotes[lessonId] as string | undefined;
        },
        { storageKey: LEARNER_PROGRESS_STORAGE_KEY, lessonId: "lesson-01" },
      ),
    )
    .toBe(noteText);

  await page.reload();

  await expect(completion).toBeChecked();
  await expect(notes).toHaveValue(noteText);
  await expect(firstLesson.getByText("Private learner notes", { exact: false })).toBeVisible();

  const mobileMenu = page.locator("details.mobile-menu");
  await mobileMenu.locator("summary").click();
  await expect(mobileMenu).toHaveAttribute("open", "");
  await expect(mobileMenu.getByRole("link", { name: "Curriculum" })).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test("module and lesson disclosures provide compact curriculum navigation", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/#curriculum");

  const curriculumModule = page.locator("details.curriculum-module");
  const moduleSummary = curriculumModule.locator(":scope > summary");
  const firstLesson = page.locator("#lesson-01");
  const secondLesson = page.locator("#lesson-02");

  await expect(curriculumModule).toHaveAttribute("open", "");
  await expect(firstLesson).toHaveAttribute("open", "");
  await expect(secondLesson).not.toHaveAttribute("open", "");
  await expect(firstLesson.getByRole("heading", { name: /Learning outcome/i })).toBeVisible();

  await secondLesson.locator(":scope > summary").click();
  await expect(secondLesson).toHaveAttribute("open", "");
  await expect(firstLesson).not.toHaveAttribute("open", "");
  await expect(secondLesson.getByRole("heading", { name: /Learning outcome/i })).toBeVisible();
  await expect(firstLesson.getByRole("heading", { name: /Learning outcome/i })).toBeHidden();

  await moduleSummary.click();
  await expect(curriculumModule).not.toHaveAttribute("open", "");
  await expect(page.getByText("Show lessons", { exact: true })).toBeVisible();

  await moduleSummary.click();
  await expect(curriculumModule).toHaveAttribute("open", "");
  await expect(secondLesson).toHaveAttribute("open", "");

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test("module map, starter notebook, and formative checks support beginner navigation", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/#curriculum");
  await page.evaluate((storageKey) => window.localStorage.removeItem(storageKey), LEARNER_PROGRESS_STORAGE_KEY);
  await page.reload();

  await expect(page.locator(".module-overview-panel").getByRole("heading", { name: "Thinking Like a Scientific Programmer", exact: true })).toBeVisible();
  await expect(page.locator(".module-syllabus li")).toHaveCount(12);
  await expect(page.locator(".syllabus-available")).toHaveCount(12);
  await expect(page.locator(".syllabus-planned")).toHaveCount(0);
  await expect(page.locator(".module-syllabus").getByText("Conditions and Data-Quality Rules", { exact: true })).toBeVisible();
  await expect(page.locator("#lesson-04")).toHaveCount(1);
  await expect(page.locator("#lesson-12")).toHaveCount(1);

  const firstLesson = page.locator("#lesson-01");
  const starter = firstLesson.getByRole("link", { name: /Download the Vegetation Data Explorer starter notebook/i });
  await expect(starter).toHaveAttribute("download", "");
  await expect(starter).toHaveAttribute("href", /Vegetation_Data_Explorer_Starter\.ipynb$/);

  const firstCheck = firstLesson.locator(".formative-check").first();
  const completion = firstLesson.getByRole("checkbox");
  await expect(completion).not.toBeChecked();

  await firstCheck.getByLabel("A code cell").focus();
  await page.keyboard.press("Space");
  await firstCheck.getByRole("button", { name: "Check answer" }).click();
  await expect(firstCheck.getByText("Not quite", { exact: true })).toBeVisible();
  await expect(firstCheck.getByText(/Markdown cells hold narrative/)).toBeVisible();
  await expect(completion).not.toBeChecked();

  await firstCheck.getByRole("button", { name: "Try again" }).click();
  await firstCheck.getByLabel("A Markdown cell").focus();
  await page.keyboard.press("Space");
  await firstCheck.getByRole("button", { name: "Check answer" }).click();
  await expect(firstCheck.getByText("Correct", { exact: true })).toBeVisible();
  await expect(firstLesson.getByText("1 of 3 checks completed", { exact: true })).toBeVisible();
  await expect(completion).not.toBeChecked();

  const controlHeights = await firstLesson.locator(":scope > summary, .formative-check button, .lesson-resource-list a").evaluateAll((elements) =>
    elements.filter((element) => {
      const style = window.getComputedStyle(element);
      return style.display !== "none" && style.visibility !== "hidden";
    }).map((element) => element.getBoundingClientRect().height),
  );
  expect(controlHeights.every((height) => height >= 42)).toBe(true);
});

test("task text, imagery, and GeoJSON persist and render", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  const firstLesson = page.locator("#lesson-01");
  const taskText = page.locator("#lesson-01-result-text");
  const resultText = "The output confirms that Python ran the instruction; it is not yet ecological evidence.";
  await taskText.fill(resultText);

  const fileInput = page.locator("#lesson-01-result-files");
  await fileInput.setInputFiles([
    {
      name: "sals1-notebook.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2nQAAAABJRU5ErkJggg==",
        "base64",
      ),
    },
    {
      name: "saardu-boundary.geojson",
      mimeType: "application/geo+json",
      buffer: Buffer.from(
        JSON.stringify({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Polygon",
                coordinates: [[[24, 59], [25, 59], [25, 60], [24, 60], [24, 59]]],
              },
            },
          ],
        }),
      ),
    },
    {
      name: "plot-summary.csv",
      mimeType: "text/csv",
      buffer: Buffer.from("plot_id,species_richness\nSALS1,7\n"),
    },
  ]);

  await expect(page.getByText("sals1-notebook.png", { exact: true })).toBeVisible();
  await expect(page.getByText("saardu-boundary.geojson", { exact: true })).toBeVisible();
  await expect(page.getByText("plot-summary.csv", { exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: "Uploaded map: saardu-boundary.geojson" })).toBeVisible();
  await expect(firstLesson.getByText("Learner submission · browser prototype", { exact: true })).toBeVisible();
  await expect(firstLesson.getByText("Private learner–instructor conversation", { exact: true })).toBeVisible();
  await expect(firstLesson.getByText("Instructor feedback", { exact: true })).toBeVisible();
  await expect(firstLesson.getByText("Shared lesson discussion", { exact: true })).toBeVisible();

  await expect
    .poll(() =>
      page.evaluate(
        () =>
          new Promise<string | null>((resolve) => {
            const request = indexedDB.open("rs-academy-task-results-v1", 1);
            request.onerror = () => resolve(null);
            request.onsuccess = () => {
              const database = request.result;
              const transaction = database.transaction("task-results", "readonly");
              const recordRequest = transaction.objectStore("task-results").get("lesson-01");
              recordRequest.onerror = () => resolve(null);
              recordRequest.onsuccess = () => resolve(recordRequest.result?.text ?? null);
            };
          }),
      ),
    )
    .toBe(resultText);

  await page.reload();

  await expect(taskText).toHaveValue(resultText);
  await expect(page.getByText("sals1-notebook.png", { exact: true })).toBeVisible();
  await expect(page.getByText("saardu-boundary.geojson", { exact: true })).toBeVisible();
  await expect(page.getByText("plot-summary.csv", { exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: "Uploaded map: saardu-boundary.geojson" })).toBeVisible();
});

for (const viewport of viewports) {
  test(`${viewport.name}: public and admin pages have no horizontal overflow`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    for (const path of ["/", "/admin/"]) {
      await page.goto(path);
      await expect(page.locator("body")).toBeVisible();

      const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));

      expect(dimensions.scrollWidth, `${path} overflowed at ${viewport.width}px`).toBeLessThanOrEqual(
        dimensions.clientWidth,
      );
    }
  });
}
