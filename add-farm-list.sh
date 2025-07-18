#!/bin/bash

while IFS='|' read -r x y; do
curl 'https://ttq.x2.america.travian.com/api/v1/farm-list/slot' \
  -H 'accept: application/json, text/javascript, */*; q=0.01' \
  -H 'accept-language: en,en-US;q=0.9,vi;q=0.8,vi-VN;q=0.7' \
  -H 'content-type: application/json; charset=UTF-8' \
  -b '_fw_crm_v=b772ba38-18f5-458f-deb5-3c49377a01d3; _ga_4NQKT5Y92J=GS2.2.s1750380265$o1$g1$t1750380265$j60$l0$h0; _ga_VLL1WGW5X2=GS2.2.s1751082188$o1$g1$t1751082195$j53$l0$h0; _ga_WC52SKTYRF=GS2.2.s1751082202$o1$g0$t1751082202$j60$l0$h0; _ga_27G3ESYQ6C=GS2.2.s1751081694$o26$g1$t1751082319$j60$l0$h0; _ga_8QRTLL2FG6=GS2.2.s1751640018$o1$g0$t1751640018$j60$l0$h0; _ga_ZQMM0SFYTB=GS2.1.s1751986716$o23$g0$t1751986837$j60$l0$h0; active_rallypoint_sub_filters_2=4; __cmpconsentx17155=CQUbJ6gQUbJ6gAfSDBENBzFsAP_gAELAAAYgLXNT_G__bXlv-b736ftkeYxf9_hr7sQxBgbJs24FzLvW_JwW32E7NEzatqYKmRIAu3TBIQNtHJjURVChKogVrzDsaEyUoTtKJ-BkiHMRY2JYCFxvm4tjeQCZ5vr_91d9mT-t7dr-3dzyy5hnv3a9_-S1WJidKYetHfv8bBKT-_IU9_x-_4v4_N7pE2-eS1v_tGvt639-4vv_dp_99_77ffz____73_e_X__f_______3f_______8FrQATDQqIIyyIEQiUDCCBAAoKwgAoEAQAAJA0QEAJgwKcgYALrCZACAFAAMEAIAAQYAAgAAEgAQiACgAgEAAEAgUAAYAEAQEADAwABgAsBAIAAQHQMUwIIBAsAEjMig0gJQAEggJbKhBIAgQVwhCLPAIIERMFAAACAAUBAAA8FgISSAlYkEAXEE0AABAAAFECBAikbMAQUBmi0F4Mn0ZGmAYPmCZJTAMgCIIyMk2ITfhMPHIUQoIcAQJABAXmOgAgLzJQAQF5lIAIC8wA; __cmpcccx17155=aCQUbtJXgAqWGH3PmzD3nPt3jTGMHvVqYLLDDg8IxlqazBkNaZYMaYDM0sGIajVgsstIaTAyYLyvLCyGEaQaFmYYZYGFoGswrE1jEyassaxLKyNDGYMXj0GVoNDCYjQysZYYHHowamazNWatA155DGJrtmGWmVjWGGLATKjFIysAGQxLVly81axOJ5o0s0DBrBqwZkyZGg9ehmWGYMXJ5gxYw7wMBjr1hpljTR7ymVGpqazBWsAhSkLITSQZVViKFBqlIwRAaClQwA; _ga=GA1.2.1065157476.1742652837; _ga_45619DR32F=GS2.2.s1752457249$o37$g0$t1752457249$j60$l0$h0; active_rallypoint_sub_filters_1=1; JWT=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI3c1hQdVFCRFFueTdYWm9TcGhxd0NCMUNGUXdwMTZkNSIsImF1ZCI6ImFhM2I5MDAwLTRhOTgtMTFmMC02NzFjLTAxMDAwMDAwMGRjNyIsImV4cCI6MTc1MjgwNDAwOSwicHJvcGVydGllcyI6eyJwdyI6IjF5UGc1YXE5YTJYM2MwZllWU01ZOFVCWUFCV241b2VEIiwiaGFzaCI6IjdjZDA3Y2QwN2NkMDdjZDBGNDNPMVVjWWsxVHJ4NlBlIiwibW9iaWxlT3B0aW1pemF0aW9ucyI6ZmFsc2UsImxvZ2luSWQiOjEwMTA5NDMsImRpZCI6Mzk2MzgsImxhbmd1YWdlIjoiZW4tVVMiLCJ2aWxsYWdlUGVyc3BlY3RpdmUiOiJwZXJzcGVjdGl2ZVJlc291cmNlcyJ9fQ.eTlQQ3ANt8jbaSgwJy-2cZbkij7VIaG0Vb7oLw54_nGVDRFFt8Ocp5j9SkIfItBPeHUdC92PrcPBGYFBNrYz5tjfM-tixQFIecSVAGCMUpBVv7KbAynkaMojJtSnfkFvkxf7-oP_zXEO72YVeXDlwKvfxczO9q_rFd9XoG8S_ZjD-XuqfewgpzpaK2Ez5-mNPjy4jHcEv3kZyvPs1YRCXWz4toS1NirB_y3ehSI18b0Jai2fr8bDwanEGC2T5w5DmIoOIG6T0dBEuKnVtOwd9BfIJyGCi_U7N9lEIcDe3oe4n6oFuM-tbFyD-ZDJZ1GlqE_u6Sp1jVfeMqXVpt-gkQ' \
  -H 'origin: https://ttq.x2.america.travian.com' \
  -H 'priority: u=1, i' \
  -H 'referer: https://ttq.x2.america.travian.com/build.php?newdid=39638&gid=16&tt=99' \
  -H 'sec-ch-ua: "Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36' \
  -H 'x-requested-with: XMLHttpRequest' \
  -H 'x-version: 171.8' \
  --data-raw '{"slots":[{"listId":4338,"x":'$x',"y":'$y',"units":{"t1":0,"t2":0,"t3":0,"t4":2,"t5":0,"t6":2,"t7":0,"t8":0,"t9":0,"t10":0},"active":true}]}'
done <<EOF
-187|115
-183|115
-186|113
-184|119
-184|120
-188|112
-188|120
-189|112
-186|110
-192|116
-178|116
-179|120
-192|119
-191|121
-185|124
-178|120
-189|108
-179|109
-182|125
EOF