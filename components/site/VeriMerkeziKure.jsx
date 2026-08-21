'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DoubleSide,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  RingGeometry,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';
import { KARA_MASKESI, MASKE_GENISLIK, MASKE_YUKSEKLIK } from '@/content/site/dunya-maskesi';

const PALET = {
  acik: { kure: 0xdfe7ee, kara: 0x0f766e, ag: 0xb2c0cd, hale: 0x14b8a6, isaret: 0xe11d48, halka: 0xe11d48 },
  koyu: { kure: 0x0b1420, kara: 0x2dd4bf, ag: 0x1f3547, hale: 0x14b8a6, isaret: 0xfb7185, halka: 0xfb7185 },
};

const UCUS_SURESI = 1500;

const konumdanVektor = (enlem, boylam, yaricap) => {
  const phi = ((90 - enlem) * Math.PI) / 180;
  const theta = ((boylam + 180) * Math.PI) / 180;
  return new Vector3(
    -yaricap * Math.sin(phi) * Math.cos(theta),
    yaricap * Math.cos(phi),
    yaricap * Math.sin(phi) * Math.sin(theta),
  );
};

function maskeyiCoz() {
  try {
    const ham = atob(KARA_MASKESI);
    const bayt = new Uint8Array(ham.length);
    for (let i = 0; i < ham.length; i++) bayt[i] = ham.charCodeAt(i);
    return bayt;
  } catch {
    return null;
  }
}

function karaNoktalari(bayt, yaricap) {
  const karaMi = (enlem, boylam) => {
    const i =
      ((Math.floor(((boylam + 180) / 360) * MASKE_GENISLIK) % MASKE_GENISLIK) + MASKE_GENISLIK) % MASKE_GENISLIK;
    const j = Math.min(MASKE_YUKSEKLIK - 1, Math.max(0, Math.floor(((90 - enlem) / 180) * MASKE_YUKSEKLIK)));
    const n = j * MASKE_GENISLIK + i;
    return (bayt[n >> 3] & (1 << (n & 7))) !== 0;
  };

  const konumlar = [];
  for (let enlem = -84; enlem <= 84; enlem += 1.8) {
    const cevre = Math.cos((enlem * Math.PI) / 180);
    const adim = 1.8 / Math.max(cevre, 0.08);
    for (let boylam = -180; boylam < 180; boylam += adim) {
      if (!karaMi(enlem, boylam)) continue;
      const v = konumdanVektor(enlem, boylam, yaricap);
      konumlar.push(v.x, v.y, v.z);
    }
  }

  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(new Float32Array(konumlar), 3));
  return g;
}

function noktaDokusu() {
  const boyut = 64;
  const kanvas = document.createElement('canvas');
  kanvas.width = boyut;
  kanvas.height = boyut;
  const ctx = kanvas.getContext('2d');
  ctx.beginPath();
  ctx.arc(boyut / 2, boyut / 2, boyut / 2 - 2, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  return new CanvasTexture(kanvas);
}

function agGeometrisi(yaricap) {
  const noktalar = [];
  const ekle = (a, b) => noktalar.push(a.x, a.y, a.z, b.x, b.y, b.z);
  for (let enlem = -60; enlem <= 60; enlem += 30) {
    for (let boylam = -180; boylam < 180; boylam += 5) {
      ekle(konumdanVektor(enlem, boylam, yaricap), konumdanVektor(enlem, boylam + 5, yaricap));
    }
  }
  for (let boylam = -180; boylam < 180; boylam += 30) {
    for (let enlem = -90; enlem < 90; enlem += 5) {
      ekle(konumdanVektor(enlem, boylam, yaricap), konumdanVektor(enlem + 5, boylam, yaricap));
    }
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(new Float32Array(noktalar), 3));
  return g;
}

const yumusat = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const azaltilmisHareket = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function VeriMerkeziKure({ enlem, boylam, etiket, onDurum, onHazir }) {
  const kapRef = useRef(null);
  const etiketRef = useRef(null);
  const tetikRef = useRef(null);
  const [destekYok, setDestekYok] = useState(false);

  const tetikle = useCallback(() => {
    tetikRef.current?.();
  }, []);

  useEffect(() => {
    const kap = kapRef.current;
    if (!kap) return undefined;

    let renderer;
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
      if (!renderer.getContext()) throw new Error('baglam yok');
    } catch {
      setDestekYok(true);
      return undefined;
    }

    const sahne = new Scene();
    const kamera = new PerspectiveCamera(38, 1, 0.1, 100);
    const baslangicKonum = new Vector3(0, 0, 3.3);
    kamera.position.copy(baslangicKonum);

    const egim = new Group();
    egim.rotation.x = 0.314;
    sahne.add(egim);

    const grup = new Group();
    egim.add(grup);

    const kureGeo = new SphereGeometry(1, 64, 48);
    const kureMat = new MeshBasicMaterial({ transparent: true, opacity: 0.97 });
    grup.add(new Mesh(kureGeo, kureMat));

    const agGeo = agGeometrisi(1.002);
    const agMat = new LineBasicMaterial({ transparent: true, opacity: 0.4 });
    grup.add(new LineSegments(agGeo, agMat));

    const bayt = maskeyiCoz();
    const karaGeo = bayt ? karaNoktalari(bayt, 1.006) : null;
    const doku = karaGeo ? noktaDokusu() : null;
    const karaMat = karaGeo
      ? new PointsMaterial({ size: 0.021, map: doku, transparent: true, alphaTest: 0.35, sizeAttenuation: true })
      : null;
    if (karaGeo) grup.add(new Points(karaGeo, karaMat));

    const haleGeo = new SphereGeometry(1.17, 48, 32);
    const haleMat = new MeshBasicMaterial({
      side: BackSide,
      transparent: true,
      opacity: 0.14,
      blending: AdditiveBlending,
    });
    sahne.add(new Mesh(haleGeo, haleMat));

    const konum = konumdanVektor(enlem, boylam, 1.015);
    const isaretGeo = new SphereGeometry(0.026, 16, 12);
    const isaretMat = new MeshBasicMaterial();
    const isaret = new Mesh(isaretGeo, isaretMat);
    isaret.position.copy(konum);
    grup.add(isaret);

    const halkaGeo = new RingGeometry(0.048, 0.058, 40);
    const halkaMat = new MeshBasicMaterial({ side: DoubleSide, transparent: true, opacity: 0.9 });
    const halka = new Mesh(halkaGeo, halkaMat);
    halka.position.copy(konum);
    halka.lookAt(konum.clone().multiplyScalar(2));
    grup.add(halka);

    const temelAci = -Math.atan2(konum.x, konum.z);
    let surukleFarki = 0;
    grup.rotation.y = temelAci;

    const renkleriUygula = () => {
      const p = document.documentElement.classList.contains('dark') ? PALET.koyu : PALET.acik;
      kureMat.color = new Color(p.kure);
      agMat.color = new Color(p.ag);
      haleMat.color = new Color(p.hale);
      isaretMat.color = new Color(p.isaret);
      halkaMat.color = new Color(p.halka);
      if (karaMat) karaMat.color = new Color(p.kara);
    };
    renkleriUygula();

    const temaIzleyici = new MutationObserver(renkleriUygula);
    temaIzleyici.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    kap.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = 'pan-y';
    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.setAttribute('role', 'img');
    renderer.domElement.setAttribute('aria-label', etiket + ' veri merkezi konumu');

    const olcekle = () => {
      const genislik = kap.clientWidth;
      const yukseklik = kap.clientHeight || genislik;
      if (!genislik || !yukseklik) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(genislik, yukseklik, false);
      kamera.aspect = genislik / yukseklik;
      kamera.updateProjectionMatrix();
    };
    olcekle();

    const boyutIzleyici = new ResizeObserver(olcekle);
    boyutIzleyici.observe(kap);

    let suruklu = false;
    let suruklendi = false;
    let sonX = 0;
    const durgun = azaltilmisHareket();

    let asama = 'kure';
    let ucusBaslangici = 0;
    let ucusYonu = 1;
    let donmusAci = temelAci;
    const ucusHedefi = new Vector3();
    const kontrolNoktasi = new Vector3();
    const bakisHedefi = new Vector3();
    const gecici = new Vector3();

    const ucusuBaslat = (yon) => {
      if (asama === 'ucus') return;
      ucusYonu = yon;
      asama = 'ucus';
      ucusBaslangici = 0;
      donmusAci = grup.rotation.y;
      isaret.getWorldPosition(ucusHedefi);
      kontrolNoktasi.copy(ucusHedefi).normalize().multiplyScalar(3).add(new Vector3(0, 0.9, 0));
      if (onDurum) onDurum(yon === 1 ? 'ucuyor' : 'donuyor');
    };

    tetikRef.current = () => ucusuBaslat(asama === 'yakin' ? -1 : 1);
    if (onHazir) onHazir({ geriDon: () => ucusuBaslat(-1), yaklas: () => ucusuBaslat(1) });

    const basti = (e) => {
      if (asama !== 'kure') return;
      suruklu = true;
      suruklendi = false;
      sonX = e.clientX;
      renderer.domElement.style.cursor = 'grabbing';
      renderer.domElement.setPointerCapture?.(e.pointerId);
    };
    const hareket = (e) => {
      if (!suruklu) return;
      const fark = e.clientX - sonX;
      if (Math.abs(fark) > 2) suruklendi = true;
      surukleFarki += fark * 0.006;
      sonX = e.clientX;
    };
    const birakti = (e) => {
      const oncekiSuruklu = suruklu;
      suruklu = false;
      renderer.domElement.style.cursor = 'grab';
      renderer.domElement.releasePointerCapture?.(e.pointerId);
      if (oncekiSuruklu && !suruklendi && asama !== 'ucus') ucusuBaslat(asama === 'yakin' ? -1 : 1);
    };

    renderer.domElement.addEventListener('pointerdown', basti);
    renderer.domElement.addEventListener('pointermove', hareket);
    renderer.domElement.addEventListener('pointerup', birakti);
    renderer.domElement.addEventListener('pointercancel', birakti);

    let gorunur = true;
    const gorunurlukIzleyici = new IntersectionObserver((girdiler) => {
      gorunur = girdiler[0].isIntersecting;
    });
    gorunurlukIzleyici.observe(kap);

    const dunyaKonumu = new Vector3();
    const ekseneBak = new Vector3(0, 0, 1);
    let cerceve = 0;

    const dongu = (zaman) => {
      cerceve = requestAnimationFrame(dongu);
      if (!gorunur || document.hidden) return;

      if (asama === 'kure') {
        grup.rotation.y = durgun
          ? temelAci + surukleFarki
          : temelAci + surukleFarki + Math.sin(zaman / 5200) * 0.34;
        kamera.position.copy(baslangicKonum);
        kamera.lookAt(0, 0, 0);
        if (kamera.fov !== 38) {
          kamera.fov = 38;
          kamera.updateProjectionMatrix();
        }
      } else if (asama === 'ucus') {
        if (!ucusBaslangici) ucusBaslangici = zaman;
        const ham = durgun ? 1 : Math.min((zaman - ucusBaslangici) / UCUS_SURESI, 1);
        const t = ucusYonu === 1 ? yumusat(ham) : yumusat(1 - ham);
        grup.rotation.y = donmusAci;

        const bitis = gecici.copy(ucusHedefi).normalize().multiplyScalar(1.45);
        const ters = 1 - t;
        kamera.position.set(
          ters * ters * baslangicKonum.x + 2 * ters * t * kontrolNoktasi.x + t * t * bitis.x,
          ters * ters * baslangicKonum.y + 2 * ters * t * kontrolNoktasi.y + t * t * bitis.y,
          ters * ters * baslangicKonum.z + 2 * ters * t * kontrolNoktasi.z + t * t * bitis.z,
        );
        bakisHedefi.set(0, 0, 0).lerp(ucusHedefi, t);
        kamera.lookAt(bakisHedefi);
        kamera.fov = 38 - 10 * t;
        kamera.updateProjectionMatrix();

        if (ham >= 1) {
          asama = ucusYonu === 1 ? 'yakin' : 'kure';
          if (asama === 'kure') surukleFarki = donmusAci - temelAci;
          if (onDurum) onDurum(asama);
        }
      }

      if (!durgun) {
        const evre = (zaman % 2600) / 2600;
        const olcek = 1 + evre * 2.4;
        halka.scale.set(olcek, olcek, olcek);
        halkaMat.opacity = 0.85 * (1 - evre);
      }

      const et = etiketRef.current;
      if (et) {
        if (asama === 'kure') {
          isaret.getWorldPosition(dunyaKonumu);
          const onde = dunyaKonumu.clone().normalize().dot(ekseneBak) > 0.12;
          const yansima = dunyaKonumu.clone().project(kamera);
          et.style.transform =
            'translate3d(' + ((yansima.x + 1) / 2) * kap.clientWidth + 'px, ' +
            ((1 - yansima.y) / 2) * kap.clientHeight + 'px, 0)';
          et.style.opacity = onde ? '1' : '0';
          et.style.pointerEvents = onde ? 'auto' : 'none';
        } else {
          et.style.opacity = '0';
          et.style.pointerEvents = 'none';
        }
      }

      renderer.render(sahne, kamera);
    };
    cerceve = requestAnimationFrame(dongu);

    return () => {
      cancelAnimationFrame(cerceve);
      tetikRef.current = null;
      if (onHazir) onHazir(null);
      temaIzleyici.disconnect();
      boyutIzleyici.disconnect();
      gorunurlukIzleyici.disconnect();
      renderer.domElement.removeEventListener('pointerdown', basti);
      renderer.domElement.removeEventListener('pointermove', hareket);
      renderer.domElement.removeEventListener('pointerup', birakti);
      renderer.domElement.removeEventListener('pointercancel', birakti);
      [kureGeo, agGeo, haleGeo, isaretGeo, halkaGeo, karaGeo].forEach((g) => g?.dispose());
      [kureMat, agMat, haleMat, isaretMat, halkaMat, karaMat].forEach((m) => m?.dispose());
      doku?.dispose();
      if (renderer.domElement.parentNode === kap) kap.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [enlem, boylam, etiket, onDurum, onHazir]);

  if (destekYok) {
    return (
      <div className="grid h-full place-items-center rounded-3xl border border-line bg-surface2 px-6 text-center">
        <p className="text-[14px] leading-relaxed text-body">
          Tarayıcınız 3B görüntülemeyi desteklemiyor. Veri merkezimiz {etiket} konumundadır.
        </p>
      </div>
    );
  }

  return (
    <div ref={kapRef} className="relative h-full w-full select-none">
      <button
        ref={etiketRef}
        type="button"
        onClick={tetikle}
        className="absolute left-0 top-0 z-10 -translate-y-1/2 whitespace-nowrap rounded-lg bg-ink/90 px-2.5 py-1 text-[12px] font-bold text-white opacity-0 shadow-lg transition-opacity duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
      >
        {etiket}
      </button>
    </div>
  );
}
