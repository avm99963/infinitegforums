load("@aspect_rules_swc//swc:defs.bzl", "swc")
load("@bazel_skylib//lib:partial.bzl", "partial")

swc_pkg = partial.make(
    swc,
    swcrc = "//:.swcrc_pkg",
    source_maps = True,
)
