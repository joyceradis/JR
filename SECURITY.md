# Security Policy

## Scope

This repository is a public portfolio and development surface. Public visibility must never be treated as authorization to expose secrets, patient data, judicial documents, private Google Drive content or production credentials.

## Secrets

Never commit or expose in client-side bundles:

- `GEMINI_API_KEY` or other AI-provider secrets;
- OAuth client secrets;
- service-account credentials;
- refresh/access tokens;
- webhook secrets;
- database service-role keys;
- private signing keys.

AI-provider calls that require a secret key must be proxied through server-side routes. Client code must not receive the secret.

Firebase web configuration is client configuration rather than a server secret, but the associated project and API key must still be restricted in Google Cloud/Firebase to the minimum required APIs, origins and quotas.

## Personal and clinical data

Do not place real patient identifiers, medical records, judicial records, attachments, access tokens or private workspace content in this repository, tests, fixtures or screenshots.

## Reporting

Do not publish exploit details or sensitive data in public issues. Use a private contact channel controlled by the repository owner.

## Production gate

Before any production use involving real users or protected data, require authentication/authorization review, least-privilege scopes, server-side secret handling, input validation, logging without sensitive payloads, rate limiting, dependency review, backup/restore testing and an incident-response process.
