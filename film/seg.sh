#!/usr/bin/env bash
# يرمّز جزءًا من لقطات الفيلم إلى مقطع فيديو 1080 (بلا صوت) للتجميع لاحقًا
#   seg.sh <مجلد اللقطات> <أول لقطة> <ملف mp4>
set -euo pipefail
ffmpeg -y -v error -framerate 30 -start_number "$2" -i "$1/f_%05d.jpg" -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -g 60 -bf 2 -an "$3"
