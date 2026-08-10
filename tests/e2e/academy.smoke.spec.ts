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
  await page.evaluate((storageKey) => window.localStorage.removeItem(storageKey), LEARNER_PROGRESS_STORAGE_KEY);
  await page.reload();

  const curriculumModule = page.locator("details.curriculum-module").first();
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
  await expect(curriculumModule.getByText("Show lessons", { exact: true })).toBeVisible();

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

  const module1Overview = page.locator(".module-overview-lime");
  await expect(module1Overview.getByRole("heading", { name: "Thinking Like a Scientific Programmer", exact: true })).toBeVisible();
  await expect(module1Overview.locator(".module-syllabus li")).toHaveCount(12);
  await expect(module1Overview.locator(".syllabus-available")).toHaveCount(12);
  await expect(module1Overview.locator(".syllabus-planned")).toHaveCount(0);
  await expect(module1Overview.locator(".syllabus-number").first()).toHaveText("1.1");
  await expect(module1Overview.locator(".syllabus-number").nth(11)).toHaveText("1.12");
  await module1Overview.locator(".module-chapter").nth(1).locator("summary").click();
  await expect(module1Overview.locator(".module-syllabus").getByText("Conditions and Data-Quality Rules", { exact: true })).toBeVisible();
  await expect(page.locator("#lesson-04")).toHaveCount(1);
  await expect(page.locator("#lesson-12")).toHaveCount(1);

  const firstLesson = page.locator("#lesson-01");
  await expect(firstLesson.locator(".module-index")).toHaveText("1.1");
  await expect(firstLesson.locator(".module-lesson-label")).toHaveText("Lesson 1.1");
  await expect(firstLesson.getByText("Lesson 1.1 of 12", { exact: true })).toBeVisible();
  const starter = firstLesson.getByRole("link", { name: /Download the Vegetation Data Explorer starter notebook/i });
  await expect(starter).toHaveAttribute("download", "");
  await expect(starter).toHaveAttribute("href", /Vegetation_Data_Explorer_Starter\.ipynb$/);

  const firstCheck = firstLesson.locator(".formative-check").first();
  const completion = firstLesson.getByRole("checkbox");
  await expect(completion).not.toBeChecked();

  const incorrectOption = firstCheck.getByLabel("A code cell");
  const checkAnswer = firstCheck.getByRole("button", { name: "Check answer" });
  await incorrectOption.check();
  await expect(incorrectOption).toBeChecked();
  await expect(checkAnswer).toBeEnabled();
  await checkAnswer.click();
  await expect(firstCheck.getByText("Not quite", { exact: true })).toBeVisible();
  await expect(firstCheck.getByText(/Markdown cells hold narrative/)).toBeVisible();
  await expect(completion).not.toBeChecked();

  await firstCheck.getByRole("button", { name: "Try again" }).click();
  const correctOption = firstCheck.getByLabel("A Markdown cell");
  await correctOption.check();
  await expect(correctOption).toBeChecked();
  await expect(checkAnswer).toBeEnabled();
  await checkAnswer.click();
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

test("Module 2 exposes the complete reviewed vector sequence and planned pathway", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/#curriculum");
  await page.evaluate((storageKey) => window.localStorage.removeItem(storageKey), LEARNER_PROGRESS_STORAGE_KEY);
  await page.reload();

  const overview = page.locator(".module-overview-blue");
  await expect(overview.getByRole("heading", { name: "Geospatial Data Science", exact: true })).toBeVisible();
  await expect(overview.locator(".module-chapter")).toHaveCount(13);
  await expect(overview.locator(".module-syllabus li")).toHaveCount(50);
  await expect(overview.locator(".syllabus-available")).toHaveCount(12);
  await expect(overview.locator(".syllabus-planned")).toHaveCount(40);
  await expect(overview.locator(".module-syllabus li .syllabus-number").first()).toHaveText("2.1");
  await expect(overview.locator(".module-syllabus li .syllabus-number").nth(48)).toHaveText("2.49");
  await expect(overview.getByRole("link", { name: "What Makes Data Geospatial?", exact: true })).toHaveAttribute("href", "#lesson-2-01");
  await expect(overview.getByText("GeoPandas and Spatial Tables", { exact: true })).toBeHidden();
  await overview.locator(".module-chapter").nth(1).locator("summary").click();
  await expect(overview.getByText("GeoPandas and Spatial Tables", { exact: true })).toBeVisible();
  await expect(overview.getByRole("link", { name: "GeoPandas and Spatial Tables", exact: true })).toHaveAttribute("href", "#lesson-2-05");
  await expect(overview.getByRole("link", { name: "Geometry with Shapely", exact: true })).toHaveAttribute("href", "#lesson-2-06");
  await expect(overview.getByRole("link", { name: "Spatial Joins, Overlay and Nearest Neighbours", exact: true })).toHaveAttribute("href", "#lesson-2-07");
  await expect(overview.getByRole("link", { name: "Spatial Indexing and Performance", exact: true })).toHaveAttribute("href", "#lesson-2-08");
  await expect(overview.getByRole("link", { name: "Topology, Geometry Cleaning and Data Integrity", exact: true })).toHaveAttribute("href", "#lesson-2-09");
  await expect(overview.getByRole("link", { name: "QGIS for Professional Spatial QA", exact: true })).toHaveAttribute("href", "#lesson-2-10");
  await expect(overview.getByRole("link", { name: "Accept, Review or Reject?", exact: true })).toHaveAttribute("href", "#module-2-chapter-1-practicum");
  await expect(overview.getByRole("link", { name: "Vector Handover Review", exact: true })).toHaveAttribute("href", "#module-2-chapter-2-practicum");
  await expect(overview.getByText("0/5 complete", { exact: true })).toBeVisible();
  await expect(overview.getByRole("link", { name: "Raster Fundamentals", exact: true })).toHaveCount(0);
  await expect(overview.getByText("Workflow Automation and CI", { exact: true })).toBeHidden();
  await overview.locator(".module-chapter").nth(11).locator("summary").click();
  await expect(overview.getByText("Workflow Automation and CI", { exact: true })).toBeVisible();

  const moduleNavigation = page.locator("details.curriculum-module").nth(1);
  await expect(moduleNavigation).not.toHaveAttribute("open", "");
  await moduleNavigation.locator(":scope > summary").click();
  await expect(moduleNavigation).toHaveAttribute("open", "");
  await expect(moduleNavigation.getByText("10 lessons · 2 practica available", { exact: true })).toBeVisible();
  await expect(moduleNavigation.locator("details.module")).toHaveCount(12);
  await expect(page.locator("#lesson-2-05")).toHaveCount(1);
  await expect(page.locator("#lesson-2-10")).toHaveCount(1);
  await expect(page.locator("#lesson-2-11")).toHaveCount(0);

  const firstLesson = page.locator("#lesson-2-01");
  await firstLesson.locator(":scope > summary").click();
  await expect(firstLesson.locator(".module-index")).toHaveText("2.1");
  await expect(firstLesson.locator(".module-lesson-label")).toHaveText("Lesson 2.1");
  await expect(firstLesson.getByText("Lesson 2.1 of 49", { exact: true })).toBeVisible();
  await expect(firstLesson.getByRole("heading", { name: "Learning outcome", exact: true })).toBeVisible();
  await expect(firstLesson.getByText(/What evidence connects every observation/)).toBeVisible();
  await expect(firstLesson.getByText("spatial_data_inventory.ipynb", { exact: true }).first()).toBeVisible();
  await expect(firstLesson.getByRole("img", { name: /Diagram comparing an ordinary table/i })).toBeVisible();
  await expect(firstLesson.getByText("Concept", { exact: true })).toBeVisible();
  await firstLesson.getByRole("checkbox").check();
  await expect(overview.getByText("1/5 complete", { exact: true })).toBeVisible();

  const vectorLesson = page.locator("#lesson-2-05");
  await vectorLesson.locator(":scope > summary").click();
  await expect(vectorLesson.getByText("Lesson 2.5 of 49", { exact: true })).toBeVisible();
  await expect(vectorLesson.getByRole("img", { name: /Diagram showing a GeoDataFrame/i })).toBeVisible();
  await expect(vectorLesson.locator(".formative-check")).toHaveCount(3);
  await expect(vectorLesson.getByRole("link", { name: "Download synthetic training field plots" })).toHaveAttribute("href", /training_field_plots\.geojson$/);

  const performanceLesson = page.locator("#lesson-2-08");
  await performanceLesson.locator(":scope > summary").click();
  await expect(performanceLesson.getByText("Lesson 2.8 of 49", { exact: true })).toBeVisible();
  await expect(performanceLesson.getByRole("img", { name: /two-stage spatial-index query/i })).toBeVisible();
  await expect(performanceLesson.locator(".formative-check")).toHaveCount(3);

  const topologyLesson = page.locator("#lesson-2-09");
  await topologyLesson.locator(":scope > summary").click();
  await expect(topologyLesson.getByRole("link", { name: "Download the explicitly corrupted topology training derivative" })).toHaveAttribute("href", /training_topology_corrupted\.geojson$/);

  const qgisLesson = page.locator("#lesson-2-10");
  await qgisLesson.locator(":scope > summary").click();
  await expect(qgisLesson.getByRole("link", { name: "Download the QGIS vector QA checklist" })).toHaveAttribute("href", /QGIS_Vector_QA_Checklist\.md$/);
  await expect(qgisLesson.getByRole("link", { name: "Download the structured QGIS observation log" })).toHaveAttribute("href", /qgis_qa_observations\.csv$/);

  const chapterOnePracticum = page.locator("#module-2-chapter-1-practicum");
  await chapterOnePracticum.locator(":scope > summary").click();
  await expect(chapterOnePracticum.locator(".module-lesson-label")).toHaveText("Chapter practicum");
  await expect(chapterOnePracticum.getByText("DATA_ACCEPTANCE_DECISION.md", { exact: true }).first()).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
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
