load("//:tools/static_styles_provider.bzl", "StaticStyle")

static_style = StaticStyle(
    label = Label("staticStyles"),
    src = "src/features/bulkReportReplies/ui/staticStyles/styles.css",
    destination = "css/bulk_report_replies.css",
)
