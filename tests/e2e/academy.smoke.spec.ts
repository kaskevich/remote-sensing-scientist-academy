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

  const firstLesson = page.locator("#lesson-01");
  const completion = firstLesson.getByRole("checkbox");
  const notes = page.locator("#lesson-01-notes");
  const noteText = "Compare Sentinel-2 atmospheric correction methods.";

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
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        const request = indexedDB.deleteDatabase("rs-academy-task-results-v1");
        request.onsuccess = () => resolve();
        request.onerror = () => resolve();
        request.onblocked = () => resolve();
      }),
  );
  await page.reload();

  const taskText = page.locator("#lesson-01-result-text");
  const resultText = "Recovery is strongest on north-facing slopes; cloud cover adds uncertainty.";
  await taskText.fill(resultText);

  const fileInput = page.locator("#lesson-01-result-files");
  await fileInput.setInputFiles([
    {
      name: "recovery.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2nQAAAABJRU5ErkJggg==",
        "base64",
      ),
    },
    {
      name: "recovery.geojson",
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
  ]);

  await expect(page.getByText("recovery.png", { exact: true })).toBeVisible();
  await expect(page.getByText("recovery.geojson", { exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: "Uploaded map: recovery.geojson" })).toBeVisible();

  await page.reload();

  await expect(taskText).toHaveValue(resultText);
  await expect(page.getByText("recovery.png", { exact: true })).toBeVisible();
  await expect(page.getByText("recovery.geojson", { exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: "Uploaded map: recovery.geojson" })).toBeVisible();
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
