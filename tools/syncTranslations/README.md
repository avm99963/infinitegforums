# Sync translations

Tool which syncs some translations from the Community Console to our project.

## Configuring strings to synchronize

Add them to [config.ts](./config.ts). Keep in mind that only non-existing
translations will be synced: after they are already available in our codebase,
translations will not be overriden.

## Running the tool

This tool should be run manually using:

```sh
make sync_translations
```

Then, commit the changes made by the synchronization.

The rationale for not automating this is that this tool will be used sparingly.
Mainly, we will use it when changing strings to be synced, or adding a new
language to the extension.
