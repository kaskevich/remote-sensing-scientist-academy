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
