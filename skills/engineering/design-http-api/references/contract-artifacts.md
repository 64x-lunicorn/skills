# Contract artifacts

Every HTTP API ships three artifacts that change together with the code: the OpenAPI document, Swagger UI serving it, and a Bruno collection. Find existing ones before creating any; a second OpenAPI file or collection for the same API drifts from the first.

## OpenAPI document

- OpenAPI 3.1, one document per major version, committed in the repository.
- It is the source of truth. When the project has code generation or contract tests, they check implementation against this document.
- `info.description` states the must-ignore rule: clients ignore unknown fields, enum values and link relations.
- Every operation has:
  - `operationId`, `summary` and a description of its purpose,
  - `security` with the scopes or roles it needs,
  - every status code it can return, each error response as `application/problem+json` with the `type` values it can carry,
  - the headers the rules require: `Location` on `201` and `202`, `ETag` on `GET` of mutable resources, `If-Match` on writes, `Idempotency-Key` where supported, `Retry-After` on `429` and `503`,
  - its rate limit and idempotency behaviour in the description,
  - examples that validate against the schema.
- Request schemas set `additionalProperties: false` and bound every string (`maxLength`), number (`minimum`, `maximum`) and array (`maxItems`).
- Shared shapes live in `components`: the problem details schema, pagination, money, common headers and parameters. A shape defined twice diverges.
- A departure from a MUST rule is written into the operation's description with its reason.

## Swagger UI

- Served by the application from the same OpenAPI document, never from a copy.
- Not publicly reachable in production: disabled there, or behind the API's authentication. A public Swagger UI hands out a map of the whole attack surface.
- The raw document is served next to it and linked from API responses with `Link: <...>; rel="service-desc"` (RFC 8631).

## Bruno collection

Bruno stores collections as plain files, so the collection is committed and reviewed like code.

- **Format.** A new collection uses OpenCollection YAML, the format Bruno recommends since 3.0: `opencollection.yml` at the root, one `.yml` file per request, `folder.yml` per folder, environments under `environments/`. An existing `.bru` collection keeps its format; converting it is its own change, not part of a feature.
- **Structure.** One folder per resource, one request per operation, named like its `operationId`. Add requests for the error cases a client must handle and that are reachable with test data: `401`, `404`, `409` or `412`, `422`.
- **Assertions on every request:**
  - `res.status` equals the documented code,
  - `res.headers['content-type']` contains `application/json` or `application/problem+json`,
  - the headers the rules require for that response, such as `location` on `201` or `etag` on `GET`,
  - the fields a client relies on, such as `res.body.id` being defined or `res.body.type` on a problem response.
- **Chaining.** IDs created by one request are stored in a variable by a post-response script and used by the next. Hard-coded IDs break as soon as the data changes, and URIs are not the contract.
- **Environments.** One environment per target, such as `local`. Environment files hold only non-secret values like `baseUrl`. Tokens and keys are secret variables, which Bruno keeps out of the environment file, or come from a `.env` file at the collection root read as `{{process.env.API_TOKEN}}`. That `.env` file is listed in `.gitignore`, because a committed token is a secret in the repository.
- **Headless runs.** With `@usebruno/cli`, run `bru run --env local` from the collection directory; `--reporter-junit <path>` writes a report for CI. The exit code is `1` when any request, test or assertion fails. Wiring the run into the project's `CI gate` is a separate decision for `configure-ci-gate`.
