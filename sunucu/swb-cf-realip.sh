#!/bin/sh
H=/etc/nginx/swb-cf-realip.conf
T=$(mktemp)
{ grep -oE '^allow [0-9a-fA-F:./]+' /etc/nginx/cloudflare/ips | awk '{print "set_real_ip_from "$2";"}'; echo "real_ip_header CF-Connecting-IP;"; } > "$T"
[ "$(grep -c set_real_ip_from "$T")" -ge 10 ] || { rm -f "$T"; exit 1; }
if cmp -s "$T" "$H"; then rm -f "$T"; exit 0; fi
[ -f "$H" ] && cp "$H" "$H.bak"
mv "$T" "$H"; chmod 644 "$H"
if nginx -t >/dev/null 2>&1; then systemctl reload nginx; else [ -f "$H.bak" ] && mv "$H.bak" "$H"; exit 1; fi
