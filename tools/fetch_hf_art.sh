#!/bin/sh
# Downloads the HELL.EXE Higgsfield art into assets/ so the game doesn't depend on the Higgsfield CDN.
# Run once from the repo root: sh tools/fetch_hf_art.sh   (then commit the .webp files)
CDN=https://d8j0ntlcm91z4.cloudfront.net/user_3KJVMTVL7n80h8UThtXGEHD8BGV
get(){ mkdir -p "assets/$(dirname "$1")"; curl -sfL "$CDN/$2_min.webp" -o "assets/$1.webp" && echo "ok  $1" || echo "FAIL $1"; }
get story/matrix_rain  hf_20261018_135021_db33dbbf-15f4-4ae9-836c-f726964c82ae
get story/matrix_dodge hf_20261018_135019_a2f32af3-a00d-4a02-9adf-d7e9c8803c22
get story/matrix_catch hf_20261018_135020_8f449107-930c-4915-9cce-92d140aa9b92
get bg/hell_a          hf_20261018_135020_26f7ccd2-0041-4cb5-951f-0fa2de73a0c4
get bg/hell_b          hf_20261018_135019_b0bd9cae-f1ba-4fa1-b44e-3f27882985db
get story/spider_vendor hf_20261018_171602_13efc660-c26c-474a-a547-fa9b66722efb
get story/vv_bin hf_20261018_164318_48cff445-1d35-4ad7-84e6-d2646fa4dda1
get story/haggle hf_20261018_180856_3d8b1c71-9d68-4ad0-9558-06a6bbb67091
get story/tata hf_20261018_180857_2225d6bc-52ad-48ce-ba6b-7c9f335b4164
get story/rumi hf_20261018_180856_2b7f0020-fd32-4961-81c2-fcbdd234a49d
curl -sfL https://d2ol7oe51mr4n9.cloudfront.net/user_3KJVMTVL7n80h8UThtXGEHD8BGV/1fa480f8-8e1f-40f3-977d-451ec032f8e1.mp4 -o assets/video/tiririri.mp4 && echo "ok  video/tiririri" || echo "FAIL video/tiririri"
# new title screen / album art (uploaded media, plain jpg)
curl -sfL https://d2ol7oe51mr4n9.cloudfront.net/user_3KJVMTVL7n80h8UThtXGEHD8BGV/99714105-106a-428a-a9b8-81af77fd587f.jpg -o assets/shots/00_title_v2.jpg && echo "ok  shots/00_title_v2" || echo "FAIL shots/00_title_v2"
