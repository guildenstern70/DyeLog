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

`src/main.ts` reads demo version from `src/version.ts`, which sources
`deno.json`.

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

The JSR publish process is triggerd by GitHub Actions 
when you push a tag that matches the `version` field in `jsr.json`. To publish:

1. Bump version in `jsr.json` and `deno.json` (keep aligned).
2. Push a tag that matches the new version, e.g. `git tag v1.2.3 && git push origin v1.2.3`.
3. GitHub Actions will run the publish workflow, which includes a `deno publish --dry-run` step for validation. If that step fails, fix any issues and push a new tag to trigger another publish attempt.
4. Once the workflow completes successfully, the new version will be published to JSR. You can verify the release on the JSR website and update any user-facing docs if needed.

