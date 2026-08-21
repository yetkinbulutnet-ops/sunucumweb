'use client';
import { useEffect, useRef, useState } from 'react';
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  RingGeometry,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';

const PALET = {
  acik: { kure: 0xe8eef3, ag: 0x94a3b8, hale: 0x14b8a6, isaret: 0x0d9488, halka: 0x14b8a6 },
  koyu: { kure: 0x0d1622, ag: 0x2f4a5c, hale: 0x14b8a6, isaret: 0x2dd4bf, halka: 0x2dd4bf },
};

const konumdanVektor = (enlem, boylam, yaricap) => {
  const phi = ((90 - enlem) * Math.PI) / 180;
  const theta = ((boylam + 180) * Math.PI) / 180;
  return new Vector3(
    -yaricap * Math.sin(phi) * Math.cos(theta),
    yaricap * Math.cos(phi),
    yaricap * Math.sin(phi) * Math.sin(theta),
  );
};

function agGeometrisi() {
  const noktalar = [];
  const ekle = (a, b) => noktalar.push(a.x, a.y, a.z, b.x, b.y, b.z);

  for (let enlem = -75; enlem <= 75; enlem += 15) {
    for (let boylam = -180; boylam < 180; boylam += 5) {
      ekle(konumdanVektor(enlem, boylam, 1.001), konumdanVektor(enlem, boylam + 5, 1.001));
    }
  }
  for (let boylam = -180; boylam < 180; boylam += 15) {
    for (let enlem = -90; enlem < 90; enlem += 5) {
      ekle(konumdanVektor(enlem, boylam, 1.001), konumdanVektor(enlem + 5, boylam, 1.001));
    }
  }

  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(new Float32Array(noktalar), 3));
  return g;
}

const azaltilmisHareket = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function VeriMerkeziKure({ enlem, boylam, etiket }) {
  const kapRef = useRef(null);
  const etiketRef = useRef(null);
  const [destekYok, setDestekYok] = useState(false);

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
    kamera.position.set(0, 0, 3.3);

    const egim = new Group();
    egim.rotation.x = 0.314;
    sahne.add(egim);

    const grup = new Group();
    egim.add(grup);

    const kureGeo = new SphereGeometry(1, 64, 48);
    const kureMat = new MeshBasicMaterial({ transparent: true, opacity: 0.95 });
    grup.add(new Mesh(kureGeo, kureMat));

    const agGeo = agGeometrisi();
    const agMat = new LineBasicMaterial({ transparent: true, opacity: 0.55 });
    grup.add(new LineSegments(agGeo, agMat));

    const haleGeo = new SphereGeometry(1.16, 48, 32);
    const haleMat = new MeshBasicMaterial({
      side: BackSide,
      transparent: true,
      opacity: 0.13,
      blending: AdditiveBlending,
    });
    sahne.add(new Mesh(haleGeo, haleMat));

    const konum = konumdanVektor(enlem, boylam, 1.02);
    const isaretGeo = new SphereGeometry(0.028, 16, 12);
    const isaretMat = new MeshBasicMaterial();
    const isaret = new Mesh(isaretGeo, isaretMat);
    isaret.position.copy(konum);
    grup.add(isaret);

    const halkaGeo = new RingGeometry(0.05, 0.062, 40);
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
    let sonX = 0;
    const durgun = azaltilmisHareket();

    const basti = (e) => {
      suruklu = true;
      sonX = e.clientX;
      renderer.domElement.style.cursor = 'grabbing';
      renderer.domElement.setPointerCapture?.(e.pointerId);
    };
    const hareket = (e) => {
      if (!suruklu) return;
      surukleFarki += (e.clientX - sonX) * 0.006;
      sonX = e.clientX;
    };
    const birakti = (e) => {
      suruklu = false;
      renderer.domElement.style.cursor = 'grab';
      renderer.domElement.releasePointerCapture?.(e.pointerId);
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

      grup.rotation.y = durgun ? temelAci + surukleFarki : temelAci + surukleFarki + Math.sin(zaman / 5200) * 0.34;

      if (!durgun) {
        const evre = (zaman % 2600) / 2600;
        const olcek = 1 + evre * 2.4;
        halka.scale.set(olcek, olcek, olcek);
        halkaMat.opacity = 0.85 * (1 - evre);
      }

      isaret.getWorldPosition(dunyaKonumu);
      const onde = dunyaKonumu.clone().normalize().dot(ekseneBak) > 0.12;
      const yansima = dunyaKonumu.clone().project(kamera);
      const et = etiketRef.current;
      if (et) {
        const g = kap.clientWidth;
        const y = kap.clientHeight;
        et.style.transform =
          'translate3d(' + ((yansima.x + 1) / 2) * g + 'px, ' + ((1 - yansima.y) / 2) * y + 'px, 0)';
        et.style.opacity = onde ? '1' : '0';
      }

      renderer.render(sahne, kamera);
    };
    cerceve = requestAnimationFrame(dongu);

    return () => {
      cancelAnimationFrame(cerceve);
      temaIzleyici.disconnect();
      boyutIzleyici.disconnect();
      gorunurlukIzleyici.disconnect();
      renderer.domElement.removeEventListener('pointerdown', basti);
      renderer.domElement.removeEventListener('pointermove', hareket);
      renderer.domElement.removeEventListener('pointerup', birakti);
      renderer.domElement.removeEventListener('pointercancel', birakti);
      [kureGeo, agGeo, haleGeo, isaretGeo, halkaGeo].forEach((g) => g.dispose());
      [kureMat, agMat, haleMat, isaretMat, halkaMat].forEach((m) => m.dispose());
      if (renderer.domElement.parentNode === kap) kap.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [enlem, boylam, etiket]);

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
      <span
        ref={etiketRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 -translate-y-1/2 whitespace-nowrap rounded-lg bg-ink/85 px-2.5 py-1 text-[12px] font-bold text-white opacity-0 shadow-lg transition-opacity duration-300"
      >
        {etiket}
      </span>
    </div>
  );
}
