# FluxBooks Tray Project TODOs

## Current baseline status

- Phase 0: Baseline
  - `cargo check --manifest-path apps/desktop-tray/src-tauri/Cargo.toml` succeeded.
  - `npm run build` succeeded for `@fluxbooks/desktop-tray-ui` and produced a production bundle.
  - `cargo test --manifest-path apps/desktop-tray/src-tauri/Cargo.toml --features testkit` passed 23 unit tests, 2 BDD scenarios, 1 integration test, and 1 property test.
  - Git working tree is dirty: modified and untracked files exist under `apps/desktop-tray/src-tauri/`.
  - Action: clean/commit current work before final baseline verification.

## Phase progress

- Phase 1: Monorepo restructure
  - Confirmed: root `package.json` uses workspaces for `apps/desktop-tray/ui` and `tools/mock-ws-server`.
  - Confirmed: `apps/desktop-tray/src-tauri/tauri.conf.json` points `frontendDist` to `../ui/dist`.
  - Note: root Cargo workspace is not yet present; `apps/desktop-tray/sidecar/README.md` documents future workspace promotion.

- Phase 2: T001 Rust module + Vue domain skeletons + test dirs
  - Confirmed: Rust module skeletons in `apps/desktop-tray/src-tauri/src/` and Vue domain directories in `apps/desktop-tray/ui/src/domains/`.
  - Confirmed: test directories exist under `apps/desktop-tray/src-tauri/tests/`.

- Phase 3: T003 pinned dependencies
  - Confirmed: `apps/desktop-tray/src-tauri/Cargo.toml` pins Cargo dependency versions.
  - Confirmed: `rust-toolchain.toml` pins `stable` channel and includes `rustfmt` and `clippy`.

- Phase 4: T004 lint/format/typing
  - Confirmed: root `package.json` defines `lint`, `format`, and `prepare` (husky).
  - Confirmed: `eslint.config.js` exists and `lint-staged` includes Rust formatting via Cargo.
  - Action: run `npm run lint` and `npm run format` to verify frontend formatting and linting.

- Phase 5: T006 schemas
  - Confirmed: JSON schema contracts exist under `apps/desktop-tray/contracts/`.
  - Confirmed: serde model module exists in `apps/desktop-tray/src-tauri/src/schemas/`.

- Phase 6: T007 rusqlite store
  - Confirmed: store module exists at `apps/desktop-tray/src-tauri/src/store/`.
  - Action: verify migrations, CRUD behavior, and no-credential guard tests.

- Phase 7: T008 audit + redaction layer
  - Confirmed: audit/redaction module exists and property tests are present under `apps/desktop-tray/src-tauri/tests/property/`.

- Phase 8: T009-T012 ports + fakes + cucumber
  - Confirmed: credential, scriptlib, runner, updater ports exist.
  - Confirmed: `testkit` module and BDD/cucumber test scaffolding exist.

- Phase 9: Tray icon + close-to-tray lifecycle
  - Confirmed: Tauri tray-icon plugin is included and bundle icons are configured in `tauri.conf.json`.

- Phase 10: WebSocket notify module + Vue notifications domain + mock server
  - Confirmed: websocket dependencies and `tools/mock-ws-server` folder exist.
  - Note: UI notification domain likely present in `apps/desktop-tray/ui/src/domains/notifications`.

- Phase 11: Playwright harness + mutants.toml + CI workflows
  - Confirmed: `apps/desktop-tray/ui/package.json` includes `test:e2e` using Playwright.
  - Not found: `mutants.toml` file in repository.
  - Confirmed: `.github/workflows/build.yml` exists but only covers build packaging.

- Final verification
  - Baseline Rust compile passes.
  - Need to execute full lint, test, frontend E2E, and manual checks for final verification.

## Immediate next steps

1. Commit or stash current dirty work.
2. Run `npm install` if dependencies are not yet installed.
3. Run `npm run lint` from repo root.
4. Run `npm run format` if formatting is required.
5. Run `cargo fmt --manifest-path apps/desktop-tray/src-tauri/Cargo.toml` and `cargo clippy --manifest-path apps/desktop-tray/src-tauri/Cargo.toml -- -D warnings`.
6. Run frontend and Rust tests:
   - `npm run test:e2e -w @fluxbooks/desktop-tray-ui`
   - `cargo test --manifest-path apps/desktop-tray/src-tauri/Cargo.toml`
7. Add `mutants.toml` and expand CI if required by Phase 11.
