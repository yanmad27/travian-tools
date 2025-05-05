#!/bin/bash

# Function to generate curl command
generate_curl() {
    local x=$1
    local y=$2
    curl 'https://ts3.x1.asia.travian.com/build.php?gid=16&tt=2' \
      -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
      -H 'accept-language: en,en-US;q=0.9,vi;q=0.8,vi-VN;q=0.7' \
      -H 'cache-control: max-age=0' \
      -H 'content-type: application/x-www-form-urlencoded' \
      -b '_ga_27G3ESYQ6C=GS1.2.1744899239.20.0.1744899239.0.0.0; _ga_ZQMM0SFYTB=GS1.1.1745674989.5.1.1745675224.0.0.0; _ga=GA1.2.1065157476.1742652837; active_rallypoint_sub_filters_1=1%2C1; active_rallypoint_sub_filters_2=4%2C4%2C4; _gid=GA1.2.1350606462.1746339197; _ga_45619DR32F=GS2.2.s1746339196$o13$g0$t1746339196$j0$l0$h0; __cmpconsentx17155=CQQ3vOgQQ3vOgAfSDBENBpFsAP_gAELAAAYgLJNX_G__bXlv-T736ftkeYxf99h77sQxBgbJs-4FzLvW_JwX32E7NEz6tqYKmRIAu3TBIQNtHJjURVChaogVrTDsaEyUoTtKJ-BkiHMRY2dYCFxvm4tjeQCZ5vr_91d5mT-t7dr-3dzyy5hnv3a9_-S1WJidKYetHfv8bBOT-_Ie9_x-_4v4_N7pE2-eS1t_tWvt739-4tv_9__99_77_f7_____3_-_X__f____________BY4Akw0KiCMsiAEIlAwggQAKCsICKBAEAACQNEBACYMCnIGAC6wkQAgBQADBACAAEGAAIAABIAEIgAoAKBAABAIFAAGABAMBAAwMAAYALAQCAAEB0DFMCCAQLABIzIoNMCUABIICWyoQSAIEFcIQizwCCBETBQAAAgAFAAAgPBYDEkgJWJBAFxBNAAAQAABBAgUIpOzAEFAZstReDJ9GVpgWD5gmaUwDIAiCMjJNiE37TDxyAAA; __cmpcccx17155=aCQQ5jdYgAqWFl3PmzD3nPt3jTGMHvVqYLLDDg8Ixlqa1WtMsGNMBmaWDI0Go1YLQ0hpMDJgvK8sLIYRpBoWZYZYGFoGmBNYxMmrLGsSysjQxmDFowsMrIMJiMppkwwOPRg1M1mas1aBrzyGMrtmGWmVjWGGLATKjFIysAGQxLVly81axOJ5lM0DVg1YMyZMjVkwNDNWYMXJ5g0MBgMdesMDGmhqMZVazAIUpCyE0kGVVYihQapSMEQGgpUM; JWT=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJlU1EyRko5WU1Bb0tvTFIwZDZDWUM2dGoyd2w0ZGxYSiIsImF1ZCI6IjhiMzhlODAwLWZmZTktMTFlZi02ODAzLTAxMDAwMDAwMGFkNCIsImV4cCI6MTc0NjM0NzkyNywicHJvcGVydGllcyI6eyJoYXNoIjoiNGRhMDRkYTA0ZGEwNGRhMEtVSmlPZlJOMmh2a0N4cTYiLCJtb2JpbGVPcHRpbWl6YXRpb25zIjpmYWxzZSwibGFuZ3VhZ2UiOiJlbi1VUyIsImxvZ2luSWQiOjM5MDQ3OCwidmlsbGFnZVBlcnNwZWN0aXZlIjoicGVyc3BlY3RpdmVCdWlsZGluZ3MiLCJwdyI6InIzVU15ZGRmRU9OZUs5UGdvNGNDQ3JGTDRQNGxqMlJyIiwiZGlkIjoyMzg0Mn19.jCkkUAPBlZtXq6b5SQGmtf-8Qd71_WsvvAKWcjZJFCHel1O-LmOGtMH_MmvXR3OlccLz6UzXfNK5w6C4PEtbLE9bxqwKokQ8nXycSpXTwwbPFvOlKNr1E-arUMohKw6MtpAlgWYc4aZqshfHLEUGfVQjdSplOlQDSbTeROmZ8eVgTB0NU2lM6KkndgJzDk5eM8gZQ9Obt35qi2MNSqoy4JasiR0szowGTRMvqWqaVt8xeSGjdvZnKVJZ0OArxck7kYhkix5aPENh7_V5nqZKYWS78qqnhB43l2gOvrB2EkMPx3UhE3lQJh4UTynGp9K8oX5BoW-RUqRU6jsc4hEwSw; _dd_s=logs=1&id=fc9e5d4e-4718-454e-9e18-1e162a2ddb9c&created=1746337968108&expire=1746341689456' \
      -H 'origin: https://ts3.x1.asia.travian.com' \
      -H 'priority: u=0, i' \
      -H 'referer: https://ts3.x1.asia.travian.com/build.php?gid=16&tt=2' \
      -H 'sec-ch-ua: "Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"' \
      -H 'sec-ch-ua-mobile: ?0' \
      -H 'sec-ch-ua-platform: "macOS"' \
      -H 'sec-fetch-dest: document' \
      -H 'sec-fetch-mode: navigate' \
      -H 'sec-fetch-site: same-origin' \
      -H 'sec-fetch-user: ?1' \
      -H 'upgrade-insecure-requests: 1' \
      -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36' \
      --data-raw "action=troopsSend%2F23842%2F1746340776&eventType=4&villagename=&x=$x&y=$y&redeployHero=&checksum=13efda&troops%5B0%5D%5Bt1%5D=0&troops%5B0%5D%5Bt2%5D=0&troops%5B0%5D%5Bt3%5D=1&troops%5B0%5D%5Bt4%5D=0&troops%5B0%5D%5Bt5%5D=0&troops%5B0%5D%5Bt6%5D=0&troops%5B0%5D%5Bt7%5D=0&troops%5B0%5D%5Bt8%5D=0&troops%5B0%5D%5Bt9%5D=0&troops%5B0%5D%5Bt10%5D=0&troops%5B0%5D%5Bt11%5D=0&troops%5B0%5D%5BscoutTarget%5D=&troops%5B0%5D%5BcatapultTarget1%5D=&troops%5B0%5D%5BcatapultTarget2%5D=&troops%5B0%5D%5BvillageId%5D=23842&troops%5B0%5D%5BscoutTarget%5D=1"
}

# Export the function so it's available to xargs
export -f generate_curl

# Create a list of coordinates to attack
# Format: x y
coordinates=(
    "-71 -26"
    "-71 -26"
)

# Run curl commands in parallel (4 at a time)
printf "%s\n" "${coordinates[@]}" | xargs -P 4 -n 2 bash -c 'generate_curl "$@"' _