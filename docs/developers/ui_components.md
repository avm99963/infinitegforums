# Building UI components

To build UI components, it is highly recommended to use [Lit][lit]. This page
will explain how we use it in this project.

Some legacy components are built using using the Javascript DOM API (such as
using `document.createElement()`, `element.append()`, etc.), plain CSS
stylesheets (which are injected without any modification), and the
`chrome.i18n` API for localization. This method is no longer recommended, since
the code is unreadable and we cannot easily implement reactivity.

## Convention

We usually name the custom elements with a `twpt-` prefix in order to prevent
naming collisions with the vanilla code already running in the page.

## Localization

We use the `@lit/localize` library. [Learn how it works][lit-localize].

One of the issues we had when migrating the codebase to Bazel is that, since we
need to use the `lit-localize` tool to extract messages from the code (and
build the locale files with the translated strings), we needed a way to pipe
all relevant source code to the tool.

We could input all the codebase (which is what the tool expects, btw), but
since that would be inefficient, we've defined a file group with all the source
code that needs to be translated (i.e., uses the `msg` function):
`//src/lit-locales:localized_code`.

## Injection

We usually do the following:

- Import the component definition in the
  `src/injections/litComponentsInject.js` file. This file is injected to the
  main world so the custom elements are available to the page.
- Inject Lit components from a sandboxed content script, by doing something
  like this:

  ``` ts
  const myLitElement = document.createElement('twpt-my-lit-element');
  someNode.append(myLitElement);
  ```

In order for TypeScript to know that `myLitElement` is of type
`TWPTMyLitElement`, we only import its type. There's no need to import the
component code since it is run in the main world, not in the sandbox!

[lit]: https://lit.dev/
[lit-localize]: https://lit.dev/docs/localization/overview/
