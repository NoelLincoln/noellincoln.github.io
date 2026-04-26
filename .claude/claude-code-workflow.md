# Best Workflow with Claude Code

## Recommended Operating Mode
- Work in small vertical slices (backend endpoint + frontend usage + test/check).
- Keep a single source of truth for status in `.claude/plan.md` and `.claude/progress.md`.
- Prefer short, explicit requests with one clear outcome per prompt.

## Prompt Template (Use This)
1. Goal: what should be completed in this step.
2. Constraints: files/scope not to touch, style requirements.
3. Done criteria: exact checks to pass (lint/test/build).

Example:
"Goal: implement BlogPost model + admin registration in backend only. Constraints: do not modify frontend. Done criteria: migrations generated and tests pass for blog app."

## Suggested Rhythm
1. Start session:
- Review `.claude/progress.md` and choose next unchecked item in `.claude/plan.md`.

2. During session:
- Ask Claude to implement one milestone-sized task.
- Ask Claude to run/verify checks for that task.

3. End session:
- Mark completed checklist items in `.claude/plan.md`.
- Add a short entry in `.claude/progress.md`.
- Record next 1-3 actions.

## Branching Strategy
- `develop` is the integration base branch.
- All feature/fix/chore branches are created from updated `develop` and merged back into `develop`.
- Goal: keep a clean, linear commit history on the main integration line.
- Before starting any new feature/fix/chore, always create a new branch first.
- Branch naming format is mandatory:
	- `feat/description`
	- `fix/description`
	- `chore/description`
	- `docs/description`
	- `refactor/description`
- Keep branch names short, lowercase, and hyphen-separated.
- One branch per milestone or focused feature.
- Keep commits small and descriptive.
- Open PRs early for feedback.

## Session Start Gate
- Do not begin implementation work until branch creation is confirmed.
- Always sync `develop` first, then create your branch.
- Suggested first commands each session:
	- `git fetch origin`
	- `git checkout develop`
	- `git pull --ff-only origin develop`
	- `git checkout -b feat/your-description`

## Quality Gates per Step
- Lint passes for touched files.
- Build passes for touched app.
- Basic manual verification for UI/API behavior.

## Practical Notes
- Prefer project-local tools (`npm run ...`, `python -m ...`) over global latest `npx` when possible.
- Keep environment setup scripted and documented.
- If a task gets too broad, split it into smaller prompts.
