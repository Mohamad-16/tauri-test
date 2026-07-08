# Unit tests

Unit tests live **in-module** (`#[cfg(test)] mod tests` next to the code they
cover), per Rust convention. This directory exists to mirror the layout named
in spec 022 T001; do not add files here — run them with `cargo test --lib`.
