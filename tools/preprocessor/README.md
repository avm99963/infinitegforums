# preprocessor

Minimal tool that lets us preprocess code according to some conditions.

## Usage

When running the tool, you pass a list of **defined dependencies**. Then, in
the code, you can add statements with conditions that decide whether to output
some code based on whether the dependencies are defined or not.

- There are three types of statements:

  - `#!if`
  - `#!else`
  - `#!endif`

- The characters preceding the statement are ignored, so you can include these
  inside comments in your programming language.

- The `#!if` statement accepts `defined(...)` statements which match if the
  dependency is defined:

  ```ts
  // #!if defined(NEW_BAR)
  const foo = 'newBar';
  // #!else
  const foo = 'oldBar';
  // #!endif
  ```

- It also supports parentheses, the `&&` (and) operator and the `||` (or)
  operator:

  ```ts
  // #!if (defined(NEW_FOO) || defined(NEW_BAR)) && defined(NOTIFY)
  console.log('Be careful! An experimental feature has been enabled.');
  // #!endif
  ```

- To prevent confusion, you cannot mix different operators inside a parenthesis
  level:

  ```ts
  // This will give a preprocessing error.
  // Instead, use parentheses like in the previous example.
  // #!if defined(NEW_FOO) || defined(NEW_BAR) && defined(NOTIFY)
  console.debug('Be careful! An experimental feature has been enabled.');
  // #!endif
  ```

- Finally, it also supports the negation operator `!` before a defined
  statement or a pair of parentheses:

  ```ts
  // #!if !defined(IS_PRODUCTION) && !(FEATURE_FLAG_FOO || FEATURE_FLAG_BAR)
  console.debug('No feature flags are enabled.');
  // #!endif
  ```

- Inside an "if" or "else" branch, one can also add other nested if-else-endif
  statements to compose them:

  ```ts
  // #!if defined(NOTIFY)
  // #!if defined(NEW_FOO)
  console.debug('The NEW_FOO experiment is enabled.');
  // #!endif
  // #!if defined(NEW_BAR)
  console.debug('The NEW_BAR experiment is enabled.');
  // #!endif
  // #!else
  console.debug('No experiments are enabled.');
  // #!endif
  ```

- The output will be what you expect: the lines which match the conditions set
  out in statements.

  For instance, for the last example, if the defined dependencies are `NEW_BAR,
  NOTIFY`, the preprocessor outputs:

  ```ts
  console.debug('The NEW_BAR experiment is enabled.');
  ```

  And if the defined dependencies are `NEW_BAR`, then it outputs:

  ```ts
  console.debug('No experiments are enabled.');
  ```

## More examples

You can find more examples in the [test\_data](./test_data) directory.
