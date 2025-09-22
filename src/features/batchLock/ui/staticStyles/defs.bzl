load("//:tools/static_styles_provider.bzl", "StaticStyle")

static_style = StaticStyle(
    label = Label("staticStyles"),
    src = "src/features/batchLock/ui/staticStyles/styles.css",
    destination = "css/batchlock_inject.css",
)
