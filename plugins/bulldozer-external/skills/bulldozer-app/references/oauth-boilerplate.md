# Bulldozer App — Keycloak OAuth2 boilerplate (Angular)

Use this reference to wire Keycloak/OAuth2 into a **Bulldozer App**. It is based on the real
BulldozerOS front end (`app.config.ts`). Fill in `clientId` with the id you generated and passed
to `bdzCreateHosting` (the same client Keycloak provisions).

## Keycloak coordinates (fixed)

- **Server (url)**: `https://auth.bulldozer-collective.fr`
- **Realm**: `bdz-saas-dev`
- **client-id**: the generated client id (e.g. `bdz-app-<subdomain>-<random>`)

## 1. package.json dependencies

Add these to the Angular app (versions aligned with BulldozerOS — Angular 21):

```jsonc
{
  "dependencies": {
    "@angular/animations": "^21.2.17",
    "@angular/common": "^21.2.0",
    "@angular/compiler": "^21.2.0",
    "@angular/core": "^21.2.0",
    "@angular/forms": "^21.2.0",
    "@angular/platform-browser": "^21.2.0",
    "@angular/router": "^21.2.0",
    "keycloak-angular": "^21.0.0",
    "keycloak-js": "^26.2.4",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0"
    // optional UI (Bulldozer uses PrimeNG): "primeng": "^21.1.6", "@primeng/themes": "^21.0.4"
  }
}
```

The two OAuth-critical packages are **`keycloak-angular`** and **`keycloak-js`**.

## 2. environment.ts

```ts
export const environment = {
  production: true,
  apiUrl: 'https://api.bulldozer-collective.fr/v2', // Bulldozer REST API base
  keycloak: {
    url: 'https://auth.bulldozer-collective.fr',
    realm: 'bdz-saas-dev',
    clientId: '<GENERATED_CLIENT_ID>', // same id given to bdzCreateHosting
  },
};
```

## 3. app.config.ts

Adapted from the BulldozerOS front end. `includeBearerTokenInterceptor` automatically attaches
the Keycloak access token to every request whose URL matches `apiConditions` (here, the Bulldozer
REST API), so calls to the documented endpoints are authenticated.

```ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  provideKeycloak,
  withAutoRefreshToken,
  AutoRefreshTokenService,
  UserActivityService,
  includeBearerTokenInterceptor,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  type IncludeBearerTokenCondition,
} from 'keycloak-angular';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { customerIdInterceptor } from './core/interceptors/customer-id.interceptor'; // adds X-Bdz-Customer-Id / X-Bdz-Project-Id — see project-context.md

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Attach the bearer token only to Bulldozer API calls.
const apiConditions: IncludeBearerTokenCondition[] = [
  { urlPattern: new RegExp(`^${escapeRegex(environment.apiUrl)}`) },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    // Hash routing: the app is served under a sub-path with no SPA fallback (see SKILL Rule 1).
    provideRouter(routes, withHashLocation(), withComponentInputBinding()),
    provideAnimationsAsync(),

    provideKeycloak({
      config: environment.keycloak, // { url, realm, clientId }
      initOptions: {
        onLoad: 'check-sso',
        checkLoginIframe: false,
        // Base-href-aware: the app lives under /{subdomain}/, not the domain root.
        silentCheckSsoRedirectUri: new URL('silent-check-sso.html', document.baseURI).href,
      },
      features: [
        withAutoRefreshToken({
          onInactivityTimeout: 'logout',
          sessionTimeout: 60000,
        }),
      ],
      providers: [AutoRefreshTokenService, UserActivityService],
    }),
    {
      provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
      useValue: apiConditions,
    },
    // Order matters: bearer token first, then the two Bulldozer headers.
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor, customerIdInterceptor])),
  ],
};
```

## 4. silent-check-sso.html

`onLoad: 'check-sso'` + `silentCheckSsoRedirectUri` requires a static file served alongside the
app. Create `public/silent-check-sso.html` so it ships in the build output and is served under the
app base path (`…/{subdomain}/silent-check-sso.html`) — which is exactly what
`new URL('silent-check-sso.html', document.baseURI)` resolves to:

```html
<!doctype html>
<html>
  <body>
    <script>
      parent.postMessage(location.href, location.origin);
    </script>
  </body>
</html>
```

## 5. Reading auth state / calling the API in a component

```ts
import { inject } from '@angular/core';
import Keycloak from 'keycloak-js';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

const keycloak = inject(Keycloak);
const http = inject(HttpClient);

// login / logout — redirect back to the app base (document.baseURI), not the domain root
// (the root hosts other apps under the same customer slug).
keycloak.login();
keycloak.logout({ redirectUri: document.baseURI });

// authenticated call — token is added automatically by the interceptor
http.get(`${environment.apiUrl}/projects`).subscribe(/* ... */);
```

## 6. Auth bootstrap — require login, then load memberships

Force authentication on protected routes, and once authenticated load the user's project
memberships (the "first screen after login" required by SKILL Rule 3 / `project-context.md`).

`auth.guard.ts`:

```ts
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import Keycloak from 'keycloak-js';
import { ProjectService } from './core/services/project.service';

export const authGuard: CanActivateFn = async () => {
  const keycloak = inject(Keycloak);
  if (!keycloak.authenticated) {
    await keycloak.login({ redirectUri: window.location.href });
    return false; // login() navigates away
  }
  // Authenticated → ensure memberships are loaded before the app renders.
  const projectSvc = inject(ProjectService);
  if (!projectSvc.ready()) projectSvc.loadProjects();
  return true;
};
```

Apply it in `app.routes.ts`:

```ts
import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', canActivate: [authGuard], loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent) },
  // ...other protected routes
];
```

The user must then pick a project (see the `<select>` in `project-context.md`) before any
customer/project-scoped API call succeeds.

## Notes

- The client id **must** match the one provisioned when the static site was created
  (`bdzCreateHosting` with the `clientId` argument). Otherwise Keycloak login fails.
- Redirect URIs / web origins for the client are provisioned server-side against the site's
  public URL (`https://{customerSlug}.bulldozer-os.fr/{subdomain}/`).
- The realm is always `bdz-saas-dev` and the server always `https://auth.bulldozer-collective.fr`.
