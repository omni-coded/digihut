import { useLang } from '../i18n/LanguageContext';

const display = { fontFamily: 'var(--font-display)' };
const body = { fontFamily: 'var(--font-body)' };

const SHELF_ITEMS = [
  // [x, width, height, color] per shelf
  [
    [188, 16, 26, '#F5D547'],
    [207, 14, 20, '#FFFFFF'],
    [224, 18, 30, '#8FD3B6'],
    [246, 14, 22, '#F2A65A'],
    [264, 22, 26, '#7FB2E5'],
    [290, 14, 18, '#FFFFFF'],
    [308, 18, 28, '#F5D547'],
    [330, 16, 22, '#F7B7C6'],
    [350, 18, 26, '#8FD3B6'],
    [372, 12, 18, '#FFFFFF'],
  ],
  [
    [190, 20, 22, '#7FB2E5'],
    [214, 14, 28, '#F5D547'],
    [232, 18, 20, '#FFFFFF'],
    [254, 16, 26, '#F2A65A'],
    [274, 20, 22, '#8FD3B6'],
    [298, 14, 26, '#F7B7C6'],
    [316, 22, 20, '#F5D547'],
    [342, 16, 28, '#FFFFFF'],
    [362, 20, 22, '#7FB2E5'],
  ],
];

function Card({ x, y, w, h, className, children }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={`float-card ${className}`}>
        <rect x="0" y="7" width={w} height={h} rx="14" fill="#06180F" opacity="0.4" />
        <rect x="0" y="0" width={w} height={h} rx="14" fill="#FFFFFF" />
        {children}
      </g>
    </g>
  );
}

/**
 * The hero scene: a neighbourhood shop opens its shutter and appears on
 * Google Maps, a website, WhatsApp Business and Instagram. Pure SVG — no
 * images to download, crisp on every screen, cheap on low-end phones.
 */
export default function HeroArt() {
  const { t } = useLang();
  const a = t.hero.art;
  const stripes = Array.from({ length: 9 }, (_, i) => i);

  return (
    <div className="hero-art relative mx-auto w-full max-w-[34rem] lg:max-w-none">
      <svg viewBox="0 0 560 470" role="img" aria-label={a.label} className="h-auto w-full">
        {/* backdrop */}
        <circle cx="285" cy="250" r="205" fill="#1F6041" opacity="0.55" />
        <circle cx="285" cy="250" r="232" fill="none" stroke="#1F6041" strokeWidth="1.5" strokeDasharray="3 9" opacity="0.8" />
        <ellipse cx="285" cy="440" rx="200" ry="14" fill="#0B2418" opacity="0.6" />

        {/* signal above the shop — the DigiHut symbol */}
        <g className="signal" fill="none" stroke="#F5D547" strokeWidth="5" strokeLinecap="round">
          <circle cx="285" cy="80" r="5" fill="#F5D547" stroke="none" />
          <path className="s1" d="M276.5 71.5a12 12 0 0 1 17 0" />
          <path className="s2" d="M269.4 64.4a22 22 0 0 1 31.2 0" />
          <path className="s3" d="M262.4 57.4a32 32 0 0 1 45.2 0" />
        </g>

        {/* building */}
        <rect x="150" y="150" width="270" height="282" rx="4" fill="#F8FAF6" />
        <rect x="150" y="150" width="16" height="282" fill="#E1EBE3" />
        <rect x="404" y="150" width="16" height="282" fill="#E1EBE3" />

        {/* signboard */}
        <rect x="134" y="94" width="302" height="66" rx="9" fill="#F5D547" />
        <rect x="140" y="100" width="290" height="54" rx="6" fill="none" stroke="#123D2B" strokeOpacity="0.18" strokeWidth="1.5" />
        <text
          x="285"
          y="126"
          textAnchor="middle"
          fontSize="19"
          fontWeight="800"
          fill="#123D2B"
          textLength="224"
          lengthAdjust="spacingAndGlyphs"
          style={{ ...display, fontStretch: '108%' }}
          lang="en"
        >
          {a.board}
        </text>
        <text x="285" y="148" textAnchor="middle" fontSize="14" fontWeight="600" fill="#1F6041" style={body} lang="hi">
          {a.boardSub}
        </text>

        {/* awning */}
        {stripes.map((i) => {
          const w = 290 / 9;
          const x = 140 + i * w;
          const fill = i % 2 === 0 ? '#1F6041' : '#F5D547';
          return (
            <g key={i}>
              <rect x={x} y="160" width={w + 0.5} height="34" fill={fill} />
              <path d={`M${x} 194a${w / 2} ${w / 2} 0 0 0 ${w} 0z`} fill={fill} />
            </g>
          );
        })}

        {/* shop interior */}
        <rect x="175" y="214" width="220" height="196" fill="#0D2E20" />
        {SHELF_ITEMS.map((row, r) => {
          const shelfY = r === 0 ? 268 : 318;
          return (
            <g key={r}>
              {row.map(([x, w, h, c], i) => (
                <rect key={i} x={x} y={shelfY - h} width={w} height={h} rx="2" fill={c} />
              ))}
              <rect x="182" y={shelfY} width="206" height="5" fill="#2C7A55" />
            </g>
          );
        })}
        {/* counter with UPI QR standee */}
        <rect x="175" y="352" width="220" height="58" fill="#1F6041" />
        <rect x="175" y="352" width="220" height="7" fill="#F5D547" />
        <g transform="translate(318 316)">
          <rect width="34" height="38" rx="4" fill="#FFFFFF" />
          <rect x="5" y="5" width="9" height="9" fill="#123D2B" />
          <rect x="20" y="5" width="9" height="9" fill="#123D2B" />
          <rect x="5" y="20" width="9" height="9" fill="#123D2B" />
          <rect x="20" y="20" width="4" height="4" fill="#123D2B" />
          <rect x="25" y="25" width="4" height="4" fill="#123D2B" />
          <rect x="11" y="32" width="12" height="2.5" rx="1" fill="#1F6041" />
        </g>
        <rect x="205" y="334" width="46" height="18" rx="3" fill="#E1EBE3" />
        <rect x="211" y="326" width="34" height="9" rx="2" fill="#7FB2E5" />

        {/* rolling shutter */}
        <g className="shutter">
          <rect x="175" y="214" width="220" height="196" fill="#C7D3CB" />
          {Array.from({ length: 18 }, (_, i) => (
            <rect key={i} x="175" y={222 + i * 10} width="220" height="1.6" fill="#A7B6AC" />
          ))}
          <rect x="175" y="400" width="220" height="10" fill="#97A89D" />
          <rect x="270" y="402" width="30" height="5" rx="2.5" fill="#6F8277" />
        </g>
        <rect x="171" y="208" width="228" height="8" rx="3" fill="#97A89D" />

        {/* steps */}
        <rect x="160" y="410" width="250" height="12" fill="#D9E3DB" />
        <rect x="148" y="422" width="274" height="12" fill="#C2D0C6" />

        {/* Google Maps listing */}
        <Card x={2} y={182} w={176} h={108} className="c1">
          <path d="M14 0h148a14 14 0 0 1 14 14v32H0V14A14 14 0 0 1 14 0z" fill="#E6EFE8" />
          <path d="M0 34 176 16M64 0l22 46M120 46l24-46" stroke="#FFFFFF" strokeWidth="5" />
          <path d="M120 10a9 9 0 0 1 9 9c0 7-9 15-9 15s-9-8-9-15a9 9 0 0 1 9-9z" fill="#123D2B" />
          <circle cx="120" cy="19" r="3.4" fill="#F5D547" />
          <text x="14" y="66" fontSize="13.5" fontWeight="700" fill="#17251D" style={body}>
            {a.mapsTitle}
          </text>
          <circle cx="18" cy="84" r="4" fill="#2C7A55" />
          <text x="27" y="88" fontSize="11.5" fontWeight="600" fill="#1F6041" style={body}>
            {a.mapsSub}
          </text>
          <rect x="94" y="74" width="70" height="22" rx="11" fill="#123D2B" />
          <text x="129" y="89" textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#FFFFFF" style={body}>
            {a.mapsBtn}
          </text>
        </Card>

        {/* Website preview */}
        <Card x={398} y={40} w={160} h={132} className="c2">
          <circle cx="14" cy="12" r="3" fill="#D9E3DB" />
          <circle cx="24" cy="12" r="3" fill="#D9E3DB" />
          <circle cx="34" cy="12" r="3" fill="#D9E3DB" />
          <rect x="44" y="7" width="104" height="10" rx="5" fill="#EEF3EF" />
          <rect x="8" y="24" width="144" height="54" rx="8" fill="#123D2B" />
          <text x="18" y="46" fontSize="12.5" fontWeight="700" fill="#FFFFFF" style={body}>
            {a.siteTitle}
          </text>
          <rect x="18" y="54" width="62" height="16" rx="8" fill="#F5D547" />
          <text x="49" y="65.5" textAnchor="middle" fontSize="9" fontWeight="700" fill="#123D2B" style={body}>
            {a.siteBtn}
          </text>
          <rect x="8" y="86" width="44" height="36" rx="6" fill="#FCF3C6" />
          <rect x="58" y="86" width="44" height="36" rx="6" fill="#E6EFE8" />
          <rect x="108" y="86" width="44" height="36" rx="6" fill="#FCF3C6" />
          <circle cx="30" cy="102" r="8" fill="#F2A65A" />
          <rect x="72" y="94" width="16" height="20" rx="2" fill="#2C7A55" />
          <rect x="122" y="96" width="16" height="16" rx="8" fill="#7FB2E5" />
        </Card>

        {/* WhatsApp Business order */}
        <Card x={4} y={328} w={196} h={96} className="c3">
          <circle cx="22" cy="22" r="11" fill="#1F6041" />
          <path d="M17 26.5l1-3.4a6 6 0 1 1 2.4 2.3z" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinejoin="round" />
          <text x="40" y="26.5" fontSize="12" fontWeight="700" fill="#17251D" style={body}>
            {a.waTitle}
          </text>
          <rect x="12" y="40" width="172" height="26" rx="8" fill="#DDF5D2" />
          <text x="22" y="57.5" fontSize="11" fontWeight="500" fill="#17251D" style={body}>
            {a.waMsg}
          </text>
          <path d="M14 82l3 3 6-6M20 85l1 0 6-6" fill="none" stroke="#2C7A55" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <text x="32" y="86" fontSize="11" fontWeight="600" fill="#1F6041" style={body}>
            {a.waStatus}
          </text>
        </Card>

        {/* Instagram post */}
        <Card x={404} y={258} w={150} h={176} className="c4">
          <circle cx="20" cy="18" r="9" fill="#F5D547" stroke="#123D2B" strokeWidth="2" />
          <rect x="36" y="13" width="64" height="9" rx="4.5" fill="#E6EFE8" />
          <rect x="10" y="34" width="130" height="100" rx="8" fill="#123D2B" />
          <circle cx="124" cy="48" r="8" fill="#1F6041" />
          <circle cx="26" cy="120" r="5" fill="#1F6041" />
          <path d="M64 108c0-9 7-15 11-21 4 6 11 12 11 21z" fill="#F5D547" />
          <ellipse cx="75" cy="112" rx="18" ry="6" fill="#F2A65A" />
          <text x="75" y="66" textAnchor="middle" fontSize="15" fontWeight="800" fill="#F5D547" style={display}>
            {a.instaTitle}
          </text>
          <path d="M22 147.5c-3.5-3-7-5.8-7-9a3.8 3.8 0 0 1 7-2 3.8 3.8 0 0 1 7 2c0 3.2-3.5 6-7 9z" fill="#E5484D" />
          <path d="M38 137h11a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-7l-4 3z" fill="none" stroke="#17251D" strokeWidth="1.6" strokeLinejoin="round" />
          <text x="62" y="146" fontSize="11" fontWeight="600" fill="#5F6C64" style={body}>
            {a.instaSub}
          </text>
        </Card>
      </svg>
    </div>
  );
}
