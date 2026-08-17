'use client';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from './chrome';
import { Kutu, Satir, Rozet, Bos, tarihYaz, sureYaz } from './tool-ui';
import DnsRapor from './DnsRapor';
import { DNS_TIP_KODLARI } from '@/content/site/dns-tipleri';

const GECMIS_ANAHTARI = 'sunucumweb-arac-gecmis';
const GECMIS_SINIRI = 8;

const alanNormalle = (deger) =>
  String(deger || '')
    .trim()
    .toLowerCase()
    .replace(/^[a-z][a-z0-9+.-]*:\/\//, '')
    .replace(/^[^/@]*@/, '')
    .split(/[/?#]/)[0]
    .replace(/:\d+$/, '')
    .replace(/^www\./, '')
    .replace(/^\.+|\.+$/g, '');

function gecmisOku(slug) {
  try {
    const ham = JSON.parse(window.localStorage.getItem(GECMIS_ANAHTARI) || '{}');
    return Array.isArray(ham[slug]) ? ham[slug] : [];
  } catch {
    return [];
  }
}

function gecmisYaz(slug, kayit) {
  try {
    const ham = JSON.parse(window.localStorage.getItem(GECMIS_ANAHTARI) || '{}');
    const liste = Array.isArray(ham[slug]) ? ham[slug] : [];
    const anahtar = `${kayit.girdi}|${kayit.tip || ''}`;
    const yeni = [kayit, ...liste.filter((k) => `${k.girdi}|${k.tip || ''}` !== anahtar)].slice(0, GECMIS_SINIRI);
    window.localStorage.setItem(GECMIS_ANAHTARI, JSON.stringify({ ...ham, [slug]: yeni }));
    return yeni;
  } catch {
    return [];
  }
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

function KaraListeSonuc({ veri }) {
  const bolgeAdi = Object.fromEntries(veri.bolgeler.map((b) => [b.id, b]));

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Kutu
        baslik="Genel durum"
        genis
        ek={
          <Rozet durum={veri.temiz ? 'iyi' : 'yok'}>
            {veri.temiz ? 'Kara listede değil' : `${veri.listeliToplam} listede kayıtlı`}
          </Rozet>
        }
      >
        <p className="text-[14px] leading-relaxed text-body">
          {veri.adresSayisi} IP adresi, {veri.bolgeSayisi} kara liste bölgesinde sorgulandı.{' '}
          {veri.temiz
            ? 'Sorgulanan adreslerin hiçbiri listelerde görünmüyor.'
            : 'Listeye düşen adresler aşağıda işaretli; listeden çıkmak için ilgili listenin kendi başvuru sayfasını kullanmanız gerekir.'}
        </p>
      </Kutu>

      {veri.sonuclar.map((s) => (
        <Kutu
          key={s.ip}
          baslik={s.ip}
          genis
          ek={<Rozet durum={s.listeliSayi ? 'yok' : 'iyi'}>{s.listeliSayi ? `${s.listeliSayi} listede` : 'Temiz'}</Rozet>}
        >
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[13px] text-muted">
            <span>{s.kaynak}</span>
            {s.ptr && <span>PTR: <code className="text-body">{s.ptr}</code></span>}
          </div>

          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {s.listeler.map((l) => {
              const b = bolgeAdi[l.id];
              return (
                <li key={l.id} className="flex items-baseline justify-between gap-3 rounded-xl bg-surface2 px-3.5 py-2.5">
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold text-strong">{b.ad}</span>
                    <span className="block text-[11px] text-muted">{b.bolge}</span>
                  </span>
                  <Rozet durum={l.durum === 'listede' ? 'yok' : l.durum === 'temiz' ? 'iyi' : 'notr'}>
                    {l.durum === 'listede' ? 'Listede' : l.durum === 'temiz' ? 'Temiz' : 'Sorgulanamadı'}
                  </Rozet>
                </li>
              );
            })}
          </ul>

          {s.listeler.some((l) => l.sebep) && (
            <div className="mt-4 space-y-2">
              {s.listeler
                .filter((l) => l.sebep)
                .map((l) => (
                  <p key={l.id} className="text-[13px] leading-relaxed text-body">
                    <span className="font-bold text-strong">{bolgeAdi[l.id].ad}:</span> {l.sebep}
                  </p>
                ))}
            </div>
          )}
        </Kutu>
      ))}

      {veri.bolgeler
        .filter((b) => b.not)
        .map((b) => (
          <div key={b.id} className="sm:col-span-2 rounded-2xl border border-line bg-surface2 p-5">
            <p className="text-[13px] leading-relaxed text-body">
              <span className="font-bold text-strong">{b.ad}:</span> {b.not}{' '}
              {b.baglanti && (
                <a href={b.baglanti} target="_blank" rel="noopener noreferrer" className="font-bold text-brandtext hover:text-brand-500">
                  Sorgu sayfası
                </a>
              )}
            </p>
          </div>
        ))}
    </div>
  );
}

function BasliklarSonuc({ veri }) {
  const puanTonu = veri.puan >= 80 ? 'iyi' : veri.puan >= 50 ? 'orta' : 'yok';

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Kutu baslik="Genel değerlendirme" genis ek={<Rozet durum={puanTonu}>{veri.puan} / 100</Rozet>}>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-surface2 px-4 py-3">
            <div className="text-[12px] text-muted">Son adres</div>
            <div className="mt-0.5 break-all text-[14px] font-bold text-strong">{veri.sonUrl}</div>
          </div>
          <div className="rounded-xl bg-surface2 px-4 py-3">
            <div className="text-[12px] text-muted">Durum kodu</div>
            <div className="mt-0.5 text-[18px] font-extrabold text-strong">{veri.durumKodu}</div>
          </div>
          <div className="rounded-xl bg-surface2 px-4 py-3">
            <div className="text-[12px] text-muted">Sunucu</div>
            <div className="mt-0.5 break-all text-[14px] font-bold text-strong">{veri.sunucu || 'Bildirilmemiş'}</div>
          </div>
        </div>
      </Kutu>

      <Kutu baslik="Güvenlik başlıkları" genis>
        <ul className="space-y-3">
          {veri.kontroller.map((k) => (
            <li key={k.id} className="border-b border-line/70 pb-3 last:border-0 last:pb-0">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <span className="text-[14px] font-bold text-strong">{k.ad}</span>
                <Rozet durum={k.durum}>
                  {k.durum === 'iyi' ? 'Tanımlı' : k.durum === 'orta' ? 'Geliştirilmeli' : 'Eksik'}
                </Rozet>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">{k.aciklama}</p>
              {k.deger && <code className="mt-2 block break-all rounded-lg bg-surface2 px-3 py-2 text-[12px] text-body">{k.deger}</code>}
            </li>
          ))}
        </ul>
      </Kutu>

      <Kutu baslik="Yönlendirme zinciri">
        <ol className="space-y-2.5">
          {veri.zincir.map((z, i) => (
            <li key={`${z.url}-${i}`} className="flex gap-3">
              <span className="text-[12px] font-bold tabular-nums text-brandtext">{z.durum}</span>
              <span className="min-w-0 break-all text-[13px] text-body">{z.url}</span>
            </li>
          ))}
        </ol>
        {veri.hsts && (
          <div className="mt-4">
            <Satir etiket="HSTS süresi" deger={`${Math.round(veri.hsts.maxAge / 86400)} gün`} />
            <Satir etiket="Alt alan adları" deger={veri.hsts.altAlanlar ? 'Kapsıyor' : 'Kapsamıyor'} />
            <Satir etiket="Ön yükleme listesi" deger={veri.hsts.onYukleme ? 'İşaretli' : 'İşaretsiz'} />
          </div>
        )}
      </Kutu>

      <Kutu baslik="Çerezler ve sunucu bilgisi">
        {veri.cerezler.length ? (
          <ul className="space-y-2.5">
            {veri.cerezler.map((c) => (
              <li key={c.ad} className="flex flex-wrap items-baseline justify-between gap-2">
                <code className="text-[13px] font-semibold text-strong">{c.ad}</code>
                <span className="flex flex-wrap gap-1.5">
                  <Rozet durum={c.secure ? 'iyi' : 'orta'}>Secure</Rozet>
                  <Rozet durum={c.httpOnly ? 'iyi' : 'orta'}>HttpOnly</Rozet>
                  <Rozet durum={c.sameSite ? 'iyi' : 'orta'}>SameSite{c.sameSite ? `=${c.sameSite}` : ' yok'}</Rozet>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <Bos>Yanıtta çerez ayarlanmıyor.</Bos>
        )}

        <div className="mt-4">
          <Satir etiket="İçerik türü" deger={veri.icerikTuru} kod />
          <Satir etiket="Sıkıştırma" deger={veri.sikistirma || 'Yok'} />
          <Satir etiket="Önbellek" deger={veri.onbellek} kod />
        </div>

        {veri.ifsalar.length > 0 && (
          <p className="mt-4 text-[13px] leading-relaxed text-amber-700 dark:text-amber-400">
            Sürüm bilgisi ifşa ediliyor: {veri.ifsalar.map((i) => `${i.ad}: ${i.deger}`).join(' · ')}. Bu başlıkları
            gizlemek, bilinen açıkları arayan taramaları zorlaştırır.
          </p>
        )}
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

const SONUC = {
  whois: WhoisSonuc,
  ssl: SslSonuc,
  eposta: EpostaSonuc,
  ip: IpSonuc,
  karaliste: KaraListeSonuc,
  basliklar: BasliklarSonuc,
};

const TIP_SECENEKLERI = ['TUM', ...DNS_TIP_KODLARI];

export const dnsYolu = (alan, tip) =>
  `/araclar/dns/${encodeURIComponent(alan)}${!tip || tip === 'TUM' ? '' : `/${tip.toLowerCase()}`}`;

function TipSecici({ secili, onSec }) {
  return (
    <div className="-mx-1 flex snap-x gap-1.5 overflow-x-auto px-1 pb-1">
      {TIP_SECENEKLERI.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onSec(t)}
          aria-pressed={secili === t}
          className={`shrink-0 snap-start rounded-lg px-3 py-1.5 text-[13px] font-bold transition-colors ${
            secili === t ? 'bg-brand-500 text-white' : 'bg-surface2 text-body hover:bg-brandsoft hover:text-brandtext'
          }`}
        >
          {t === 'TUM' ? 'Tümü' : t}
        </button>
      ))}
    </div>
  );
}

export default function ToolRunner({ arac, baslangicGirdi = '', baslangicTip = 'TUM', veri: sunucuVeri = null }) {
  const dnsMi = arac.slug === 'dns';
  const router = useRouter();
  const [gecis, gecisBaslat] = useTransition();

  const [girdi, setGirdi] = useState(baslangicGirdi);
  const [tip, setTip] = useState(baslangicTip);
  const [veri, setVeri] = useState(null);
  const [hata, setHata] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [gecmis, setGecmis] = useState([]);

  useEffect(() => setGecmis(gecmisOku(arac.slug)), [arac.slug]);

  useEffect(() => {
    if (!dnsMi || !baslangicGirdi) return;
    setGecmis(gecmisYaz(arac.slug, { girdi: baslangicGirdi, tip: baslangicTip }));
  }, [dnsMi, arac.slug, baslangicGirdi, baslangicTip]);

  const dnsGit = useCallback(
    (deger, istenenTip) => {
      const alan = alanNormalle(deger);
      if (!alan) {
        setHata('Alan adı girin.');
        return;
      }
      setHata('');
      gecisBaslat(() => router.push(dnsYolu(alan, istenenTip)));
    },
    [router],
  );

  const sorgula = useCallback(
    async (e) => {
      e?.preventDefault();

      if (dnsMi) {
        dnsGit(girdi, tip);
        return;
      }

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
        if (d.ok) {
          setVeri(d.data);
          if (girdi.trim()) setGecmis(gecmisYaz(arac.slug, { girdi: girdi.trim() }));
        } else {
          setHata(d.error?.message || 'Sorgu tamamlanamadı.');
        }
      } catch {
        setHata('Sunucuya ulaşılamadı. Bağlantınızı kontrol edip tekrar deneyin.');
      } finally {
        setYukleniyor(false);
      }
    },
    [girdi, tip, arac, dnsMi, dnsGit],
  );

  const Sonuc = SONUC[arac.slug];
  const bekliyor = yukleniyor || gecis;

  return (
    <div>
      <form onSubmit={sorgula} className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row">
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
            disabled={bekliyor}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-brand-500/25 transition-colors hover:bg-brand-600 disabled:opacity-60"
          >
            {bekliyor ? 'Sorgulanıyor…' : 'Sorgula'}
            {!bekliyor && <Icon name="arrow" className="h-4 w-4" />}
          </button>
        </div>

        {dnsMi && <TipSecici secili={tip} onSec={(t) => { setTip(t); if (alanNormalle(girdi)) dnsGit(girdi, t); }} />}
      </form>

      {gecmis.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[12px] text-muted">Son sorgular:</span>
          {gecmis.map((k) => (
            <button
              key={`${k.girdi}|${k.tip || ''}`}
              type="button"
              onClick={() => {
                setGirdi(k.girdi);
                if (dnsMi) {
                  setTip(k.tip || 'TUM');
                  dnsGit(k.girdi, k.tip || 'TUM');
                }
              }}
              className="rounded-lg bg-surface2 px-2.5 py-1 text-[12px] font-semibold text-body transition-colors hover:bg-brandsoft hover:text-brandtext"
            >
              {k.girdi}
              {k.tip && k.tip !== 'TUM' && <span className="ml-1 text-muted">{k.tip}</span>}
            </button>
          ))}
        </div>
      )}

      {hata && (
        <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/5 px-4 py-3 text-[14px] font-medium text-rose-600 dark:text-rose-400">
          {hata}
        </p>
      )}

      {dnsMi && sunucuVeri && (
        <div className="mt-8">
          <DnsRapor veri={sunucuVeri} />
        </div>
      )}

      {!dnsMi && veri && Sonuc && (
        <div className="mt-8 animate-[fadeup_0.4s_ease-out]">
          <Sonuc veri={veri} />
        </div>
      )}
    </div>
  );
}
