#!/bin/bash
set -e
A=/home/sunucumweb/htdocs/sunucumweb.com
K=${1:-/root/onyuz.tgz}
[ -f "$K" ] || { echo "arsiv yok: $K"; exit 1; }
T=$(date +%Y%m%d-%H%M%S)
tar czf /root/sunucumweb-canli-$T.tgz -C $A --exclude=node_modules .
echo "canli yedek /root/sunucumweb-canli-$T.tgz"
tar xzf "$K" -C $A --no-same-owner
chown -R sunucumweb:sunucumweb $A
ORTAM="PATH=/usr/bin:/bin HOME=/home/sunucumweb NEXT_TELEMETRY_DISABLED=1"
sudo -u sunucumweb env -i $ORTAM bash -c "cd $A && npm install --no-audit --no-fund" > /root/swb_build.log 2>&1 || { tail -20 /root/swb_build.log; exit 1; }
sudo -u sunucumweb env -i $ORTAM CMS_URL=https://cms.sunucumweb.com SITE_INDEXABLE=1 SITE_URL=https://sunucumweb.com CSP_KIP="${CSP_KIP:-zorla}" bash -c "IFS= read -r CMS_TOKEN; export CMS_TOKEN; cd $A && npm run build" < /root/.swb_cms_token >> /root/swb_build.log 2>&1 || { tail -30 /root/swb_build.log; exit 1; }
cd $A
rm -rf app components lib middleware.js postcss.config.mjs tailwind.config.js jsconfig.json scripts Dockerfile .dockerignore .github
find content -mindepth 1 ! -name manifest.json -exec rm -rf {} +
chown -R sunucumweb:sunucumweb $A
rm -f "$K"
systemctl restart sunucumweb
for i in $(seq 1 30); do curl -s -o /dev/null http://127.0.0.1:3800/api/health && break; sleep 1; done
REVALIDATE_SECRET=$(. /etc/sunucumweb/sunucumweb.env; printf '%s' "$REVALIDATE_SECRET")
printf 'x-revalidate-secret: %s\n' "$REVALIDATE_SECRET" | curl -s -X POST -H @- http://127.0.0.1:3800/api/revalidate
echo
