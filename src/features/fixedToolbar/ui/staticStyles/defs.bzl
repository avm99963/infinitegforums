load("//:tools/static_styles_provider.bzl", "StaticStyle")

static_style = StaticStyle(
    label = Label("staticStyles"),
    src = "src/features/fixedToolbar/ui/staticStyles/styles.css",
    destination = "css/fixed_toolbar.css",
)
