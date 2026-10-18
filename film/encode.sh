#!/usr/bin/env bash
# يحوّل لقطات الفيلم إلى MP4 بدقة 1080 مع الصوت، وصورة غلاف من لحظة إضاءة بطاقة إيليت
#   encode.sh <مجلد اللقطات> <ملف mp4> <ملف jpg>
set -euo pipefail
D="$(cd "$(dirname "$0")" && pwd)"
ffmpeg -y -v error -framerate 30 -i "$1/f_%05d.jpg" -i "$D/audio.m4a" -t 32.5 -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p -c:a copy -movflags +faststart "$2"
ffmpeg -y -v error -i "$1/f_00700.jpg" -q:v 3 "$3"
