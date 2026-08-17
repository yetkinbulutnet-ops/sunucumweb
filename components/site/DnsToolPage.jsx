import Link from 'next/link';
import { CtaBand, SiteShell } from './chrome';
import { AracKabugu, DigerAraclar } from './ToolsPage';
import ToolRunner from './ToolRunner';
import { DNS_TIPLERI, dnsTipBul } from '@/content/site/dns-tipleri';

const yol = (alan, tip) => `/araclar/dns/${alan}${tip ? `/${tip.toLowerCase()}` : ''}`;

function TipKartlari({ alan }) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {DNS_TIPLERI.map((t) => (
        <Link
          key={t.tip}
          href={alan ? yol(alan, t.tip) : '/araclar/dns'}
          className="group rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-brandline"
        >
          <span className="inline-flex items-center gap-2">
            <code className="rounded-lg bg-brandsoft px-2 py-0.5 text-[13px] font-bold text-brandtext">{t.tip}</code>
            <span className="text-[13px] font-semibold text-muted">{t.kisa}</span>
          </span>
          <p className="mt-3 text-[14px] leading-relaxed text-body">{t.ozet}</p>
          {alan && (
            <span className="mt-3 inline-block text-[13px] font-bold text-brandtext">
              {alan} için sorgula
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}

function TipAnlatimi({ tipBilgi, alan }) {
  return (
    <section className="mx-auto max-w-4xl px-5 lg:px-8 py-14 lg:py-16">
      <h2 className="text-2xl font-extrabold tracking-tight text-strong">
        {tipBilgi.ad} nedir?
      </h2>
      <p className="mt-4 text-[16px] leading-relaxed text-body">{tipBilgi.aciklama}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-muted">Örnek değer</h3>
          <code className="mt-3 block break-all text-[14px] font-semibold text-strong">{tipBilgi.ornek}</code>
        </div>
        <div className="rounded-2xl border border-brandline bg-brandsoft p-5">
          <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-brandtext">Pratik ipucu</h3>
          <p className="mt-3 text-[14px] leading-relaxed text-body">{tipBilgi.ipucu}</p>
        </div>
      </div>

      {alan && (
        <p className="mt-6 text-[15px] leading-relaxed text-body">
          Yukarıdaki sonuçlar {alan} alan adının {tipBilgi.tip} kayıtlarını dokuz farklı genel DNS çözümleyicisinden
          canlı olarak sorgular. Aynı alan adının{' '}
          <Link href={yol(alan)} className="font-bold text-brandtext hover:text-brand-500">
            tüm kayıt tiplerini tek sayfada
          </Link>{' '}
          da görebilirsiniz.
        </p>
      )}
    </section>
  );
}

function GenelAnlatim({ alan }) {
  return (
    <section className="mx-auto max-w-4xl px-5 lg:px-8 py-14 lg:py-16">
      <h2 className="text-2xl font-extrabold tracking-tight text-strong">DNS yayılımı ne demek?</h2>
      <p className="mt-4 text-[16px] leading-relaxed text-body">
        Bir alan adını yeni sunucuya yönlendirdiğinizde, MX kaydını değiştirdiğinizde ya da doğrulama için TXT kaydı
        eklediğinizde bu değişikliğin dünyadaki DNS çözümleyicilerine ulaşması gerekir. Çözümleyiciler önceki yanıtı
        kaydın TTL süresi boyunca önbellekte tuttuğu için değişiklik anında görünmez; bu arada kalan süreye DNS yayılımı
        denir.
      </p>
      <p className="mt-4 text-[16px] leading-relaxed text-body">
        {alan ? `${alan} için yaptığımız sorgu` : 'Bu araç'}, aynı kaydı Cloudflare, Google, AdGuard, NextDNS ve
        Uzak Doğu dahil farklı bölgelerdeki dokuz çözümleyiciye aynı anda sorar. Dönen değerler birbirinin aynıysa
        değişiklik tamamen yayılmış demektir. Farklıysa TTL süresinin dolmasını beklemeniz gerekir; taşımadan bir gün
        önce TTL değerini düşürmek bu süreyi belirgin biçimde kısaltır.
      </p>
    </section>
  );
}

export default function DnsToolPage({ arac, alan = '', tip = '', veri = null, hata = '' }) {
  const tipBilgi = tip ? dnsTipBul(tip) : null;

  const baslik = alan
    ? tipBilgi
      ? `${alan} ${tipBilgi.tip} kayıtları`
      : `${alan} DNS kayıtları`
    : arac.baslik;

  const ozet = alan
    ? tipBilgi
      ? `${alan} alan adının ${tipBilgi.tip} kayıtlarını dokuz farklı çözümleyiciden canlı sorguluyoruz. ${tipBilgi.ozet}`
      : `${alan} alan adının A, AAAA, MX, NS, TXT, SOA ve CAA kayıtları ile yayılım durumu.`
    : arac.ozet;

  const kirinti = [{ metin: arac.kisa, yol: alan ? '/araclar/dns' : null }];
  if (alan) kirinti.push({ metin: alan, yol: tipBilgi ? yol(alan) : null });
  if (tipBilgi) kirinti.push({ metin: tipBilgi.tip });

  return (
    <SiteShell>
      <AracKabugu arac={arac} kirinti={kirinti} baslik={baslik} ozet={ozet}>
        <ToolRunner arac={arac} baslangicGirdi={alan} baslangicTip={tipBilgi ? tipBilgi.tip : 'TUM'} veri={veri} />

        {hata && (
          <p className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-[14px] font-medium text-amber-700 dark:text-amber-400">
            {hata}
          </p>
        )}
      </AracKabugu>

      {alan && (
        <section className="border-b border-line bg-surface2">
          <div className="mx-auto max-w-4xl px-5 lg:px-8 py-12">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">
              {alan} için diğer kayıt tipleri
            </h2>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href={yol(alan)}
                className={`rounded-lg px-3 py-1.5 text-[13px] font-bold transition-colors ${
                  tipBilgi ? 'bg-surface text-body hover:bg-brandsoft hover:text-brandtext' : 'bg-brand-500 text-white'
                }`}
              >
                Tümü
              </Link>
              {DNS_TIPLERI.map((t) => (
                <Link
                  key={t.tip}
                  href={yol(alan, t.tip)}
                  className={`rounded-lg px-3 py-1.5 text-[13px] font-bold transition-colors ${
                    tipBilgi?.tip === t.tip ? 'bg-brand-500 text-white' : 'bg-surface text-body hover:bg-brandsoft hover:text-brandtext'
                  }`}
                >
                  {t.tip}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {tipBilgi ? <TipAnlatimi tipBilgi={tipBilgi} alan={alan} /> : <GenelAnlatim alan={alan} />}

      {!alan && (
        <section className="border-t border-line bg-surface2">
          <div className="mx-auto max-w-7xl px-5 lg:px-8 py-14 lg:py-16">
            <h2 className="text-2xl font-extrabold tracking-tight text-strong">DNS kayıt tipleri</h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-body">
              Sorgulayabileceğiniz on kayıt tipi ve ne işe yaradıkları. Bir alan adı girdiğinizde her tip için ayrı
              sonuç sayfası açılır.
            </p>
            <TipKartlari alan={alan} />
          </div>
        </section>
      )}

      <DigerAraclar slug="dns" />
      <CtaBand />
    </SiteShell>
  );
}
