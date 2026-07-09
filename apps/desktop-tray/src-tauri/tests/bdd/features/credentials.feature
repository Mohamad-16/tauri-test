Feature: Credential store is fail-closed
  Credentials live only in the OS keychain. When the backend is unavailable
  or a credential is revoked, access is denied - never defaulted or cached.

  Scenario: Backend unavailable denies access
    Given a stored credential "portal-1"
    And the credential backend is unavailable
    When a pull run resolves credential "portal-1"
    Then access is denied

  Scenario: Revoked credential stays revoked
    Given a stored credential "portal-1"
    And credential "portal-1" is revoked
    When a pull run resolves credential "portal-1"
    Then access is denied
