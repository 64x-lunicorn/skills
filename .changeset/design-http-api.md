---
"64x-lunicorn-skills": minor
---

Add `design-http-api`: HTTP API contracts are designed against fixed REST guidelines, starting with the per-API choices recorded once, then resources, methods, status codes, problem details, pagination, concurrency, idempotency, security and versioning, with the full rules in reference files loaded per topic. Every added or changed endpoint ships its OpenAPI 3.1 document, Swagger UI that is not public in production, and a Bruno collection with assertions in the same change. `review-architecture` designs endpoint contracts through it, `implement-ticket` builds endpoints with it, and `review-change` reports an endpoint change without matching OpenAPI and Bruno updates as a hard finding.
