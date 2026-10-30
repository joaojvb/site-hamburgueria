# Agents — Wize Development Kit

This repo is wired with the [`wize-dev-kit`](https://www.npmjs.com/package/wize-dev-kit).
Detailed artifacts live under `.wize/`. The agents below are activated through your AI IDE
using slash commands (Claude Code, Codex, Cursor, Windsurf, Antigravity, Hermes all read this file).

<!-- wize:bootstrap:begin (managed by wize-dev-kit; edits inside are replaced by update) -->
## Kit bootstrap

Once per session, if you can run shell commands, run `npx --yes --fetch-retries=0 wize-dev-kit version-check --json`
(prefix it with `timeout 20` where that exists) and follow its `action` field (if npx fails or times out,
for example offline, skip this):

- `hydrate`: run `commands.hydrate` now. It writes only git-ignored files. If the `/wize-*`
  commands are still missing afterwards, tell the user to restart the harness.
- `update`: run `commands.update`. It prepares a `chore/wize-kit-<version>` branch in a temporary
  worktree and never touches this checkout. Then ask once before running `commands.pr`, which
  pushes the branch and opens a PR. Exception: when `reason` is `pin-unpublished`, `commands.update`
  lowers the project pin; ask the user first and run it only on a yes.
- `use-pin`: tell the user to run kit commands as `npx wize-dev-kit@<pin>`, with `<pin>` taken from
  `project.pin` in the JSON.
- `none` with `reason` `kit-not-on-branch`: tell the user to merge the kit into this branch, or install here with `install --here`.
- `install`, other `none`: do nothing.

If the `/wize-*` commands are missing, run `npx --yes wize-dev-kit hydrate`.
Never commit a kit update on the default branch.
<!-- wize:bootstrap:end -->

## Operating context

Treat `.wize/`, this `AGENTS.md`, and the installed `wize-*` skills as your operating
instructions and persistent memory — not background reading. Read project state before
acting; write what you change back into `.wize/` so the next session inherits it.

Before editing, classify the demand via `/wize` (or `/wize-help`): **Quick Dev** (small, predictable,
trivially scoped, no new feature / architecture / UX / security) or **Full Lifecycle**. Never pick
Quick Dev just to skip artifacts.

When a skill fans out to subagents, match the model tier to the task: a lightweight tier
for mechanical work (reads, greps, formatting, short summaries), the standard tier for
implementation and review, a high-capability tier only for architecture, critical
decisions, or final adversarial review.

A request for a plan, review or investigation never implies editing, pushing or publishing.

If several agents share a repo: one branch or worktree per agent; never touch another agent's
uncommitted work; never force-push the default branch (`--force-with-lease` only on your own
branch); regenerate lockfiles instead of hand-merging; on an unresolvable conflict, stop and report.

## Writing code (always on)

Before writing new code, climb this ladder and stop at the first rung that holds:

1. Does this need to exist? → no: skip it (YAGNI).
2. Already in this codebase? → reuse the helper, util, or pattern; don't rewrite it.
3. Does the standard library do it? → use it.
4. Does a platform or framework feature cover it? → use it.
5. Does an already-installed dependency solve it? → use it.
6. Is it one line? → write the one line.
7. Only then: the minimum code that works.

The ladder runs **after** you understand the problem: read the code the change touches and
trace the real flow before picking a rung.

- No abstractions, configuration, or boilerplate nobody asked for. No new dependency if it can be avoided.
- Deletion over addition. Boring over clever. Fewest files possible.
- Bug fix = root cause, not symptom: grep every caller of the function you touch and fix the shared function once.
- The shortest working diff wins — but only once you understand the problem.

Lazy, not negligent — never on the chopping block: input validation at trust boundaries,
error handling that prevents data loss, security, accessibility, tests on non-trivial logic,
and anything explicitly requested.

A deliberate shortcut with a known ceiling gets a `wize-debt:` comment naming the ceiling and
the upgrade trigger, so it can be harvested later with `/wize-debt`. Before a PR, run
`/wize-subtract` on the diff — the best review outcome is a shorter diff.

## Roster


## Where to start

Activate the orchestrator: `/wize` (or `/wize-help`). Wizer will guide you.
