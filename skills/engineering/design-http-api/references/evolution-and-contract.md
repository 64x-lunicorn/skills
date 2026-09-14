# Versioning, evolution and documentation

## Versions

- The major version MUST be in the path: `/v1/orders`. Media type versioning is allowed but raises the error rate in clients and caches.
- Minor versions MUST NOT appear in the URI.

## Non-breaking changes (allowed without a new version)

- New optional request fields
- New response fields
- New endpoints, new enum values, new problem `type` values
- New optional headers

Precondition: the must-ignore rule is documented and clients follow it.

## Breaking changes (new major version)

- Removing or renaming a field
- Changing a field's type or format
- Adding a required field
- Changing the meaning of an existing field
- Tightening validation
- Changing the status code for an existing case
- Changing a default value

## Deprecation

```http
Deprecation: @1789820400
Sunset: Wed, 31 Dec 2026 23:59:59 GMT
Link: <https://developer.example.com/migration/v2>; rel="deprecation"; type="text/html"
```

- `Deprecation` (RFC 9745) and `Sunset` (RFC 8594) MUST be set as soon as an endpoint is deprecated.
- A documented minimum period MUST lie between announcement and shutdown.
- Use of deprecated endpoints MUST be measured per client. Shutdown happens only after proven non-use or active notification.

## Documentation and contract

- The API MUST be specified as **OpenAPI 3.1** (JSON Schema compatible).
- The OpenAPI document is the source of truth. Code generation or contract tests in CI MUST enforce that implementation and document match.
- Every endpoint MUST document: purpose, auth requirement, required scopes or roles, all status codes, all problem `type` values, rate limits, idempotency behaviour.
- Examples MUST be valid against the schema.
- Breaking change detection against the previous version of the document SHOULD run automatically in CI.
