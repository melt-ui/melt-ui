# Contributing to Melt UI

## Code of Conduct

Melt UI has adopted the
[Contributor Covenant](https://www.contributor-covenant.org/) as its Code of
Conduct, and we expect project participants to adhere to it.

Please read [the full text](/CODE_OF_CONDUCT.md) so that you can understand what
actions will and will not be tolerated.

## Heuristics

[heuristic](<https://en.wikipedia.org/wiki/Heuristic_(computer_science)>)
/ˌhjʊ(ə)ˈrɪstɪk/

> A technique designed for solving a problem more quickly when classic methods
> are too slow, or for finding an approximate solution when classic methods fail
> to find any exact solution

- Priority is the best User Experience
- Complexity should be introduced when it’s inevitable
- Code should be easy to reason about
- Code should be easy to delete
- Avoid abstracting too early
- Avoid thinking too far in the future

## Questions

If you have questions about Melt UI, be sure to check out the docs where we have
several examples and detailed API references that may help you solve your
problem. You can also share your questions on our Discord community (link on
[README.md](/README.md)). We're happy to help!

## How to contribute

There are many ways to contribute to the project. Code is just one possible
means of contribution.

- **Feedback.** Tell us what we're doing well or where we can improve.
- **Support.** You can answer questions on Discord, or provide solutions for
  others in [open issues](https://github.com/melt-ui/melt-ui/issues).
- **Write.** If you come up with an interesting example, write about it. Post it
  to your blog and share it with us. We'd love to see what folks in the
  community build with Melt UI!
- **Report.** Create issues with bug reports so we can make Melt UI even better.

## Working on your first Pull Request?

There are a lot of great resources on creating a good pull request. We've
included a few below, but don't be shy—we appreciate all contributions and are
happy to help those who are willing to help us!

- [How to Contribute to a Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

## Creating a new component builder?

The Builder API is fairly new in its conception. As such, there aren't strict
conventions around it.

Under the hood, the "elements" that builder exposes are nothing more than
objects. The trick is, these objects contain an UUID that is used to identify
them. This UUID is then used to get the element via document.querySelector and
pass events to it.

You'll see two methods commonly appearing inside builders. `elementDerived` and
`elementMultiDerived`. In general, elementDerived is to be used when only a
single instance of an element is expected to be used (e.g. `root`), while
elementMultiDerived accepts multiple instances of an element (e.g. Tabs
`trigger`). You pass in a store to them, and a callback that accepts both the
store values, and an `attach` method for attaching event listeners. This
callback must return an object in `elementDerived` and a function in
`elementMultiDerived`.

In case you don't need to use stores, you also have the `element` and
`elementMulti` methods, which are just wrappers around the derived methods that
don't accept a store.

In some cases, you'll want to run an effect whenever an internal value changes.
You have the `effect` method for that.

In case of any doubts, you can always check the source code of existing
builders, or reach out to us on Discord. We're more than happy to help!

## Preparing a Pull Request

[Pull Requests](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request)
are always welcome, but before working on a large change, it is best to open an
issue first to discuss it with maintainers, or check if there is already an
issue for it.

A good PR is small, focuses on a single feature or improvement, and clearly
communicates the problem it solves. Try not to include more than one issue in a
single PR. It's much easier for us to review multiple small pull requests than
one that is large and unwieldy.

1. [Fork the repository](https://docs.github.com/en/free-pro-team@latest/github/getting-started-with-github/fork-a-repo).

2. Clone the fork to your local machine and add upstream remote:

```sh
git clone https://github.com/<your username>/melt-ui.git
cd melt-ui
git remote add upstream https://github.com/melt-ui/melt-ui.git
```

1. Synchronize your local `develop` branch with the upstream remote:

```sh
git checkout develop
git pull upstream develop
```

1. Install dependencies with [pnpm](https://pnpm.io/):

```sh
pnpm i
```

1. Create a new branch related to your PR:

```sh
git checkout -b fix/bug-being-fixed
```

6. Make changes, then commit and push to your forked repository:

```sh
git push -u origin HEAD
```

7. Go to [the repository](https://github.com/melt-ui/melt-ui) and
   [make a Pull Request](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

8. We will review your Pull Request and either merge it, request changes to it,
   or close it with an explanation.

## Working locally

### Development

```bash
# install dependencies
pnpm i

# start docs page and see examples in the browser
pnpm run dev
```

Make your changes and check that they resolve the problem with an example in the
local docs. We also suggest adding tests to support your change, and then run
`pnpm run test` to make sure nothing is broken.

Lastly, run `pnpm run lint` && `pnpm run check` to ensure that everything is in
order before submitting the pull request.
