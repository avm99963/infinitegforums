#!/bin/bash
# Helper tool used to compress generated GIFs
gifsicle -O3 --lossy=100 --colors 128 $1 -o $2

# webp isn't yet allowed to be used in gitiles
#gif2webp -mixed -min_size -loop_compatibility $2
