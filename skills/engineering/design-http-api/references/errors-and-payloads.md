# Errors and payloads

## Error responses

Every error (`4xx`, `5xx`) MUST be `application/problem+json` per **RFC 9457**.

```http
HTTP/1.1 422 Unprocessable Content
Content-Type: application/problem+json
Content-Language: en

{
  "type": "https://api.example.com/problems/validation-failed",
  "title": "Validation failed",
  "status": 422,
  "detail": "The field 'deliveryDate' is in the past.",
  "instance": "/orders/7f3a1b2c",
  "traceId": "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01",
  "errors": [
    {
      "pointer": "/deliveryDate",
      "code": "date_in_past",
      "detail": "Must be today or later."
    }
  ]
}
```

- `type` MUST be a stable, documented URI. **It is the machine-readable error code**: clients program against `type`, never against `title` or `detail`.
- `type` MUST stay stable for the lifetime of a major version. Adding `type` values is not a breaking change; clients fall back to the status code class for unknown values.
- `title` is for humans, short, without variable parts.
- `detail` is for humans, may contain variable parts, and MUST NOT contain stack traces, SQL, internal host names, file paths or database IDs.
- Field-level validation errors MUST be an array under their own field (`errors`), each with a JSON Pointer (RFC 6901) to the affected field.
- Every error response SHOULD carry a correlation ID (`traceId` or the `traceparent` header) that can be found in the server log.
- `5xx` responses MUST stay generic: no internal details.
- Every possible `type` value MUST be documented in the OpenAPI document.

## JSON

- Default format is JSON (RFC 8259), UTF-8, no BOM.
- Field names use one casing per API (`camelCase` or `snake_case`), recorded as a per-API choice.
- The top-level structure of a response MUST be an object, never a bare array; a bare array blocks adding metadata later.
- `null` and "field absent" MUST mean the same, except in JSON Merge Patch where `null` means "delete". Document that exception.
- Empty collections MUST be `[]`, not `null` or omitted.
- Boolean fields SHOULD be phrased positively: `enabled`, not `disabled`.

## Types

| Concept | Rule |
|---|---|
| Point in time | RFC 3339, always UTC with `Z`: `2026-09-14T10:30:00Z`. Field name ends in `At`. |
| Date | `2026-09-14` (RFC 3339 full-date) |
| Duration | ISO 8601 duration (`PT30M`) or integer with the unit in the field name (`timeoutSeconds`) |
| Time zone | Separate IANA field (`Europe/Berlin`), not an offset. RFC 9557 when needed. |
| Money | Object of `amount` (string, decimal) and `currency` (ISO 4217). **Never a float.** |
| Decimals | As a string when precision matters to the business |
| Integers | Declare `format: int32`/`int64` in the schema. Values above 2^53 MUST be strings (JavaScript precision). |
| Language | BCP 47 (`de-DE`) |
| Country | ISO 3166-1 alpha-2 |
| Binary data | Base64url (RFC 4648) with a declared content type; from about 1 MB a separate resource instead of inline |

## Enums

- Enum values use one casing per API (`UPPER_SNAKE_CASE` or `lower_snake_case`), never language-dependent.
- Clients MUST tolerate unknown enum values (fallback to "unknown"). Adding an enum value is **not** a breaking change, and the documentation says so.
- Enums MUST NOT be encoded as numbers.
