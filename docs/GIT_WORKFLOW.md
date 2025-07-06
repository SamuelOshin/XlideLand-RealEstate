# 🌿 Git Workflow for XlideLand Monorepo

This document outlines the Git workflow and branching strategy for the XlideLand real estate platform monorepo.

## 📋 Overview

XlideLand uses a **monorepo structure** where both frontend (Next.js) and backend (Django) code are maintained in a single repository. This approach provides better coordination, easier dependency management, and streamlined deployment.

## 🌳 Branch Structure

### Main Branches

#### `main` (Production)
- **Purpose**: Production-ready code
- **Contains**: Stable, tested code for both frontend and backend
- **Protected**: Yes (requires PR and reviews)
- **Deployment**: Auto-deploys to production
- **Merges from**: `develop` only

#### `develop` (Integration)
- **Purpose**: Integration branch for feature development
- **Contains**: Latest development changes
- **Protected**: Yes (requires PR)
- **Merges from**: All feature branches
- **Merges to**: `main` (for releases)

### Feature Branches

#### Frontend Features
```
feature/frontend-*
```
- `feature/frontend-user-dashboard`
- `feature/frontend-property-search`
- `feature/frontend-auth-system`
- `feature/frontend-ui-components`

#### Backend Features
```
feature/backend-*
```
- `feature/backend-api-endpoints`
- `feature/backend-user-management`
- `feature/backend-property-models`
- `feature/backend-authentication`

#### Full-Stack Features
```
feature/fullstack-*
```
- `feature/fullstack-property-management`
- `feature/fullstack-user-authentication`
- `feature/fullstack-contact-system`
- `feature/fullstack-search-functionality`

#### Other Branch Types
```
hotfix/*        # Critical production fixes
release/*       # Release preparation
bugfix/*        # Bug fixes
chore/*         # Maintenance tasks
docs/*          # Documentation updates
```

## 🚀 Workflow Process

### 1. Starting New Work

```bash
# 1. Switch to develop and pull latest changes
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/frontend-user-dashboard

# 3. Work on your feature
# Make changes, add files, etc.

# 4. Regular commits
git add .
git commit -m "feat: add user dashboard skeleton"
git commit -m "feat: add dashboard navigation"
git commit -m "style: improve dashboard layout"
```

### 2. Working on Features

```bash
# Push your branch regularly
git push origin feature/frontend-user-dashboard

# Keep your branch updated with develop
git checkout develop
git pull origin develop
git checkout feature/frontend-user-dashboard
git rebase develop  # or merge if preferred
```

### 3. Completing Features

```bash
# 1. Final commit and push
git add .
git commit -m "feat: complete user dashboard implementation"
git push origin feature/frontend-user-dashboard

# 2. Create Pull Request
# - Base: develop
# - Compare: feature/frontend-user-dashboard
# - Add reviewers
# - Link any related issues

# 3. After PR approval and merge
git checkout develop
git pull origin develop
git branch -d feature/frontend-user-dashboard
```

### 4. Release Process

```bash
# 1. Create release branch from develop
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0

# 2. Prepare release
# - Update version numbers
# - Update CHANGELOG.md
# - Final testing
# - Bug fixes only

# 3. Merge to main
git checkout main
git pull origin main
git merge release/v1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin main --tags

# 4. Merge back to develop
git checkout develop
git merge main
git push origin develop

# 5. Delete release branch
git branch -d release/v1.2.0
```

### 5. Hotfix Process

```bash
# 1. Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-fix

# 2. Fix the issue
git add .
git commit -m "hotfix: fix critical authentication bug"

# 3. Merge to main
git checkout main
git merge hotfix/critical-bug-fix
git tag -a v1.2.1 -m "Hotfix version 1.2.1"
git push origin main --tags

# 4. Merge to develop
git checkout develop
git merge hotfix/critical-bug-fix
git push origin develop

# 5. Delete hotfix branch
git branch -d hotfix/critical-bug-fix
```

## 📝 Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) for consistent commit messages:

### Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **perf**: Performance improvements
- **ci**: CI/CD changes
- **build**: Build system changes

### Scopes (Optional)
- **frontend**: Frontend changes
- **backend**: Backend changes
- **api**: API-related changes
- **ui**: UI/UX changes
- **auth**: Authentication changes
- **db**: Database changes
- **deps**: Dependencies

### Examples
```bash
# Feature additions
git commit -m "feat(frontend): add user dashboard component"
git commit -m "feat(backend): implement property search API"
git commit -m "feat(fullstack): add property favorites system"

# Bug fixes
git commit -m "fix(auth): resolve login redirect issue"
git commit -m "fix(api): handle empty property search results"

# Documentation
git commit -m "docs: update API documentation"
git commit -m "docs(readme): add installation instructions"

# Refactoring
git commit -m "refactor(frontend): restructure component hierarchy"
git commit -m "refactor(backend): optimize database queries"

# Breaking changes
git commit -m "feat(api)!: update user authentication endpoints

BREAKING CHANGE: authentication endpoints now require API key"
```

## 🛡️ Branch Protection Rules

### Main Branch Protection
- ✅ Require pull request reviews (2 reviewers)
- ✅ Dismiss stale reviews when new commits are pushed
- ✅ Require review from code owners
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging
- ✅ Restrict pushes that create files larger than 100MB

### Develop Branch Protection
- ✅ Require pull request reviews (1 reviewer)
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging

## 🔍 Code Review Guidelines

### PR Requirements
- **Clear Title**: Descriptive title following conventional commits
- **Description**: What was changed and why
- **Testing**: How the changes were tested
- **Screenshots**: For UI changes
- **Breaking Changes**: Clearly marked if any
- **Documentation**: Updated if needed

### Review Checklist
- [ ] Code follows project conventions
- [ ] Tests are included and passing
- [ ] Documentation is updated if needed
- [ ] No console.log or debug statements
- [ ] Performance impact considered
- [ ] Security implications reviewed
- [ ] Backward compatibility maintained

## 🚨 Emergency Procedures

### Reverting Changes
```bash
# Revert last commit
git revert HEAD

# Revert specific commit
git revert <commit-hash>

# Revert merge commit
git revert -m 1 <merge-commit-hash>
```

### Rolling Back Releases
```bash
# Create rollback branch
git checkout -b rollback/v1.2.0-to-v1.1.0

# Reset to previous version
git reset --hard v1.1.0

# Force push (use with caution)
git push origin rollback/v1.2.0-to-v1.1.0 --force
```

## 📊 Monitoring and Metrics

### Branch Metrics
- **Feature Branch Lifespan**: Target < 1 week
- **PR Review Time**: Target < 24 hours
- **Merge Frequency**: Daily to develop, weekly to main
- **Hotfix Frequency**: Monitor and minimize

### Quality Metrics
- **Test Coverage**: Maintain > 80%
- **Build Success Rate**: Target > 95%
- **Code Review Coverage**: 100% of changes reviewed

## 🔧 Git Configuration

### Recommended Git Config
```bash
# Set up user information
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set up useful aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'

# Set up line ending handling
git config --global core.autocrlf true  # Windows
git config --global core.autocrlf input # macOS/Linux

# Set up default branch
git config --global init.defaultBranch main
```

### Git Hooks
We use pre-commit hooks to ensure code quality:

```bash
# Install pre-commit
pip install pre-commit

# Install hooks
pre-commit install

# Run hooks manually
pre-commit run --all-files
```

## 📚 Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Semantic Versioning](https://semver.org/)

---

**Remember**: Good Git practices lead to better collaboration, easier debugging, and more maintainable code! 🚀
