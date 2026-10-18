#!/usr/bin/env bash
# يجمع مقاطع الفيلم بالترتيب (بلا إعادة ترميز) ويضيف الصوت، ثم صورة الغلاف: بطاقة العميل مكتملة الحفر والنقاط
#   join.sh <ملف mp4 الناتج> <ملف jpg> <مقطع1> <مقطع2> ...
set -euo pipefail
D="$(cd "$(dirname "$0")" && pwd)"; OUT="$1"; JPG="$2"; shift 2
L="$(mktemp)"; for f in "$@"; do printf "file '%s'\n" "$(cd "$(dirname "$f")" && pwd)/$(basename "$f")" >> "$L"; done
ffmpeg -y -v error -f concat -safe 0 -i "$L" -i "$D/audio.m4a" -map 0:v -map 1:a -c copy -t 32.5 -movflags +faststart "$OUT"
ffmpeg -y -v error -ss 25.5 -i "$OUT" -frames:v 1 -q:v 3 "$JPG"
