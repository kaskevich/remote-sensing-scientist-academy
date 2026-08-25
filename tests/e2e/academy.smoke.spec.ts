import { expect, test } from "@playwright/test";
import { LEARNER_PROGRESS_STORAGE_KEY } from "../../lib/learner-progress";
import { lessonCodeStorageKey } from "../../lib/lesson-code-workspace";

const lesson1 = "/module-1/start-with-python/scientific-programming/";
const lesson2 = "/module-1/start-with-python/variables-and-scientific-data/";
const lesson2Spatial = "/module-2/spatial-foundations/what-makes-data-geospatial/";
const lesson2Uav = "/module-2/uav-and-photogrammetry/uav-remote-sensing-fundamentals/";
const lesson3 = "/module-3/frame-the-prediction-problem/prediction-inference-and-explanation/";
const regressionEvaluation = "/module-3/evaluate-diagnose-and-understand/regression-evaluation/";

const routeMatrix = [
  "/",
  "/about/",
  "/curriculum/",
  "/module-1/",
  "/module-2/",
  "/module-3/",
  lesson1,
  lesson2Spatial,
  lesson3,
];

test("canonical lesson progress and notes persist by stable lesson ID", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(lesson1);
  await page.evaluate((storageKey) => window.localStorage.removeItem(storageKey), LEARNER_PROGRESS_STORAGE_KEY);
  await page.reload();

  await expect(page.getByRole("heading", { level: 1, name: "Welcome to Scientific Programming" })).toBeVisible();
  const lesson = page.locator("#lesson-01");
  const completion = lesson.getByRole("checkbox", { name: /Mark lesson complete|Lesson completed/ });
  const notes = page.locator("#lesson-01-notes");
  const noteText = "Execution evidence is not yet scientific interpretation.";

  await completion.check();
  await notes.fill(noteText);
  await expect.poll(() => page.evaluate((storageKey) => {
    const stored = window.localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : null;
  }, LEARNER_PROGRESS_STORAGE_KEY)).toMatchObject({
    completedLessonIds: ["lesson-01"],
    lessonNotes: { "lesson-01": noteText },
  });

  await page.reload();
  await expect(completion).toBeChecked();
  await expect(notes).toHaveValue(noteText);

  const mobileMenu = page.locator("details.mobile-menu");
  await mobileMenu.locator("summary").click();
  await expect(mobileMenu.getByRole("link", { name: "Curriculum" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
});

test("direct lesson pages expose complete content and real sequence links", async ({ page }) => {
  await page.goto(lesson1);
  const lesson = page.locator("#lesson-01");
  await expect(lesson.getByRole("heading", { name: "Learning outcome", exact: false })).toBeVisible();
  await expect(lesson.getByRole("heading", { name: "Close the notes — 3-minute recall" })).toBeVisible();
  await expect(lesson.getByRole("img", { name: /real coastal meadow beside Pärnu Bay/i })).toBeVisible();
  const programmingCycle = lesson.getByRole("img", { name: /cycle separates scientist-controlled questions/i });
  await expect(programmingCycle).toHaveCount(1);
  await expect(programmingCycle).toHaveAttribute("src", /scientific-programming-cycle\.svg$/);
  await expect(lesson.getByRole("link", { name: /Vegetation Data Explorer starter notebook/i })).toHaveAttribute("href", /Vegetation_Data_Explorer_Starter\.ipynb$/);
  await expect(page.locator(".platform-progression").getByRole("link", { name: /Variables and Scientific Data/ })).toHaveAttribute("href", lesson2);
  await expect(page.getByRole("link", { name: "Chapter overview", exact: true })).toHaveAttribute("href", "/module-1/start-with-python/");
});

test("long lesson contents remain readable and contained", async ({ page }) => {
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(regressionEvaluation);

    const workspace = page.locator(".lesson-platform-workspace");
    const contents = page.locator(".lesson-table-of-contents");
    await expect(contents.locator("li")).toHaveCount(19);
    await expect(page.locator("#lesson-3-17 > summary")).toBeHidden();

    const layout = await contents.evaluate((element) => {
      const list = element.querySelector("ol");
      const items = [...element.querySelectorAll("li")];
      const bounds = element.getBoundingClientRect();
      return {
        columns: list ? getComputedStyle(list).gridTemplateColumns.trim().split(/\s+/).length : 0,
        contained: items.every((item) => {
          const itemBounds = item.getBoundingClientRect();
          return itemBounds.left >= bounds.left && itemBounds.right <= bounds.right + 1;
        }),
      };
    });

    expect(layout.columns).toBe(1);
    expect(layout.contained).toBe(true);
    expect(await workspace.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe("rgb(11, 25, 48)");
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
  }
});

test("a fresh browser can read a direct lesson without JavaScript disclosure", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(lesson2Spatial);
  await expect(page.getByRole("heading", { level: 1, name: "What Makes Data Geospatial?" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Learning outcome", exact: false })).toBeVisible();
  await expect(page.getByText(/location, geometry, grid structure and spatial reference/i).first()).toBeVisible();
  await context.close();
});

test("lesson code can be edited, run, and restored on a canonical route", async ({ page }) => {
  await page.route("**/pyodide.js", async (route) => {
    await route.fulfill({
      contentType: "application/javascript",
      body: `window.loadPyodide = async () => {
        let stdout = () => {};
        return {
          loadPackagesFromImports: async () => {},
          setStdout: ({ batched }) => { stdout = batched; },
          setStderr: () => {},
          runPythonAsync: async () => { stdout("raw RGB frame: direct image record"); },
        };
      };`,
    });
  });
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto(lesson2Uav);
  await page.evaluate((storageKey) => window.localStorage.removeItem(storageKey), lessonCodeStorageKey("lesson-2-18"));
  await page.reload();

  const lesson = page.locator("#lesson-2-18");
  const editor = lesson.getByLabel("Python code");
  await expect(editor).toHaveValue(/"raw RGB frame": "direct image record"/);
  await editor.fill('print("Baltic meadow observation chain")');
  await expect(lesson.getByText("Draft saved in this browser", { exact: true })).toBeVisible();
  await page.reload();
  await expect(editor).toHaveValue('print("Baltic meadow observation chain")');
  await lesson.getByRole("button", { name: "Run Python" }).click();
  await expect(lesson.locator(".lesson-code-output")).toContainText("raw RGB frame: direct image record");
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
});

test("submission text, imagery, and GeoJSON persist on a canonical lesson page", async ({ page }) => {
  await page.goto(lesson1);
  const taskText = page.locator("#lesson-01-result-text");
  const resultText = "The output confirms execution, not ecological validity.";
  await taskText.fill(resultText);
  await page.locator("#lesson-01-result-files").setInputFiles([
    {
      name: "sals1-notebook.png",
      mimeType: "image/png",
      buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2nQAAAABJRU5ErkJggg==", "base64"),
    },
    {
      name: "saardu-boundary.geojson",
      mimeType: "application/geo+json",
      buffer: Buffer.from(JSON.stringify({
        type: "FeatureCollection",
        features: [{
          type: "Feature",
          properties: {},
          geometry: { type: "Polygon", coordinates: [[[24, 59], [25, 59], [25, 60], [24, 60], [24, 59]]] },
        }],
      })),
    },
  ]);
  await expect(page.getByText("sals1-notebook.png", { exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: "Uploaded map: saardu-boundary.geojson" })).toBeVisible();
  await page.reload();
  await expect(taskText).toHaveValue(resultText);
  await expect(page.getByText("sals1-notebook.png", { exact: true })).toBeVisible();
});

test("curriculum links every module, chapter, lesson, practicum, and capstone", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/curriculum/");
  await expect(page.getByRole("heading", { level: 1, name: "Curriculum and learning path" })).toBeVisible();
  await expect(page.locator(".platform-module-card")).toHaveCount(3);
  await expect(page.getByRole("link", { name: "Thinking Like a Scientific Programmer" })).toHaveAttribute("href", "/module-1/");
  await expect(page.getByRole("link", { name: "Geospatial Data Science" })).toHaveAttribute("href", "/module-2/");
  await expect(page.getByRole("link", { name: "Remote Sensing Modelling" })).toHaveAttribute("href", "/module-3/");
  await expect(page.locator('.platform-chapter-body a[href*="/module-"]')).toHaveCount(134);
  const firstLessonLink = page.getByRole("link", { name: "Welcome to Scientific Programming", exact: true });
  await expect(firstLessonLink).toHaveAttribute("href", lesson1);
});

test("general pages and representative lessons have canonical metadata and one H1", async ({ page }) => {
  for (const path of routeMatrix) {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /\S[\s\S]{29,}/);
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    await expect(canonical).toHaveAttribute("href", /^https:\/\/kaskevich\.github\.io\/remote-sensing-scientist-academy\//);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), `${path} overflowed`).toBe(false);
  }
});

test("legacy lesson hashes replace to canonical lesson URLs", async ({ page }) => {
  await page.goto("/#lesson-2-05");
  await expect(page).toHaveURL(/\/module-2\/vector-gis-and-spatial-computation\/geopandas-and-spatial-tables\/?$/);
  await expect(page.getByRole("heading", { level: 1, name: "GeoPandas and Spatial Tables" })).toBeVisible();
});

test("About preserves Volha's professional narrative and integrated links", async ({ page }) => {
  await page.goto("/about/");
  await expect(page.getByText(/in 2021 I began building the technical side/i)).toBeVisible();
  await expect(page.getByText(/64 ECTS/i)).toBeVisible();
  await expect(page.getByText(/adding Python to that toolkit/i)).toBeVisible();
  await expect(page.getByRole("link", { name: "ETIS" })).toHaveAttribute("href", /etis\.ee/);
  await expect(page.getByRole("link", { name: "Estonian University of Life Sciences" })).toHaveAttribute("href", /emu\.ee/);
  await expect(page.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", /linkedin\.com/);
});

test("sitemap, robots, structured data, and 404 are valid and useful", async ({ page, request }) => {
  const sitemapResponse = await request.get("/sitemap.xml");
  expect(sitemapResponse.ok()).toBe(true);
  const sitemap = await sitemapResponse.text();
  expect(sitemap).toContain("/curriculum/");
  expect(sitemap).toContain(lesson2Spatial);
  expect(sitemap).not.toContain("#lesson");
  expect(sitemap).not.toContain("/admin/");

  const robotsResponse = await request.get("/robots.txt");
  const robots = await robotsResponse.text();
  expect(robots).toContain("Sitemap: https://kaskevich.github.io/remote-sensing-scientist-academy/sitemap.xml");
  expect(robots).toContain("Disallow: /remote-sensing-scientist-academy/admin/");

  await page.goto(lesson3);
  const structured = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(structured.length).toBeGreaterThan(0);
  structured.forEach((value) => expect(() => JSON.parse(value)).not.toThrow());

  const response = await page.goto("/not-a-real-academy-route/");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "This Academy page could not be found" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open curriculum" })).toHaveAttribute("href", "/curriculum/");
});

for (const viewport of [
  { width: 320, height: 568 },
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
]) {
  test(`${viewport.width}px: public, lesson, curriculum, and admin pages do not overflow`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const path of ["/", "/curriculum/", lesson1, "/admin/"]) {
      await page.goto(path);
      await expect(page.locator("body")).toBeVisible();
      const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(dimensions.scrollWidth, `${path} overflowed at ${viewport.width}px`).toBeLessThanOrEqual(dimensions.clientWidth);
    }
  });
}
