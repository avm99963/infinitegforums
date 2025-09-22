load("//:tools/static_styles_provider.bzl", "StaticStyle")

static_style = StaticStyle(
    label = Label("staticStyles"),
    src = "src/features/increaseContrast/ui/staticStyles/styles.css",
    destination = "css/increase_contrast.css",
)
