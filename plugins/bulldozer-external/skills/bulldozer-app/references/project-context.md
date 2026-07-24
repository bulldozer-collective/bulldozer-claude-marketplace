# Bulldozer App — customer/project context boilerplate (Angular)

**~99% of Bulldozer API endpoints require two headers:**

- `X-Bdz-Customer-Id` — the customer id
- `X-Bdz-Project-Id` — the project id

Both come from the **project membership the user selects**. This reference (based on the real
BulldozerOS `ProjectService` / `ActiveContextService` / `customer-id.interceptor`) shows how to:

1. after auth, fetch the user's **project memberships**;
2. let the user **choose** a project (e.g. a `<select>`);
3. derive `customerId` + `projectId` from the selected membership;
4. inject both headers on every API call, **reactively** (changing the selection updates the app).

## Flow

```
authenticated ──► GET /project-memberships ──► user picks a project
                                                      │
                                       activeProjectId (signal, persisted)
                                                      │
                          ┌───────────────────────────┴──────────────┐
                   activeProject().customerId              activeProject().id
                          │                                           │
                     X-Bdz-Customer-Id                          X-Bdz-Project-Id   (interceptor)
```

Assumed file layout (consistent across the snippets below):
`src/app/core/services/project.service.ts`, `src/app/core/interceptors/customer-id.interceptor.ts`.

## 1. ProjectService — fetch memberships + hold the active selection

`src/app/core/services/project.service.ts`:

```ts
import { computed, Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Project {
  id: string;
  customerId: string;
  name: string;
  // ...other fields as needed from the API docs
}

interface ProjectMembership {
  id: string;
  customerId: string;
  project: Project;
  userId: string;
  role: string;
}

interface GetProjectMembershipResponse {
  memberships: ProjectMembership[];
}

const STORAGE_KEY = 'bulldozer-active-project';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);

  readonly projects = signal<Project[]>([]);
  readonly loading = signal(false);
  readonly ready = signal(false);

  // Persisted so a reload keeps the same project.
  readonly activeProjectId = signal<string | null>(localStorage.getItem(STORAGE_KEY));

  /** The selected project (source of the customerId/projectId pair). */
  readonly activeProject = computed(() =>
    this.projects().find((p) => p.id === this.activeProjectId()),
  );
  readonly activeCustomerId = computed(() => this.activeProject()?.customerId ?? null);

  /**
   * Call this once the user is authenticated — triggered by the `authGuard` in
   * `oauth-boilerplate.md` (§6 Auth bootstrap).
   */
  loadProjects(): void {
    this.loading.set(true);
    this.http
      .get<GetProjectMembershipResponse>(`${environment.apiUrl}/project-memberships`)
      .subscribe({
        next: (res) => {
          const list = (res.memberships ?? []).map((m) => m.project);
          this.projects.set(list);
          this.loading.set(false);
          this.ready.set(true);
          // Auto-select the first project if none stored or the stored id is stale.
          const storedId = this.activeProjectId();
          if (!list.some((p) => p.id === storedId) && list.length > 0) {
            this.setActive(list[0].id);
          }
        },
        error: () => {
          this.loading.set(false);
          this.ready.set(true);
        },
      });
  }

  setActive(id: string): void {
    this.activeProjectId.set(id); // signal change → interceptor & UI react automatically
    localStorage.setItem(STORAGE_KEY, id);
  }

  clearActive(): void {
    this.activeProjectId.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }
}
```

## 2. customer-id interceptor — inject both headers on every API call

Register it in `app.config.ts` **after** `includeBearerTokenInterceptor` (see
`oauth-boilerplate.md`): `withInterceptors([includeBearerTokenInterceptor, customerIdInterceptor])`.

`src/app/core/interceptors/customer-id.interceptor.ts`:

```ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { environment } from '../../../environments/environment';

export const customerIdInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiUrl)) return next(req);

  const projectSvc = inject(ProjectService);
  const activeProject = projectSvc.activeProject();

  const headers: Record<string, string> = {};
  if (activeProject?.customerId) headers['X-Bdz-Customer-Id'] = activeProject.customerId;
  if (activeProject?.id) headers['X-Bdz-Project-Id'] = activeProject.id;

  if (Object.keys(headers).length === 0) return next(req);
  return next(req.clone({ setHeaders: headers }));
};
```

Because the interceptor reads `projectSvc.activeProject()` at request time, **every request made
after a selection change automatically carries the new customer/project pair** — no manual wiring.

## 3. Project picker — the `<select>`

```ts
import { Component, inject } from '@angular/core';
import { ProjectService } from '../core/services/project.service';

@Component({
  selector: 'app-project-picker',
  standalone: true,
  template: `
    <select
      [value]="projectSvc.activeProjectId() ?? ''"
      (change)="onChange($event)"
      [disabled]="!projectSvc.ready()">
      @for (p of projectSvc.projects(); track p.id) {
        <option [value]="p.id">{{ p.name }}</option>
      }
    </select>
  `,
})
export class ProjectPickerComponent {
  readonly projectSvc = inject(ProjectService);

  onChange(event: Event) {
    const id = (event.target as HTMLSelectElement).value;
    if (id) this.projectSvc.setActive(id); // updates customerId/projectId app-wide
  }
}
```

## 4. Reacting to a project change in your own components/services

Anything customer/project-aware should be driven by the signals so a switch refreshes it:

```ts
import { effect, inject } from '@angular/core';
import { ProjectService } from '../core/services/project.service';

const projectSvc = inject(ProjectService);

effect(() => {
  const projectId = projectSvc.activeProjectId();
  const customerId = projectSvc.activeCustomerId();
  if (!projectId) return;
  // (re)load data for the newly active project here
});
```

## Rules recap

- **Do not** hardcode a customer/project id. Always derive from the selected membership.
- **First screen after login** = fetch memberships → let the user pick → then everything else.
  The `authGuard` in `oauth-boilerplate.md` (§6) is the concrete trigger for `loadProjects()`.
- Persist the selection (`localStorage`) so a refresh keeps context.
- Keep the selection in a **signal** so the interceptor and UI are reactive to changes.
- If the user has **no** memberships, show an empty state (nothing to select → no headers → API 4xx).
