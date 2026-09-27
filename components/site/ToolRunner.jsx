'use client';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from './chrome';
import { Kutu, Satir, Rozet, Bos, tarihYaz, sureYaz } from './tool-ui';
import DnsRapor from './DnsRapor';
import { m } from '@/lib/metin';
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
        <p className="text-[15px] font-semibold text-strong">{m('arac.whois_kayitsiz', { alan: veri.alan })}</p>
        <p className="mt-1 text-[14px] text-body">{m('arac.whois_musait')}</p>
      </div>
    );
  }

  const bitisTonu = veri.kalanGun === null ? 'notr' : veri.kalanGun < 0 ? 'yok' : veri.kalanGun < 30 ? 'orta' : 'iyi';

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Kutu
        baslik={m('arac.alan_adi')}
        ek={veri.kalanGun !== null && <Rozet durum={bitisTonu}>{veri.kalanGun < 0 ? m('arac.suresi_dolmus') : m('arac.gun_kaldi', { gun: veri.kalanGun })}</Rozet>}
      >
        <Satir etiket={m('arac.alan_adi')} deger={veri.alan} kod />
        <Satir etiket={m('arac.tescil')} deger={tarihYaz(veri.tarihler?.kayit)} />
        <Satir etiket={m('arac.son_guncelleme')} deger={tarihYaz(veri.tarihler?.guncelleme)} />
        <Satir etiket={m('arac.bitis')} deger={tarihYaz(veri.tarihler?.bitis)} />
        <Satir etiket={m('arac.yas')} deger={veri.yasYil !== null && veri.yasGun !== null ? (veri.yasYil >= 1 ? m('arac.yil_sayi', { sayi: veri.yasYil }) : m('arac.gun_sayi', { sayi: veri.yasGun })) : null} />
        <Satir etiket="DNSSEC" deger={veri.dnssec === null ? null : veri.dnssec ? m('arac.imzali') : m('arac.imzasiz')} />
      </Kutu>

      <Kutu baslik={m('arac.kayit_firmasi')}>
        <Satir etiket={m('arac.firma')} deger={veri.kayitFirmasi?.ad} />
        <Satir etiket={m('arac.iana_kimligi')} deger={veri.kayitFirmasi?.ianaId} />
        <Satir etiket={m('arac.kotuye_kullanim')} deger={veri.kayitFirmasi?.eposta} kod />
        <Satir etiket={m('arac.telefon')} deger={veri.kayitFirmasi?.telefon?.replace('tel:', '')} />
        <Satir etiket={m('arac.web_sitesi')} deger={veri.kayitFirmasi?.site} kod />
        {veri.sahip?.kurum && <Satir etiket={m('arac.kayit_sahibi')} deger={veri.sahip.kurum} />}
        {veri.sahip?.ulke && <Satir etiket={m('arac.ulke')} deger={veri.sahip.ulke} />}
      </Kutu>

      <Kutu baslik={m('arac.isim_sunuculari')}>
        {veri.isimSunuculari?.length ? (
          <ul className="space-y-2">
            {veri.isimSunuculari.map((n) => (
              <li key={n} className="break-all font-mono text-[13px] font-semibold text-strong">{n}</li>
            ))}
          </ul>
        ) : (
          <Bos>{m('arac.isim_sunucusu_yok')}</Bos>
        )}
      </Kutu>

      <Kutu baslik={m('arac.durum')}>
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
          <Bos>{m('arac.durum_yok')}</Bos>
        )}
        {veri.ekDurum?.transfer && <p className="mt-3 text-[13px] text-body">{veri.ekDurum.transfer}</p>}
      </Kutu>

      <div className="sm:col-span-2">
        <div className="flex flex-wrap items-center gap-3 text-[13px] text-muted">
          <span>{m('arac.kaynak', { kaynak: veri.kaynak === 'rdap' ? 'RDAP' : 'WHOIS', sunucu: String(veri.sunucu).replace(/^https?:\/\//, '') })}</span>
          {veri.ham && (
            <button type="button" onClick={() => setHamAcik((v) => !v)} className="font-bold text-brandtext transition-colors hover:text-brand-500">
              {hamAcik ? m('arac.ham_gizle') : m('arac.ham_goster')}
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
        baslik={m('arac.genel_durum')}
        genis
        ek={<Rozet durum={veri.gecerli && veri.alanEslesmesi ? 'iyi' : 'yok'}>{veri.gecerli && veri.alanEslesmesi ? m('arac.sertifika_gecerli') : m('arac.sorunlu')}</Rozet>}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-surface2 px-4 py-3">
            <div className="text-[12px] text-muted">{m('arac.kalan_sure')}</div>
            <div className={`mt-0.5 text-[18px] font-extrabold ${bitisTonu === 'iyi' ? 'text-strong' : 'text-amber-600 dark:text-amber-400'}`}>
              {veri.kalanGun === null ? '—' : m('arac.gun_sayi', { sayi: veri.kalanGun })}
            </div>
          </div>
          <div className="rounded-xl bg-surface2 px-4 py-3">
            <div className="text-[12px] text-muted">{m('arac.alan_eslesmesi')}</div>
            <div className="mt-0.5 text-[18px] font-extrabold text-strong">{veri.alanEslesmesi ? m('arac.uygun') : m('arac.eslesmiyor')}</div>
          </div>
          <div className="rounded-xl bg-surface2 px-4 py-3">
            <div className="text-[12px] text-muted">{m('arac.baglanti')}</div>
            <div className="mt-0.5 text-[18px] font-extrabold text-strong">{veri.baglanti.protokol || '—'}</div>
          </div>
        </div>
        {!veri.gecerli && veri.gecersizlikSebebi && (
          <p className="mt-4 text-[14px] font-medium text-rose-600 dark:text-rose-400">{m('arac.dogrulama_hatasi', { sebep: veri.gecersizlikSebebi })}</p>
        )}
      </Kutu>

      <Kutu baslik={m('arac.sertifika')}>
        <Satir etiket={m('arac.sahip')} deger={veri.sertifika.sahip} kod />
        <Satir etiket={m('arac.kurum')} deger={veri.sertifika.kurum} />
        <Satir etiket={m('arac.saglayici')} deger={veri.sertifika.saglayici} />
        <Satir etiket={m('arac.baslangic')} deger={tarihYaz(veri.sertifika.baslangic)} />
        <Satir etiket={m('arac.bitis')} deger={tarihYaz(veri.sertifika.bitis)} />
        <Satir etiket={m('arac.anahtar')} deger={veri.sertifika.anahtarTipi} />
        <Satir etiket={m('arac.seri_no')} deger={veri.sertifika.seriNo} kod />
      </Kutu>

      <Kutu baslik={m('arac.protokol_destegi')} ek={veri.eskiProtokolAcik && <Rozet durum="riskli">{m('arac.eski_protokol_acik')}</Rozet>}>
        <ul className="space-y-2.5">
          {veri.protokoller.map((p) => (
            <li key={p.ad} className="flex items-center justify-between gap-3">
              <span className="text-[14px] font-semibold text-strong">{p.ad}</span>
              <Rozet durum={p.destekli ? (p.guvenli ? 'iyi' : 'riskli') : 'notr'}>
                {p.destekli ? m('arac.acik') : m('arac.kapali')}
              </Rozet>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[12px] leading-relaxed text-muted">
          {m('arac.tls_notu')}
        </p>
      </Kutu>

      <Kutu baslik={m('arac.sifreleme')}>
        <Satir etiket={m('arac.sunulan_protokol')} deger={veri.baglanti.protokol} />
        <Satir etiket={m('arac.sifre_paketi')} deger={veri.baglanti.sifreleme} kod />
        <Satir etiket={m('arac.sunucu_adresi')} deger={veri.adres} kod />
        <Satir etiket={m('arac.parmak_izi')} deger={veri.sertifika.parmakIzi ? `${veri.sertifika.parmakIzi.slice(0, 29)}…` : null} kod />
      </Kutu>

      <Kutu baslik={m('arac.kapsanan_alanlar', { sayi: veri.alternatifler.length })}>
        {veri.alternatifler.length ? (
          <div className="flex flex-wrap gap-2">
            {veri.alternatifler.slice(0, 20).map((a) => (
              <code key={a} className="rounded-lg bg-surface2 px-2.5 py-1 text-[12px] font-semibold text-body">{a}</code>
            ))}
            {veri.alternatifler.length > 20 && <span className="text-[12px] text-muted">{m('arac.tane_daha', { sayi: veri.alternatifler.length - 20 })}</span>}
          </div>
        ) : (
          <Bos>{m('arac.alternatif_yok')}</Bos>
        )}
      </Kutu>

      {veri.zincir.length > 0 && (
        <Kutu baslik={m('arac.sertifika_zinciri')}>
          <ol className="space-y-2.5">
            {veri.zincir.map((z, i) => (
              <li key={`${z.sahip}-${i}`} className="flex gap-3">
                <span className="text-[12px] font-bold tabular-nums text-brandtext">{String(i + 1).padStart(2, '0')}</span>
                <span className="min-w-0">
                  <span className="block break-all text-[13px] font-semibold text-strong">{z.sahip || m('arac.ara_sertifika')}</span>
                  <span className="block text-[12px] text-muted">{m('arac.imzalayan', { ad: z.saglayici || '—' })}</span>
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
      <Kutu baslik={m('arac.genel_degerlendirme')} genis ek={<Rozet durum={puanTonu}>{veri.puan} / 100</Rozet>}>
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            ['MX', veri.mx.bulundu ? 'iyi' : 'yok', veri.mx.bulundu ? m('arac.tanimli') : m('arac.yok')],
            ['SPF', veri.spf.durum, veri.spf.kayit ? m('arac.tanimli') : m('arac.yok')],
            ['DMARC', veri.dmarc.durum, veri.dmarc.kayit ? m('arac.tanimli') : m('arac.yok')],
            ['DKIM', veri.dkim.bulundu ? 'iyi' : 'eksik', veri.dkim.bulundu ? m('arac.secici_sayi', { sayi: veri.dkim.kayitlar.length }) : m('arac.bulunamadi')],
          ].map(([ad, durum, metin]) => (
            <div key={ad} className="rounded-xl bg-surface2 px-4 py-3">
              <div className="text-[12px] text-muted">{ad}</div>
              <div className="mt-1"><Rozet durum={durum}>{metin}</Rozet></div>
            </div>
          ))}
        </div>
      </Kutu>

      <Kutu baslik={m('arac.posta_sunuculari_mx')}>
        {veri.mx.bulundu ? (
          <ul className="space-y-3">
            {veri.mx.sunucular.map((s) => (
              <li key={s.sunucu}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="break-all text-[14px] font-semibold text-strong">{s.sunucu}</span>
                  <span className="shrink-0 text-[12px] text-muted">{m('arac.oncelik', { sayi: s.oncelik })}</span>
                </div>
                {s.adresler.length > 0 && <div className="mt-0.5 break-all font-mono text-[12px] text-muted">{s.adresler.join(' · ')}</div>}
              </li>
            ))}
          </ul>
        ) : (
          <Bos>{m('arac.mx_yok')}</Bos>
        )}
      </Kutu>

      <Kutu baslik="SPF" ek={<Rozet durum={veri.spf.durum}>{veri.spf.durum === 'iyi' ? m('arac.uygun') : veri.spf.durum === 'yok' ? m('arac.eksik') : m('arac.dikkat')}</Rozet>}>
        <p className="text-[14px] leading-relaxed text-body">{veri.spf.mesaj}</p>
        {veri.spf.kayit && (
          <>
            <code className="mt-3 block break-all rounded-xl bg-surface2 p-3 text-[12px] text-body">{veri.spf.kayit}</code>
            <div className="mt-3">
              <Satir etiket={m('arac.dns_sorgu_sayisi')} deger={`${veri.spf.lookupSayisi} / 10`} />
              <Satir etiket={m('arac.dahil_edilenler')} deger={veri.spf.includeler?.join(', ') || null} kod />
              <Satir etiket={m('arac.tanimli_ip')} deger={veri.spf.ipler?.join(', ') || null} kod />
            </div>
            {veri.spf.lookupAsimi && (
              <p className="mt-2 text-[13px] font-semibold text-rose-600 dark:text-rose-400">
                {m('arac.spf_sinir_asimi')}
              </p>
            )}
          </>
        )}
      </Kutu>

      <Kutu baslik="DMARC" ek={<Rozet durum={veri.dmarc.durum}>{veri.dmarc.durum === 'iyi' ? m('arac.uygun') : veri.dmarc.durum === 'yok' ? m('arac.eksik') : m('arac.dikkat')}</Rozet>}>
        <p className="text-[14px] leading-relaxed text-body">{veri.dmarc.mesaj}</p>
        {veri.dmarc.kayit && (
          <>
            <code className="mt-3 block break-all rounded-xl bg-surface2 p-3 text-[12px] text-body">{veri.dmarc.kayit}</code>
            <div className="mt-3">
              <Satir etiket={m('arac.politika')} deger={veri.dmarc.politika} />
              <Satir etiket={m('arac.alt_alan_adlari')} deger={veri.dmarc.altAlanPolitikasi} />
              <Satir etiket={m('arac.uygulama_orani')} deger={`%${veri.dmarc.yuzde}`} />
              <Satir etiket={m('arac.rapor_adresi')} deger={veri.dmarc.raporAdresi?.replace('mailto:', '')} kod />
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
                <span className="text-[12px] text-muted">{m('arac.dkim_bulundu')}</span>
              </li>
            ))}
          </ul>
        ) : (
          <Bos>{m('arac.dkim_yok')}</Bos>
        )}
        <div className="mt-4 space-y-1">
          <Satir etiket="MTA-STS" deger={veri.mtaSts.bulundu ? m('arac.tanimli') : m('arac.yok')} />
          <Satir etiket="BIMI" deger={veri.bimi.bulundu ? m('arac.tanimli') : m('arac.yok')} />
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
        baslik={m('arac.genel_durum')}
        genis
        ek={
          <Rozet durum={veri.temiz ? 'iyi' : 'yok'}>
            {veri.temiz ? m('arac.kara_listede_degil') : m('arac.listede_kayitli', { sayi: veri.listeliToplam })}
          </Rozet>
        }
      >
        <p className="text-[14px] leading-relaxed text-body">
          {m('arac.karaliste_ozet', { adres: veri.adresSayisi, bolge: veri.bolgeSayisi })}{' '}
          {veri.temiz
            ? m('arac.karaliste_temiz')
            : m('arac.karaliste_listede')}
        </p>
      </Kutu>

      {veri.sonuclar.map((s) => (
        <Kutu
          key={s.ip}
          baslik={s.ip}
          genis
          ek={<Rozet durum={s.listeliSayi ? 'yok' : 'iyi'}>{s.listeliSayi ? m('arac.listede_sayi', { sayi: s.listeliSayi }) : m('arac.temiz')}</Rozet>}
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
                    {l.durum === 'listede' ? m('arac.listede') : l.durum === 'temiz' ? m('arac.temiz') : m('arac.sorgulanamadi')}
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
                  {m('arac.sorgu_sayfasi')}
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
      <Kutu baslik={m('arac.genel_degerlendirme')} genis ek={<Rozet durum={puanTonu}>{veri.puan} / 100</Rozet>}>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-surface2 px-4 py-3">
            <div className="text-[12px] text-muted">{m('arac.son_adres')}</div>
            <div className="mt-0.5 break-all text-[14px] font-bold text-strong">{veri.sonUrl}</div>
          </div>
          <div className="rounded-xl bg-surface2 px-4 py-3">
            <div className="text-[12px] text-muted">{m('arac.durum_kodu')}</div>
            <div className="mt-0.5 text-[18px] font-extrabold text-strong">{veri.durumKodu}</div>
          </div>
          <div className="rounded-xl bg-surface2 px-4 py-3">
            <div className="text-[12px] text-muted">{m('arac.sunucu')}</div>
            <div className="mt-0.5 break-all text-[14px] font-bold text-strong">{veri.sunucu || m('arac.bildirilmemis')}</div>
          </div>
        </div>
      </Kutu>

      <Kutu baslik={m('arac.guvenlik_basliklari')} genis>
        <ul className="space-y-3">
          {veri.kontroller.map((k) => (
            <li key={k.id} className="border-b border-line/70 pb-3 last:border-0 last:pb-0">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <span className="text-[14px] font-bold text-strong">{k.ad}</span>
                <Rozet durum={k.durum}>
                  {k.durum === 'iyi' ? m('arac.tanimli') : k.durum === 'orta' ? m('arac.gelistirilmeli') : m('arac.eksik')}
                </Rozet>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">{k.aciklama}</p>
              {k.deger && <code className="mt-2 block break-all rounded-lg bg-surface2 px-3 py-2 text-[12px] text-body">{k.deger}</code>}
            </li>
          ))}
        </ul>
      </Kutu>

      <Kutu baslik={m('arac.yonlendirme_zinciri')}>
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
            <Satir etiket={m('arac.hsts_suresi')} deger={m('arac.gun_sayi', { sayi: Math.round(veri.hsts.maxAge / 86400) })} />
            <Satir etiket={m('arac.alt_alan_adlari')} deger={veri.hsts.altAlanlar ? m('arac.kapsiyor') : m('arac.kapsamiyor')} />
            <Satir etiket={m('arac.on_yukleme_listesi')} deger={veri.hsts.onYukleme ? m('arac.isaretli') : m('arac.isaretsiz')} />
          </div>
        )}
      </Kutu>

      <Kutu baslik={m('arac.cerezler_sunucu')}>
        {veri.cerezler.length ? (
          <ul className="space-y-2.5">
            {veri.cerezler.map((c) => (
              <li key={c.ad} className="flex flex-wrap items-baseline justify-between gap-2">
                <code className="text-[13px] font-semibold text-strong">{c.ad}</code>
                <span className="flex flex-wrap gap-1.5">
                  <Rozet durum={c.secure ? 'iyi' : 'orta'}>Secure</Rozet>
                  <Rozet durum={c.httpOnly ? 'iyi' : 'orta'}>HttpOnly</Rozet>
                  <Rozet durum={c.sameSite ? 'iyi' : 'orta'}>SameSite{c.sameSite ? `=${c.sameSite}` : ` ${m('arac.yok_kucuk')}`}</Rozet>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <Bos>{m('arac.cerez_yok')}</Bos>
        )}

        <div className="mt-4">
          <Satir etiket={m('arac.icerik_turu')} deger={veri.icerikTuru} kod />
          <Satir etiket={m('arac.sikistirma')} deger={veri.sikistirma || m('arac.yok')} />
          <Satir etiket={m('arac.onbellek')} deger={veri.onbellek} kod />
        </div>

        {veri.ifsalar.length > 0 && (
          <p className="mt-4 text-[13px] leading-relaxed text-amber-700 dark:text-amber-400">
            {m('arac.surum_ifsa', { liste: veri.ifsalar.map((i) => `${i.ad}: ${i.deger}`).join(' · ') })}
          </p>
        )}
      </Kutu>
    </div>
  );
}

function IpSonuc({ veri }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Kutu baslik={veri.kendiIpiniz ? m('arac.bagli_ip') : m('arac.sorgulanan_ip')} genis>
        <p className="font-mono text-3xl font-extrabold tracking-tight text-strong">{veri.adres}</p>
        {veri.kaynakAlan && <p className="mt-1 text-[13px] text-muted">{m('arac.a_kaydi_kaynak', { alan: veri.kaynakAlan })}</p>}
      </Kutu>

      <Kutu baslik={m('arac.ag_bilgisi')}>
        <Satir etiket={m('arac.otonom_sistem')} deger={veri.asn} kod />
        <Satir etiket={m('arac.operator')} deger={veri.asAdi} />
        <Satir etiket={m('arac.ip_blogu')} deger={veri.onEk} kod />
        <Satir etiket={m('arac.kayit_kurulusu')} deger={veri.kayitci} />
        <Satir etiket={m('arac.tahsis_tarihi')} deger={veri.tahsisTarihi} />
        <Satir etiket={m('arac.ulke_kodu')} deger={veri.ulke} />
      </Kutu>

      <Kutu baslik={m('arac.ters_dns')}>
        {veri.ptr.length ? (
          <ul className="space-y-2">
            {veri.ptr.map((p) => (
              <li key={p} className="break-all font-mono text-[14px] font-semibold text-strong">{p}</li>
            ))}
          </ul>
        ) : (
          <Bos>{m('arac.ptr_yok')}</Bos>
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
          {t === 'TUM' ? m('arac.tumu') : t}
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
        setHata(m('arac.alan_adi_girin'));
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
        setHata(m('arac.girdi_girin', { etiket: arac.girdiEtiketi }));
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
          setHata(d.error?.message || m('arac.sorgu_tamamlanamadi'));
        }
      } catch {
        setHata(m('arac.sunucuya_ulasilamadi'));
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
              placeholder={arac.girdiOpsiyonel ? m('arac.girdi_opsiyonel', { ornek: arac.ornek }) : arac.ornek}
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
            {bekliyor ? m('arac.sorgulaniyor') : m('arac.sorgula')}
            {!bekliyor && <Icon name="arrow" className="h-4 w-4" />}
          </button>
        </div>

        {dnsMi && <TipSecici secili={tip} onSec={(t) => { setTip(t); if (alanNormalle(girdi)) dnsGit(girdi, t); }} />}
      </form>

      {gecmis.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[12px] text-muted">{m('arac.son_sorgular')}</span>
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
