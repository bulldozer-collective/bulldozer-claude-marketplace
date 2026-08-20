/**
 * Talks to the app's own service. Copy this file into the project as-is; do not rewrite it.
 *
 * It exists because the two interceptors set up in `oauth-boilerplate.md` and `project-context.md`
 * are scoped to the *Bulldozer* API, and the app's own service is a different address — so it would
 * receive neither the sign-in token nor the project header, and would answer 401 to everything.
 * This service carries both itself.
 *
 * Place at: src/app/core/services/bulldozer-app.service.ts
 */
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { from, Observable, switchMap, takeWhile, throwError, timer } from 'rxjs';
import { ProjectService } from './project.service';

/** How a long task progresses. The last two are final. */
export type TaskState = 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILURE';

export interface Task<T = unknown> {
  id: string;
  type: string;
  state: TaskState;
  /** Set once the task succeeded. */
  result?: T;
  /** Set once it failed — show it, it is written for the app's author. */
  error?: string;
  startedAt?: string;
  finishedAt?: string;
}

const FINAL: TaskState[] = ['SUCCESS', 'FAILURE'];
const POLL_MS = 2000;

@Injectable({ providedIn: 'root' })
export class BulldozerAppService {
  private readonly http = inject(HttpClient);
  private readonly keycloak = inject(Keycloak);
  private readonly projects = inject(ProjectService);

  /**
   * The app's own service, derived from where this screen is served — nothing to configure, and
   * nothing that can drift between environments. `document.baseURI` resolves the `<base href>`,
   * which is the app's address; the hash route in the URL does not affect it.
   */
  readonly baseUrl = new URL('api/', document.baseURI).href;

  get<T>(path: string, params?: Record<string, string | number | boolean>): Observable<T> {
    return this.call<T>('GET', path, undefined, params);
  }

  post<T>(path: string, body?: unknown): Observable<T> {
    return this.call<T>('POST', path, body);
  }

  put<T>(path: string, body?: unknown): Observable<T> {
    return this.call<T>('PUT', path, body);
  }

  delete<T>(path: string): Observable<T> {
    return this.call<T>('DELETE', path);
  }

  /**
   * Sends a file, in two steps: the app hands out a one-time link, then the browser sends the bytes
   * **straight to the storage** without going through the app at all.
   *
   * **Never post a file to one of the app's own routes.** A request body reaching the app is capped
   * at 1 MB, and the platform's firewall used to cut it at 8 KB — an upload written that way works
   * while the file is small, then fails the day someone picks a real document, with a `403` that
   * names neither the app nor the size. Going through the storage has no such ceiling.
   *
   * The app's route must answer `{ url }`, from `ctx.files.uploadUrl(name, type)`. It is also the
   * right place for it to record the file in its own data — it knows the name, since it just minted
   * a link for it, so the screen does not need a third call to confirm.
   *
   * @param path  the app's route that hands out the link, named by the app, e.g. '/attachments'.
   * @param file  what the file input gave you.
   * @param extra anything else that route needs, alongside the file's name and type.
   */
  uploadFile(path: string, file: File, extra: Record<string, unknown> = {}): Observable<void> {
    // Resolved ONCE and reused for both calls. A browser leaves `file.type` empty for an unknown
    // extension; asking for a link under one type and then sending another breaks the signature,
    // and the storage refuses with a message about neither.
    const type = file.type || 'application/octet-stream';

    return this.post<{ url: string }>(path, { name: file.name, type, ...extra }).pipe(
      switchMap(({ url }) =>
        // Deliberately WITHOUT the headers that `call()` adds: this request goes to the storage,
        // not to the app. The link already carries its own authorisation, and sending the
        // sign-in token to a third party would hand it out for nothing.
        this.http.put<void>(url, file, { headers: { 'Content-Type': type } }),
      ),
    );
  }

  /**
   * Starts a long task and then reports its progress until it ends.
   *
   * Emits the task on every check and **completes on its own** once the state is final, so a
   * template can subscribe to it directly without ever having to stop it. A failure arrives as an
   * emission with `state: 'FAILURE'`, not as an error: it is the task that failed, not the call.
   *
   * The screen must handle FAILURE. A task can also be reported failed because the work was cut
   * short without being able to say so — the state is derived, so it never stays RUNNING forever.
   */
  runTask<T = unknown>(path: string, payload: unknown = {}): Observable<Task<T>> {
    // `path` is the app's own route that starts the work — whatever it was named, e.g. '/imports'.
    // It answers immediately with the task, which is then followed until it ends.
    return this.post<Task<T>>(path, payload).pipe(
      switchMap((started) => this.followTask<T>(started.id)),
    );
  }

  /** Follows a task already started — after a page reload, for instance. */
  followTask<T = unknown>(id: string): Observable<Task<T>> {
    return timer(0, POLL_MS).pipe(
      switchMap(() => this.get<Task<T>>(`/jobs/${id}`)),
      // `true` keeps the final emission: without it the screen never sees the result.
      takeWhile((task) => !FINAL.includes(task.state), true),
    );
  }

  private call<T>(
    method: string,
    path: string,
    body?: unknown,
    params?: Record<string, string | number | boolean>,
  ): Observable<T> {
    const project = this.projects.activeProject();
    if (!project) {
      // Same posture as the Bulldozer interceptor: fail loudly rather than send a call that comes
      // back 401 and renders as "no data".
      return throwError(
        () =>
          new Error(
            `Call to the app's own service blocked — no active project (${method} ${path}). ` +
              'Wait for ProjectService.activeProject() to be defined.',
          ),
      );
    }

    // The token is read at call time, not cached: keycloak-angular refreshes it in the background.
    return from(this.keycloak.updateToken(30).catch(() => undefined)).pipe(
      switchMap(() =>
        this.http.request<T>(method, this.baseUrl.replace(/\/$/, '') + path, {
          body,
          params: params ? new HttpParams({ fromObject: params }) : undefined,
          headers: {
            Authorization: `Bearer ${this.keycloak.token ?? ''}`,
            // Required: the app's service is reachable only with a project, and it uses this
            // header to decide which project's data the call may touch.
            'X-Bdz-Project-Id': project.id,
            'X-Bdz-Customer-Id': project.customerId,
          },
        }),
      ),
    );
  }
}
