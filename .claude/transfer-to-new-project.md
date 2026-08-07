# Transfer .claude Pack to a New Project

## Purpose

Use this file to copy the working planning system into another repository before implementation begins.

## Files to Copy

Copy these files as a group into the target repo's `.claude/` directory:

- `.claude/objectives.md`
- `.claude/plan.md`
- `.claude/progress.md`
- `.claude/claude-code-workflow.md`
- `.claude/nextjs-django-roadmap.md`
- `.claude/transfer-to-new-project.md`

## First-Time Setup in Target Repository

1. Create and switch to `develop` if it does not exist yet.
2. Ensure `develop` tracks `origin/develop`.
3. Start all new tasks from updated `develop`.

Recommended command flow:

- `git fetch origin`
- `git checkout develop`
- `git pull --ff-only origin develop`
- `git checkout -b feat/your-description`

## Session Workflow

1. Review `.claude/progress.md`.
2. Pick next unchecked item in `.claude/plan.md`.
3. Implement one focused slice.
4. Run checks.
5. Update `.claude/progress.md` at session end.

## Notes

- Keep branch names short, lowercase, and hyphenated.
- Use one branch per feature/fix/chore.
- Merge branches into `develop` to keep history linear.
