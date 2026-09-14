# Transport, compression and observability

Rules for server, reverse proxy and runtime configuration, applied when an API is implemented or deployed rather than when its contract is designed.

## Response compression

- Textual responses (JSON, XML, CSV) from about 1 KB SHOULD be compressed.
- Preference: `br` (RFC 7932), then `gzip`, then none. `zstd` (RFC 8878) MAY be used with controlled clients.
- `deflate` MUST NOT be offered (historical implementation problems).
- Dynamic Brotli SHOULD run at level 4 to 5; level 11 only for static, precompressed artefacts.
- Already compressed content (images, archives, firmware images) MUST NOT be compressed again.

## Compression and ETags

The most common mistake: a reverse proxy compresses after the application set the ETag, giving two byte sequences with the same ETag.

- `Vary: Accept-Encoding` MUST be set.
- Either mark the ETag **weak** (then independence from encoding is allowed) **or** give each content encoding its own ETag.
- The chosen approach MUST be agreed between application and proxy.

## Request compression

- Compressed request bodies MAY be accepted. Then:
  - an absolute size limit **after** decompression,
  - a compression ratio limit (zip bomb protection),
  - for an unsupported encoding: `415` with `Accept-Encoding` in the response.
- Without these limits request compression is a DoS surface and MUST stay disabled.

## BREACH

Responses that contain both a secret (token, CSRF value) **and** reflected, attacker-controlled input MUST NOT be compressed. Pure JSON APIs with bearer auth in the header are usually unaffected.

## Protocol

- HTTP/2 or HTTP/3 SHOULD be used. Header compression (HPACK RFC 7541, QPACK RFC 9204) is the bigger lever than body compression for many small requests with large auth and tracing headers.
- `Transfer-Encoding` exists only in HTTP/1.1; API design MUST NOT rely on it.

## Alternative representations

For bandwidth- or latency-critical paths, a binary format MAY be offered next to JSON via `Accept`: CBOR (`application/cbor`, RFC 8949) or Protobuf. The schema MUST then be identical for both formats.

## Observability

- Every request MUST have a correlation ID. Prefer W3C Trace Context (`traceparent`/`tracestate`); a value sent by the client MUST be adopted, otherwise generated.
- The correlation ID MUST be returned in the response (header and/or problem details field).
- Metrics per endpoint MUST include at least: rate, error ratio by status code class, latency percentiles (p50/p95/p99).
- Health endpoints MUST be separate: liveness (process alive) and readiness (dependencies available). They MUST NOT expose internal topology unprotected.
- The OpenAPI document SHOULD be discoverable via `Link: <...>; rel="service-desc"` (RFC 8631).
