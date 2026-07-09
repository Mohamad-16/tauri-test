//! Secret redaction: every log/event/telemetry string passes through here.

use regex::Regex;

pub const REDACTED: &str = "[REDACTED]";

pub struct Redactor {
    patterns: Vec<Regex>,
}

impl Redactor {
    /// Standard pattern set: credential key/value pairs, bearer tokens, JWTs,
    /// and long opaque token blobs.
    pub fn standard() -> Self {
        // Order matters: token-shaped spans (Bearer/JWT) must be scrubbed
        // BEFORE the key/value pattern, whose value match stops at the first
        // space and would otherwise eat "Bearer" but leave the token behind.
        let patterns = [
            // Authorization: Bearer xyz
            r"(?i)\bbearer\s+[A-Za-z0-9._~+/-]+=*",
            // JWTs
            r"\beyJ[\w-]+\.[\w-]+\.[\w-]+\b",
            // key: value / key=value / "key": "value" for credential-ish keys.
            // No leading \b: compound keys (user_password, x-api-key, dbsecret)
            // must redact too — better to over-redact than leak.
            r#"(?i)[\w-]*(password|passwd|pwd|secret|api[_-]?key|access[_-]?key|token|credential|authorization)["']?\s*[:=]\s*["']?[^\s"',;&]+"#,
            // long opaque blobs (hex/base64-ish, 32+ chars)
            r"\b[A-Za-z0-9+/_-]{32,}={0,2}\b",
        ]
        .iter()
        .map(|p| Regex::new(p).expect("static redaction pattern compiles"))
        .collect();

        Self { patterns }
    }

    /// Replaces any secret-looking span with `[REDACTED]`.
    pub fn redact(&self, input: &str) -> String {
        let mut output = input.to_string();
        for pattern in &self.patterns {
            output = pattern.replace_all(&output, REDACTED).into_owned();
        }
        output
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn credential_samples_never_survive() {
        let redactor = Redactor::standard();
        let samples = [
            r#"{"password": "Hunter2!secret"}"#,
            "connecting with api_key=sk_live_abcdef123456",
            "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U",
            "token: ghp_16C7e42F292c6912E7710c838347Ae178B4a",
            "url https://x.test/cb?secret=topsecretvalue&x=1",
        ];

        for sample in samples {
            let clean = redactor.redact(sample);
            for needle in ["Hunter2", "sk_live", "eyJ", "ghp_16C7", "topsecretvalue"] {
                assert!(
                    !clean.contains(needle),
                    "leak in {clean:?} (from {sample:?})"
                );
            }
        }
    }

    #[test]
    fn plain_text_is_untouched() {
        let redactor = Redactor::standard();
        let msg = "pull completed: 12 documents fetched";
        assert_eq!(redactor.redact(msg), msg);
    }
}
