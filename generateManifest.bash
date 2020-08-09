#!/bin/bash

# Generates the manifest.json file according to the dependencies passed
# via CLI arguments

dependencies=( "$@" )

rm -f src/manifest.json
cp templates/manifest.gjson src/manifest.json

for dep in "${dependencies[@]}"; do
  perl -0777 -pi -e "s/^#if defined\($dep\)\n([^#]*)#endif\n/\$1/gms" src/manifest.json
done

perl -0777 -pi -e "s/^#if defined\([^\n#]+\)\n[^#]*#endif\n//gms" src/manifest.json
