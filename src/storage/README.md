# storage

This folder contains the logic for maintaining the `sync` storage area.

We have several schemas in the `schemas` folder: some types that describe how
the area is organized (specifically, what items it contains). These schemas
describe the history of how the storage area has been organized throughout the
development of this project.

Then, [migrations][migration] (saved in the `migrations` folder) define how to
move from one version of the schema to the next one.

## Perspective on the future

Maybe in the future this can be extended into other storage areas as well (we
also use `local` for workflows and `session` in `//src/bg`).

The code is pretty generic and could be extended easily, though there are some
references to `sync` that might need to be removed.

[migration]: ./domain/Migration.ts
