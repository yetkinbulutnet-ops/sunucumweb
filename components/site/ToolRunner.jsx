'use client';
import { useCallback, useState } from 'react';
import { Icon } from './chrome';

const TON = {
  iyi: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/25',
  orta: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/25',
  eksik: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/25',
  riskli: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/25',
  yok: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/25',
  notr: 'bg-surface2 text-body ring-line',
};

const tarihYaz = (deger) => {
  if (!deger) return null;
  const t = new Date(deger);
  return Number.isNaN(t.getTime()) ? null : t.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
};

const sureYaz = (saniye) => {
  if (!Number.isFinite(saniye)) return '—';
  if (saniye >= 86400) return `${Math.round(saniye / 86400)} gün`;
  if (saniye >= 3600) return `${Math.round(saniye / 3600)} saat`;
  if (saniye >= 60) return `${Math.round(saniye / 60)} dakika`;
  return `${saniye} sn`;
};

function Kutu({ baslik, ek, children, genis }) {
  return (
    <div className={`rounded-2xl border border-line bg-surface p-5 sm:p-6 ${genis ? 'sm:col-span-2' : ''}`}>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-muted">{baslik}</h3>
        {ek}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Satir({ etiket, deger, kod }) {
  if (deger === null || deger === undefined || deger === '') return null;
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line/70 py-2.5 last:border-0">
      <span className="shrink-0 text-[13px] text-muted">{etiket}</span>
      <span className={`min-w-0 break-all text-right text-[14px] font-semibold text-strong ${kod ? 'font-mono text-[13px]' : ''}`}>{deger}</span>
    </div>
  );
}

function Rozet({ durum = 'notr', children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-bold ring-1 ${TON[durum]}`}>
      {children}
    </span>
  );
}

function Bos({ children }) {
  return <p className="text-[14px] text-body">{children}</p>;
}

function DnsSonuc({ veri }) {
  const dolu = veri.kayitlar.filter((k) => k.bulundu);
  const bos = veri.kayitlar.filter((k) => !k.bulundu).map((k) => k.tip);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Kutu
        baslik="Yayılım kontrolü"
        genis
        ek={<Rozet durum={veri.yayilim.tutarli ? 'iyi' : 'orta'}>{veri.yayilim.tutarli ? 'Tüm sunucularda aynı' : 'Sunucular arasında fark var'}</Rozet>}
      >
        <div className="grid gap-2.5 sm:grid-cols-2">
          {veri.yayilim.sonuclar.map((s) => (
            <div key={s.cozumleyici} className="flex items-baseline justify-between gap-3 rounded-xl bg-surface2 px-3.5 py-2.5">
              <span className="text-[13px] font-semibold text-strong">{s.cozumleyici}</span>
              <span className="break-all text-right font-mono text-[12px] text-body">
                {s.ulasildi ? s.degerler.join(', ') || 'kayıt yok' : 'ulaşılamadı'}
              </span>
            </div>
          ))}
        </div>
      </Kutu>

      {dolu.map((k) => (
        <Kutu key={k.tip} baslik={`${k.tip} kaydı`} ek={<span className="text-[12px] text-muted">{k.kayitlar.length} kayıt</span>}>
          <ul className="space-y-2.5">
            {k.kayitlar.map((kayit, i) => (
              <li key={`${kayit.deger}-${i}`} className="flex items-baseline justify-between gap-4">
                <code className="break-all text-[13px] font-semibold text-strong">{kayit.deger}</code>
                <span className="shrink-0 text-[12px] tabular-nums text-muted">{sureYaz(kayit.ttl)}</span>
              </li>
            ))}
          </ul>
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

      {veri.mx.length > 0 && (
        <Kutu baslik="Posta sunucuları">
          <ul className="space-y-3">
            {veri.mx.map((m) => (
              <li key={m.sunucu}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="break-all text-[14px] font-semibold text-strong">{m.sunucu}</span>
                  <span className="shrink-0 text-[12px] text-muted">öncelik {m.oncelik}</span>
                </div>
                {m.adresler.length > 0 && <div className="mt-0.5 break-all font-mono text-[12px] text-muted">{m.adresler.join(' · ')}</div>}
              </li>
            ))}
          </ul>
        </Kutu>
      )}

      {veri.ns.length > 0 && (
        <Kutu baslik="İsim sunucuları" ek={<Rozet durum={veri.dnssec.imzali ? 'iyi' : 'notr'}>{veri.dnssec.imzali ? 'DNSSEC imzalı' : 'DNSSEC yok'}</Rozet>}>
          <ul className="space-y-3">
            {veri.ns.map((n) => (
              <li key={n.sunucu}>
                <div className="break-all text-[14px] font-semibold text-strong">{n.sunucu}</div>
                {n.adresler.length > 0 && <div className="mt-0.5 break-all font-mono text-[12px] text-muted">{n.adresler.join(' · ')}</div>}
              </li>
            ))}
          </ul>
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

function WhoisSonuc({ veri }) {
  const [hamAcik, setHamAcik] = useState(false);

  if (!veri.kayitli) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
        <p className="text-[15px] font-semibold text-strong">{veri.alan} kayıtlı görünmüyor.</p>
        <p className="mt-1 text-[14px] text-body">Bu alan adı müsait olabilir; tescil için alan adı sayfamızdan sorgulayın.</p>
      </div>
    );
  }

  const bitisTonu = veri.kalanGun === null ? 'notr' : veri.kalanGun < 0 ? 'yok' : veri.kalanGun < 30 ? 'orta' : 'iyi';

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Kutu
        baslik="Alan adı"
        ek={veri.kalanGun !== null && <Rozet durum={bitisTonu}>{veri.kalanGun < 0 ? 'Süresi dolmuş' : `${veri.kalanGun} gün kaldı`}</Rozet>}
      >
        <Satir etiket="Alan adı" deger={veri.alan} kod />
        <Satir etiket="Tescil" deger={tarihYaz(veri.tarihler?.kayit)} />
        <Satir etiket="Son güncelleme" deger={tarihYaz(veri.tarihler?.guncelleme)} />
        <Satir etiket="Bitiş" deger={tarihYaz(veri.tarihler?.bitis)} />
        <Satir etiket="Yaş" deger={veri.yasYil !== null && veri.yasGun !== null ? (veri.yasYil >= 1 ? `${veri.yasYil} yıl` : `${veri.yasGun} gün`) : null} />
        <Satir etiket="DNSSEC" deger={veri.dnssec === null ? null : veri.dnssec ? 'İmzalı' : 'İmzasız'} />
      </Kutu>

      <Kutu baslik="Kayıt firması">
        <Satir etiket="Firma" deger={veri.kayitFirmasi?.ad} />
        <Satir etiket="IANA kimliği" deger={veri.kayitFirmasi?.ianaId} />
        <Satir etiket="Kötüye kullanım" deger={veri.kayitFirmasi?.eposta} kod />
        <Satir etiket="Telefon" deger={veri.kayitFirmasi?.telefon?.replace('tel:', '')} />
        <Satir etiket="Web sitesi" deger={veri.kayitFirmasi?.site} kod />
        {veri.sahip?.kurum && <Satir etiket="Kayıt sahibi" deger={veri.sahip.kurum} />}
        {veri.sahip?.ulke && <Satir etiket="Ülke" deger={veri.sahip.ulke} />}
      </Kutu>

      <Kutu baslik="İsim sunucuları">
        {veri.isimSunuculari?.length ? (
          <ul className="space-y-2">
            {veri.isimSunuculari.map((n) => (
              <li key={n} className="break-all font-mono text-[13px] font-semibold text-strong">{n}</li>
            ))}
          </ul>
        ) : (
          <Bos>İsim sunucusu bildirilmemiş.</Bos>
        )}
      </Kutu>

      <Kutu baslik="Durum">
        {veri.durumlar?.length ? (
          <ul className="space-y-2.5">
            {veri.durumlar.map((d) => (
              <li key={d.ham} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <code className="text-[13px] font-semibold text-strong">{d.ham}</code>
                {d.aciklama && <span className="text-[13px] text-body">{d.aciklama}</span>}
              </li>
            ))}
          </ul>
        ) : (
          <Bos>Durum bilgisi yok.</Bos>
        )}
        {veri.ekDurum?.transfer && <p className="mt-3 text-[13px] text-body">{veri.ekDurum.transfer}</p>}
      </Kutu>

      <div className="sm:col-span-2">
        <div className="flex flex-wrap items-center gap-3 text-[13px] text-muted">
          <span>Kaynak: {veri.kaynak === 'rdap' ? 'RDAP' : 'WHOIS'} · {String(veri.sunucu).replace(/^https?:\/\//, '')}</span>
          {veri.ham && (
            <button type="button" onClick={() => setHamAcik((v) => !v)} className="font-bold text-brandtext transition-colors hover:text-brand-500">
              {hamAcik ? 'Ham çıktıyı gizle' : 'Ham çıktıyı göster'}
            </button>
          )}
        </div>
        {hamAcik && veri.ham && (
          <pre className="mt-3 max-h-80 overflow-auto rounded-2xl border border-line bg-surface2 p-4 font-mono text-[12px] leading-relaxed text-body">{veri.ham}</pre>
        )}
      </div>
    </div>
  );
}

function SslSonuc({ veri }) {
  const bitisTonu = veri.kalanGun === null ? 'notr' : veri.kalanGun < 0 ? 'yok' : veri.kalanGun < 30 ? 'orta' : 'iyi';

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Kutu
        baslik="Genel durum"
        genis
        ek={<Rozet durum={veri.gecerli && veri.alanEslesmesi ? 'iyi' : 'yok'}>{veri.gecerli && veri.alanEslesmesi ? 'Sertifika geçerli' : 'Sorunlu'}</Rozet>}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-surface2 px-4 py-3">
            <div className="text-[12px] text-muted">Kalan süre</div>
            <div className={`mt-0.5 text-[18px] font-extrabold ${bitisTonu === 'iyi' ? 'text-strong' : 'text-amber-600 dark:text-amber-400'}`}>
              {veri.kalanGun === null ? '—' : `${veri.kalanGun} gün`}
            </div>
          </div>
          <div className="rounded-xl bg-surface2 px-4 py-3">
            <div className="text-[12px] text-muted">Alan adı eşleşmesi</div>
            <div className="mt-0.5 text-[18px] font-extrabold text-strong">{veri.alanEslesmesi ? 'Uygun' : 'Eşleşmiyor'}</div>
          </div>
          <div className="rounded-xl bg-surface2 px-4 py-3">
            <div className="text-[12px] text-muted">Bağlantı</div>
            <div className="mt-0.5 text-[18px] font-extrabold text-strong">{veri.baglanti.protokol || '—'}</div>
          </div>
        </div>
        {!veri.gecerli && veri.gecersizlikSebebi && (
          <p className="mt-4 text-[14px] font-medium text-rose-600 dark:text-rose-400">Doğrulama hatası: {veri.gecersizlikSebebi}</p>
        )}
      </Kutu>

      <Kutu baslik="Sertifika">
        <Satir etiket="Sahip" deger={veri.sertifika.sahip} kod />
        <Satir etiket="Kurum" deger={veri.sertifika.kurum} />
        <Satir etiket="Sağlayıcı" deger={veri.sertifika.saglayici} />
        <Satir etiket="Başlangıç" deger={tarihYaz(veri.sertifika.baslangic)} />
        <Satir etiket="Bitiş" deger={tarihYaz(veri.sertifika.bitis)} />
        <Satir etiket="Anahtar" deger={veri.sertifika.anahtarTipi} />
        <Satir etiket="Seri no" deger={veri.sertifika.seriNo} kod />
      </Kutu>

      <Kutu baslik="Protokol desteği" ek={veri.eskiProtokolAcik && <Rozet durum="riskli">Eski protokol açık</Rozet>}>
        <ul className="space-y-2.5">
          {veri.protokoller.map((p) => (
            <li key={p.ad} className="flex items-center justify-between gap-3">
              <span className="text-[14px] font-semibold text-strong">{p.ad}</span>
              <Rozet durum={p.destekli ? (p.guvenli ? 'iyi' : 'riskli') : 'notr'}>
                {p.destekli ? 'Açık' : 'Kapalı'}
              </Rozet>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[12px] leading-relaxed text-muted">
          TLS 1.0 ve 1.1 güncelliğini yitirmiştir; kapalı olmaları beklenir.
        </p>
      </Kutu>

      <Kutu baslik="Şifreleme">
        <Satir etiket="Sunulan protokol" deger={veri.baglanti.protokol} />
        <Satir etiket="Şifre paketi" deger={veri.baglanti.sifreleme} kod />
        <Satir etiket="Sunucu adresi" deger={veri.adres} kod />
        <Satir etiket="Parmak izi" deger={veri.sertifika.parmakIzi ? `${veri.sertifika.parmakIzi.slice(0, 29)}…` : null} kod />
      </Kutu>

      <Kutu baslik={`Kapsanan alan adları (${veri.alternatifler.length})`}>
        {veri.alternatifler.length ? (
          <div className="flex flex-wrap gap-2">
            {veri.alternatifler.slice(0, 20).map((a) => (
              <code key={a} className="rounded-lg bg-surface2 px-2.5 py-1 text-[12px] font-semibold text-body">{a}</code>
            ))}
            {veri.alternatifler.length > 20 && <span className="text-[12px] text-muted">+{veri.alternatifler.length - 20} tane daha</span>}
          </div>
        ) : (
          <Bos>Alternatif ad tanımlı değil.</Bos>
        )}
      </Kutu>

      {veri.zincir.length > 0 && (
        <Kutu baslik="Sertifika zinciri">
          <ol className="space-y-2.5">
            {veri.zincir.map((z, i) => (
              <li key={`${z.sahip}-${i}`} className="flex gap-3">
                <span className="text-[12px] font-bold tabular-nums text-brandtext">{String(i + 1).padStart(2, '0')}</span>
                <span className="min-w-0">
                  <span className="block break-all text-[13px] font-semibold text-strong">{z.sahip || 'Ara sertifika'}</span>
                  <span className="block text-[12px] text-muted">İmzalayan: {z.saglayici || '—'}</span>
                </span>
              </li>
            ))}
          </ol>
        </Kutu>
      )}
    </div>
  );
}

function EpostaSonuc({ veri }) {
  const puanTonu = veri.puan >= 80 ? 'iyi' : veri.puan >= 50 ? 'orta' : 'yok';

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Kutu baslik="Genel değerlendirme" genis ek={<Rozet durum={puanTonu}>{veri.puan} / 100</Rozet>}>
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            ['MX', veri.mx.bulundu ? 'iyi' : 'yok', veri.mx.bulundu ? 'Tanımlı' : 'Yok'],
            ['SPF', veri.spf.durum, veri.spf.kayit ? 'Tanımlı' : 'Yok'],
            ['DMARC', veri.dmarc.durum, veri.dmarc.kayit ? 'Tanımlı' : 'Yok'],
            ['DKIM', veri.dkim.bulundu ? 'iyi' : 'eksik', veri.dkim.bulundu ? `${veri.dkim.kayitlar.length} seçici` : 'Bulunamadı'],
          ].map(([ad, durum, metin]) => (
            <div key={ad} className="rounded-xl bg-surface2 px-4 py-3">
              <div className="text-[12px] text-muted">{ad}</div>
              <div className="mt-1"><Rozet durum={durum}>{metin}</Rozet></div>
            </div>
          ))}
        </div>
      </Kutu>

      <Kutu baslik="Posta sunucuları (MX)">
        {veri.mx.bulundu ? (
          <ul className="space-y-3">
            {veri.mx.sunucular.map((s) => (
              <li key={s.sunucu}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="break-all text-[14px] font-semibold text-strong">{s.sunucu}</span>
                  <span className="shrink-0 text-[12px] text-muted">öncelik {s.oncelik}</span>
                </div>
                {s.adresler.length > 0 && <div className="mt-0.5 break-all font-mono text-[12px] text-muted">{s.adresler.join(' · ')}</div>}
              </li>
            ))}
          </ul>
        ) : (
          <Bos>MX kaydı yok; bu alan adına e-posta ulaşmaz.</Bos>
        )}
      </Kutu>

      <Kutu baslik="SPF" ek={<Rozet durum={veri.spf.durum}>{veri.spf.durum === 'iyi' ? 'Uygun' : veri.spf.durum === 'yok' ? 'Eksik' : 'Dikkat'}</Rozet>}>
        <p className="text-[14px] leading-relaxed text-body">{veri.spf.mesaj}</p>
        {veri.spf.kayit && (
          <>
            <code className="mt-3 block break-all rounded-xl bg-surface2 p-3 text-[12px] text-body">{veri.spf.kayit}</code>
            <div className="mt-3">
              <Satir etiket="DNS sorgu sayısı" deger={`${veri.spf.lookupSayisi} / 10`} />
              <Satir etiket="Dahil edilenler" deger={veri.spf.includeler?.join(', ') || null} kod />
              <Satir etiket="Tanımlı IP" deger={veri.spf.ipler?.join(', ') || null} kod />
            </div>
            {veri.spf.lookupAsimi && (
              <p className="mt-2 text-[13px] font-semibold text-rose-600 dark:text-rose-400">
                10 sorgu sınırı aşılmış; SPF doğrulaması hata verir.
              </p>
            )}
          </>
        )}
      </Kutu>

      <Kutu baslik="DMARC" ek={<Rozet durum={veri.dmarc.durum}>{veri.dmarc.durum === 'iyi' ? 'Uygun' : veri.dmarc.durum === 'yok' ? 'Eksik' : 'Dikkat'}</Rozet>}>
        <p className="text-[14px] leading-relaxed text-body">{veri.dmarc.mesaj}</p>
        {veri.dmarc.kayit && (
          <>
            <code className="mt-3 block break-all rounded-xl bg-surface2 p-3 text-[12px] text-body">{veri.dmarc.kayit}</code>
            <div className="mt-3">
              <Satir etiket="Politika" deger={veri.dmarc.politika} />
              <Satir etiket="Alt alan adları" deger={veri.dmarc.altAlanPolitikasi} />
              <Satir etiket="Uygulama oranı" deger={`%${veri.dmarc.yuzde}`} />
              <Satir etiket="Rapor adresi" deger={veri.dmarc.raporAdresi?.replace('mailto:', '')} kod />
            </div>
          </>
        )}
      </Kutu>

      <Kutu baslik="DKIM">
        {veri.dkim.bulundu ? (
          <ul className="space-y-2">
            {veri.dkim.kayitlar.map((k) => (
              <li key={k.secici} className="flex items-baseline gap-3">
                <code className="text-[13px] font-bold text-strong">{k.secici}</code>
                <span className="text-[12px] text-muted">._domainkey kaydı bulundu</span>
              </li>
            ))}
          </ul>
        ) : (
          <Bos>Bilinen seçicilerde DKIM kaydı bulunamadı. Farklı bir seçici kullanıyor olabilirsiniz.</Bos>
        )}
        <div className="mt-4 space-y-1">
          <Satir etiket="MTA-STS" deger={veri.mtaSts.bulundu ? 'Tanımlı' : 'Yok'} />
          <Satir etiket="BIMI" deger={veri.bimi.bulundu ? 'Tanımlı' : 'Yok'} />
        </div>
      </Kutu>
    </div>
  );
}

function IpSonuc({ veri }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Kutu baslik={veri.kendiIpiniz ? 'Bağlandığınız IP adresi' : 'Sorgulanan IP'} genis>
        <p className="font-mono text-3xl font-extrabold tracking-tight text-strong">{veri.adres}</p>
        {veri.kaynakAlan && <p className="mt-1 text-[13px] text-muted">{veri.kaynakAlan} alan adının A kaydı</p>}
      </Kutu>

      <Kutu baslik="Ağ bilgisi">
        <Satir etiket="Otonom sistem" deger={veri.asn} kod />
        <Satir etiket="Operatör" deger={veri.asAdi} />
        <Satir etiket="IP bloğu" deger={veri.onEk} kod />
        <Satir etiket="Kayıt kuruluşu" deger={veri.kayitci} />
        <Satir etiket="Tahsis tarihi" deger={veri.tahsisTarihi} />
        <Satir etiket="Ülke kodu" deger={veri.ulke} />
      </Kutu>

      <Kutu baslik="Ters DNS (PTR)">
        {veri.ptr.length ? (
          <ul className="space-y-2">
            {veri.ptr.map((p) => (
              <li key={p} className="break-all font-mono text-[14px] font-semibold text-strong">{p}</li>
            ))}
          </ul>
        ) : (
          <Bos>PTR kaydı tanımlı değil. Posta sunucularında bu kayıt teslim edilebilirlik için gereklidir.</Bos>
        )}
      </Kutu>
    </div>
  );
}

const SONUC = { dns: DnsSonuc, whois: WhoisSonuc, ssl: SslSonuc, eposta: EpostaSonuc, ip: IpSonuc };

export default function ToolRunner({ arac }) {
  const [girdi, setGirdi] = useState('');
  const [veri, setVeri] = useState(null);
  const [hata, setHata] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const sorgula = useCallback(async (e) => {
    e?.preventDefault();
    if (!girdi.trim() && !arac.girdiOpsiyonel) {
      setHata(`${arac.girdiEtiketi} girin.`);
      return;
    }
    setYukleniyor(true);
    setHata('');
    setVeri(null);
    try {
      const r = await fetch(`/api/araclar/${arac.slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ girdi: girdi.trim() }),
      });
      const d = await r.json();
      if (d.ok) setVeri(d.data);
      else setHata(d.error?.message || 'Sorgu tamamlanamadı.');
    } catch {
      setHata('Sunucuya ulaşılamadı. Bağlantınızı kontrol edip tekrar deneyin.');
    } finally {
      setYukleniyor(false);
    }
  }, [girdi, arac]);

  const Sonuc = SONUC[arac.slug];

  return (
    <div>
      <form onSubmit={sorgula} className="flex flex-col gap-3 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">{arac.girdiEtiketi}</span>
          <input
            value={girdi}
            onChange={(e) => { setGirdi(e.target.value); if (hata) setHata(''); }}
            placeholder={arac.girdiOpsiyonel ? `${arac.ornek} (boş bırakırsanız kendi IP'niz)` : arac.ornek}
            inputMode="url"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            className="w-full rounded-xl border border-line bg-surface px-4 py-3.5 text-[16px] text-strong outline-none transition-colors placeholder:text-muted focus:border-brand-400"
          />
        </label>
        <button
          type="submit"
          disabled={yukleniyor}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-brand-500/25 transition-colors hover:bg-brand-600 disabled:opacity-60"
        >
          {yukleniyor ? 'Sorgulanıyor…' : 'Sorgula'}
          {!yukleniyor && <Icon name="arrow" className="h-4 w-4" />}
        </button>
      </form>

      {hata && (
        <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/5 px-4 py-3 text-[14px] font-medium text-rose-600 dark:text-rose-400">
          {hata}
        </p>
      )}

      {veri && Sonuc && (
        <div className="mt-8 animate-[fadeup_0.4s_ease-out]">
          <Sonuc veri={veri} />
        </div>
      )}
    </div>
  );
}
