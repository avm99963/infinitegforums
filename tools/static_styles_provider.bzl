StaticStyle = provider(
    doc = "Provider of a static styles file mapping, representing where it's saved and the place where it should be saved in the extension package.",
    fields = {
        "label": "Label of the style.",
        "src": "Path where the file is saved.",
        "destination": "Path in the extension package where the style should be copied.",
    },
)
