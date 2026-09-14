# Collections, concurrency, caching, idempotency and long-running operations

## Pagination

Every collection resource MUST be paginated, even when it holds 20 entries today.

**Preferred: cursor-based.** Offset pagination produces duplicates and gaps under concurrent writes and gets expensive at large offsets.

```http
GET /orders?limit=50&cursor=eyJpZCI6Ijdm...
```

```json
{
  "items": [ ... ],
  "pagination": {
    "nextCursor": "eyJpZCI6IjhhNGIi...",
    "hasMore": true
  }
}
```

The `Link` header (RFC 8288) SHOULD be set as well:

```http
Link: <https://api.example.com/orders?limit=50&cursor=eyJ...>; rel="next"
```

- The cursor MUST be opaque (base64url over internal sort keys) and signed or validated, so clients cannot manipulate it.
- `limit` MUST be capped on the server (for example default 25, maximum 200). Values above the maximum are reduced to it, not rejected.
- A total `totalCount` SHOULD NOT be returned by default (expensive count over large tables). When needed, opt in: `?includeTotal=true`.
- Offset pagination MAY be used for small, stable data sets and then MUST have a hard offset maximum.

## Filtering and sorting

```http
GET /orders?status=SHIPPED&createdAt.gte=2026-01-01&sort=-createdAt,id
```

- Filter parameters MUST be declared explicitly in the schema. No generic query language that reaches the database.
- Sorting: `sort` with a comma-separated field list, `-` for descending. Allowed sort fields MUST be allowlisted.
- The sort order MUST be total (last criterion unique, such as `id`), otherwise cursor pagination is unstable.
- Never take SQL, JSONPath or template fragments from client input into queries.

## Sparse fieldsets

Optional, useful for bandwidth-critical clients:

```http
GET /orders/{id}?fields=id,status,total
```

- Not standardised: pick one convention per project and keep it.
- Field selection MUST NOT bypass authorisation: fields a caller may not see stay absent even when requested.
- Omitted fields MUST be reflected in the ETag.

## Concurrency: ETags and conditional requests

- Every mutable single resource MUST return an `ETag` on `GET`.
- Every mutating operation (`PUT`, `PATCH`, `DELETE`) on such a resource MUST evaluate `If-Match`.
- Without `If-Match`, answer `428 Precondition Required` (RFC 6585) instead of overwriting blindly (SHOULD).
- ETag does not match: `412 Precondition Failed`.
- `If-None-Match: *` on `PUT` means "create only if absent"; when it exists, `412`.
- Precondition evaluation order MUST follow RFC 9110 section 13.2.2: `If-Match`, `If-Unmodified-Since`, `If-None-Match`, `If-Modified-Since`, `If-Range`.

### Generating ETags

- Derive the ETag from a version counter or `updatedAt` plus resource ID, **not** from a hash over serialised JSON (SHOULD). Field order and embedded timestamps make JSON hashes unstable, and serialisation would have to happen before the 304 decision.
- For a conditional GET, the 304 decision MUST happen **before** loading and serialising the full resource; that is where the performance gain comes from.
- Use weak ETags (`W/"..."`) when byte identity is not guaranteed, for example with compression (SHOULD). Strong ETags are only needed for `If-Range` and range requests.
- When the representation depends on `Accept`, `Accept-Language`, `fields` or permissions, the ETag MUST include that variance and `Vary` MUST be set accordingly.

### 304 responses

A `304` MUST contain `ETag`, `Cache-Control`, `Vary` and, where relevant, `Content-Location`. It MUST NOT contain a body.

## Caching

Every response MUST set an explicit `Cache-Control` header, `no-store` included. Defaults depend on the implementation and are unreliable.

| Case | Header |
|---|---|
| Personal / auth-dependent | `Cache-Control: private, no-cache` |
| Sensitive, never store | `Cache-Control: no-store` |
| Public, stable | `Cache-Control: public, max-age=300` |
| Immutable (versioned assets) | `Cache-Control: public, max-age=31536000, immutable` |
| Error responses | `Cache-Control: no-store` |

- `Vary` MUST be set as soon as content negotiation, compression or authentication affect the response. Minimum: `Vary: Accept, Accept-Encoding`.
- Responses that depend on `Authorization` MUST NOT be `public`.
- `no-cache` means "revalidate", `no-store` means "do not store at all".
- `stale-while-revalidate` (RFC 5861) MAY be used for expensive, non-critical reads.

## Idempotency

- `GET`, `HEAD`, `PUT`, `DELETE` and `OPTIONS` MUST be idempotent.
- `POST` on operations with a business effect (payment, order, device command, dispatch) MUST support an `Idempotency-Key` request header.

1. The client generates the key (UUID); it stays constant across retries of the same logical request.
2. The server stores `(key, requestFingerprint, response)` for a documented retention (24 h is common).
3. Same key **and** same payload: return the stored response unchanged.
4. Same key, **different** payload: `422` or `409` with its own problem `type`.
5. Concurrent requests with the same key: the second gets `409` or waits for the first. A race that lets both through is a bug; it needs an atomic insert (unique constraint), not read-then-write.
6. The key MUST be scoped per tenant or client identity.

`Idempotency-Key` is **not an RFC**. `draft-ietf-httpapi-idempotency-key-header` (last version -07, October 2025) expired without publication. The header name is consistent across the industry; document its semantics yourself.

## Long-running operations

Anything that takes longer than about 2 seconds SHOULD be asynchronous.

```http
POST /devices/{id}/firmware-updates
-> 202 Accepted
   Location: /firmware-update-jobs/9f2b
   Retry-After: 5

GET /firmware-update-jobs/9f2b
-> 200 OK
   { "status": "RUNNING", "progress": 0.42 }

-> 200 OK
   { "status": "SUCCEEDED", "result": { "href": "/devices/.../firmware" } }
```

- The job status MUST be a defined enum (`PENDING`, `RUNNING`, `SUCCEEDED`, `FAILED`, `CANCELLED`).
- On failure, the job resource still answers `200`; the error is a problem details object **inside** the job body.
- `Retry-After` SHOULD give the polling interval.
- Job resources MUST have a documented retention.

### Webhooks

- Deliveries MUST be signed (HMAC over body plus timestamp, or RFC 9421 HTTP Message Signatures).
- A timestamp MUST be part of the signature (replay protection), with a narrow tolerance window.
- Receivers MUST tolerate duplicates (at-least-once). Every message carries a stable event ID.
- Retries MUST use exponential backoff with jitter, a defined cut-off and a dead-letter path.
- Webhook target URLs from customer configuration MUST be checked against SSRF.
