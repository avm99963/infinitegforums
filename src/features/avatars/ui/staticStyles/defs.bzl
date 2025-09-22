load("//:tools/static_styles_provider.bzl", "StaticStyle")

static_style = StaticStyle(
    label = Label("staticStyles"),
    src = "src/features/avatars/ui/staticStyles/styles.css",
    destination = "css/thread_list_avatars.css",
)
