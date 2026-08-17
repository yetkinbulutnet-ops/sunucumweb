import { Kutu, Satir, Rozet, Bos, sureYaz } from './tool-ui';

function YayilimKutusu({ yayilim, tip }) {
  const tonu = yayilim.tutarli ? 'iyi' : yayilim.uyusan >= yayilim.ulasan - 1 ? 'orta' : 'riskli';

  return (
    <Kutu
      baslik={`Yayılım kontrolü${tip ? ` · ${tip}` : ''}`}
      genis
      ek={
        <Rozet durum={tonu}>
          {yayilim.tutarli ? `${yayilim.ulasan} sunucuda aynı` : `${yayilim.uyusan} / ${yayilim.ulasan} sunucu uyuşuyor`}
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
              {s.ulasildi ? s.degerler.join(', ') || 'kayıt yok' : 'ulaşılamadı'}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[12px] leading-relaxed text-muted">
        Sorgu, farklı sağlayıcıların genel çözümleyicilerine aynı anda gönderilir. Değerler farklıysa değişiklik henüz her
        yere ulaşmamış demektir; kaydın TTL süresi dolduğunda tümü eşitlenir.
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
        <Kutu key={k.tip} baslik={`${k.tip} kaydı`} ek={<span className="text-[12px] text-muted">{k.kayitlar.length} kayıt</span>}>
          <KayitListesi kayitlar={k.kayitlar} />
        </Kutu>
      ))}

      {veri.soa && (
        <Kutu baslik="SOA ayrıntısı">
          <Satir etiket="Birincil sunucu" deger={veri.soa.birincilSunucu} kod />
          <Satir etiket="Yetkili e-posta" deger={veri.soa.yetkiliEposta} kod />
          <Satir etiket="Seri numarası" deger={veri.soa.seri} kod />
          <Satir etiket="Yenileme" deger={sureYaz(veri.soa.yenileme)} />
          <Satir etiket="Sona erme" deger={sureYaz(veri.soa.sonaErme)} />
        </Kutu>
      )}

      {veri.mx?.length > 0 && (
        <Kutu baslik="Posta sunucuları">
          <MxListesi mx={veri.mx} />
        </Kutu>
      )}

      {veri.ns?.length > 0 && (
        <Kutu baslik="İsim sunucuları" ek={<Rozet durum={veri.dnssec.imzali ? 'iyi' : 'notr'}>{veri.dnssec.imzali ? 'DNSSEC imzalı' : 'DNSSEC yok'}</Rozet>}>
          <NsListesi ns={veri.ns} />
        </Kutu>
      )}

      {bos.length > 0 && (
        <div className="sm:col-span-2">
          <p className="text-[13px] text-muted">Kayıt bulunmayan tipler: {bos.join(', ')}</p>
        </div>
      )}
    </div>
  );
}

function MxListesi({ mx }) {
  return (
    <ul className="space-y-3">
      {mx.map((m) => (
        <li key={m.sunucu}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="break-all text-[14px] font-semibold text-strong">{m.sunucu}</span>
            <span className="shrink-0 text-[12px] text-muted">öncelik {m.oncelik}</span>
          </div>
          {m.adresler.length > 0 && <div className="mt-0.5 break-all font-mono text-[12px] text-muted">{m.adresler.join(' · ')}</div>}
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
        baslik={`${tip} kaydı`}
        genis
        ek={
          <Rozet durum={veri.bulundu ? 'iyi' : veri.nxdomain ? 'yok' : 'orta'}>
            {veri.nxdomain ? 'Alan adı bulunamadı' : veri.bulundu ? `${veri.kayitlar.length} kayıt bulundu` : 'Kayıt yok'}
          </Rozet>
        }
      >
        {veri.bulundu ? (
          <KayitListesi kayitlar={veri.kayitlar} />
        ) : veri.nxdomain ? (
          <Bos>Bu alan adı DNS üzerinde tanımlı değil. Yazımını kontrol edin ya da alan adının tescilli olduğundan emin olun.</Bos>
        ) : (
          <Bos>Bu alan adında {tip} tipinde kayıt tanımlı değil. Diğer tipleri aşağıdaki bağlantılardan sorgulayabilirsiniz.</Bos>
        )}

        {veri.takma?.length > 0 && (
          <div className="mt-4 rounded-xl bg-surface2 px-4 py-3">
            <div className="text-[12px] text-muted">Sorgu bir takma ad üzerinden çözümlendi</div>
            {veri.takma.map((t, i) => (
              <code key={`${t.deger}-${i}`} className="mt-1 block break-all text-[13px] font-semibold text-strong">
                CNAME → {t.deger}
              </code>
            ))}
          </div>
        )}
      </Kutu>

      {tip === 'MX' && veri.mx?.length > 0 && (
        <Kutu baslik="Posta sunucuları ve adresleri" genis>
          <MxListesi mx={veri.mx} />
        </Kutu>
      )}

      {tip === 'NS' && veri.ns?.length > 0 && (
        <Kutu baslik="İsim sunucuları ve adresleri" genis>
          <NsListesi ns={veri.ns} />
        </Kutu>
      )}

      {tip === 'SOA' && veri.soa && (
        <Kutu baslik="SOA ayrıntısı" genis>
          <div className="grid gap-x-8 sm:grid-cols-2">
            <div>
              <Satir etiket="Birincil sunucu" deger={veri.soa.birincilSunucu} kod />
              <Satir etiket="Yetkili e-posta" deger={veri.soa.yetkiliEposta} kod />
              <Satir etiket="Seri numarası" deger={veri.soa.seri} kod />
            </div>
            <div>
              <Satir etiket="Yenileme" deger={sureYaz(veri.soa.yenileme)} />
              <Satir etiket="Tekrar deneme" deger={sureYaz(veri.soa.tekrar)} />
              <Satir etiket="Sona erme" deger={sureYaz(veri.soa.sonaErme)} />
              <Satir etiket="En az TTL" deger={sureYaz(veri.soa.enAzTtl)} />
            </div>
          </div>
        </Kutu>
      )}

      {tip === 'SRV' && veri.srv?.length > 0 && (
        <Kutu baslik="Servis tanımları" genis>
          <ul className="space-y-3">
            {veri.srv.map((s, i) => (
              <li key={`${s.hedef}-${i}`} className="flex flex-wrap items-baseline justify-between gap-3">
                <span className="break-all text-[14px] font-semibold text-strong">
                  {s.hedef}<span className="text-muted">:{s.port}</span>
                </span>
                <span className="shrink-0 text-[12px] text-muted">öncelik {s.oncelik} · ağırlık {s.agirlik}</span>
              </li>
            ))}
          </ul>
        </Kutu>
      )}

      {tip === 'CAA' && veri.caa?.length > 0 && (
        <Kutu baslik="Sertifika yetkileri" genis>
          <ul className="space-y-3">
            {veri.caa.map((c, i) => (
              <li key={`${c.deger}-${i}`} className="flex flex-wrap items-baseline justify-between gap-3">
                <span className="break-all text-[14px] font-semibold text-strong">{c.deger || '—'}</span>
                <span className="shrink-0 text-[12px] text-muted">
                  {c.etiket === 'issue' && 'sertifika verebilir'}
                  {c.etiket === 'issuewild' && 'joker sertifika verebilir'}
                  {c.etiket === 'iodef' && 'ihlal bildirim adresi'}
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
