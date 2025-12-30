# storage

This folder contains the logic for maintaining the `sync` storage area.

We have several schemas in the `schemas` folder: some types that describe how
the area is organized (specifically, what items it contains). These schemas
describe the history of how the storage area has been organized throughout the
development of this project.

Then, [migrations][migration] (saved in the `migrations` folder) define how to
move from one version of the schema to the next one.

In `repositories` we define a port that lets its users access the storage area
without having to care too much about the migration process (so callers can
assume that the storage area has been migrated to the latest schema version).

## How migrations are executed

The idea is migrations are executed when a request to save or read data from
our repository is made. If the schema version does not match the latest schema
version, migrations are executed first to update the schema to the latest
version.

### About race conditions

Executing migrations before each request is processed introduces a potential
issue: race conditions.

To fix this, our goal is to make sure that even if 2 or more requests come in
at the same time, the migrations are only executed once, and the requests are
processed only after the migration is done.

But we have a challenge: multiple repositories can coexist in multiple
contexts, so we can't implement a mutex in each repository and be done with it.

**Our solution: centralize the migration execution in a migrator that lives in
the background script/service worker**. This way, a mutex in this migrator can
ensure migrations are only executed once.

Then, as said **each instance of the repository will call this centralized
migrator** when it detects that a migration is needed before processing
`get`/`set` requests.

We have two cases:

- **The repository lives in the background script:** the migrator is called
  directly.
- **The repository lives in another context:** we use an intermediate proxy
  migrator adapter that sends a message to the background script to execute the
  migration in the centralized migrator.

## Perspective on the future

Maybe in the future this can be extended into other storage areas as well (we
also use `local` for workflows and `session` in `//src/bg`).

The code is pretty generic and could be extended easily, though there are some
references to `sync` that might need to be removed.

[migration]: ./domain/Migration.ts
