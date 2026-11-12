// Detailed mock-ups for the demo portfolio, drawn in SVG so they stay sharp and
// add nothing to download. To use a real photo or design instead, set
// `image: '/portfolio/your-file.jpg'` on the project in src/content/data.js.

const TONES = {
  saffron: { bg: '#FCE8CF', accent: '#C9611A', dark: '#5A2E0C', soft: '#FFF6EA' },
  gold: { bg: '#F5ECD3', accent: '#9A6F17', dark: '#3D2E0F', soft: '#FFFAEC' },
  rose: { bg: '#F9E1E6', accent: '#B83E6F', dark: '#4A1830', soft: '#FFF3F6' },
  blue: { bg: '#E0EAF7', accent: '#2C67AD', dark: '#12305A', soft: '#F3F7FD' },
  leaf: { bg: '#E3EEE6', accent: '#1F6041', dark: '#123D2B', soft: '#F6FAF7' },
};
const INK = '#17251D';
const MUTED = '#5F6C64';
const display = { fontFamily: 'var(--font-display)' };
const body = { fontFamily: 'var(--font-body)' };

const initials = (name) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

function T({ x, y, size = 8, weight = 500, fill = INK, anchor, font = body, spacing, children }) {
  return (
    <text x={x} y={y} fontSize={size} fontWeight={weight} fill={fill} textAnchor={anchor} letterSpacing={spacing} style={font}>
      {children}
    </text>
  );
}

const Shadow = ({ x, y, w, h, rx = 10 }) => <rect x={x + 1} y={y + 5} width={w} height={h} rx={rx} fill="#000" opacity="0.1" />;

/* ---------------- Website on desktop + phone ---------------- */
function Web({ c, d, name }) {
  return (
    <>
      <Shadow x={18} y={16} w={274} h={248} />
      <rect x="18" y="16" width="274" height="248" rx="10" fill="#fff" />
      <path d="M18 26a10 10 0 0 1 10-10h254a10 10 0 0 1 10 10v12H18z" fill={c.soft} />
      <circle cx="30" cy="27" r="3" fill="#E9A39B" />
      <circle cx="40" cy="27" r="3" fill="#EBCB7A" />
      <circle cx="50" cy="27" r="3" fill="#9CCB9A" />
      <rect x="62" y="21" width="150" height="12" rx="6" fill="#fff" />
      <T x={70} y={30} size={7} fill={MUTED}>
        {d.url}
      </T>

      <T x={30} y={54} size={11} weight={800} fill={c.dark} font={display}>
        {name}
      </T>
      {d.nav.map((n, i) => (
        <T key={n} x={280 - (d.nav.length - 1 - i) * 36} y={54} size={7} fill={MUTED} anchor="end">
          {n}
        </T>
      ))}

      <rect x="30" y="62" width="250" height="88" rx="8" fill={c.dark} />
      <circle cx="238" cy="106" r="34" fill={c.accent} />
      <circle cx="238" cy="106" r="23" fill={c.soft} />
      <circle cx="238" cy="106" r="13" fill={c.bg} />
      <T x={42} y={88} size={16} weight={800} fill="#fff" font={display}>
        {d.h1[0]}
      </T>
      <T x={42} y={107} size={16} weight={800} fill="#F5D547" font={display}>
        {d.h1[1]}
      </T>
      <T x={42} y={121} size={7.5} fill="#fff">
        {d.sub}
      </T>
      <rect x="42" y="128" width="84" height="15" rx="7.5" fill="#F5D547" />
      <T x={84} y={138.5} size={7.5} weight={700} fill={c.dark} anchor="middle">
        {d.cta}
      </T>

      <T x={30} y={166} size={9} weight={700} fill={c.dark}>
        {d.listTitle}
      </T>
      {d.items.map(([title, meta], i) => {
        const x = 30 + i * 86;
        return (
          <g key={title}>
            <rect x={x} y="173" width="78" height="80" rx="7" fill="#fff" stroke={c.bg} />
            <rect x={x + 5} y="178" width="68" height="36" rx="5" fill={i === 1 ? c.accent : c.bg} opacity={i === 1 ? 0.85 : 1} />
            <circle cx={x + 39} cy="196" r="11" fill={i === 1 ? c.soft : c.accent} opacity="0.9" />
            <T x={x + 6} y={228} size={7.5} weight={700}>
              {title}
            </T>
            <T x={x + 6} y={242} size={8} weight={700} fill={c.accent}>
              {meta}
            </T>
          </g>
        );
      })}

      {/* phone */}
      <Shadow x={296} y={60} w={92} h={206} rx={15} />
      <rect x="296" y="60" width="92" height="206" rx="15" fill={INK} />
      <rect x="300" y="64" width="84" height="198" rx="12" fill="#fff" />
      <path d="M300 76a12 12 0 0 1 12-12h60a12 12 0 0 1 12 12v24h-84z" fill={c.dark} />
      <T x={342} y={84} size={8} weight={800} fill="#fff" anchor="middle" font={display}>
        {name}
      </T>
      <T x={342} y={94} size={5.5} fill="#F5D547" anchor="middle">
        {d.sub}
      </T>
      {d.items.map(([title, meta], i) => (
        <g key={title} transform={`translate(306 ${108 + i * 36})`}>
          <rect width="72" height="30" rx="6" fill={c.soft} />
          <rect x="4" y="4" width="22" height="22" rx="4" fill={i === 1 ? c.accent : c.bg} />
          <T x={31} y={13} size={6.2} weight={700}>
            {title}
          </T>
          <T x={31} y={23} size={6.5} weight={700} fill={c.accent}>
            {meta}
          </T>
        </g>
      ))}
      <rect x="306" y="232" width="72" height="20" rx="10" fill="#1F6041" />
      <T x={342} y={245} size={6.2} weight={700} fill="#fff" anchor="middle">
        {d.phoneCta}
      </T>
    </>
  );
}

/* ---------------- Logo + visiting cards ---------------- */
function Brand({ c, d, name }) {
  const mono = initials(name);
  return (
    <>
      <circle cx="96" cy="96" r="58" fill="#fff" />
      <circle cx="96" cy="96" r="49" fill="none" stroke={c.accent} strokeWidth="2.5" />
      <circle cx="96" cy="96" r="44" fill="none" stroke={c.accent} strokeWidth="0.8" />
      <T x={96} y={111} size={40} weight={800} fill={c.dark} anchor="middle" font={display}>
        {mono}
      </T>
      <T x={96} y={182} size={15} weight={800} fill={c.dark} anchor="middle" font={display}>
        {name}
      </T>
      <T x={96} y={197} size={7} weight={700} fill={c.accent} anchor="middle" spacing="1.6">
        {d.tag}
      </T>
      {[c.dark, c.accent, '#F5D547', c.soft].map((fill, i) => (
        <circle key={fill} cx={63 + i * 22} cy="228" r="8.5" fill={fill} stroke="#fff" strokeWidth="2" />
      ))}

      {/* card front */}
      <g transform="rotate(-5 284 96)">
        <Shadow x={196} y={42} w={184} h={106} rx={8} />
        <rect x="196" y="42" width="184" height="106" rx="8" fill="#fff" />
        <rect x="196" y="42" width="7" height="106" fill={c.accent} />
        <circle cx="226" cy="70" r="13" fill="none" stroke={c.accent} strokeWidth="1.6" />
        <T x={226} y={74.5} size={11} weight={800} fill={c.dark} anchor="middle" font={display}>
          {mono}
        </T>
        <T x={246} y={68} size={11.5} weight={800} fill={c.dark} font={display}>
          {name}
        </T>
        <T x={246} y={79} size={6} weight={700} fill={c.accent} spacing="1.2">
          {d.tag}
        </T>
        <rect x="214" y="94" width="150" height="0.8" fill={c.bg} />
        <T x={214} y={110} size={9} weight={700}>
          {d.person}
        </T>
        <T x={214} y={123} size={7.5} fill={MUTED}>
          +91 98XXX XXXXX
        </T>
        <T x={214} y={135} size={7.5} fill={MUTED}>
          {d.addr}
        </T>
      </g>
      {/* card back */}
      <g transform="rotate(4 296 208)">
        <Shadow x={206} y={158} w={184} h={104} rx={8} />
        <rect x="206" y="158" width="184" height="104" rx="8" fill={c.dark} />
        <circle cx="298" cy="198" r="19" fill="none" stroke="#F5D547" strokeWidth="1.6" />
        <T x={298} y={204.5} size={16} weight={800} fill="#fff" anchor="middle" font={display}>
          {mono}
        </T>
        <T x={298} y={236} size={11} weight={800} fill="#fff" anchor="middle" font={display}>
          {name}
        </T>
        <T x={298} y={248} size={6} weight={700} fill="#F5D547" anchor="middle" spacing="1.4">
          {d.tag}
        </T>
      </g>
    </>
  );
}

/* ---------------- Instagram profile + featured post ---------------- */
function Social({ c, d, name }) {
  const fills = [c.dark, c.bg, c.accent, c.bg, c.accent, c.soft, c.accent, c.bg, c.dark];
  return (
    <>
      <Shadow x={28} y={10} w={156} h={260} rx={20} />
      <rect x="28" y="10" width="156" height="260" rx="20" fill={INK} />
      <rect x="33" y="15" width="146" height="250" rx="16" fill="#fff" />
      <circle cx="56" cy="42" r="15" fill="none" stroke={c.accent} strokeWidth="2" />
      <circle cx="56" cy="42" r="11.5" fill={c.dark} />
      <T x={56} y={45.5} size={9} weight={800} fill="#fff" anchor="middle" font={display}>
        {initials(name)}
      </T>
      <T x={78} y={38} size={8.5} weight={700}>
        {d.handle}
      </T>
      <T x={78} y={49} size={6.8} fill={MUTED}>
        {d.bio}
      </T>
      <rect x="41" y="64" width="84" height="16" rx="5" fill={c.accent} />
      <T x={83} y={75} size={7} weight={700} fill="#fff" anchor="middle">
        Follow
      </T>
      <rect x="129" y="64" width="42" height="16" rx="5" fill={c.soft} stroke={c.bg} />
      <T x={150} y={75} size={7} weight={700} anchor="middle">
        Message
      </T>
      {d.highlights.map((h, i) => (
        <g key={h}>
          <circle cx={54 + i * 34} cy="101" r="11" fill={c.soft} stroke={c.accent} strokeWidth="1.4" />
          <T x={54 + i * 34} y={121} size={5.6} fill={MUTED} anchor="middle">
            {h}
          </T>
        </g>
      ))}
      {fills.map((fill, i) => {
        const x = 38 + (i % 3) * 46;
        const y = 128 + Math.floor(i / 3) * 44;
        const label = d.posts[i];
        const light = fill === c.bg || fill === c.soft;
        return (
          <g key={i}>
            <rect x={x} y={y} width="44" height="42" rx="3" fill={fill} />
            {label ? (
              <T x={x + 22} y={y + 24} size={6.4} weight={800} fill={light ? c.dark : '#fff'} anchor="middle" font={display}>
                {label}
              </T>
            ) : (
              <circle cx={x + 22} cy={y + 21} r="9" fill={light ? c.accent : c.soft} opacity="0.85" />
            )}
          </g>
        );
      })}

      {/* featured post */}
      <Shadow x={204} y={26} w={172} h={220} rx={10} />
      <rect x="204" y="26" width="172" height="220" rx="10" fill="#fff" />
      <rect x="212" y="34" width="156" height="156" rx="7" fill={c.dark} />
      <circle cx="338" cy="64" r="44" fill={c.accent} opacity="0.55" />
      <circle cx="232" cy="172" r="26" fill={c.accent} opacity="0.4" />
      <T x={224} y={62} size={7} weight={700} fill="#F5D547" spacing="1.4">
        {name.toUpperCase()}
      </T>
      <T x={224} y={112} size={22} weight={800} fill="#fff" font={display}>
        {d.feature[0]}
      </T>
      <T x={224} y={138} size={22} weight={800} fill="#F5D547" font={display}>
        {d.feature[1]}
      </T>
      <rect x="224" y="152" width="74" height="18" rx="9" fill="#fff" />
      <T x={261} y={164} size={7.5} weight={700} fill={c.dark} anchor="middle">
        {d.featureCta}
      </T>
      <path d="M222 210.500c-3.500-3-7-5.800-7-9a3.800 3.800 0 0 1 7-2 3.800 3.800 0 0 1 7 2c0 3.200-3.500 6-7 9z" fill="#E5484D" />
      <path d="M238 200h12a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-8l-4 3z" fill="none" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M262 201l12 5-12 6 2-5.500z" fill="none" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      <T x={214} y={230} size={7.6}>
        <tspan fontWeight="700">{d.handle}</tspan> {d.caption}
      </T>
    </>
  );
}

/* ---------------- Festival / offer poster set ---------------- */
function Poster({ c, d, name }) {
  const lights = Array.from({ length: 9 }, (_, i) => i);
  return (
    <>
      <g transform="rotate(-6 62 110)">
        <Shadow x={14} y={62} w={96} h={96} rx={6} />
        <rect x="14" y="62" width="96" height="96" rx="6" fill={c.accent} />
        <T x={62} y={96} size={8} weight={700} fill="#fff" anchor="middle" spacing="1">
          {name.toUpperCase()}
        </T>
        <T x={62} y={120} size={15} weight={800} fill="#F5D547" anchor="middle" font={display}>
          {d.square[0]}
        </T>
        <T x={62} y={138} size={15} weight={800} fill="#fff" anchor="middle" font={display}>
          {d.square[1]}
        </T>
      </g>
      <g transform="rotate(5 340 190)">
        <Shadow x={292} y={158} w={98} h={62} rx={6} />
        <rect x="292" y="158" width="98" height="62" rx="6" fill="#fff" />
        <rect x="292" y="158" width="98" height="16" rx="6" fill={c.dark} />
        <T x={341} y={169.5} size={7} weight={700} fill="#F5D547" anchor="middle">
          {d.offer}
        </T>
        <T x={341} y={193} size={10} weight={800} fill={c.dark} anchor="middle" font={display}>
          {name}
        </T>
        <T x={341} y={208} size={6.5} fill={MUTED} anchor="middle">
          {d.foot}
        </T>
      </g>

      <Shadow x={118} y={10} w={166} h={260} rx={8} />
      <rect x="118" y="10" width="166" height="260" rx="8" fill={c.dark} />
      <path d="M118 30q83 26 166 0" fill="none" stroke="#F5D547" strokeWidth="1" opacity="0.7" />
      {lights.map((i) => {
        const t = (i + 0.5) / 9;
        const x = 118 + t * 166;
        const y = 30 + 26 * (1 - Math.pow(2 * t - 1, 2)) * 0.5;
        return <circle key={i} cx={x} cy={y + 4} r="3.6" fill={i % 2 ? '#F5D547' : c.accent} stroke="#fff" strokeWidth="0.6" />;
      })}
      <T x={201} y={70} size={8} weight={700} fill="#fff" anchor="middle" spacing="1.6">
        {name.toUpperCase()}
      </T>
      <T x={201} y={104} size={28} weight={800} fill="#F5D547" anchor="middle" font={display}>
        {d.title[0]}
      </T>
      <T x={201} y={133} size={28} weight={800} fill="#fff" anchor="middle" font={display}>
        {d.title[1]}
      </T>
      <path d="M132 148h138l-8 13 8 13H132l8-13z" fill={c.accent} />
      <T x={201} y={166} size={12} weight={800} fill="#fff" anchor="middle" font={display}>
        {d.offer}
      </T>
      <T x={201} y={192} size={8.5} fill="#fff" anchor="middle">
        {d.sub}
      </T>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${151 + i * 50} 222)`}>
          <ellipse cx="0" cy="6" rx="13" ry="5" fill={c.accent} />
          <path d="M-13 5q13 12 26 0z" fill="#D98A2B" />
          <path d="M0 -12c4 5 5 9 0 14c-5-5-4-9 0-14z" fill="#F5D547" />
        </g>
      ))}
      <rect x="118" y="246" width="166" height="24" fill="#fff" />
      <path d="M118 246h166v16a8 8 0 0 1-8 8H126a8 8 0 0 1-8-8z" fill="#fff" />
      <T x={201} y={261.500} size={7.5} weight={700} fill={c.dark} anchor="middle">
        {d.foot} | 98XXX XXXXX
      </T>
    </>
  );
}

/* ---------------- Google listing + WhatsApp catalogue + records ---------------- */
function Setup({ c, d }) {
  return (
    <>
      {/* Google Maps listing */}
      <Shadow x={16} y={16} w={184} h={132} rx={12} />
      <rect x="16" y="16" width="184" height="132" rx="12" fill="#fff" />
      <path d="M16 28a12 12 0 0 1 12-12h160a12 12 0 0 1 12 12v42H16z" fill="#DDE9E0" />
      <path d="M16 56l184-22M74 16l26 54M150 70l22-54M16 34l60 18" stroke="#fff" strokeWidth="5" />
      <path d="M118 26a11 11 0 0 1 11 11c0 9-11 19-11 19s-11-10-11-19a11 11 0 0 1 11-11z" fill="#D8412F" />
      <circle cx="118" cy="37" r="4" fill="#fff" />
      <T x={28} y={90} size={11} weight={800} font={display}>
        {d.shop}
      </T>
      <T x={28} y={103} size={7.5} fill={MUTED}>
        {d.kind}
      </T>
      <T x={28} y={116} size={7.5} weight={700} fill="#1F6041">
        Open <tspan fill={MUTED} fontWeight="500">{d.hours}</tspan>
      </T>
      <rect x="28" y="124" width="64" height="16" rx="8" fill="#1A73E8" />
      <T x={60} y={135} size={7} weight={700} fill="#fff" anchor="middle">
        Directions
      </T>
      <rect x="98" y="124" width="42" height="16" rx="8" fill="#fff" stroke="#C7D3CB" />
      <T x={119} y={135} size={7} weight={700} fill="#1A73E8" anchor="middle">
        Call
      </T>
      <rect x="146" y="124" width="46" height="16" rx="8" fill="#fff" stroke="#C7D3CB" />
      <T x={169} y={135} size={7} weight={700} fill="#1A73E8" anchor="middle">
        Website
      </T>

      {/* WhatsApp Business */}
      <Shadow x={212} y={16} w={172} h={160} rx={12} />
      <rect x="212" y="16" width="172" height="160" rx="12" fill="#fff" />
      <path d="M212 28a12 12 0 0 1 12-12h148a12 12 0 0 1 12 12v22H212z" fill="#1F6041" />
      <circle cx="230" cy="33" r="9" fill="#fff" />
      <T x={230} y={36.500} size={7} weight={800} fill="#1F6041" anchor="middle" font={display}>
        {initials(d.shop)}
      </T>
      <T x={245} y={31} size={8.5} weight={700} fill="#fff">
        {d.shop}
      </T>
      <T x={245} y={41} size={6.2} fill="#D3E2D8">
        Business account
      </T>
      <T x={222} y={64} size={7.5} weight={700} fill={MUTED}>
        {d.catTitle}
      </T>
      {d.products.map(([title, meta], i) => (
        <g key={title} transform={`translate(222 ${70 + i * 34})`}>
          <rect width="152" height="29" rx="6" fill={c.soft} stroke={c.bg} />
          <rect x="4" y="4" width="21" height="21" rx="4" fill={i ? c.bg : c.accent} />
          <T x={31} y={13} size={7.4} weight={700}>
            {title}
          </T>
          <T x={31} y={23} size={7.2} weight={700} fill={c.accent}>
            {meta}
          </T>
        </g>
      ))}
      <rect x="222" y="142" width="152" height="24" rx="12" fill="#DDF5D2" />
      <T x={298} y={157} size={7.4} weight={700} fill="#1F6041" anchor="middle">
        {d.chat}
      </T>

      {/* Bill or booking list */}
      <g transform="rotate(-3 100 210)">
        <Shadow x={28} y={160} w={150} h={108} rx={6} />
        <rect x="28" y="160" width="150" height="108" rx="6" fill="#fff" />
        <T x={38} y={176} size={8} weight={800} fill={c.dark} spacing="0.8">
          {d.listTitle}
        </T>
        <T x={168} y={176} size={6.5} fill={MUTED} anchor="end">
          {d.listMeta}
        </T>
        <rect x="38" y="182" width="130" height="0.8" fill="#D9E3DB" />
        {d.rows.map(([l, r], i) => (
          <g key={l}>
            <T x={38} y={197 + i * 14} size={7.4}>
              {l}
            </T>
            <T x={168} y={197 + i * 14} size={7.4} anchor="end">
              {r}
            </T>
          </g>
        ))}
        <rect x="38" y="232" width="130" height="0.8" fill="#D9E3DB" />
        <T x={38} y={247} size={8.5} weight={800} fill={c.dark}>
          {d.totalLabel}
        </T>
        <T x={168} y={247} size={8.5} weight={800} fill={c.dark} anchor="end">
          {d.total}
        </T>
        <T x={38} y={259} size={6} fill={MUTED}>
          {d.listFoot}
        </T>
      </g>

      {/* UPI QR */}
      <Shadow x={196} y={190} w={70} h={78} rx={8} />
      <rect x="196" y="190" width="70" height="78" rx="8" fill="#fff" />
      {[
        [0, 0],
        [28, 0],
        [0, 28],
      ].map(([dx, dy]) => (
        <g key={`${dx}${dy}`} transform={`translate(${208 + dx} ${200 + dy})`}>
          <rect width="18" height="18" rx="2" fill={INK} />
          <rect x="4" y="4" width="10" height="10" rx="1" fill="#fff" />
          <rect x="6.500" y="6.500" width="5" height="5" fill={INK} />
        </g>
      ))}
      {[
        [30, 30],
        [38, 30],
        [30, 38],
        [42, 40],
        [22, 14],
        [14, 22],
        [36, 22],
      ].map(([dx, dy]) => (
        <rect key={`${dx}-${dy}`} x={208 + dx} y={200 + dy} width="5" height="5" fill={INK} />
      ))}
      <T x={231} y={261} size={6.5} weight={700} fill={c.dark} anchor="middle">
        Scan and pay
      </T>

      {/* Setup checklist */}
      <rect x="278" y="190" width="106" height="78" rx="8" fill={c.dark} />
      {d.checks.map((label, i) => (
        <g key={label} transform={`translate(288 ${204 + i * 19})`}>
          <circle cx="6" cy="4" r="6" fill="#F5D547" />
          <path d="M3 4l2.200 2.200L9.200 2" fill="none" stroke={c.dark} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <T x={18} y={7} size={7.4} weight={700} fill="#fff">
            {label}
          </T>
        </g>
      ))}
    </>
  );
}

const VARIANTS = { web: Web, brand: Brand, grid: Social, poster: Poster, setup: Setup };

export default function PortfolioArt({ art, tone, name, d = {}, image }) {
  const c = TONES[tone] || TONES.leaf;
  if (image) {
    return <img src={image} alt="" width="400" height="280" loading="lazy" decoding="async" className="block aspect-[10/7] w-full object-cover" />;
  }
  const Variant = VARIANTS[art] || Web;
  return (
    <svg viewBox="0 0 400 280" className="block h-auto w-full" aria-hidden="true" focusable="false" lang="en">
      <rect width="400" height="280" fill={c.bg} />
      <Variant c={c} d={d} name={d.name || name} />
    </svg>
  );
}
