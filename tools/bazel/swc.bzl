load("@aspect_rules_swc//swc:defs.bzl", "swc")
load("@bazel_skylib//lib:partial.bzl", "partial")

swc_pkg = partial.make(
    swc,
    swcrc = "//:.swcrc_pkg",
    source_maps = True,
)

swc_pkg_strict = partial.make(
    swc,
    swcrc = "//:.swcrc_pkg_strict",
    source_maps = True,
)
