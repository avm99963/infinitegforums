//go:build tools
// +build tools

package tools

// These imports only exist to keep go.mod entries for packages that are referenced
// in BUILD files, but not in Go code.

import (
	_ "gomodules.avm99963.com/webext/genmanifest"
)
