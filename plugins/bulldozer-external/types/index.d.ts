export type Membership = {
  customerId: string
  projectId: string
  projectName: string
  userId: string
  companyId: string | null
  companyName: string
  logoUrl: string | null
}

export type Active = { customerId: string; projectId: string }

export type AdPlatform = 'META' | 'LINKEDIN' | 'MICROSOFT_ADS' | 'GOOGLE_ADS'

// A registered ad account (Meta, LinkedIn, Microsoft) or a SEA Google Ads account.
export type AdAccount = {
  id: string
  platform: AdPlatform
  name: string
  // The account's number on its platform, as shown beside its name.
  number: string
  adwordCustomerId: string | null
  adwordLoginId: string | null
  // From the account's last access check; null for Google Ads, which has none.
  access: 'read-write' | 'read-only' | 'denied' | null
}

export type ImportSummary = { state: string; at: string | null }

export type ProjectInfo = {
  subscription: { name: string; state: string } | null
  // Jetons left in the project's stack (the customer's for a shared project); null when unread.
  stack: number | null
  objectives: { type: string; answer: string }[]
  // Why the objectives could not be read, after one retry; null when they were.
  objectivesError: string | null
  // The user's connectors; isValid is false once expiresAt has passed.
  connectors: { platform: string; isValid: boolean }[]
  // Last import per selected Meta / LinkedIn account id.
  imports: Record<string, ImportSummary>
}

// The panel's tabs, under its fixed header.
export type Tab = 'paid' | 'imports' | 'jobs' | 'hostings' | 'journal' | 'projet'

// The color of a tag: lime for fine, amber for a warning, red for a failure, dim for neither.
export type TagTone = 'lime' | 'amber' | 'red' | 'dim'

// A block of a tab, loaded apart from the header. `key` names what it was loaded for (the project, and the
// selected accounts or the day where they matter): a result whose key is no longer current is dropped.
export type Loaded<T> = { key: string; isLoading: boolean; error: string | null; rows: T[] }

// One period's sums over an account's campaigns. `leads` for Meta and LinkedIn, `conversions` for Google Ads.
export type PerfFigures = { currency: string | null; cost: number; leads: number | null; conversions: number | null }

// The 7 complete days before today (UTC) against the 7 before them, for one selected account.
export type AccountPerf = {
  platform: AdPlatform
  accountId: string
  current: PerfFigures | null
  previous: PerfFigures | null
  // Meta and LinkedIn: the end of the imported data, when it stops before the current period does.
  staleThrough: string | null
  error: string | null
}

// One source of nightly imports: a selected ad account or a Search Console domain.
export type HealthRow = { key: string; source: AdPlatform | 'GSC'; label: string; tag: string; tone: TagTone; detail: string | null }

// A long-running job of the project: still running, or ended (done or failed) in the last 24 hours.
export type JobRow = {
  key: string
  label: string
  state: 'queued' | 'running' | 'failed' | 'done'
  // 0 to 1, when the job reports it.
  progress: number | null
  detail: string | null
  // What a done Studio job generated: presigned https URLs, valid an hour after the jobs were read.
  links: string[]
}

// A hosting of the project, not expired: a public static site or a single private file.
export type HostingRow = { id: string; name: string; isSite: boolean; publicUrl: string | null; createdAt: string }

// One page of the project's hostings, for the search text `q`; `total` counts every match, expired included.
export type HostingPage = Loaded<HostingRow> & { total: number }

// The Hostings tab's search and page, for the project it was set on: another project starts over.
export type HostingQuery = { projectId: string; q: string; page: number }

// A single file's presigned URL, read on demand: it expires an hour after.
export type HostingLink = { url: string; expiresAt: string | null }

// An Ads write the guard let through or stopped, this session.
export type WriteEntry = {
  at: string
  projectId: string
  tool: string
  platform: AdPlatform | null
  account: string | null
  object: string | null
  outcome: 'ok' | 'error' | 'refused'
  detail: string | null
}

// What bulldozer.json selects per platform: the account's local id, or for Google its adwordCustomerId.
export type AdSelection = { META: string | null; LINKEDIN: string | null; GOOGLE_ADS: string | null }

declare module 'claude-code' {
  interface PluginState {
    'bulldozer': {
      memberships: Membership[]
      active: Active | null
      error: string | null
      clientLogo: string | null
      adAccounts: AdAccount[]
      adSelection: AdSelection
      confirmedTargets: string[]
      projectInfo: ProjectInfo | null
      // True when an allow rule for one of the mod's reads is missing: the panel offers to add them.
      needsPermission: boolean
      // True while the panel asks, in place, whether to add those rules.
      isConfirmingAllow: boolean
      // True while ↻ (or the session start) reloads everything: the sidebar shows a loading state.
      isLoading: boolean
      // True for SPLASH_MS after the sidebar opens: the splash stays up that long even when data is ready.
      isSplashing: boolean
      // True while a project switch loads the new project's data: the half-loaded panel stays hidden.
      isSwitching: boolean
      // isLoading || isSplashing || isSwitching, written only when it flips: what the splash render reads.
      isSplashShown: boolean
      activeTab: Tab
      // Paid: the 7-day performance of each selected account, loaded when the tab shows.
      perf: Loaded<AccountPerf> | null
      // Imports: loaded in the background after the project, for the tab's warning mark.
      health: Loaded<HealthRow> | null
      // Jobs: loaded in the background after the project, read again every 30 s while one runs.
      jobs: Loaded<JobRow> | null
      // Hostings: one page of the project's hostings, loaded when the tab shows.
      hostings: HostingPage | null
      hostingQuery: HostingQuery | null
      // Presigned URLs of the files whose link was asked, by hosting id.
      hostingLinks: Record<string, HostingLink>
      // The session's guarded Ads writes, newest first, 50 at most.
      writeLog: WriteEntry[]
    }
  }
}
