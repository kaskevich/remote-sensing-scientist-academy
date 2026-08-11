import { expect, test } from "@playwright/test";
import { LEARNER_PROGRESS_STORAGE_KEY } from "../../lib/learner-progress";
import { lessonCodeStorageKey } from "../../lib/lesson-code-workspace";

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

test("a direct lesson link opens the correct module and lesson", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/#lesson-2-18");

  const moduleNavigation = page.locator("details.curriculum-module").nth(1);
  const lesson = page.locator("#lesson-2-18");

  await expect(moduleNavigation).toHaveAttribute("open", "");
  await expect(lesson).toHaveAttribute("open", "");
  await expect(lesson.getByRole("heading", { name: "Learning outcome", exact: true })).toBeVisible();
});

test("lesson code can be edited, run, and restored after refresh", async ({ page }) => {
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
  await page.goto("/#lesson-2-18");
  await page.evaluate((storageKey) => window.localStorage.removeItem(storageKey), lessonCodeStorageKey("lesson-2-18"));
  await page.reload();

  const lesson = page.locator("#lesson-2-18");
  const editor = lesson.getByLabel("Python code");
  await expect(editor).toHaveValue(/"raw RGB frame": "direct image record"/);

  const editedCode = 'print("Baltic meadow observation chain")';
  await editor.fill(editedCode);
  await expect(lesson.getByText("Draft saved in this browser", { exact: true })).toBeVisible();
  await page.reload();
  await expect(editor).toHaveValue(editedCode);

  await lesson.getByRole("button", { name: "Run Python" }).click();
  await expect(lesson.locator(".lesson-code-output")).toContainText("raw RGB frame: direct image record");

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
  await expect(firstLesson.getByRole("table")).toHaveCount(1);
  await expect(firstLesson.getByRole("columnheader", { name: "Format" })).toBeVisible();
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

test("Module 2 exposes nine reviewed professional chapters with the planned pathway", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/#curriculum");
  await page.evaluate((storageKey) => window.localStorage.removeItem(storageKey), LEARNER_PROGRESS_STORAGE_KEY);
  await page.reload();

  const overview = page.locator(".module-overview-blue");
  await expect(overview.getByRole("heading", { name: "Geospatial Data Science", exact: true })).toBeVisible();
  await expect(overview.locator(".module-chapter")).toHaveCount(13);
  await expect(overview.locator(".module-syllabus li")).toHaveCount(54);
  await expect(overview.locator(".syllabus-available")).toHaveCount(54);
  await expect(overview.locator(".syllabus-planned")).toHaveCount(9);
  await expect(overview.locator(".module-syllabus li .syllabus-number").first()).toHaveText("2.1");
  await expect(overview.locator(".module-syllabus li .syllabus-number").nth(52)).toHaveText("2.53");
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
  await expect(overview.getByText("0/5 complete", { exact: true }).first()).toBeVisible();
  await expect(overview.getByText("What Is a Raster Really?", { exact: true })).toBeHidden();
  await overview.locator(".module-chapter").nth(2).locator("summary").click();
  await expect(overview.getByRole("link", { name: "What Is a Raster Really?", exact: true })).toHaveAttribute("href", "#lesson-2-11");
  await expect(overview.getByRole("link", { name: "Terrain Analysis with DEM and DSM", exact: true })).toHaveAttribute("href", "#lesson-2-17");
  await expect(overview.getByRole("link", { name: "Build an Analysis-Ready Raster Stack", exact: true })).toHaveAttribute("href", "#module-2-chapter-3-practicum");
  await expect(overview.getByText("UAV Remote Sensing Fundamentals", { exact: true })).toBeHidden();
  await overview.locator(".module-chapter").nth(3).locator("summary").click();
  await expect(overview.getByRole("link", { name: "UAV Remote Sensing Fundamentals", exact: true })).toHaveAttribute("href", "#lesson-2-18");
  await expect(overview.getByRole("link", { name: "UAV Multispectral Processing Pipeline", exact: true })).toHaveAttribute("href", "#lesson-2-25");
  await expect(overview.getByRole("link", { name: "Evaluate a UAV Survey Before Scientific Analysis", exact: true })).toHaveAttribute("href", "#module-2-chapter-4-practicum");
  await expect(overview.getByText("Optical Remote Sensing", { exact: true })).toBeHidden();
  await overview.locator(".module-chapter").nth(4).locator("summary").click();
  await expect(overview.getByRole("link", { name: "Optical Remote Sensing", exact: true })).toHaveAttribute("href", "#lesson-2-26");
  await expect(overview.getByRole("link", { name: "LiDAR and Point Clouds", exact: true })).toHaveAttribute("href", "#lesson-2-30");
  await expect(overview.getByRole("link", { name: "Build a Defensible Satellite Evidence Package", exact: true })).toHaveAttribute("href", "#module-2-chapter-5-practicum");
  await expect(overview.getByText("Spatial Autocorrelation", { exact: true })).toBeHidden();
  await overview.locator(".module-chapter").nth(5).locator("summary").click();
  await expect(overview.getByRole("link", { name: "Spatial Autocorrelation", exact: true })).toHaveAttribute("href", "#lesson-2-31");
  await expect(overview.getByRole("link", { name: "Spatial Regression Concepts", exact: true })).toHaveAttribute("href", "#lesson-2-34");
  await expect(overview.getByRole("link", { name: "Design and Defend a Spatial Inference Plan", exact: true })).toHaveAttribute("href", "#module-2-chapter-6-practicum");
  await expect(overview.getByText("SQL for Geospatial Scientists", { exact: true })).toBeHidden();
  await overview.locator(".module-chapter").nth(6).locator("summary").click();
  await expect(overview.getByRole("link", { name: "SQL for Geospatial Scientists", exact: true })).toHaveAttribute("href", "#lesson-2-35");
  await expect(overview.getByRole("link", { name: "Managing Large Spatial Data", exact: true })).toHaveAttribute("href", "#lesson-2-37");
  await expect(overview.getByRole("link", { name: "Build a Governed Spatial Database Handover", exact: true })).toHaveAttribute("href", "#module-2-chapter-7-practicum");
  await expect(overview.getByText("Xarray and Rioxarray", { exact: true })).toBeHidden();
  await overview.locator(".module-chapter").nth(7).locator("summary").click();
  await expect(overview.getByRole("link", { name: "Xarray and Rioxarray", exact: true })).toHaveAttribute("href", "#lesson-2-38");
  await expect(overview.getByRole("link", { name: "STAC", exact: true })).toHaveAttribute("href", "#lesson-2-42");
  await expect(overview.getByRole("link", { name: "Build a Reproducible Cloud-Native EO Evidence Cube", exact: true })).toHaveAttribute("href", "#module-2-chapter-8-practicum");
  await expect(overview.getByText("Web Maps and Spatial Services", { exact: true })).toBeHidden();
  await overview.locator(".module-chapter").nth(8).locator("summary").click();
  await expect(overview.getByRole("link", { name: "Web Maps and Spatial Services", exact: true })).toHaveAttribute("href", "#lesson-2-43");
  await expect(overview.getByRole("link", { name: "OGC Standards and Interoperability", exact: true })).toHaveAttribute("href", "#lesson-2-45");
  await expect(overview.getByRole("link", { name: "Deliver an Accessible Environmental Monitoring Map", exact: true })).toHaveAttribute("href", "#module-2-chapter-9-practicum");
  await expect(overview.getByText("Workflow Automation and CI", { exact: true })).toBeHidden();
  await overview.locator(".module-chapter").nth(11).locator("summary").click();
  await expect(overview.getByText("Workflow Automation and CI", { exact: true })).toBeVisible();

  const moduleNavigation = page.locator("details.curriculum-module").nth(1);
  await expect(moduleNavigation).not.toHaveAttribute("open", "");
  await moduleNavigation.locator(":scope > summary").click();
  await expect(moduleNavigation).toHaveAttribute("open", "");
  await expect(moduleNavigation.getByText("45 lessons · 9 practica available", { exact: true })).toBeVisible();
  await expect(moduleNavigation.locator("details.module")).toHaveCount(54);
  await expect(page.locator("#lesson-2-05")).toHaveCount(1);
  await expect(page.locator("#lesson-2-10")).toHaveCount(1);
  await expect(page.locator("#lesson-2-11")).toHaveCount(1);
  await expect(page.locator("#lesson-2-18")).toHaveCount(1);
  await expect(page.locator("#lesson-2-25")).toHaveCount(1);
  await expect(page.locator("#lesson-2-30")).toHaveCount(1);
  await expect(page.locator("#lesson-2-31")).toHaveCount(1);
  await expect(page.locator("#lesson-2-34")).toHaveCount(1);
  await expect(page.locator("#lesson-2-35")).toHaveCount(1);
  await expect(page.locator("#lesson-2-37")).toHaveCount(1);
  await expect(page.locator("#lesson-2-38")).toHaveCount(1);
  await expect(page.locator("#lesson-2-42")).toHaveCount(1);
  await expect(page.locator("#lesson-2-43")).toHaveCount(1);
  await expect(page.locator("#lesson-2-45")).toHaveCount(1);

  const firstLesson = page.locator("#lesson-2-01");
  await firstLesson.locator(":scope > summary").click();
  await expect(firstLesson.locator(".module-index")).toHaveText("2.1");
  await expect(firstLesson.locator(".module-lesson-label")).toHaveText("Lesson 2.1");
  await expect(firstLesson.getByText("Lesson 2.1 of 53", { exact: true })).toBeVisible();
  await expect(firstLesson.getByRole("heading", { name: "Learning outcome", exact: true })).toBeVisible();
  await expect(firstLesson.getByText(/What evidence connects every observation/)).toBeVisible();
  await expect(firstLesson.getByText("spatial_data_inventory.ipynb", { exact: true }).first()).toBeVisible();
  await expect(firstLesson.getByRole("img", { name: /Diagram comparing an ordinary table/i })).toBeVisible();
  await expect(firstLesson.getByText("Concept", { exact: true })).toBeVisible();
  await firstLesson.getByRole("checkbox").check();
  await expect(overview.getByText("1/5 complete", { exact: true })).toBeVisible();

  const vectorLesson = page.locator("#lesson-2-05");
  await vectorLesson.locator(":scope > summary").click();
  await expect(vectorLesson.getByText("Lesson 2.5 of 53", { exact: true })).toBeVisible();
  await expect(vectorLesson.getByRole("img", { name: /Diagram showing a GeoDataFrame/i })).toBeVisible();
  await expect(vectorLesson.locator(".formative-check")).toHaveCount(3);
  await expect(vectorLesson.getByRole("link", { name: "Download synthetic training field plots" })).toHaveAttribute("href", /training_field_plots\.geojson$/);

  const performanceLesson = page.locator("#lesson-2-08");
  await performanceLesson.locator(":scope > summary").click();
  await expect(performanceLesson.getByText("Lesson 2.8 of 53", { exact: true })).toBeVisible();
  await expect(performanceLesson.getByRole("img", { name: /two-stage spatial-index query/i })).toBeVisible();
  await expect(performanceLesson.locator(".formative-check")).toHaveCount(3);

  const topologyLesson = page.locator("#lesson-2-09");
  await topologyLesson.locator(":scope > summary").click();
  await expect(topologyLesson.getByRole("link", { name: "Download the explicitly corrupted topology training derivative" })).toHaveAttribute("href", /training_topology_corrupted\.geojson$/);

  const qgisLesson = page.locator("#lesson-2-10");
  await qgisLesson.locator(":scope > summary").click();
  await expect(qgisLesson.getByRole("link", { name: "Download the QGIS vector QA checklist" })).toHaveAttribute("href", /QGIS_Vector_QA_Checklist\.md$/);
  await expect(qgisLesson.getByRole("link", { name: "Download the structured QGIS observation log" })).toHaveAttribute("href", /qgis_qa_observations\.csv$/);

  const rasterLesson = page.locator("#lesson-2-11");
  await rasterLesson.locator(":scope > summary").click();
  await expect(rasterLesson.getByText("Lesson 2.11 of 53", { exact: true })).toBeVisible();
  await expect(rasterLesson.getByRole("img", { name: /numerical values, grid location and measurement meaning/i })).toBeVisible();
  await expect(rasterLesson.locator(".formative-check")).toHaveCount(3);
  await expect(rasterLesson.getByRole("link", { name: "Download the raster metadata and checksum manifest" })).toHaveAttribute("href", /raster-foundations\/manifest\.json$/);

  const rasterPracticum = page.locator("#module-2-chapter-3-practicum");
  await rasterPracticum.locator(":scope > summary").click();
  await expect(rasterPracticum.locator(".module-lesson-label")).toHaveText("Chapter practicum");
  await expect(rasterPracticum.getByText("RASTER_QA_REPORT.md", { exact: true }).first()).toBeVisible();

  const uavLesson = page.locator("#lesson-2-18");
  await uavLesson.locator(":scope > summary").click();
  await expect(uavLesson.getByText("Lesson 2.18 of 53", { exact: true })).toBeVisible();
  await expect(uavLesson.getByRole("img", { name: /platform, sensor, navigation, storage and flight control/i })).toBeVisible();
  await expect(uavLesson.locator(".formative-check")).toHaveCount(3);
  await expect(uavLesson.getByRole("link", { name: "Download the UAV data and checksum manifest" })).toHaveAttribute("href", /uav-foundations\/manifest\.json$/);

  const multispectralLesson = page.locator("#lesson-2-25");
  await multispectralLesson.locator(":scope > summary").click();
  await expect(multispectralLesson.getByRole("link", { name: "Download the shifted NIR QA fixture" })).toHaveAttribute("href", /uav_nir_shifted\.tif$/);

  const uavPracticum = page.locator("#module-2-chapter-4-practicum");
  await uavPracticum.locator(":scope > summary").click();
  await expect(uavPracticum.locator(".module-lesson-label")).toHaveText("Chapter practicum");
  await expect(uavPracticum.getByText("UAV_PRODUCT_QA_REPORT.md", { exact: true }).first()).toBeVisible();

  const opticalLesson = page.locator("#lesson-2-26");
  await opticalLesson.locator(":scope > summary").click();
  await expect(opticalLesson.getByText("Lesson 2.26 of 53", { exact: true })).toBeVisible();
  await expect(opticalLesson.locator(".formative-check")).toHaveCount(3);
  await expect(opticalLesson.getByRole("link", { name: "Download the optical observation inventory" })).toHaveAttribute("href", /satellite-eo\/optical_observation_inventory\.csv$/);

  const lidarLesson = page.locator("#lesson-2-30");
  await lidarLesson.locator(":scope > summary").click();
  await expect(lidarLesson.getByRole("link", { name: "Download the synthetic LiDAR point samples" })).toHaveAttribute("href", /satellite-eo\/lidar_point_samples\.csv$/);

  const satellitePracticum = page.locator("#module-2-chapter-5-practicum");
  await satellitePracticum.locator(":scope > summary").click();
  await expect(satellitePracticum.locator(".module-lesson-label")).toHaveText("Chapter practicum");
  await expect(satellitePracticum.getByText("SATELLITE_EO_EVIDENCE_REPORT.md", { exact: true }).first()).toBeVisible();

  const autocorrelationLesson = page.locator("#lesson-2-31");
  await autocorrelationLesson.locator(":scope > summary").click();
  await expect(autocorrelationLesson.getByText("Lesson 2.31 of 53", { exact: true })).toBeVisible();
  await expect(autocorrelationLesson.locator(".formative-check")).toHaveCount(3);
  await expect(autocorrelationLesson.getByRole("link", { name: "Download the synthetic meadow plot observations" })).toHaveAttribute("href", /spatial-statistics\/meadow_plot_observations\.csv$/);

  const spatialRegressionLesson = page.locator("#lesson-2-34");
  await spatialRegressionLesson.locator(":scope > summary").click();
  await expect(spatialRegressionLesson.getByRole("link", { name: "Download the separated model-validation blocks" })).toHaveAttribute("href", /spatial-statistics\/spatial_validation_blocks\.csv$/);

  const spatialPracticum = page.locator("#module-2-chapter-6-practicum");
  await spatialPracticum.locator(":scope > summary").click();
  await expect(spatialPracticum.locator(".module-lesson-label")).toHaveText("Chapter practicum");
  await expect(spatialPracticum.getByText("SPATIAL_INFERENCE_DECISION.md", { exact: true }).first()).toBeVisible();

  const sqlLesson = page.locator("#lesson-2-35");
  await sqlLesson.locator(":scope > summary").click();
  await expect(sqlLesson.getByText("Lesson 2.35 of 53", { exact: true })).toBeVisible();
  await expect(sqlLesson.locator(".formative-check")).toHaveCount(3);
  await expect(sqlLesson.getByRole("link", { name: "Download the reviewed PostgreSQL and PostGIS teaching schema" })).toHaveAttribute("href", /spatial-databases\/schema\.sql$/);

  const postgisLesson = page.locator("#lesson-2-36");
  await postgisLesson.locator(":scope > summary").click();
  await expect(postgisLesson.getByRole("link", { name: "Download the synthetic management-zone WKT records" })).toHaveAttribute("href", /spatial-databases\/management_zones\.csv$/);

  const storageLesson = page.locator("#lesson-2-37");
  await storageLesson.locator(":scope > summary").click();
  await expect(storageLesson.getByRole("link", { name: "Download the deliberately imperfect database handover inventory" })).toHaveAttribute("href", /spatial-databases\/database_handover_inventory\.csv$/);

  const databasePracticum = page.locator("#module-2-chapter-7-practicum");
  await databasePracticum.locator(":scope > summary").click();
  await expect(databasePracticum.locator(".module-lesson-label")).toHaveText("Chapter practicum");
  await expect(databasePracticum.getByText("SPATIAL_DATABASE_HANDOVER_DECISION.md", { exact: true }).first()).toBeVisible();

  const xarrayLesson = page.locator("#lesson-2-38");
  await xarrayLesson.locator(":scope > summary").click();
  await expect(xarrayLesson.getByText("Lesson 2.38 of 53", { exact: true })).toBeVisible();
  await expect(xarrayLesson.locator(".formative-check")).toHaveCount(3);
  await expect(xarrayLesson.getByRole("link", { name: "Download the labelled cube structure contract" })).toHaveAttribute("href", /cloud-native-eo\/meadow_cube_structure\.json$/);

  const stacLesson = page.locator("#lesson-2-42");
  await stacLesson.locator(":scope > summary").click();
  await expect(stacLesson.getByRole("link", { name: "Download the deterministic synthetic STAC ItemCollection" })).toHaveAttribute("href", /cloud-native-eo\/stac_items_fixture\.json$/);

  const cloudPracticum = page.locator("#module-2-chapter-8-practicum");
  await cloudPracticum.locator(":scope > summary").click();
  await expect(cloudPracticum.locator(".module-lesson-label")).toHaveText("Chapter practicum");
  await expect(cloudPracticum.getByText("CLOUD_NATIVE_EO_RELEASE_DECISION.md", { exact: true }).first()).toBeVisible();

  const webServicesLesson = page.locator("#lesson-2-43");
  await webServicesLesson.locator(":scope > summary").click();
  await expect(webServicesLesson.getByText("Lesson 2.43 of 53", { exact: true })).toBeVisible();
  await expect(webServicesLesson.locator(".formative-check")).toHaveCount(3);
  await expect(webServicesLesson.getByRole("link", { name: "Download the deliberately mixed service capability inventory" })).toHaveAttribute("href", /web-gis-delivery\/service_capability_inventory\.csv$/);

  const mappingLesson = page.locator("#lesson-2-44");
  await mappingLesson.locator(":scope > summary").click();
  await expect(mappingLesson.getByRole("link", { name: "Download the generalized synthetic monitoring sites" })).toHaveAttribute("href", /web-gis-delivery\/monitoring_sites\.geojson$/);

  const interoperabilityLesson = page.locator("#lesson-2-45");
  await interoperabilityLesson.locator(":scope > summary").click();
  await expect(interoperabilityLesson.getByRole("link", { name: "Download the deterministic interoperability fixture" })).toHaveAttribute("href", /web-gis-delivery\/interoperability_fixture\.json$/);

  const webPracticum = page.locator("#module-2-chapter-9-practicum");
  await webPracticum.locator(":scope > summary").click();
  await expect(webPracticum.locator(".module-lesson-label")).toHaveText("Chapter practicum");
  await expect(webPracticum.getByText("WEB_GIS_RELEASE_DECISION.md", { exact: true }).first()).toBeVisible();

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
