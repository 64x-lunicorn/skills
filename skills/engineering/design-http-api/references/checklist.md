# API change checklist

## Anti-patterns

| Anti-pattern | Instead |
|---|---|
| `200 OK` with `{"error": ...}` in the body | Correct status code and `application/problem+json` |
| Envelope `{"success": true, "data": ...}` | The resource directly; status via HTTP |
| Verbs in paths (`/getOrders`, `/doCancel`) | Resources and methods |
| Authorisation only per endpoint | Check per resource instance |
| Sequential integer IDs exposed | UUIDv7 or opaque IDs |
| Unpaginated collections | Cursor pagination with a server-side limit |
| Offset pagination under concurrent writes | Cursor over a total sort order |
| Float for money | Decimal string plus ISO 4217 currency |
| Token in the query string | `Authorization` header |
| Stack trace or SQL in an error response | Generic `5xx`, details only in the log |
| Missing `Cache-Control` | Explicit header on every response |
| Blind overwrite without `If-Match` | Optimistic locking, `428` when the precondition is missing |
| ETag as a hash over serialised JSON | Version counter or `updatedAt` |
| Compression after ETag generation, without `Vary` | Weak ETag or one ETag per encoding, plus `Vary` |
| Generic object binding onto entities | Explicit DTO mapping, `additionalProperties: false` |
| Synchronous request over several seconds | `202` plus a job resource |
| Custom status codes or numeric error codes in the body | Registered codes plus a problem `type` URI |
| Endpoint changed, OpenAPI document or Bruno collection not | All three in the same change |

## Checklist

**Design**
- [ ] Paths without verbs, plural, `kebab-case`, at most two nesting levels
- [ ] Method semantics correct (safe / idempotent)
- [ ] Status codes cover every path, including `401`, `403`, `404`, `409`, `422`, `429`
- [ ] Error responses are `application/problem+json` with a stable `type`
- [ ] Collections paginated, `limit` capped, sort order total
- [ ] Enums extensible, clients tolerate unknown values

**Consistency**
- [ ] Naming, time format and money format identical to the rest of the API
- [ ] No `null` versus absent ambiguity, except in Merge Patch

**Correctness under load**
- [ ] ETag present, `If-Match` enforced on writes
- [ ] Idempotency for non-idempotent operations with a business effect
- [ ] `Cache-Control` and `Vary` explicit on every response
- [ ] Timeouts and rate limits defined

**Security**
- [ ] Authorisation checked per resource instance (IDOR/BOLA)
- [ ] Schema validation before business logic, `additionalProperties: false`
- [ ] Body size, nesting depth and array lengths bounded
- [ ] No secrets or personal data in URIs, logs or error messages
- [ ] TLS enforced, security headers set, `Server` header removed
- [ ] SSRF protection for client-supplied URLs
- [ ] Decompression limit when request compression is on

**Privacy**
- [ ] Only the fields the client needs in the response
- [ ] Pseudonymous IDs, no personal data in path or query
- [ ] Retention defined for data, logs and the idempotency store

**Operation and contract**
- [ ] OpenAPI 3.1 updated, examples valid against the schema
- [ ] Swagger UI serves the same document and is not public in production
- [ ] Bruno collection has a request with assertions for every added or changed operation, none for removed ones
- [ ] Breaking change check passed, or a new major version
- [ ] `Deprecation`/`Sunset` on deprecated paths
- [ ] Correlation ID passed through and returned
- [ ] Metrics and alerts for the new path
