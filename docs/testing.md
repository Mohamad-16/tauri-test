# Testing

## Rust (`apps/desktop-tray/src-tauri`)

- **Unit** — in-module `#[cfg(test)] mod tests`. Run: `cargo test --lib --features testkit`.
- **Integration** — `tests/integration/` (temp-dir sqlite, cross-module smoke). Run: `cargo test --test integration --features testkit`.
- **Property** — `tests/property/` (proptest). Run: `cargo test --test property --features testkit`.
- **BDD** — `tests/bdd/` (cucumber, `harness = false`). Run: `cargo test --test bdd --features testkit`.

All test targets require `--features testkit` (the in-memory port fakes; never compiled into release builds).

## Frontend (`apps/desktop-tray/ui`)

- **E2E** — Playwright, `tests/e2e/`. Run: `npm run test:e2e` (from repo root) or `npx playwright test` (from `ui/`).
- Runs against a browser context, not a real Tauri webview — anything gated on `@tauri-apps/api` must fail soft when the Tauri bridge is absent, so these tests can't validate native-only behavior (tray icon, OS notifications, WS-to-webview events). Full in-app coverage of those is a follow-up (tauri-driver/WebdriverIO).

## Mutation testing (T037 groundwork)

`apps/desktop-tray/src-tauri/mutants.toml` scopes `cargo-mutants` to the credential, schedule, audit and update paths — the ones named in T037 (Constitution Art. II). Target: **>= 70% mutation score (MSI)** on those paths.

Run locally:

```bash
cd apps/desktop-tray/src-tauri
cargo mutants
```

CI runs this as a **non-blocking** job — compiling the tauri crate once per mutant is slow, and a skeleton with mostly-passthrough logic isn't where mutation testing pays off yet. Tighten as real business logic lands in these modules.

## Coverage

CI uploads a `cargo llvm-cov` lcov artifact and enforces a soft line threshold (50%) as a baseline, not a real quality bar. Intent going forward: move to **changed-line coverage** gating (e.g. via a patch-coverage tool) once the credential/scheduler/runner logic is more than a skeleton — full-file coverage isn't meaningful yet on code that's mostly trait definitions and fakes.
