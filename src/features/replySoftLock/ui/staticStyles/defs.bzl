load("//tools:static_styles_provider.bzl", "StaticStyle")

static_style = StaticStyle(
    label = Label("staticStyles"),
    src = "src/features/replySoftLock/ui/staticStyles/styles.css",
    destination = "css/reply_soft_lock.css",
)
