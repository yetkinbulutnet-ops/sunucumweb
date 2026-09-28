#!/bin/sh
for d in 'sunucumweb-canli-*.tgz' 'swbcms-db-*.sql.gz' 'cms-kaynak-*.tgz' 'storage-yedek-*.tgz' 'status-backup-*.tgz' 'cms-env-yedek-*' 'yedek-*'; do
  ls -1dt /root/$d 2>/dev/null | tail -n +4 | while read f; do
    [ -n "$(find "$f" -maxdepth 0 -mtime +14)" ] && rm -rf "$f"
  done
done
