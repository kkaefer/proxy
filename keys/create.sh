#!/bin/sh
echo "NOTE: Specify * as Common Name"
openssl genrsa -out keys/private.key 4096
openssl req -new -x509 -nodes -sha1 -days 3650 -key keys/private.key > keys/public.cer
