load("//tools:static_styles_provider.bzl", "StaticStyle")

static_style = StaticStyle(
    label = Label("staticStyles"),
    src = "src/features/enhancedAnnouncementsDot/ui/staticStyles/styles.css",
    destination = "css/enhanced_announcements_dot.css",
)
