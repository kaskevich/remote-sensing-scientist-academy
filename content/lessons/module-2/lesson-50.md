## 1. APIs and Automated Data Acquisition

### Learning outcome

By the end of this lesson, you will be able to explain an HTTP request and JSON response in a scientific acquisition workflow; distinguish query parameters, authentication and response metadata; retrieve paginated environmental records with timeouts and bounded retries; classify failures that should stop or retry; validate schema and stable identifiers; protect credentials; and write a provenance-rich acquisition manifest that another scientist can reproduce.

- **Lesson type:** Environmental API Acquisition Laboratory
- **Estimated time:** 180–240 minutes
- **Prerequisites:** Python functions and dictionaries, data validation, STAC and provenance
- **Portfolio output:** `api_acquisition_log.ipynb`

### Why this matters

Environmental data increasingly arrive through services rather than manually downloaded files. APIs can make a workflow repeatable, but automation also repeats mistakes efficiently. A query may retrieve only the first page. A service may change its response schema. A retry loop may hammer a server or duplicate records. A notebook may expose an access token. A successful status code may carry data outside the intended geography or time.

A Remote Sensing Scientist treats acquisition as the first analytical stage. The request defines a population, the response represents evidence, and the manifest preserves how those records entered the study.

### Scientific context

The coastal-meadow group wants a reproducible occurrence-data acquisition to support field planning around Baltic salt-tolerant vegetation. The example uses the public GBIF occurrence API for learning. Returned records require their own licence, coordinate, taxonomic and sampling-quality review; retrieval does not make them verified field truth or part of the published meadow dataset.

```text
scientific query contract
  ├─ endpoint and parameters
  ├─ authority and permitted use
  └─ expected schema and population
             ↓ HTTP request
service response: status + headers + JSON body
             ↓ validate and paginate
stable-ID inventory + exclusions + provenance
             ↓
reviewed acquisition snapshot
```

### Concept — a request is a versioned scientific operation

HTTP is a protocol for exchanging messages. A client sends a request to a server. A `GET` request asks for a representation of a resource. The request includes a URL, optional query parameters and headers. The server returns a status, headers and a body.

JSON represents nested objects and arrays using text. In Python, a JSON object commonly becomes a dictionary and a JSON array becomes a list. Parsing JSON proves only that the syntax is readable. Validate required fields, types, identifiers and allowed values before analysis.

#### Status categories

- `2xx` indicates that the server handled the request successfully at the protocol level;
- `4xx` indicates a client-side condition such as an invalid query, missing authority or forbidden resource;
- `5xx` indicates that the service could not complete a valid request.

Do not retry every failure. A timeout, connection interruption, `429 Too Many Requests` or some `5xx` responses may be transient. An invalid parameter or credential needs correction. Use bounded attempts, increasing delay, random jitter where appropriate and any `Retry-After` instruction. Record final failure instead of looping indefinitely.

[[CHECK:m2-l50-status]]

#### Authentication and secrets

Some APIs are public; others use API keys, OAuth tokens or signed requests. Authentication establishes an identity. Authorisation determines what that identity may do. Keep secrets outside code and version control, for example in protected environment variables or a managed secret store. Never print tokens, store them in notebook output, include them in URLs that enter logs, or copy them into a browser bundle.

Redact secrets while preserving reproducibility: record the authentication method and permission scope, not the secret value.

#### Pagination

Services limit response size. Pagination may use offset/limit values, page numbers, cursors or advertised `next` links. A first page is not the population. Follow the documented mechanism, enforce a maximum safety bound, reconcile reported totals and detect duplicated stable IDs.

Store the ordered request record and the final item inventory. If the service changes between pages, totals or content may drift. For a critical acquisition, use a service snapshot/version if available, retrieve a documented download export, or record enough evidence to expose the inconsistency.

[[CHECK:m2-l50-pagination]]

#### Rate limits and polite acquisition

Rate limits protect service availability. Prefer larger permitted pages over rapid tiny requests, avoid repeated identical acquisition, cache authorised responses where appropriate and identify your application if the service asks. Schedule intensive work outside peak periods only when policy allows. A public endpoint is shared infrastructure, not unlimited local storage.

### Worked example — one bounded, inspectable request

#### Predict before running

Predict which facts the code can establish: that transport succeeded, that JSON contains a `results` field and how many records arrived on this page. Which scientific facts still require review?

```python
import requests

url = "https://api.gbif.org/v1/occurrence/search"
params = {
    "country": "EE",
    "scientific_name": "Salicornia europaea",
    "limit": 100,
}
response = requests.get(url, params=params, timeout=30)
response.raise_for_status()
payload = response.json()

if not isinstance(payload.get("results"), list):
    raise ValueError("Unexpected response schema")
print("records on page", len(payload["results"]))
print("resolved request", response.url)
```

### Code walkthrough

1. `requests` provides an explicit HTTP client interface.
2. `url` names one API operation; production evidence should also record the service documentation/version.
3. `params` keeps the query separate from URL punctuation and makes its scientific boundary inspectable.
4. Country, scientific name and page limit constrain the requested response; they do not prove record quality.
5. `timeout=30` prevents an unlimited wait. Production code usually separates connection and read timeouts.
6. `raise_for_status()` converts non-success HTTP statuses into a visible exception.
7. `response.json()` parses the body; malformed JSON will fail.
8. The schema guard requires `results` to be a list instead of assuming the service shape.
9. The page count confirms only records in this response.
10. `response.url` preserves the resolved non-secret query for provenance.

The example does not implement retry or pagination because each deserves an explicit tested function. It also does not cache or publish the response. Acquisition is incomplete until the inventory and licensing review pass.

### Design a recoverable acquisition function

A professional client separates responsibilities:

1. build and validate the query contract;
2. send one request with timeout;
3. classify the status;
4. retry only transient conditions within policy;
5. parse and validate response schema;
6. yield records and the advertised next position;
7. reconcile stable IDs and totals;
8. write a manifest and immutable snapshot;
9. validate coordinates, dates, licences and scientific fitness in a later gate.

Make idempotence explicit: repeating the same acquisition should not silently duplicate records. Stable source IDs and a recorded snapshot identifier help. If the upstream record changes, preserve both retrieval time and source modification/version evidence.

#### Acquisition manifest

Record at minimum:

- endpoint and documentation version/review date;
- redacted query parameters and method;
- retrieval start/end in UTC;
- client and software version;
- authentication method/scope, without secret;
- page count, reported total, received count, distinct stable IDs and duplicates;
- response content type, selected headers and final status;
- source licence and per-record rights where supplied;
- response snapshot checksum or item-inventory checksum;
- schema validation result and rejected records;
- failure/retry log;
- responsible analyst and intended use.

[[CHECK:m2-l50-provenance]]

### Common mistakes and recovery

#### Mistake 1 — treating one successful page as complete

**Recognise it:** report count equals page limit or a `next` link is present.

**Recover:** follow the documented paging relation, reconcile totals and distinct IDs, and record the final termination condition.

#### Mistake 2 — retrying invalid requests

**Recognise it:** the same `400` or `401` repeats.

**Recover:** stop, preserve the redacted error and correct parameters or authority. Retry only explicitly transient conditions.

#### Mistake 3 — hiding parameters inside string construction

**Recognise it:** query meaning is difficult to review and encoding errors appear.

**Recover:** use a parameter structure, validate allowed fields and store a canonical redacted representation.

#### Mistake 4 — committing a token

**Recognise it:** token text appears in code, notebook output, configuration or Git history.

**Recover:** revoke/rotate immediately, remove exposed outputs, use protected runtime secrets and review logs. Deleting one visible line does not invalidate an already exposed token.

#### Mistake 5 — assuming JSON types express scientific meaning

**Recognise it:** coordinate, date, units and taxon fields enter analysis without domain checks.

**Recover:** validate schema first, then apply scientific fitness checks with explicit missingness and exclusions.

#### Mistake 6 — ignoring service terms and licences

**Recognise it:** the downloaded snapshot has no attribution or rights inventory.

**Recover:** record service terms, dataset licences and citation identifiers at acquisition time; restrict redistribution when required.

### Guided practice

1. Write a bounded query for country, taxon, date or geometry and explain the population it intends to retrieve.
2. Read authoritative API documentation and record the endpoint, parameter definitions, pagination method and rate guidance.
3. Execute one small request. Preserve status, content type, resolved redacted URL and response schema summary.
4. Build a schema check for stable ID, scientific name, event date, coordinates, dataset key and licence.
5. Create a pagination loop design with a maximum page/record safety bound and termination rule.
6. Define retryable and non-retryable conditions, attempts, delay and final failure message.
7. Reconcile reported count, received rows, distinct IDs and duplicate IDs.
8. Separate transport/schema acceptance from coordinate, taxonomy, date and licence review.
9. Hash the stored raw snapshot or canonical ID inventory.
10. Create `acquisition_manifest.json` and `acquisition_exclusions.csv`.
11. Simulate a `429`, malformed JSON, missing field and duplicated page; state the expected recovery.
12. Write a short decision about whether the snapshot may proceed to exploratory field planning.

### Independent challenge

Design the same acquisition contract for a STAC API, Copernicus catalogue or authorised organisational service. Compare its authentication, pagination, stable identifiers, asset licences and snapshot behaviour with the occurrence API. Do not send large requests. Produce the design and test fixture without requiring a live secret.

### Scientific interpretation

An automated acquisition provides a reproducible selection from an upstream service at a recorded time. It does not establish that coordinates are accurate, sampling is representative or taxonomic identification is correct. Those are separate scientific gates. The manifest makes the boundary visible so the next analyst knows exactly what entered the workflow and why.

### Reflection, submission and portfolio artifact

#### Reflection

1. Which parameter most strongly defines the retrieved population?
2. How would records changing between pages appear in reconciliation?
3. Which failure should stop immediately, and which may retry?
4. What provenance remains if the live endpoint later changes?

#### Submission

Submit `api_acquisition_log.ipynb`, a redacted query contract, acquisition manifest, stable-ID reconciliation, exclusion table, failure-test table and 250–400 word scientific-use decision. Upload no token, credential, signed URL or restricted response.

#### Portfolio artifact

Add the acquisition package to `production-geospatial-computing/acquisition/`. It becomes the first executable, reviewable stage of the final UAV and Satellite Analysis Pipeline.
