#!/bin/bash

while IFS='|' read -r x y; do
curl 'https://ttq.x2.america.travian.com/api/v1/farm-list/slot' \
  -H 'accept: application/json, text/javascript, */*; q=0.01' \
  -H 'accept-language: en,en-US;q=0.9,vi;q=0.8,vi-VN;q=0.7' \
  -H 'content-type: application/json; charset=UTF-8' \
  -b '_fw_crm_v=b772ba38-18f5-458f-deb5-3c49377a01d3; _ga_4NQKT5Y92J=GS2.2.s1750380265$o1$g1$t1750380265$j60$l0$h0; _ga_VLL1WGW5X2=GS2.2.s1751082188$o1$g1$t1751082195$j53$l0$h0; _ga_WC52SKTYRF=GS2.2.s1751082202$o1$g0$t1751082202$j60$l0$h0; _ga_27G3ESYQ6C=GS2.2.s1751081694$o26$g1$t1751082319$j60$l0$h0; _ga_8QRTLL2FG6=GS2.2.s1751640018$o1$g0$t1751640018$j60$l0$h0; _ga_ZQMM0SFYTB=GS2.1.s1751986716$o23$g0$t1751986837$j60$l0$h0; _ga=GA1.2.1065157476.1742652837; __cmpconsentx17155=CQVP46gQVP46gAfSDDENB1FsAP_gAELAAAYgLaNR_G__bXlv-b736ftkeYxf9_hr7sQxBgbJs24FzLvW_JwW32E7NEzatqYKmRIAu3TBIQNtHJjURVChKIgVrzDsaEyUoTtKJ-BkiHMRY2JYCFxvm4tjeQCZ5vr_91d9mT-N7dr-3dzyy5hnv3a9_-S1WJidKYetHfv8bBKT-_IU9_x-_4v4_N7pE2-eS1v_tGvt639-4vv_dp_99_76ffz____73_e_X__f_______3f________8FsAATDQqIIyyIEQiUDCCBAAoKwgAoEAQAAJA0QEAJgwKcgYALrCZACAFAAMEAIAAQYAAgAAEgAQiACgAgEAAEAgUAAYAEAQEADAwABgAsBAIAAQHQMUwIIBAsAEjMig0gJQAEggJbKhBIAgQVwhCLPAIIERMFAAACAAUBAAA8FgISSAlYkEAXEE0AABAAAFECBAikbMAQUBmi0F4Mn0ZGmAYPmCZJTIMgCYIyMk2ITfhMPHIUQoIcgCBIAIC8x0AEBeZKACAvMpABAXmA; __cmpcccx17155=aCQVS31hgAqWGP3PmzD3nPt3jTGMHvVqYLLDDg8IxlqazBkNaZYMaYDM0sGIajVgsstIaTAyYLyvLCyGEaQaFmYYZYGmrQNZhWJrGJk1ZY1iWVkaGMwYvHoMrQYaMJiNDKxlhgcejBqZmZmrNWga88hjE12zDLTKxrDDFgJlRikZWADIYlqy5eatYnE80aWaBg1g1YMyZMjQevQzLDMGLk8wYsYd4GAx16wzWWNNHvKZUamprMFawCFKQshNJBlVWIoUGqUjBEBoKVDA; _pubcid=156674e6-a252-4080-a8b8-d3a0ab9124a5; _pubcid_cst=zix7LPQsHA%3D%3D; _cc_id=364d2e73951921583c91e8d564955211; cto_bundle=q-QCz19UWVdUbjY3aHNlJTJCeHAzMCUyRlhOUXJ1cndZSGFSZyUyQmVDTHFhMXZ6JTJGektseVkwNWhoWWlCRDF6TGxob2MySGUlMkZGak81S3F4V1lZRWN4Z1RpMWVtaHZTcGc0WnolMkZGUWxMak11MTdReWZMRkNmNzZHUEsyczEzSUFLQmZCRVRmTkxtTGZ5ZkpoSEg3dzVhNVNrcEdnNzVBeVVkOE5Xeld4UkZ2VWdoUFRqZmFSbVhZSE9nYlkxZ3VqbWg1bUhPTlBNRmw; cto_bidid=x13ZgV9LJTJGdHNPWUpLN2trcENuUjI4dlh3U0c1RU4xYll6V3pMd2FBUDFIeTNYeHZpZjZOZ0Z6T2ptVndJSTY5U3dVVzJ1ZGVZOFowOXlRZDVFY1NGMEElMkJjSGZoTHZBJTJGVklPelZrY0glMkJiOWlCSXhRbzF2THBqS0VDWTFIOTdDeEF4OGZaMmcwNWx3eE05eHR3RzhMVTlmTlZwUSUzRCUzRA; __gads=ID=725140de1c72d94b:T=1753745353:RT=1753889906:S=ALNI_MakMKyYZa0mAcSkxHXR8WKkMCARhQ; __gpi=UID=00000f1aee35300a:T=1753745353:RT=1753889906:S=ALNI_MYefoePanU2kBnDt6JPqc2ejas7Lg; __eoi=ID=043637565764428e:T=1753745353:RT=1753889906:S=AA-AfjZt1OIS7nL36BguBmi86myT; _ga_45619DR32F=GS2.2.s1753895213$o41$g0$t1753895213$j60$l0$h0; active_rallypoint_sub_filters_1=2%2C3; active_rallypoint_sub_filters_2=4; JWT=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJlWGhJdU5NWjMzYTB1VGFhUGR4anFraWowb0pDU2p0byIsImF1ZCI6ImFhM2I5MDAwLTRhOTgtMTFmMC02NzFjLTAxMDAwMDAwMGRjNyIsImV4cCI6MTc1NDU4NTU2MywicHJvcGVydGllcyI6eyJoYXNoIjoiN2NkMGNjMTA3Y2QwN2NkMEY0M08xVWNZazFUcng2UGUiLCJtb2JpbGVPcHRpbWl6YXRpb25zIjpmYWxzZSwibG9naW5JZCI6MTQ1ODA0OCwibGFuZ3VhZ2UiOiJlbi1VUyIsInZpbGxhZ2VQZXJzcGVjdGl2ZSI6InBlcnNwZWN0aXZlUmVzb3VyY2VzIiwicHciOiJOdDZrZUxRbjBkOEpSZ21pRDJzZkNiMWFOMmxGaVlHMyIsImRpZCI6Mjk1NjF9fQ.XSx1EWhWcv234YR5vENd2KzPD2nJJLNP8Upmj66Lynjn-S4_yruCdU_lEId7G9lPaU_8GP_UjWVPwJa9x11oU2m9bQ0KbNRnbNEAVe3xBlJTRh4XmbKxvF71tH_X5Su-nw0Mm6hxQyymkWgPFWQFFuA1ilCbAilQcxEFAn5-5rpaXfolzFk9o1NUpnD1KUixRCY5OaDbOoxTqVM0BnASBhfORpY62rcAwnBf812fpbax4EdZbrQ1RXhJsnRNUXmrutMF1Phk1kmA673uK4T6za9L86jKReBFIt5EdNJXASXLPEmoCZlgfjrPw4Dwp7XMcM_tbBOOgxc6qG3dE2VqsA' \
  -H 'origin: https://ttq.x2.america.travian.com' \
  -H 'priority: u=1, i' \
  -H 'referer: https://ttq.x2.america.travian.com/build.php?gid=16&tt=99' \
  -H 'sec-ch-ua: "Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36' \
  -H 'x-requested-with: XMLHttpRequest' \
  -H 'x-version: 200.14' \
  --data-raw '{"slots":[{"listId":6267,"x":'$x',"y":'$y',"units":{"t1":0,"t2":0,"t3":0,"t4":2,"t5":1,"t6":1,"t7":0,"t8":0,"t9":0,"t10":0},"active":true}]}'
  echo "Added farm at coordinates $x,$y"
  sleep 0.7
done <<EOF
63|6
65|25
103|9
99|26
64|1
103|18
64|25
99|-1
100|26
74|34
60|7
104|7
93|33
105|11
104|6
75|35
92|-8
92|34
103|23
EOF