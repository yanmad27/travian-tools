#!/bin/bash

# Function to run the curl command
run_curl() {
    local id=$1
    echo "Starting curl request $id..."
    
    curl_chrome116 'https://ttq.x2.america.travian.com/build.php?gid=16&tt=2' \
      --http2 \
      --tls-max 1.3 \
      --ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256' \
      -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
      -H 'accept-language: en,en-US;q=0.9,vi;q=0.8,vi-VN;q=0.7' \
      -H 'cache-control: max-age=0' \
      -H 'content-type: application/x-www-form-urlencoded' \
      -b '_fw_crm_v=b772ba38-18f5-458f-deb5-3c49377a01d3; _ga_4NQKT5Y92J=GS2.2.s1750380265$o1$g1$t1750380265$j60$l0$h0; __cmpconsentx17155=CQTtAygQTtAygAfSDBENBxFsAP_gAELAAAYgLSNT_G__bXlv-T736ftkeYxf9_hr7sQxBgbJs24FzLvW_JwS32E7NEzatqYKmRIAu3TBIQNtHJjURVChaogVrzDsaEyUoTtKJ-BkiDMRY2JYCFxvm4tjeQCZ5vr_91d9mT-t7dr-3dzyy5hnv3a9_-S1WJidKYetHfv8bBKT-_Ic9_x-_4v4_N7pE2-eS1v_tGvt639-4vv_dp_99_77ffz____72_e_X__f_______________BasAEw0KiCMsiAEIlAwggQAKCsIAKBAEAACQNEBACYMCnIGAC6wkQAgBQADBACAAEGAAIAABIAEIgAoAKBAABAIFAAGABAEBAAwMAAYALAQCAAEB0DFMCCAQLABIzIoNICUABIICWyoQSAIEFcIQizwCCBETBQAAAgAFAQAAPBYDEkgJWJBAFxBNAAAQAABRAgQIpGzAEFAZotBeDJ9GRpgGD5gmaUwDIAiCMjJNiE35TDxyFEKAEAQJABAXmOgAgLzJQAQF5lIAIC8w; _ga_VLL1WGW5X2=GS2.2.s1751082188$o1$g1$t1751082195$j53$l0$h0; _ga_WC52SKTYRF=GS2.2.s1751082202$o1$g0$t1751082202$j60$l0$h0; _ga_27G3ESYQ6C=GS2.2.s1751081694$o26$g1$t1751082319$j60$l0$h0; _ga_8QRTLL2FG6=GS2.2.s1751640018$o1$g0$t1751640018$j60$l0$h0; _ga_ZQMM0SFYTB=GS2.1.s1751709381$o22$g0$t1751709387$j54$l0$h0; active_rallypoint_sub_filters_2=5; _ga=GA1.2.1065157476.1742652837; __cmpcccx17155=aCQUJz5DgAqWF13PmzD3nPt3jTGMHvVqYLLDDg8IxlqazBkNaZYMaYDM0sGIajVgsstIaTAyYLyvLCyGEaQaFmYYZYGFoGswJrGJk1ZY1iWVkaGMwYtGQysgwmIwDJhgcejBqZrM1Zq0DXnkMYmu2YZaZWNYYYsBMqMUjKwAZDEtWXLzVrE4nmUzQMGsGrBmTJkaD16GZYZgxcnmDQw7wMBjr1hpljTR7ymVGAazAIUpCyE0kGVVYihQapSMEQGgpUMA; _ga_45619DR32F=GS2.2.s1751798334$o35$g1$t1751799828$j54$l0$h0; active_rallypoint_sub_filters_1=2%2C3; JWT=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhcndJZmpQaWF4eGxwQnczQVMxWjFxdEIyaUhCVEwzVCIsImF1ZCI6ImFhM2I5MDAwLTRhOTgtMTFmMC02NzFjLTAxMDAwMDAwMGRjNyIsImV4cCI6MTc1MTkxNTkwOSwicHJvcGVydGllcyI6eyJwdyI6ImtuczN1dk5xaTQ3VmhyRVVMS0RISjRZY25qQU40MEViIiwiaGFzaCI6IjdjZDA3Y2QwN2NkMDdjZDBGNDNPMVVjWWsxVHJ4NlBlIiwibW9iaWxlT3B0aW1pemF0aW9ucyI6ZmFsc2UsImxvZ2luSWQiOjczNzYwMiwiZGlkIjoyODc5MSwibGFuZ3VhZ2UiOiJlbi1VUyIsInZpbGxhZ2VQZXJzcGVjdGl2ZSI6InBlcnNwZWN0aXZlQnVpbGRpbmdzIn19.jgViaxB-QerqK7FULPP58bvq1x8VUi8YvB2nSBAMQjrTKNYfTJDlMI_FaOn2lTd6UL-7T9_MysSQeuLJsFBaGAV0eQjv_X7_z1qcWcfgQohlbnUX1O30ive-7xASD6cTNj9JFCp1-KsHbNvDvURbNIylZwzZolSqrS5l5Exin9zwzoRi-aDQ0M-UkED7AivZ-6uydZEBsQsECpFLbIo0n7jGnzXfuC36eNx2SCe4UpXNRfE555_fQ17oJokwhXbv-QGscyQ59MHfw0uvcPZ1OmVvyooBkx0wQMj0XdmMHoq6e1G0G8JIsOvag8KybaKP1jaRHq6c5fagJfmlqGl1WQ' \
      -H 'origin: https://ttq.x2.america.travian.com' \
      -H 'priority: u=0, i' \
      -H 'referer: https://ttq.x2.america.travian.com/build.php?gid=16&tt=2' \
      -H 'sec-ch-ua: "Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"' \
      -H 'sec-ch-ua-mobile: ?0' \
      -H 'sec-ch-ua-platform: "macOS"' \
      -H 'sec-fetch-dest: document' \
      -H 'sec-fetch-mode: navigate' \
      -H 'sec-fetch-site: same-origin' \
      -H 'sec-fetch-user: ?1' \
      -H 'upgrade-insecure-requests: 1' \
      -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36' \
      --data-raw 'action=troopsSend%2F28791%2F1751908755&eventType=4&villagename=&x=76&y=12&redeployHero=&checksum=8e805a&troops%5B0%5D%5Bt1%5D=0&troops%5B0%5D%5Bt2%5D=0&troops%5B0%5D%5Bt3%5D=1&troops%5B0%5D%5Bt4%5D=0&troops%5B0%5D%5Bt5%5D=0&troops%5B0%5D%5Bt6%5D=0&troops%5B0%5D%5Bt7%5D=0&troops%5B0%5D%5Bt8%5D=0&troops%5B0%5D%5Bt9%5D=0&troops%5B0%5D%5Bt10%5D=0&troops%5B0%5D%5Bt11%5D=0&troops%5B0%5D%5BscoutTarget%5D=&troops%5B0%5D%5BcatapultTarget1%5D=&troops%5B0%5D%5BcatapultTarget2%5D=&troops%5B0%5D%5BvillageId%5D=28791&troops%5B0%5D%5BscoutTarget%5D=1' \
      -s
    
    echo "Completed curl request $id"
}

# Run all 8 requests in parallel, but give first request a head start
echo "Starting first curl request with head start..."
run_curl 1 &

# Small delay to give first request a head start
sleep 0.1

echo "Starting remaining 7 parallel curl requests..."
for i in {2..8}; do
    run_curl $i &
done

# Wait for all background jobs to complete
wait

echo "All curl requests completed!" 