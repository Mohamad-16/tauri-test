//! Property: no secret embedded in any credential-shaped context survives
//! redaction (SC-005 groundwork).

use fluxbooks_lib::audit::Redactor;
use proptest::prelude::*;

proptest! {
    #[test]
    fn secrets_never_survive_redaction(
        secret in "[A-Za-z0-9]{16,48}",
        key in prop::sample::select(vec!["password", "secret", "api_key", "token", "credential"]),
        prefix in "[a-z ]{0,20}",
        suffix in "[a-z ]{0,20}",
    ) {
        let redactor = Redactor::standard();
        let samples = [
            format!("{prefix}{key}={secret}{suffix}"),
            format!("{prefix}{key}: {secret} {suffix}"),
            format!(r#"{{"{key}": "{secret}"}}"#),
            format!("{prefix}Authorization: Bearer {secret}{suffix}"),
        ];

        for sample in samples {
            let clean = redactor.redact(&sample);
            prop_assert!(!clean.contains(&secret), "secret survived: {clean:?}");
        }
    }
}
