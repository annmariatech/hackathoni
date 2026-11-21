import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface WaterwayHeroProps {
  onOpenMap: () => void;
}

const Hyacinth = ({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`} stroke="#24483d" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M0 14 Q-3 1 -13 -4 M0 14 Q2 0 13 -6 M0 14 Q-2 5 2 -10" fill="none" />
    <ellipse cx="-16" cy="-5" rx="9" ry="5" transform="rotate(25 -16 -5)" fill="#85a76a" />
    <ellipse cx="15" cy="-7" rx="9" ry="5" transform="rotate(-25 15 -7)" fill="#9db67b" />
    <ellipse cx="3" cy="-13" rx="8" ry="5" transform="rotate(-75 3 -13)" fill="#73955f" />
    <path d="M-21 -6l8 2M10 -8l9 2M2 -19l2 11" fill="none" stroke="#41634d" strokeWidth="1" />
    <path d="M-2 -12 Q-7 -23 -1 -28 Q5 -22 1 -12Z" fill="#b896c3" />
    <path d="M-1 -18 Q-11 -24 -11 -18 Q-7 -12 -1 -15 M0 -19 Q8 -28 11 -22 Q10 -16 1 -15" fill="#c4a1c9" />
    <circle cx="0" cy="-18" r="2" fill="#e8c66d" stroke="none" />
  </g>
);

export const WaterwayHero: React.FC<WaterwayHeroProps> = ({ onOpenMap }) => (
  <section className="mb-6 overflow-hidden rounded-[28px] border-2 border-[var(--ink)] bg-[#f3e7cf] shadow-[4px_5px_0px_var(--ink)]">
    <div className="relative grid min-h-[230px] grid-cols-1 items-center gap-2 px-5 pt-5 md:grid-cols-[0.8fr_1.2fr] md:px-8 md:py-6">
      <div className="relative z-10 max-w-xs pb-2 md:pb-0">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#486e5b]">
          Vembanad · Alappuzha
        </span>
        <h1 className="mt-2 font-display text-3xl font-black leading-tight text-[#1e332b] md:text-4xl">
          വേമ്പനാട്ടിലെ<br />പായൽ കാഴ്ച
        </h1>
        <button
          type="button"
          onClick={onOpenMap}
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-[#1e332b] bg-[#1e6b57] px-4 py-2 font-display text-sm font-bold text-[#fff8e9] shadow-[2px_3px_0px_#1e332b] transition hover:-translate-y-0.5"
        >
          ഉപഗ്രഹ ഭൂപടം <ArrowUpRight size={15} />
        </button>
      </div>

      <svg
        className="-mx-4 w-[calc(100%+2rem)] self-end md:mx-0 md:w-full"
        viewBox="0 0 820 360"
        role="img"
        aria-label="Hand-drawn Kerala country boats crossing a water hyacinth covered backwater"
      >
        <defs>
          <linearGradient id="lake-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#9fcac0" />
            <stop offset="1" stopColor="#4d9281" />
          </linearGradient>
          <pattern id="paper-speckle" width="38" height="34" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="8" r="1.1" fill="#6c614c" opacity=".14" />
            <circle cx="27" cy="22" r=".8" fill="#6c614c" opacity=".12" />
          </pattern>
        </defs>
        <path d="M0 0H820V360H0Z" fill="url(#paper-speckle)" />
        <circle cx="692" cy="64" r="30" fill="#edc96f" stroke="#6e613f" strokeWidth="2" />
        <path d="M0 152 Q124 142 236 151 T460 148 T820 151V360H0Z" fill="url(#lake-fill)" stroke="#284a3e" strokeWidth="3" />
        <path d="M0 155 Q100 148 195 155 T385 155 T590 152 T820 157" fill="none" stroke="#315b4d" strokeWidth="3" />
        <path d="M0 186 Q105 178 195 188 T390 186 T590 188 T820 182 M0 268 Q114 259 220 269 T440 266 T640 269 T820 260 M0 333 Q102 325 201 333 T415 331 T622 336 T820 328" fill="none" stroke="#d5e2c7" strokeWidth="2" opacity=".6" />
        <path d="M0 151 Q50 140 89 147 Q132 131 180 146 Q236 130 285 148 Q330 136 376 150V168H0Z" fill="#809568" stroke="#284a3e" strokeWidth="2.5" />
        <path d="M24 143q5-30 22-40m-15 20q-20-12-17-23m16 13q21-19 31-17M63 145q2-25 18-36m-12 15q-15-10-14-21m15 13q18-16 28-15" fill="none" stroke="#355c45" strokeWidth="3" strokeLinecap="round" />

        <g transform="translate(250 205) rotate(-3)" stroke="#2e4036" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
          <path d="M-84 30 Q0 48 91 27 Q68 58 2 60 Q-55 57-84 30Z" fill="#875c3e" />
          <path d="M-79 31 Q-3 45 85 29" fill="none" stroke="#d1a16a" strokeWidth="3" />
          <path d="M-29 25v-38m47 42v-47" fill="none" strokeWidth="4" />
          <path d="M-32 -16 Q-5 -31 15 -10 L-17 -2Z" fill="#e5d5b3" />
          <path d="M12 -17 Q36 -32 52 -8 L18 -3Z" fill="#f3e8d0" />
          <circle cx="-37" cy="-27" r="9" fill="#83583e" />
          <path d="M-48 -10q11-12 21 0v30h-21z" fill="#a04f37" />
          <circle cx="23" cy="-31" r="9" fill="#83583e" />
          <path d="M13 -14q11-12 21 0v31H13z" fill="#356f5c" />
          <path d="M-69 4 Q-95 -14 -102 -35 M72 2 Q100 -13 113 -34" fill="none" strokeWidth="3.5" />
          <path d="M-110 -40l17 7m190-6-16 8" fill="none" stroke="#c5a86d" strokeWidth="4" />
        </g>

        <g transform="translate(594 264) scale(.72) rotate(3)" stroke="#2e4036" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
          <path d="M-74 24 Q0 42 81 22 Q59 51 1 54 Q-49 51-74 24Z" fill="#875c3e" />
          <path d="M-69 25 Q0 39 75 24" fill="none" stroke="#d1a16a" strokeWidth="3" />
          <path d="M-10 20v-36" fill="none" strokeWidth="4" />
          <path d="M-13 -14 Q12 -29 28 -9 L-7 -1Z" fill="#e7d8b9" />
          <circle cx="-32" cy="-17" r="9" fill="#83583e" />
          <path d="M-42 0q10-12 20 0v27h-20z" fill="#b95236" />
          <path d="M-62 7 Q-83 -8 -94 -31 M61 7 Q84 -4 98 -26" fill="none" strokeWidth="3.5" />
        </g>

        <Hyacinth x={90} y={231} scale={1.05} />
        <Hyacinth x={166} y={302} scale={.8} />
        <Hyacinth x={354} y={250} scale={.9} />
        <Hyacinth x={438} y={321} scale={1.1} />
        <Hyacinth x={514} y={210} scale={.75} />
        <Hyacinth x={710} y={307} scale={1.15} />
        <Hyacinth x={762} y={225} scale={.72} />
        <g fill="none" stroke="#29493e" strokeWidth="2" opacity=".8">
          <path d="M108 274q24-9 47 1m-8 36q24-7 42 3m281-8q23-10 42-1m210-28q23-9 43 1" />
          <path d="M52 322q19-8 37 1m155-17q16-8 33 0m373 49q22-8 42 1" />
        </g>
      </svg>
    </div>
  </section>
);
