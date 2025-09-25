load("//tools:static_styles_provider.bzl", "StaticStyle")

static_style = StaticStyle(
    label = Label("staticStyles"),
    src = "src/features/stickySidebarHeaders/ui/staticStyles/styles.css",
    destination = "css/sticky_sidebar_headers.css",
)
