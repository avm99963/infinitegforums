load("//:tools/static_styles_provider.bzl", "StaticStyle")

static_style = StaticStyle(
    label = Label("staticStyles"),
    src = "src/features/imageMaxHeight/ui/staticStyles/styles.css",
    destination = "css/image_max_height.css",
)
