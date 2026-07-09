//! BDD test target (cucumber). Feature files live in `tests/bdd/features/`.

mod steps;

use cucumber::World as _;

#[tokio::main(flavor = "current_thread")]
async fn main() {
    steps::TrayWorld::run("tests/bdd/features").await;
}
