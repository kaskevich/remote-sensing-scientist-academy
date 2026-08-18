# Environmental Monitoring Project — brief and preregistration

Complete this document before fitting the final candidate models. Replace prompts; do not delete headings. Record amendments in the final section.

## 1. Decision statement

- **Organisation and decision user:**
- **Decision or field action informed:**
- **Why a prediction is needed:**
- **Most consequential error:**
- **Project status:** real approved evidence / licensed public evidence / synthetic training demonstration

## 2. Prediction problem

- **Predictive question:**
- **Regression or classification:**
- **Target:**
- **One modelling observation:**
- **One prediction unit:**
- **Spatial domain:**
- **Temporal domain:**
- **Sensor/product domain:**
- **Intended transfer:** within known sites / new sites / new time / new region
- **Explicit non-claims:**

## 3. Target specification

| Field | Registered definition | Authority or evidence |
|---|---|---|
| name |  |  |
| units or class codes |  |  |
| observation protocol |  |  |
| spatial support |  |  |
| temporal support |  |  |
| valid range/classes |  |  |
| zeros/detection limits |  |  |
| prediction unit |  |  |

Stop if a required meaning is guessed.

## 4. Predictor contract

Link `predictor_hypotheses.csv`. Confirm that every feature records source, unit, spatial/temporal support, transform, version, scientific rationale, expected relationship, limitation and availability at prediction time.

- **Leakage review owner:**
- **Training-serving-skew test:**
- **Frozen feature-schema version:**

## 5. Experiment preregistration

- **Naive baseline:**
- **Scientific/simple comparator:**
- **Tree ensemble:**
- **XGBoost candidate:**
- **Primary metric and why:**
- **Supporting metrics:**
- **Outer validation and transfer claim:**
- **Inner selection/tuning:**
- **Calibration evidence:**
- **Final protected assessment:**
- **Final-test custodian:**
- **When the final test may be opened:**
- **Threshold-selection rule where relevant:**
- **Uncertainty method and nominal coverage where relevant:**
- **Applicability method and release thresholds:**
- **Random seeds and software record:**

## 6. Source and role inventory

| Source/version | Licence/access | Role | Sites/dates/support | Checksum or query record | Known limitation |
|---|---|---|---|---|---|
|  |  | development / outer / calibration / final |  |  |  |

## 7. Success and withholding rules

- **Evidence that would support bounded release:**
- **Evidence that requires review:**
- **Evidence that forces withholding:**
- **Areas or groups automatically withheld:**
- **Who has release authority:**

## 8. Earth Engine component

- **Necessary role:**
- **Collections/assets and versions:**
- **Server-side operation:**
- **Export/interface contract:**
- **Protected validation kept outside the component:**
- **Why local-only or cloud-only was rejected:**

## 9. Communication plan

- **Scientific audience and artifact:**
- **Technical operator and artifact:**
- **Management audience and artifact:**
- **Accessible map/table requirements:**
- **Sensitive information policy:**

## 10. Amendments

| Date/version | Change | Evidence available when changed | Effect on protected assessment | Approver |
|---|---|---|---|---|
|  |  |  |  |  |
