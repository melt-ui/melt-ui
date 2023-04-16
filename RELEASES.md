# Releases

Every release is generated manually while in a `release/xxx` branch.

- To prepare a release, checkout from `develop` to a `release/xxx` branch.
- **No features are added to this `release/xxx` branch. Only bug fixes, documentation generation, and other release-oriented tasks should go in this branch.**
- Whenever the release is tested and ready to be deployed, **generate a new version** to be merged to `develop`
- Also merge the release branch to `develop` – which, at this time, could have more commits (and even received new features)

## Generating releases

When the app is internally tested and approved, it's time to generate a release.

Make sure you're on a `release/xxx` branch (e.g.: `release/next`) with no uncommitted changes.

### Create a release based on conventional commit messages

```
pnpm run release
```

### Create a release with a specific version

```
pnpm run release --release-as X.X.X
# or
pnpm run release --release-as minor
```

### Create your first release (without bumping files)

```
pnpm run release --first-release
```

_Check all available flags in https://www.npmjs.com/package/standard-version_

### What is this script doing

1. Check if our git status is clean and we're on a correct branch
2. Bump version in package.json
3. Generate changelog
4. Commit these changes
5. Tag this commit
6. Push changes and tag to origin
