#!/bin/sh

# Execute scripts/check-git-status.sh and fail if it exits with a non-zero exit code.
sh scripts/check-git-status.sh || exit 1

# run npx standard-version with all arguments
npx standard-version "$@"

# Check if tag was created
if [ -z "$(git tag --points-at HEAD)" ]; then
  echo "No tag created"
  exit 1
fi

# Get final version from the created git tag
VERSION=$(git describe --tags --abbrev=0)
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

git push --follow-tags origin $CURRENT_BRANCH --no-verify

# Success message
echo "Successfully bumped to $VERSION and pushed to origin"