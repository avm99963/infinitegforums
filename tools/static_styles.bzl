load("//src/features/avatars/ui/staticStyles:defs.bzl", avatars_static_style = "static_style")
load("//src/features/batchLock/ui/staticStyles:defs.bzl", batch_lock_static_style = "static_style")
load("//src/features/bulkReportReplies/ui/staticStyles:defs.bzl", bulk_report_replies_static_style = "static_style")
load("//src/features/enhancedAnnouncementsDot/ui/staticStyles:defs.bzl", enhanced_announcements_dot_static_style = "static_style")
load("//src/features/fixCrPopup/ui/staticStyles:defs.bzl", fix_cr_popup_static_style = "static_style")
load("//src/features/fixedToolbar/ui/staticStyles:defs.bzl", fixed_toolbar_static_style = "static_style")
load("//src/features/imageMaxHeight/ui/staticStyles:defs.bzl", image_max_height_static_style = "static_style")
load("//src/features/increaseContrast/ui/staticStyles:defs.bzl", increase_contrast_static_style = "static_style")
load("//src/features/repositionExpandThread/ui/staticStyles:defs.bzl", reposition_expand_thread_static_style = "static_style")
load("//src/features/stickySidebarHeaders/ui/staticStyles:defs.bzl", sticky_sidebar_headers_static_style = "static_style")
load("//src/features/threadToolbar/ui/staticStyles:defs.bzl", thread_toolbar_static_style = "static_style")

_static_styles = [
    avatars_static_style,
    batch_lock_static_style,
    bulk_report_replies_static_style,
    enhanced_announcements_dot_static_style,
    fix_cr_popup_static_style,
    fixed_toolbar_static_style,
    image_max_height_static_style,
    increase_contrast_static_style,
    reposition_expand_thread_static_style,
    sticky_sidebar_headers_static_style,
    thread_toolbar_static_style,
]

def get_static_styles_replace_prefixes():
    replace_prefixes = {}
    for static_style in _static_styles:
        replace_prefixes[static_style.src] = static_style.destination
    return replace_prefixes

def get_static_styles_labels():
    return [static_style.label for static_style in _static_styles]
