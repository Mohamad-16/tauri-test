# FluxBooks Sidecar (placeholder)

Reserved for the RPA sidecar binary (headless browser runner) per
`specs/022-desktop-tray-application` plan.md.

When the first Rust sidecar crate lands here, promote the repository to a
Cargo workspace: add a root `Cargo.toml` with
`members = ["apps/desktop-tray/src-tauri", "apps/desktop-tray/sidecar"]`
and move the shared `Cargo.lock` to the root.
