# Agent Guide: ScripCalculator
> **Auto-generated** | Last updated: 2025-12-26 | Template version: v1.1

---

## 🎯 What This Is
[See README.md for description]

---

## 🛠️ Tech Stack

**Framework:** Vanilla JavaScript
**Build Tool:** None
**Key Libraries:**
- [Check package.json for dependencies]

**Deployment:** [Update with deployment target]

---

## 🚀 Quick Start

```bash
# Development
[Add dev command - npm run dev, python -m http.server, etc.]

# Build
[Add build command if applicable]
```

**Access:** [http://localhost:PORT or file path]

---

## 📁 File Structure

```
ScripCalculator/
├── [key files]    # [description]
└── README.md      # [reference for more details]
```

---

## 📝 Common Tasks

### 1. Add a New Feature
- Start in: `[directory/file]`
- Pattern to follow: [existing pattern]
- Update: [what else needs updating]

### 2. Fix a Bug
- Check: `[where bugs typically occur]`
- Debug with: [debugging approach]
- Test: [how to verify fix]

### 3. Deploy Updates
```bash
[deployment commands]
```

---

## 📋 Agent Work Log Protocol

**REQUIRED: All agents must log their work when making changes to this project.**

### Where to Log
```
planningDocs/log.md
```

### What to Log
Every work session should include:
```markdown
## [YYYY-MM-DD HH:MM] <Agent Name> - <Brief Task Description>

**Task:** [What was requested]

**Actions Taken:**
- [Specific changes made]
- [Files modified/created]
- [Commands run]

**Outcome:**
- [Success/Partial/Blocked]
- [What works now]
- [What still needs work]

**Next Steps:**
- [Recommended follow-up tasks]

---
```

### When to Log
- ✅ Before starting work (log the task)
- ✅ After completing work (log the outcome)
- ✅ When blocked (log the blocker and attempted solutions)
- ✅ When switching agents (log handoff context)

---

## 🔄 Git Workflow

**Git Status:** ✅ Git initialized

### Commit Guidelines

**When to Commit:**
- After completing a logical unit of work
- Before switching to a different task
- When user explicitly requests it
- NEVER commit without user approval unless explicitly instructed

**Commit Message Format:**
```bash
git commit -m "$(cat <<'EOF'
[Verb] [brief description of what changed]

[Optional: Why this change was needed]
[Optional: What was tested]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: [Agent Name] <noreply@anthropic.com>
EOF
)"
```

### Pre-Commit Checklist
```bash
# 1. Check what's changed
git status
git diff

# 2. Review staged changes
git diff --staged

# 3. Test (project-specific)
[Add test commands]

# 4. Commit with descriptive message
git commit -m "..."

# 5. Update log file with commit reference
```

---

## 🎯 Session Handoff Checklist

**Before finishing your work session, ensure:**

- [ ] All changes are logged in log file
- [ ] Code is in a working state (not broken mid-refactor)
- [ ] If using git: Changes are committed with descriptive message
- [ ] Tests pass (if applicable)
- [ ] Dependencies are installed (if package.json modified)
- [ ] Next steps are documented

**Handoff Message Template:**
```markdown
## Session Complete: [Task Name]

**Status:** ✅ Complete / 🔄 In Progress / ⚠️ Blocked

**What Was Done:**
[2-3 sentence summary]

**Files Changed:**
- [list of files]

**How to Continue:**
[Instructions for next agent or user]

**Blockers (if any):**
[What's preventing completion?]
```

---

## 🎓 Educational Context

**Target Audience:** [Who uses this?]
**Learning Goals:** [What does this teach or enable?]
**Design Principles:**
- [Principle 1]
- [Principle 2]

---

## ⚠️ Important Notes

- **[Add critical constraints or requirements]**
- **[Add common gotchas]**
- **[Add special considerations]**

---

## 🔗 Key References

- Main README: `README.md` - [what's in it]
- CLAUDE.md: [project-specific instructions if exists]
- [Add other key docs]

---

<!-- ✂️ AUTO-UPDATE BOUNDARY - Don't modify above this line -->
<!-- Everything above gets auto-updated when template changes -->
<!-- Everything below is preserved across updates -->

---

## 💡 Project-Specific Custom Notes

> **This section is for hand-written notes that won't be overwritten**

### Custom Agent Instructions
[Add any project-specific agent behaviors here]

### Quirks & Workarounds
[Document weird edge cases or workarounds]

### Future Enhancements
[Ideas for future development]

---

**Last Manual Update:** 2025-12-26
**Updated By:** Propagation Script v1.1
