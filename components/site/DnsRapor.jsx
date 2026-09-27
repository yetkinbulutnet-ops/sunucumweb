import { Kutu, Satir, Rozet, Bos, sureYaz } from './tool-ui';
import { m } from '@/lib/metin';

function YayilimKutusu({ yayilim, tip }) {
  const tonu = yayilim.tutarli ? 'iyi' : yayilim.uyusan >= yayilim.ulasan - 1 ? 'orta' : 'riskli';

  return (
    <Kutu
      baslik={`${m('dnsrapor.yayilim_kontrolu')}${tip ? ` · ${tip}` : ''}`}
      genis
      ek={
        <Rozet durum={tonu}>
          {yayilim.tutarli ? m('dnsrapor.sunucuda_ayni', { sayi: yayilim.ulasan }) : m('dnsrapor.sunucu_uyusuyor', { uyusan: yayilim.uyusan, ulasan: yayilim.ulasan })}
        </Rozet>
      }
    >
      <div className="grid gap-2.5 sm:grid-cols-2">
        {yayilim.sonuclar.map((s) => (
          <div key={s.id || s.cozumleyici} className="flex items-baseline justify-between gap-3 rounded-xl bg-surface2 px-3.5 py-2.5">
            <span className="min-w-0">
              <span className="block text-[13px] font-semibold text-strong">{s.cozumleyici}</span>
              {s.bolge && <span className="block text-[11px] text-muted">{s.bolge}</span>}
            </span>
            <span className="break-all text-right font-mono text-[12px] text-body">
              {s.ulasildi ? s.degerler.join(', ') || m('dnsrapor.kayit_yok_kucuk') : m('dnsrapor.ulasilamadi')}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[12px] leading-relaxed text-muted">
        {m('dnsrapor.yayilim_notu')}
      </p>
    </Kutu>
  );
}

function KayitListesi({ kayitlar }) {
  return (
    <ul className="space-y-2.5">
      {kayitlar.map((kayit, i) => (
        <li key={`${kayit.deger}-${i}`} className="flex items-baseline justify-between gap-4">
          <span className="min-w-0">
            <code className="block break-all text-[13px] font-semibold text-strong">{kayit.deger}</code>
            {kayit.sinif && <span className="mt-0.5 block text-[11px] text-brandtext">{kayit.sinif}</span>}
          </span>
          <span className="shrink-0 text-[12px] tabular-nums text-muted">{sureYaz(kayit.ttl)}</span>
        </li>
      ))}
    </ul>
  );
}

function TumRapor({ veri }) {
  const dolu = veri.kayitlar.filter((k) => k.bulundu);
  const bos = veri.kayitlar.filter((k) => !k.bulundu).map((k) => k.tip);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <YayilimKutusu yayilim={veri.yayilim} tip="A" />

      {dolu.map((k) => (
        <Kutu key={k.tip} baslik={m('dnsrapor.tip_kaydi', { tip: k.tip })} ek={<span className="text-[12px] text-muted">{m('dnsrapor.kayit_sayi', { sayi: k.kayitlar.length })}</span>}>
          <KayitListesi kayitlar={k.kayitlar} />
        </Kutu>
      ))}

      {veri.soa && (
        <Kutu baslik={m('dnsrapor.soa_ayrintisi')}>
          <Satir etiket={m('dnsrapor.birincil_sunucu')} deger={veri.soa.birincilSunucu} kod />
          <Satir etiket={m('dnsrapor.yetkili_eposta')} deger={veri.soa.yetkiliEposta} kod />
          <Satir etiket={m('dnsrapor.seri_numarasi')} deger={veri.soa.seri} kod />
          <Satir etiket={m('dnsrapor.yenileme')} deger={sureYaz(veri.soa.yenileme)} />
          <Satir etiket={m('dnsrapor.sona_erme')} deger={sureYaz(veri.soa.sonaErme)} />
        </Kutu>
      )}

      {veri.mx?.length > 0 && (
        <Kutu baslik={m('dnsrapor.posta_sunuculari')}>
          <MxListesi mx={veri.mx} />
        </Kutu>
      )}

      {veri.ns?.length > 0 && (
        <Kutu baslik={m('arac.isim_sunuculari')} ek={<Rozet durum={veri.dnssec.imzali ? 'iyi' : 'notr'}>{veri.dnssec.imzali ? m('dnsrapor.dnssec_imzali') : m('dnsrapor.dnssec_yok')}</Rozet>}>
          <NsListesi ns={veri.ns} />
        </Kutu>
      )}

      {bos.length > 0 && (
        <div className="sm:col-span-2">
          <p className="text-[13px] text-muted">{m('dnsrapor.bos_tipler', { tipler: bos.join(', ') })}</p>
        </div>
      )}
    </div>
  );
}

function MxListesi({ mx }) {
  return (
    <ul className="space-y-3">
      {mx.map((k) => (
        <li key={k.sunucu}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="break-all text-[14px] font-semibold text-strong">{k.sunucu}</span>
            <span className="shrink-0 text-[12px] text-muted">{m('arac.oncelik', { sayi: k.oncelik })}</span>
          </div>
          {k.adresler.length > 0 && <div className="mt-0.5 break-all font-mono text-[12px] text-muted">{k.adresler.join(' · ')}</div>}
        </li>
      ))}
    </ul>
  );
}

function NsListesi({ ns }) {
  return (
    <ul className="space-y-3">
      {ns.map((n) => (
        <li key={n.sunucu}>
          <div className="break-all text-[14px] font-semibold text-strong">{n.sunucu}</div>
          {n.adresler.length > 0 && <div className="mt-0.5 break-all font-mono text-[12px] text-muted">{n.adresler.join(' · ')}</div>}
        </li>
      ))}
    </ul>
  );
}

function TekTipRapor({ veri }) {
  const { tip } = veri;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Kutu
        baslik={m('dnsrapor.tip_kaydi', { tip })}
        genis
        ek={
          <Rozet durum={veri.bulundu ? 'iyi' : veri.nxdomain ? 'yok' : 'orta'}>
            {veri.nxdomain ? m('dnsrapor.alan_bulunamadi') : veri.bulundu ? m('dnsrapor.kayit_bulundu', { sayi: veri.kayitlar.length }) : m('dnsrapor.kayit_yok')}
          </Rozet>
        }
      >
        {veri.bulundu ? (
          <KayitListesi kayitlar={veri.kayitlar} />
        ) : veri.nxdomain ? (
          <Bos>{m('dnsrapor.nxdomain')}</Bos>
        ) : (
          <Bos>{m('dnsrapor.tip_yok', { tip })}</Bos>
        )}

        {veri.takma?.length > 0 && (
          <div className="mt-4 rounded-xl bg-surface2 px-4 py-3">
            <div className="text-[12px] text-muted">{m('dnsrapor.takma_ad')}</div>
            {veri.takma.map((t, i) => (
              <code key={`${t.deger}-${i}`} className="mt-1 block break-all text-[13px] font-semibold text-strong">
                CNAME → {t.deger}
              </code>
            ))}
          </div>
        )}
      </Kutu>

      {tip === 'MX' && veri.mx?.length > 0 && (
        <Kutu baslik={m('dnsrapor.posta_adresleri')} genis>
          <MxListesi mx={veri.mx} />
        </Kutu>
      )}

      {tip === 'NS' && veri.ns?.length > 0 && (
        <Kutu baslik={m('dnsrapor.isim_adresleri')} genis>
          <NsListesi ns={veri.ns} />
        </Kutu>
      )}

      {tip === 'SOA' && veri.soa && (
        <Kutu baslik={m('dnsrapor.soa_ayrintisi')} genis>
          <div className="grid gap-x-8 sm:grid-cols-2">
            <div>
              <Satir etiket={m('dnsrapor.birincil_sunucu')} deger={veri.soa.birincilSunucu} kod />
              <Satir etiket={m('dnsrapor.yetkili_eposta')} deger={veri.soa.yetkiliEposta} kod />
              <Satir etiket={m('dnsrapor.seri_numarasi')} deger={veri.soa.seri} kod />
            </div>
            <div>
              <Satir etiket={m('dnsrapor.yenileme')} deger={sureYaz(veri.soa.yenileme)} />
              <Satir etiket={m('dnsrapor.tekrar_deneme')} deger={sureYaz(veri.soa.tekrar)} />
              <Satir etiket={m('dnsrapor.sona_erme')} deger={sureYaz(veri.soa.sonaErme)} />
              <Satir etiket={m('dnsrapor.en_az_ttl')} deger={sureYaz(veri.soa.enAzTtl)} />
            </div>
          </div>
        </Kutu>
      )}

      {tip === 'SRV' && veri.srv?.length > 0 && (
        <Kutu baslik={m('dnsrapor.servis_tanimlari')} genis>
          <ul className="space-y-3">
            {veri.srv.map((s, i) => (
              <li key={`${s.hedef}-${i}`} className="flex flex-wrap items-baseline justify-between gap-3">
                <span className="break-all text-[14px] font-semibold text-strong">
                  {s.hedef}<span className="text-muted">:{s.port}</span>
                </span>
                <span className="shrink-0 text-[12px] text-muted">{m('dnsrapor.srv_oncelik', { oncelik: s.oncelik, agirlik: s.agirlik })}</span>
              </li>
            ))}
          </ul>
        </Kutu>
      )}

      {tip === 'CAA' && veri.caa?.length > 0 && (
        <Kutu baslik={m('dnsrapor.sertifika_yetkileri')} genis>
          <ul className="space-y-3">
            {veri.caa.map((c, i) => (
              <li key={`${c.deger}-${i}`} className="flex flex-wrap items-baseline justify-between gap-3">
                <span className="break-all text-[14px] font-semibold text-strong">{c.deger || '—'}</span>
                <span className="shrink-0 text-[12px] text-muted">
                  {c.etiket === 'issue' && m('dnsrapor.caa_issue')}
                  {c.etiket === 'issuewild' && m('dnsrapor.caa_issuewild')}
                  {c.etiket === 'iodef' && m('dnsrapor.caa_iodef')}
                  {!['issue', 'issuewild', 'iodef'].includes(c.etiket) && c.etiket}
                </span>
              </li>
            ))}
          </ul>
        </Kutu>
      )}

      <YayilimKutusu yayilim={veri.yayilim} tip={tip} />
    </div>
  );
}

export default function DnsRapor({ veri }) {
  return veri.tumu ? <TumRapor veri={veri} /> : <TekTipRapor veri={veri} />;
}
