# MyAngularApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Okta + Google social login setup

Use **Okta as the OpenID Connect provider** and **Google as an external Identity Provider**.

1. **Create a Google OAuth app**
   - In Google Cloud Console, create an OAuth 2.0 **Web application** client.
   - Save the Google **Client ID** and **Client Secret**.
   - Add the Okta callback URI (from step 2) as an authorized redirect URI.

2. **Configure Google as an Identity Provider in Okta**
   - In Okta Admin: **Security > Identity Providers > Add Identity Provider > Google**.
   - Provide Google Client ID/Secret.
   - Use scopes: `openid profile email`.
   - Copy the Okta callback URI shown there and register it in Google OAuth redirect URIs.

3. **Create Okta OIDC SPA app for this UI**
   - In Okta Admin: **Applications > Create App Integration > OIDC - Single-Page Application**.
   - Sign-in redirect URI: `http://localhost:4200/auth/callback`
   - Sign-out redirect URI: `http://localhost:4200/login`
   - Assign users/groups allowed to access the app.
   - Note these values:
     - Issuer: `https://{yourOktaDomain}/oauth2/default`
     - Client ID: `<your Okta SPA client id>`

4. **Enable Google sign-in via Okta-hosted login**
   - In Okta sign-in branding/policy settings, enable the Google IdP so users can sign in with Google through Okta.

5. **Configure this UI project**
   - Update `src/com/fedex/shipment/services/auth.service.ts`:
     - `oktaIssuer = 'https://{yourOktaDomain}/oauth2/default'`
     - `oktaClientId = '<your Okta SPA client id>'`

6. **Configure backend API token validation**
   - In `shipmentAPI` set:
     - `spring.security.oauth2.resourceserver.jwt.issuer-uri=${OKTA_ISSUER}`
   - Environment variable example:
     - `OKTA_ISSUER=https://{yourOktaDomain}/oauth2/default`

7. **(Optional) Trusted origins in Okta**
   - Add `http://localhost:4200` as a Trusted Origin (CORS + Redirect) if your Okta tenant policies require it.
