# Calling the app's own service

Read this only if the app has a service. Two things matter: the screen never builds the address
itself, and a long task is never awaited in a single call.

## Install the service

Copy `assets/bulldozer-app.service.ts` to `src/app/core/services/bulldozer-app.service.ts`. It needs
`ProjectService` from `project-context.md` next to it, and nothing else — no configuration, no
environment entry, no interceptor change.

The address is derived from where the screen is served. **Never write it in `environment.ts`**: it
differs per customer, and a hardcoded one works in exactly one installation.

## Ordinary calls

The paths are the app's own routes, exactly as its service declares them.

```ts
private readonly app = inject(BulldozerAppService);

readonly notes = signal<Note[]>([]);

load() {
  this.app.get<{ items: Note[] }>('/notes').subscribe((page) => this.notes.set(page.items));
}

add(text: string) {
  this.app.post<Note>('/notes', { text }).subscribe(() => this.load());
}
```

Anything that takes more than **30 seconds is cut off** — not by the app, by what sits in front of
it. There is no setting to raise. Work that can exceed that must be a long task.

## Long tasks

The route that starts the work answers immediately with the task, not with the result. The service
then follows the task until it ends and completes on its own:

```ts
readonly task = signal<Task<ImportReport> | null>(null);

startImport(file: string) {
  this.app.runTask<ImportReport>('/imports', { file }).subscribe((task) => this.task.set(task));
}
```

```html
@if (task(); as t) {
  @switch (t.state) {
    @case ('PENDING') { <p>Queued…</p> }
    @case ('RUNNING') { <p>Working…</p> }
    @case ('SUCCESS') { <p>{{ t.result?.imported }} rows imported.</p> }
    @case ('FAILURE') { <p class="error">{{ t.error }}</p> }
  }
}
```

Three rules, each of which has produced a spinner that never stopped:

- **Handle `FAILURE`.** It arrives as a normal emission, not as an HTTP error. A screen that only
  renders `SUCCESS` spins forever on a failed task.
- **Do not poll by hand.** `runTask` already does, and stops. A second loop keeps running after the
  component is gone.
- **Show `PENDING` and `RUNNING` differently** if the work can take minutes: `PENDING` means it has
  not started yet, and a user who sees "Working…" for two minutes assumes a hang.

To recover a task after a page reload, keep its `id` and call `followTask(id)`.

## What the service does not do

It never exposes the sign-in token, and it cannot reach anything but this app's own service — that
is the point. Calls to the Bulldozer API keep going through `HttpClient` and its interceptors, as
described in `project-context.md`.
