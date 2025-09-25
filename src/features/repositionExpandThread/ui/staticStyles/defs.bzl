load("//tools:static_styles_provider.bzl", "StaticStyle")

static_style = StaticStyle(
    label = Label("staticStyles"),
    src = "src/features/repositionExpandThread/ui/staticStyles/styles.css",
    destination = "css/reposition_expand_thread.css",
)
