import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const [sourceDirectory, outputDirectory] = process.argv.slice(2);
if (!sourceDirectory || !outputDirectory) {
  throw new Error("Usage: node scripts/prepare-uav-project-examples.mjs <Vegetation_Indices_Plots> <public output directory>");
}

const examples = [
  ["Saardu_NDVI_Plot.png", "saardu-ndvi.png", "NDVI", "derived"],
  ["Saardu_GNDVI_Plot.png", "saardu-gndvi.png", "GNDVI", "derived"],
  ["Saardu_RNDVI_Plot.png", "saardu-rndvi.png", "RNDVI / NDVIRe", "derived"],
  ["Saardu_MSAVI_Plot.png", "saardu-msavi.png", "MSAVI", "derived"],
  ["Saardu_DSM_Plot.png", "saardu-dsm.png", "DSM", "processed"],
  ["Saardu_Thermal_Plot.png", "saardu-thermal.png", "Thermal", "processed"],
];

await fs.mkdir(outputDirectory, { recursive: true });
for (const [sourceName, outputName] of examples) {
  const sourcePath = path.join(sourceDirectory, sourceName);
  const metadata = await sharp(sourcePath).metadata();
  if (metadata.width !== 3034 || metadata.height !== 1886) throw new Error(`Unexpected source geometry for ${sourceName}`);
  await sharp(sourcePath)
    .extract({ left: 650, top: 70, width: 1680, height: 1650 })
    .resize({ width: 1200, withoutEnlargement: true })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(path.join(outputDirectory, outputName));
}

const provenance = {
  project: "2024 Boreal Baltic coastal-wetland UAV campaign, western Estonia",
  site: "Saardu",
  sourceFolder: "2024 fieldwork / Vegetation_Indices_Plots",
  publicUseBasis: "User-supplied project material explicitly requested for public Academy teaching",
  transformation: "Identical crop removes precise coordinate axes and legend; map pixels are otherwise unaltered, then downsampled for web delivery",
  examples: examples.map(([sourceFile, publicFile, product, status]) => ({ sourceFile, publicFile, product, status })),
};
await fs.writeFile(path.join(outputDirectory, "provenance.json"), `${JSON.stringify(provenance, null, 2)}\n`);
