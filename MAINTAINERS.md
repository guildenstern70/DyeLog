# Maintainer Procedures

This guide is for maintainers who need to modify the library and publish
releases to JSR.

## 1) Where to edit

- Public package entrypoint: `src/mod.ts` (also declared in `deno.json` and
  `jsr.json`).
- Demo app (not published API): `src/main.ts`.
- Tests: `test/test.ts`.
- User docs to keep aligned: `README.md` and `src/README.md`.

## 2) Safe code-change procedure

1. Make API/behavior changes in `src/mod.ts`.
2. Keep log methods parallel (`trace`, `debug`, `info`, `warn`, `error`) when
   changing pipeline behavior.
3. If output format changes, update:
   - `README.md`
   - `src/README.md`
   - `test/test.ts`
4. Run local quality checks before release work.

## 3) Version and metadata alignment

When bumping version, keep these in sync:

- `jsr.json` -> `version`
- `deno.json` -> `version` (and `name`/`exports` aligned with `jsr.json`)
- `src/main.ts` -> `appVersion`

JSR source of truth for publish metadata is `jsr.json`.

## 4) Local validation commands

Run from repository root:

```bash
deno fmt --check
deno lint
deno task test
deno publish --dry-run
```

If your working tree is intentionally dirty during checks:

```bash
deno publish --dry-run --allow-dirty
```

## 5) Publish to JSR

Use this flow only after tests and dry-run pass:

```bash
deno publish
```

Notes:

- CI publish is defined in `.github/workflows/deno.yml` and runs on release
  events.
- Prefer JSR examples/specifiers (`jsr:@littlelite/dyelog`) in docs; keep Deno/X
  references clearly legacy/secondary.
