

# Setup

- `npm install`
- Run `keys/create.sh`
- Install `dnsmasq`
- Use `address=/#/192.168.0.115` in your `dnsmasq.conf` (replace the IP with yours)
- Install `keys/public.cer` on the client device
- Change DNS to your IP address on the client device
- `sudo node proxy.js`