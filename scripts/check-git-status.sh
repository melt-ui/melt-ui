#!/bin/sh

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Checking git status on branch $CURRENT_BRANCH"


# # Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "There are uncommitted changes. Please commit them and try again."
    exit 1
fi

# Check if the current branch name starts with "release"
if echo "$CURRENT_BRANCH" | grep -q -v "release"; then
    echo "You are not on a release branch. Please switch to a release branch and try again."
    exit 1
fi

# Update remote branch to fetch latest remote commit
git remote update

# Check if current branch has upstream set
if [ -z "$(git rev-parse --abbrev-ref @{upstream})" ]; then
    echo "The current branch has no upstream set. Please set an upstream for the current branch and try again."
    exit 1
fi

# Get the latest commit hash
local_commit=$(git rev-parse @)
remote_commit=$(git rev-parse @{u})
base_commit=$(git merge-base @ @{u})

# Check branch status
if [ "$local_commit" = "$remote_commit" ]; then
  echo "Branch is up-to-date with origin."
  exit 0
elif [ "$local_commit" = "$base_commit" ]; then
  echo "Branch is behind origin. Please pull and try again."
  exit 1
elif [ "$remote_commit" = "$base_commit" ]; then
  echo "Branch is ahead of origin. Please push and try again."
  exit 1
else
  echo "Branch has diverged. Please pull and try again."
  exit 1
fi