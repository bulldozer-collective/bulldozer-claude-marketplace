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

  /**
   * Read at startup but **not published**: a restored id is not yet an active project — it may be
   * stale, and `activeProject()` cannot resolve before the memberships are loaded. Publishing it
   * straight away would open a window where the id is non-null while no tenant header is
   * injectable, and where the id never changing afterwards prevents any reaction from re-running.
   */
  private readonly storedId = localStorage.getItem(STORAGE_KEY);

  /** `null` until the memberships are loaded — persistence is applied at that point, not before. */
  readonly activeProjectId = signal<string | null>(null);

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
          // Persistence is preserved: the stored id wins if still valid, else the first project.
          if (list.length > 0) {
            const restored = list.some((p) => p.id === this.storedId)
              ? this.storedId!
              : list[0].id;
            this.setActive(restored);
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

## 2. customer-id interceptor — inject both headers, and fail loudly without a project

Register it in `app.config.ts` **after** `includeBearerTokenInterceptor` (see
`oauth-boilerplate.md`): `withInterceptors([includeBearerTokenInterceptor, customerIdInterceptor])`.

Letting a tenant-scoped request go out **without** the headers yields a `4xx` that the UI renders as
"no data": the actual defect becomes invisible. Block it instead, with a message that says what to
wait for.

`src/app/core/interceptors/customer-id.interceptor.ts`:

```ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { ProjectService } from '../services/project.service';
import { environment } from '../../../environments/environment';

/**
 * API paths that do NOT require the tenant headers.
 * `/project-memberships` MUST stay exempt — it is what populates `projects()`, so blocking it for
 * lack of an active project would deadlock startup. `/admin/**` is realm-scoped (SKILL Rule 3):
 * sending the headers is harmless, but *requiring* a project is not.
 */
const TENANT_FREE_PATHS = [/^\/project-memberships\b/, /^\/admin\//];

export const customerIdInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiUrl)) return next(req);

  const path = req.url.slice(environment.apiUrl.length) || '/';
  if (TENANT_FREE_PATHS.some((re) => re.test(path))) return next(req);

  const activeProject = inject(ProjectService).activeProject();

  if (!activeProject) {
    return throwError(
      () =>
        new Error(
          `Tenant-scoped call blocked — no active project resolved (${req.method} ${path}). ` +
            `Wait for ProjectService.activeProject() to be defined: a non-null activeProjectId() is not enough.`,
        ),
    );
  }

  return next(
    req.clone({
      setHeaders: {
        'X-Bdz-Customer-Id': activeProject.customerId,
        'X-Bdz-Project-Id': activeProject.id,
      },
    }),
  );
};
```

> ⚠️ **Adding an endpoint that legitimately needs no tenant context?** Add it to
> `TENANT_FREE_PATHS`. Forgetting it turns a working call into a thrown error — loud and traceable,
> which is the point, but make sure the exemption list matches the endpoints your app actually uses.

Because the interceptor reads `projectSvc.activeProject()` at request time, **every request made
after a selection change automatically carries the new customer/project pair** — no manual wiring.

## 3. Project picker — the `<select>`

> ⚠️ **Put the selection on the `<option>`s, never `[value]` on the `<select>`.** A `[value]`
> binding on the select is applied independently of the `<option>`s that `@for` creates: once the
> options are inserted the browser resets the selection to the **first** one, while the signal still
> points elsewhere (typically the project restored from `localStorage`). The DOM value and the signal
> then disagree — and if the user's first click lands on the option the DOM already shows, **no
> `change` event fires at all**. The symptom is "the first project switch does nothing, the next ones
> work", which looks like a state bug and is really a DOM-sync bug.

```ts
import { Component, inject } from '@angular/core';
import { ProjectService } from '../core/services/project.service';

@Component({
  selector: 'app-project-picker',
  standalone: true,
  template: `
    <select (change)="onChange($event)" [disabled]="!projectSvc.ready()">
      @for (p of projectSvc.projects(); track p.id) {
        <option [value]="p.id" [selected]="p.id === projectSvc.activeProjectId()">
          {{ p.name }}
        </option>
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

Worth a regression test, because the failure is silent — the app renders fine and only the first
interaction is lost:

```ts
it('reflects the active project even when it is not the first option', async () => {
  projectSvc.projects.set([
    { id: 'p1', customerId: 'c1', name: 'One' },
    { id: 'p2', customerId: 'c1', name: 'Two' },
    { id: 'p3', customerId: 'c1', name: 'Three' },
  ]);
  projectSvc.setActive('p3');
  projectSvc.ready.set(true);
  await fixture.whenStable();

  const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
  expect(select.value).toBe('p3'); // with [value] on the select this is 'p1'
});
```

## 4. Reacting to a project change in your own components/services

Anything customer/project-aware should be driven by the signals so a switch refreshes it. **Depend on
`activeProject()`, not on `activeProjectId()`** — that is the precondition the interceptor actually
needs:

```ts
import { effect, inject } from '@angular/core';
import { ProjectService } from '../core/services/project.service';

const projectSvc = inject(ProjectService);

effect(() => {
  // `activeProject()` is only defined once memberships are loaded AND the stored id resolves.
  const project = projectSvc.activeProject();
  if (!project) return;
  // (re)load data here — the two tenant headers are guaranteed injectable at this point.
});
```

> ⚠️ **Do not guard on `activeProjectId()` alone.** It is restored from `localStorage` in the
> service's field initialiser, so it is non-null *before any HTTP call has happened*. An effect
> guarded on the id therefore fires while `projects()` is still empty — `activeProject()` is
> `undefined`, the interceptor (§2) injects **no** headers, and every request of that first pass goes
> out untenanted and fails.
>
> It then gets worse: `loadProjects()` only calls `setActive()` when the stored id is **stale**. With
> a valid stored id, `activeProjectId` never changes, so **the effect never re-runs** and the user is
> left looking at empty data with no error to explain it. Keying on `activeProject()` fixes both the
> premature fire and the missing re-run, since the computed changes when memberships arrive.

## Rules recap

- **Do not** hardcode a customer/project id. Always derive from the selected membership.
- **First screen after login** = fetch memberships → let the user pick → then everything else.
  The `authGuard` in `oauth-boilerplate.md` (§6) is the concrete trigger for `loadProjects()`.
- Persist the selection (`localStorage`) so a refresh keeps context.
- Keep the selection in a **signal** so the interceptor and UI are reactive to changes.
- **Resolution order matters.** Never fire a tenant-scoped call before `activeProject()` is defined.
  `ProjectService` (§1) enforces this structurally by not publishing the stored id until the
  memberships land, and the interceptor (§2) throws rather than sending an untenanted request — so
  the mistake is impossible to make silently.
- **Never bind `[value]` on the project `<select>`** — carry the selection on the `<option>`s with
  `[selected]`, or the first switch is silently swallowed (§3).
- If the user has **no** memberships, show an empty state (nothing to select → no headers → API 4xx).
