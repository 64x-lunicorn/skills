# Resources, methods and status codes

Normative terms follow RFC 2119/8174: MUST, MUST NOT, SHOULD, SHOULD NOT, MAY.

## Principles

1. **Do not reinvent HTTP.** Caching, concurrency, content negotiation, error classes and authentication MUST use the HTTP mechanisms, not custom body fields.
2. **No envelope.** Status code and headers carry metadata, not a `{"status": "ok", "data": {...}}` wrapper. Exception: collection responses with pagination metadata.
3. **URIs are not the contract.** Clients MUST take URIs from links or documented templates and not assemble them (RFC 9205).
4. **Plan for extension.** Clients MUST ignore unknown JSON fields, enum values and link relations ("must-ignore"). The API documentation states this rule explicitly.
5. **Evolvability over elegance.** An API that can grow without a breaking change is worth more than one that looks nicer today.
6. **Consistency over local optimisation.** Within one API, the same concept MUST have the same name and behaviour everywhere.

## URIs

- Path segments MUST be `kebab-case`: `/delivery-addresses`, not `/deliveryAddresses` or `/delivery_addresses`.
- Collection resources MUST be plural: `/orders`, `/orders/{orderId}`.
- URIs MUST NOT end with `/`.
- Verbs in paths are not allowed: no `/getUser`, no `/orders/{id}/doCancel`.
- File extensions in paths (`.json`, `.xml`) are not allowed; the format is negotiated with `Accept`.
- Nesting MUST stay at two levels at most and only where a real composition exists:
  - good: `/orders/{orderId}/items/{itemId}`
  - bad: `/customers/{cId}/orders/{oId}/items/{iId}/attachments/{aId}`
  - Sub-resources with their own identity MUST also be reachable under a top-level path: `/order-items/{itemId}`.
- Query parameters use one casing per API, recorded as a per-API choice, never mixed.

### Actions that are not CRUD

Model state transitions as resources, not RPC verbs:

```
POST   /orders/{id}/cancellations          # creates a cancellation
POST   /devices/{id}/firmware-updates      # creates an update job
PUT    /features/{id}/activation           # state of a sub-resource
```

When that cannot be modelled sensibly, an explicit action suffix is allowed, documented as an exception:

```
POST   /reports/{id}:export
```

### IDs

- Resource IDs MUST be opaque. Clients assume no structure.
- Sequential integer IDs SHOULD NOT be exposed; they are enumerable and reveal business volume.
- Recommended: **UUIDv7** (RFC 9562), random enough, time-sortable, index-friendly. Alternatives: ULID or a prefixed opaque token (`ord_7f3a...`).
- IDs MUST NOT contain personal data (no email, serial number tied to a person, employee number in URIs; see security-and-privacy).

## Methods

| Method | Semantics | Safe | Idempotent | Request body | Response body |
|---|---|---|---|---|---|
| `GET` | Read | yes | yes | no | yes |
| `HEAD` | Read metadata | yes | yes | no | no |
| `POST` | Create / non-idempotent action | no | no | yes | yes |
| `PUT` | Replace fully / create at known URI | no | yes | yes | optional |
| `PATCH` | Change partially | no | no* | yes | optional |
| `DELETE` | Delete | no | yes | no | no |
| `OPTIONS` | Query capabilities | yes | yes | no | yes |

\* PATCH can be made idempotent (Merge Patch without relative operations) and SHOULD be.

- `GET` and `HEAD` MUST have no side effects: no state change, no quota consumption, no messages sent.
- `GET` MUST NOT take a request body. For complex searches use `POST /resources/searches` returning a result handle, or filters in the query string.
- `PUT` replaces fully. Missing fields mean "set to default/null", not "leave unchanged".
- `PATCH` MUST use a declared patch format: `application/merge-patch+json` (RFC 7396) by default, `application/json-patch+json` (RFC 6902) when array operations or test conditions are needed. "JSON with a few fields" without a declared media type is not allowed.
- `DELETE` MUST be idempotent: a second delete returns `404`, not `500`. `204` on the second call is also acceptable but MUST be documented.
- Deletion with a retention duty (soft delete) still uses `DELETE`; the restore path is documented separately.

## Status codes

Use registered codes only. Clients MUST handle unknown codes by class (`2xx`/`3xx`/`4xx`/`5xx`).

### Success

| Code | Use |
|---|---|
| `200 OK` | GET/PUT/PATCH with body |
| `201 Created` | Resource created. `Location` header MUST be set. |
| `202 Accepted` | Accepted asynchronously. `Location` pointing to a status resource MUST be set. |
| `204 No Content` | Success without body (DELETE, PUT with `Prefer: return=minimal`) |
| `206 Partial Content` | Range response |

### Redirection

| Code | Use |
|---|---|
| `301` / `308` | Moved permanently. `308` keeps the method; prefer it for APIs. |
| `302` / `307` | Temporary. `307` keeps the method; prefer it for APIs. |
| `304 Not Modified` | Response to a conditional GET |

### Client errors

| Code | Use |
|---|---|
| `400 Bad Request` | Syntactically broken: invalid JSON, missing required parameter |
| `401 Unauthorized` | Missing or invalid authentication. `WWW-Authenticate` MUST be set. |
| `403 Forbidden` | Authenticated but not permitted |
| `404 Not Found` | Does not exist **or** must not be seen (see security-and-privacy) |
| `405 Method Not Allowed` | `Allow` header MUST be set |
| `406 Not Acceptable` | No format from `Accept` can be delivered |
| `409 Conflict` | State conflict (duplicate, invalid transition) |
| `410 Gone` | Existed, permanently removed |
| `412 Precondition Failed` | `If-Match` failed |
| `413` / `414` / `415` | Body too large / URI too long / media type not supported |
| `422 Unprocessable Content` | Syntactically valid, semantically invalid (validation error) |
| `428 Precondition Required` | Server requires `If-Match`, client sent none |
| `429 Too Many Requests` | Rate limit. `Retry-After` SHOULD be set. |

### Server errors

| Code | Use |
|---|---|
| `500 Internal Server Error` | Unexpected error. MUST NOT serve as a catch-all for client errors. |
| `501 Not Implemented` | Method not supported at all |
| `502` / `503` / `504` | Upstream error / overload / upstream timeout. `Retry-After` SHOULD be set on `503`. |

### Commonly confused

- `400` vs `422`: `400` = could not be parsed. `422` = parsed, but a business rule is violated.
- `401` vs `403`: `401` = "I do not know who you are". `403` = "I know, and you still may not".
- `403` vs `404`: when the mere existence of a resource is confidential, return `404`.
- `409` vs `412`: `409` = business conflict. `412` = a precondition header failed.
