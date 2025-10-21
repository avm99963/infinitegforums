# Extension's architecture

The extension's source code is based on a [**ports and adapters
architecture**][hexagonal], also known as **hexagonal architecture**. We also
use something similar to [**clean architecture**][clean-architecture], which is
a superset of the former, but with different layers (which still aren't clearly
defined).

To bring inversion of control (as needed by an hexagonal architecture), we use
**pure dependency injection**: injecting dependencies manually in the
entrypoint of the application (for more info, read _Dependency Injection.
Principles, Practices and Patterns._ Steven van Deursen, Mark Seemann).

*** promo
**Note:** there is a lot of legacy code that doesn't conform to this
architecture. We're slowly moving everything over to the new architecture, and
we're certain that a lot of code will never be ported over (e.g., a lot of
features will continue to be implemented in the core layer, see the section
below).
***

## Layers

- **Entrypoint**: for code that is going to be injected to TW, entrypoints are
  the actual scripts that are injected. They are the composition root for pure
  DI, and depend on the scripts found in the presentation layer to provide the
  actual logic.
- **Presentation:** the first layer, used to present the feature to users.
- **Ui:** layer which contains the UI components.
- **Domain:** layer which contains the the entities/models.
- **Services and repositories:** layer which holds the classes used to interact
  with the outside world.
- **Core:** legacy layer used to hold the logic of features that were just
  migrated to the `features` folder, but haven't been fully migrated to the new
  architecture: the logic of files in this folder doesn't usually use DI, and
  hasn't been split into separate layers.

  Ideally, in the future this layer will cease to exist. It's called "core"
  because it contains the main bulk of the logic.

The layers are not yet finalized, and may change. For instance, a sensible
change we might do is to merge the services folders into repositories.

Except for the entrypoint and legacy layers, source code inside
`infrastructure` folders contain the adapters (implementations), while code
outside of them contain the ports (interfaces).

[clean-architecture]: https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
[hexagonal]: https://alistair.cockburn.us/hexagonal-architecture
