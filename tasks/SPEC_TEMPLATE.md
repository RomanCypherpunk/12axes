# Spec: Create a payment charge (POST /v1/charges)
# Status: requirements:approved

## Overview
A merchant creates a charge against a customer. This moves money, so it
must be safe to retry and impossible to double-bill.

## In scope
- Create a charge from an authenticated merchant request.
- Return the charge id and status.
- Guarantee exactly-once billing under client retries.

## Out of scope (v1)
- Refunds (separate spec: 005-refunds).
- Partial captures.
- Multi-currency. All amounts are BRL, stored as integer cents. Never float.

## Functional requirements (EARS)
- FR-1  WHEN a merchant POSTs a charge with a valid Idempotency-Key,
        THE SYSTEM SHALL create at most one charge for that key.
- FR-2  WHEN the same Idempotency-Key is replayed within 24h,
        THE SYSTEM SHALL return the original charge and create no new one.
- FR-3  IF the amount is <= 0,
        THE SYSTEM SHALL reject with 422 "amount must be positive".
- FR-4  IF the merchant is over its rate limit,
        THE SYSTEM SHALL reject with 429 and a Retry-After header.
- FR-5  WHILE a charge is pending,
        THE SYSTEM SHALL NOT allow a second capture.

## Acceptance criteria (examples the agent must satisfy)
- amount=1000, key=abc            -> 201, status=pending
- same key=abc, replayed          -> 200, same charge id, no new row
- amount=0                        -> 422 "amount must be positive"
- amount=-50                      -> 422 "amount must be positive"
- 6th request in 1s, one merchant -> 429, Retry-After: 1

## Non-functional
- p95 latency under 300ms at 200 requests/sec per merchant.
- Every money value is an integer. No floating point anywhere in the path.

## Data
- charges(id, merchant_id, amount_cents, currency, status,
          idempotency_key, created_at)
- UNIQUE(merchant_id, idempotency_key)   # this is what enforces FR-1

## Verification
- Integration test replays one key 50x concurrently; assert exactly one
  row and one ledger entry.
- Load test holds p95 < 300ms at 200 rps.

## Confirm before building
Do not write code until you restate FR-1 through FR-5 and the uniqueness
constraint in your own words. If any acceptance criterion is ambiguous,
ask before implementing.