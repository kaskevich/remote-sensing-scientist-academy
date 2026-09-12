export const hyperspectralFieldLabPath = "/field-labs/hyperspectral-signatures/";

export const hyperspectralFieldLabSources = {
  aviris: "https://aviris.jpl.nasa.gov/aviris/",
  neonIntro: "https://www.neonscience.org/resources/learning-hub/tutorials/introduction-hyperspectral-remote-sensing-data-python",
  neonValidation: "https://www.neonscience.org/resources/learning-hub/tutorials/hyperspectral-validation-py",
  usgsLibrary: "https://www.usgs.gov/labs/spectroscopy-lab/usgs-spectral-library",
} as const;

export const hyperspectralSignatures = [
  { wavelength: 450, dry: .052, moist: .044, water: .061, bad: false, snr: 78 },
  { wavelength: 500, dry: .074, moist: .062, water: .054, bad: false, snr: 96 },
  { wavelength: 550, dry: .121, moist: .106, water: .047, bad: false, snr: 112 },
  { wavelength: 600, dry: .098, moist: .081, water: .038, bad: false, snr: 105 },
  { wavelength: 650, dry: .071, moist: .057, water: .031, bad: false, snr: 101 },
  { wavelength: 680, dry: .058, moist: .047, water: .026, bad: false, snr: 94 },
  { wavelength: 700, dry: .121, moist: .103, water: .021, bad: false, snr: 91 },
  { wavelength: 720, dry: .238, moist: .211, water: .018, bad: false, snr: 88 },
  { wavelength: 750, dry: .401, moist: .372, water: .015, bad: false, snr: 84 },
  { wavelength: 800, dry: .438, moist: .409, water: .011, bad: false, snr: 82 },
  { wavelength: 850, dry: .451, moist: .421, water: .009, bad: false, snr: 77 },
  { wavelength: 900, dry: .421, moist: .379, water: .007, bad: false, snr: 58 },
  { wavelength: 940, dry: .312, moist: .241, water: .006, bad: true, snr: 17 },
  { wavelength: 1000, dry: .391, moist: .337, water: .005, bad: false, snr: 52 },
  { wavelength: 1200, dry: .342, moist: .276, water: .004, bad: false, snr: 46 },
  { wavelength: 1400, dry: .092, moist: .061, water: .003, bad: true, snr: 8 },
  { wavelength: 1650, dry: .281, moist: .216, water: .003, bad: false, snr: 39 },
  { wavelength: 1900, dry: .048, moist: .032, water: .002, bad: true, snr: 6 },
  { wavelength: 2200, dry: .173, moist: .126, water: .002, bad: false, snr: 31 },
  { wavelength: 2400, dry: .119, moist: .084, water: .002, bad: true, snr: 15 },
] as const;

export const hyperspectralWorkflowSteps = [
  { n: "01", phase: "QUESTION", title: "Define the target and reference domain", action: ["Name the class or continuous response.", "Specify spatial and spectral support.", "Define acquisition timing and field/lab reference protocol.", "State what the model must not claim."], check: ["Target labels are independent of the image features.", "Reference samples represent the intended mapping domain."], output: "Target specification, sampling plan and non-claims.", fail: "Labels, support or domain of application are ambiguous." },
  { n: "02", phase: "CUBE", title: "Audit cube dimensions and metadata", action: ["Confirm row, column and band axis order.", "Read centre wavelength and bandwidth/FWHM for every band.", "Record radiance/reflectance scale, units, fill value, CRS and transform.", "Inventory quality layers, bad-band metadata and acquisition geometry."], check: ["Band count matches wavelength metadata.", "Wavelengths increase as expected and scaling reproduces plausible values."], output: "Cube contract and band inventory.", fail: "Axis order, wavelength mapping, units or scale is unknown." },
  { n: "03", phase: "LEVEL", title: "Establish the measurement level", action: ["Identify raw DN, radiance, apparent reflectance or surface-reflectance product.", "Read atmospheric/radiometric processing provenance.", "Keep radiance and reflectance products separately named.", "Inspect calibration or validation targets when supplied."], check: ["The product level supports the proposed cross-pixel or cross-date comparison.", "Reflectance is not inferred from the file appearance."], output: "Measurement-level decision record.", fail: "A DN or radiance cube is treated as surface reflectance without a defensible conversion." },
  { n: "04", phase: "MASK", title: "Build spatial and spectral validity masks", action: ["Apply fill, cloud/shadow and geometry masks relevant to the product.", "Read sensor/product bad-band flags.", "Review low-SNR, atmospheric-absorption and spectral-edge regions.", "Keep masked bands in provenance even when excluded from analysis."], check: ["Masking follows metadata and observed QA, not a universal wavelength recipe.", "NaN/NoData are not converted to zero reflectance."], output: "Valid-pixel mask, valid-band mask and exclusion log.", fail: "Invalid bands or pixels enter the feature matrix as measurements." },
  { n: "05", phase: "SPECTRA", title: "Extract spectra at compatible support", action: ["Overlay reference geometry on the cube.", "Use plot/polygon summaries when a point does not represent the field footprint.", "Record pixel count, statistic and variability.", "Convolve high-resolution reference spectra to sensor response where comparison requires it."], check: ["Field and image timing/support are compatible.", "Spectral-library samples match material state and measurement conditions closely enough for the claim."], output: "Reference-linked spectral table.", fail: "A library curve or single pixel is treated as interchangeable with a mixed field plot." },
  { n: "06", phase: "EXPLORE", title: "Inspect spectral shape and uncertainty", action: ["Plot class medians plus dispersion, not only one mean curve.", "Inspect signal-to-noise and residual striping.", "Compare spectra on the same units and wavelength support.", "Mark absorption regions before calculating features."], check: ["Apparent separation exceeds within-class variation where claimed.", "Display smoothing has not silently replaced analysis values."], output: "Spectral QA plots and candidate-feature rationale.", fail: "A visually attractive curve hides noise, outliers or unequal sample counts." },
  { n: "07", phase: "FEATURES", title: "Engineer features inside the training design", action: ["Choose raw bands, derivatives, ratios, continuum removal or dimensionality reduction from a physical hypothesis.", "Fit scalers, PCA or feature selection on training folds only.", "Preserve wavelength names and transform parameters.", "Test sensitivity to preprocessing choices."], check: ["No validation or test pixels informed preprocessing.", "Feature count is defensible relative to independent sample count."], output: "Fold-safe feature pipeline and feature register.", fail: "The full cube is normalized or reduced before splitting, causing leakage." },
  { n: "08", phase: "SPLIT", title: "Separate spatially independent evaluation data", action: ["Group samples by site, flight line, plot or spatial block.", "Keep nearby pixels from the same object in one fold.", "Reserve a final test domain where feasible.", "Record class balance and spectral coverage by fold."], check: ["No mixed-pixel neighborhood appears in both training and validation.", "Rare classes remain evaluable."], output: "Spatial fold registry and held-out test set.", fail: "Random pixel splitting inflates apparent generalization." },
  { n: "09", phase: "MODEL", title: "Train a transparent baseline before complexity", action: ["Fit a simple physically interpretable baseline.", "Compare more flexible models under identical folds.", "Tune hyperparameters inside training data only.", "Retain class probabilities or prediction intervals."], check: ["Complexity improves held-out performance, not only training fit.", "Metrics include per-class or response-specific error."], output: "Validated model candidates and selection record.", fail: "A high-dimensional model is chosen from resubstitution accuracy." },
  { n: "10", phase: "MAP QA", title: "Map predictions and their domain of applicability", action: ["Apply the exact fitted preprocessing pipeline.", "Mask invalid pixels and extrapolative spectra.", "Map uncertainty, confidence or spectral distance.", "Inspect seams, striping and impossible salt-and-pepper patterns."], check: ["Output grid and valid-data mask match the source contract.", "Low-confidence and outside-domain pixels remain distinguishable from target absence."], output: "Prediction, uncertainty and applicability rasters.", fail: "Every pixel receives an equally confident label regardless of spectral novelty." },
  { n: "11", phase: "HANDOFF", title: "Export a spectral evidence package", action: ["Save source identifiers, band table and masks.", "Export training/fold registry, fitted pipeline and model card.", "Deliver prediction, uncertainty and applicability rasters.", "Document supported claims, sensitivity and non-claims."], check: ["Every feature can be traced to wavelengths and preprocessing.", "A reviewer can reproduce the split and final map."], output: "Analysis-ready cube evidence, model and audit trail.", fail: "The final class map cannot be reconstructed from source cube and reference labels." },
] as const;
