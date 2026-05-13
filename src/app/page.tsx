import type { CSSProperties } from "react";

export default function HomePage() {
  const mapSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675">
      <defs>
        <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#7f90a3" stroke-opacity="0.22" stroke-width="1"/>
        </pattern>
        <pattern id="fine" width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M 12 0 L 0 0 0 12" fill="none" stroke="#7f90a3" stroke-opacity="0.11" stroke-width="1"/>
        </pattern>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6"/>
        </filter>
      </defs>

      <rect width="1200" height="675" fill="url(#fine)"/>
      <rect width="1200" height="675" fill="url(#grid)"/>

      <g stroke="#566a7f" stroke-opacity="0.58" stroke-width="2" fill="none" filter="url(#soft)">
        <path d="M 70 150 L 260 120 L 420 160 L 610 90 L 790 140 L 1000 110 L 1130 160"/>
        <path d="M 140 520 L 290 430 L 480 470 L 650 390 L 830 440 L 1030 380"/>
        <path d="M 90 310 L 230 250 L 380 290 L 540 230 L 700 270 L 880 220 L 1110 260"/>
        <path d="M 320 610 L 420 520 L 560 540 L 690 480 L 820 520 L 960 470"/>
      </g>

      <g stroke="#566a7f" stroke-opacity="0.34" stroke-width="1.5" fill="none">
        <path d="M 60 80 L 220 60 L 310 95 L 420 70 L 560 105 L 740 80 L 900 115 L 1140 85"/>
        <path d="M 70 600 L 210 540 L 340 585 L 510 520 L 690 585 L 880 545 L 1120 590"/>
      </g>

      <g fill="#b8743a" stroke="#b8743a" stroke-width="2">
        <circle cx="260" cy="120" r="6"/>
        <circle cx="420" cy="160" r="6"/>
        <circle cx="610" cy="90" r="6"/>
        <circle cx="790" cy="140" r="6"/>
        <circle cx="1000" cy="110" r="6"/>
        <circle cx="290" cy="430" r="6"/>
        <circle cx="480" cy="470" r="6"/>
        <circle cx="650" cy="390" r="6"/>
        <circle cx="830" cy="440" r="6"/>
        <circle cx="1030" cy="380" r="6"/>
        <circle cx="230" cy="250" r="6"/>
        <circle cx="540" cy="230" r="6"/>
        <circle cx="880" cy="220" r="6"/>
        <circle cx="1110" cy="260" r="6"/>
      </g>
    </svg>
  `.trim();

  const mapBgStyle: CSSProperties = {
    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(mapSvg)}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#eef2f6] text-slate-900">
      <div className="absolute inset-0" style={mapBgStyle} />
      <div className="absolute inset-0 bg-white/55" />

      <div className="relative mx-auto flex min-h-dvh max-w-6xl items-center justify-center px-6 py-16">
        <section className="w-full text-center">
          <div className="mx-auto inline-block rounded-none border-2 border-[#2a3f57]/40 bg-white px-10 py-8 shadow-[0_22px_60px_rgba(15,23,42,0.18)]">
            <div className="text-5xl font-extrabold tracking-tight text-[#1f3550] sm:text-7xl">
              RECIFREELA
            </div>
            <div className="mt-2 text-lg text-[#1f3550]/85 sm:text-2xl">
              O Motor de Talentos Digitais de Recife
            </div>
          </div>

          <p className="mx-auto mt-12 max-w-4xl text-base leading-relaxed text-[#1f3550]/75 sm:text-lg">
            Conectando a alta demanda do ecossistema do Porto Digital aos
            melhores freelancers da região com zero atrito.
          </p>
        </section>
      </div>
    </main>
  );
}
