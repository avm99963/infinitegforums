load("//tools:static_styles_provider.bzl", "StaticStyle")

static_style = StaticStyle(
    label = Label("staticStyles"),
    src = "src/features/fixCrPopup/ui/staticStyles/styles.css",
    destination = "css/fix_cr_popup.css",
)
