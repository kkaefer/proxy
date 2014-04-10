#!/bin/sh
echo "NOTE: Specify * as Common Name"
openssl genrsa -out private.key 4096
openssl req -new -x509 -nodes -sha1 -days 3650 -key private.key > public.cer
