# Kill Switch
The "Kill Switch" is a system which allows the extension maintainer and some
authorized people to remotely disable a specific feature which is misbehaving
to everyone.

This folder contains the code that the extension uses to interact with the Kill
Swtich server to determine whether a feature should be disabled or not.

## Explanation
The kill switch mechanism works as follows:

1. There's a dashboard available at https://twpt-dashboard.avm99963.com/. There,
some authorized users can set some features to be disabled for everyone,
according to some criteria (it might be specified that only some versions of the
extension or some browsers are affected by this).
1. When a feature is set from the dashboard as force disabled (what we call
"enable a kill switch"), an entry is added to the server's database.
1. Every 30 minutes, the extension queries the server behind the dashboard, to
retrieve a list of force disabled features from the database.
1. The extension processes this list, and if any of the features in the list
apply to the extension according to the linked criteria, it force disables
those. If, on the contrary, a feature which was force disabled is no longer
force disabled, the previous status is restored.

## Developing the Kill Switch mechanism
The kill switch mechanism is disabled in non-release (i.e., development)
builds. To enable it, add the following lines to a `user.bazelrc` file at the
root of the repo:

```
common --//src/killSwitch:enable_kill_switch_mechanism
common --//src/killSwitch:host=http://localhost:8081
```
