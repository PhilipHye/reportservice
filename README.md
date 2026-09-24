# Report Service

A small, API-first document generation platform: turn "add a new report"
into mostly configuration instead of a new application.

Originally designed to replace a legacy Pentaho-based reporting setup;
this repo is a generalized, demo-data version

## Architecture

```
Client Application
        ↓
   Report Service      — API, report definitions, orchestration
        ↓
  Data Connector        — owns approved SQL, validates params, holds DB credentials
        ↓
   Data Source           (SQLite for this demo; swappable for Postgres/MySQL/etc.)
        ↓
  Data returned (a table — nothing more)
        ↓
   Report Service
        ↓
     Carbone             — merges data into a template
        ↓
    DOCX / PDF
```

**Security boundary:** only the Data Connector ever touches the database.
It exposes one endpoint that runs a fixed set of pre-approved, parameterized
queries — never arbitrary SQL from a client.

## Packages

- `packages/data-connector` — the guarded query executor
- `packages/report-service` — the public API + Carbone rendering

## Quickstart

```bash
npm install

# seed demo data (fake accounts/transactions, SQLite)
npm run seed

# terminal 1
cp packages/data-connector/.env.example packages/data-connector/.env
npm run start:connector

# terminal 2
cp packages/report-service/.env.example packages/report-service/.env
npm run start:report-service
```

Then, once a template is added (see `packages/report-service/templates/README.md`):

```bash
curl -X POST http://localhost:4000/reports/account-statement/run \
  -H "Content-Type: application/json" \
  -d '{"account_id":"ACC-1001","from_date":"2026-01-01","to_date":"2026-03-31"}' \
  --output statement.docx
```

## Design notes

- **Running balance is computed in SQL** (`SUM() OVER (...)` window function
  in the Data Connector), not via Carbone's aggregator formatters — those
  are an Enterprise-only feature in Carbone's free/embedded edition.
- **MVP scope is deliberately one report, synchronous, minimal auth.**
  Async job handling, a real query/report registry, and multi-source
  support (a second Data Connector for a different backend) are documented
  as the next phases, not built prematurely.
