# Route a form's submissions into a lead list (Webflow only)

WordPress answers 501 on every forms / submissions / lead-list tool.

1. `bdzListCmsForms(siteId)` — pick the form; keep its **`formElementId`** (not `id`: the same form placed on
   several pages has several ids but one `formElementId`).
2. Pick or create the target lead list (`bdzListLeadLists`).
3. `bdzPreviewCmsFormFieldMapping(siteId, formElementId)` — proposed mapping from the last 20 real submissions.
   - `mapping == null` → no email key found: the attachment would be refused. Ask which key holds the email.
   - `submissionsInspected == 0` → never submitted; the proposal is a guess from labels. Ask the user to submit a
     test entry first, or confirm the keys.
4. `bdzAttachLeadListToCmsForm(siteId, formElementId, leadListId, emailFieldKey?, …)` — omit the keys to accept the
   proposal. The webhook is registered automatically; nothing to configure in Webflow. 409 = already attached.
5. Every new submission now becomes a lead awaiting review. Past submissions are **not** imported: read them with
   `bdzListCmsFormSubmissions(siteId, formElementId)` if the user wants them.

Stop: `bdzListCmsLeadListAttachments` → `bdzDetachLeadListFromCmsForm(siteId, attachmentId)`.
An archived or deleted lead list detaches itself.
