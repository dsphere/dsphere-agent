# Sign-in and verification walls

Sign-in and verification walls pause the task, never end it. Check `authentication.waitingOn` on every page result.

## `waitingOn: agent`

Attempt the CAPTCHA or challenge yourself first, with `dsagent.page.visual.observe` and the observed controls (click,
drag, input). Obey `attemptsLeft` and the time budget. If you cannot pass, `dsagent.page.notify` hands it to the
person. Never close a challenge to bypass it.

### A slider or puzzle CAPTCHA: measure, then drag once

A bot check scores the whole drag from press to release. A person drags a slider in one stroke of 1–2 seconds; a
knob nudged with `drag-press` / `drag-move` and looks in between is rejected even when the piece sits exactly over
the gap (live: "操作过快", or a new puzzle).

1. Measure before touching it. `dsagent.page.visual.observe` the puzzle (the picture's or the challenge's `targetId`);
   find the piece's left edge and the gap's left edge in the image. Convert image pixels to the page's CSS pixels:
   multiply by the target's rect width ÷ `visual.width` (a viewport image: `pageMetrics.viewportWidth` ÷
   `visual.width`). The distance in CSS pixels is the knob's `delta.dx`; the knob usually moves the piece 1:1.
2. Drag once: `dsagent.page.action` `drag` on the knob with `delta {dx, dy: 0}`. DSphere draws the hand: an approach,
   one stroke, a small overshoot and settle; after the first answer it goes as real browser input.
3. Read the page. A new puzzle means a wrong place or a rejected drag: measure the new one and drag once again. Do not
   correct the same answer with more moves, and do not answer faster than a person would read the new puzzle.
4. Keep `drag-press` / `drag-move` / `drag-release` for a drop area that only shows where to go while something is
   dragged. Then use one or two moves with short looks: the button stays down the whole time and counts against you.

## `waitingOn: person`, or `businessCode=AUTHENTICATION_REQUIRED`

This covers LOGIN_FORM, PHONE_LOGIN, SSO, OTP and a failed challenge.

1. Stop effects there. Guest-style dismissal, scroll and Escape remain allowed.
2. First try the saved account the user named, or one `dsagent.browser.sessions.list` found, using `dsagent.page.open`
   with `accountId` or `dsagent.accounts.open`. The account owner fills credentials; never type credentials yourself.
3. Read again: opening proves neither autofill nor login.
4. If there is no account or the wall remains, tell the person once to sign in or pass the check and click Resume in the
   side panel. Do not use `dsagent.page.ask` or `dsagent.page.notify` for a person-held wall: DSphere notifies them.
5. Wait with `dsagent.page.wait` `until: authentication-cleared` (or observe). Resume the same step when it clears; in a
   wizard, keep the wizard and choose detect-again.
6. If they decline, report the task as blocked.

## A workflow run paused on a wall (`pause.kind: auth`)

A run that meets a person-held wall pauses (`status: paused-auth-interrupt`, `pause.waitingOn: person`); it does not
fail. Signing in stays the person's: never sign in, type credentials or accept terms for them.

1. Tell the person once to sign in or pass the check on the paused page (`pause.pageContextId`).
2. Keep following the run with `dsagent.execution.wait`. It resumes by itself a few seconds after the wall is gone,
   and the person may also click Resume in the side panel.
3. If the person says they signed in and the run is still paused, call `dsagent.execution.auth.resume` (your own run
   only; `nextActions` names it). It resumes only when the paused page shows no wall. `TARGET_BUSY` with
   `AUTHENTICATION_REQUIRED` means the wall still stands: ask them again. `AUTH_PAUSE_NOT_OPEN` usually means the run
   already resumed or ended: wait on it.
4. Nobody signing in ends the pause at `pause.deadline`.

A verification challenge on your own run's page can be yours instead (`pause.waitingOn: agent`, with
`pause.attemptsLeft`; `nextActions` starts with `dsagent.page.visual.observe`). Pass it on `pause.pageContextId` as in
`waitingOn: agent` above; the run lends you that page meanwhile. Then wait: the run resumes by itself once the
challenge is gone. A failed challenge goes to the person, and the pause reads `waitingOn: person` again.

## A wall that is clearly wrong

DSphere can read a wall where none stands, for example a public home page whose box of links leads to separate
sign-in pages. When the page evidence shows it (`dsagent.page.markdown` or observe show the page's own content) or your
user tells you so, report it with `dsagent.page.auth.not-a-wall` `{pageContextId}`. Never use it to get past a sign-in
or check the task needs: signing in stays the person's.

- `outcome: reported`: the wall is recorded as none for that page in that tab, until the tab moves to another address.
  A task or run paused there resumes by itself, as after any wall that went away (follow a run with
  `dsagent.execution.wait`). `cleared: false` means another kind of wall still stands there; that one is the person's.
- `outcome: no-wall`: no wall stood when the page was read; nothing was recorded.
- A new page, or a different wall on the same page, is judged as before and still pauses.
- Refusals record nothing. `TARGET_BUSY` with `AUTHENTICATION_REQUIRED`: the browser's own sign-in dialog holds the
  page; ask the person to answer it. `TARGET_BUSY` with `SIGN_IN_UNVERIFIED`: the page could not be read; wait a moment,
  then call again. `TARGET_NOT_FOUND`: the tab shows no web page.
