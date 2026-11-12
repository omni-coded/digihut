// Language-independent data: ids, icons, scoring. Text lives in en.js / hi.js.
import {
  LuMapPin,
  LuPalette,
  LuMegaphone,
  LuTrendingUp,
  LuReceipt,
  LuChartNoAxesCombined,
  LuUtensils,
  LuShirt,
  LuShoppingBasket,
  LuScissors,
  LuGraduationCap,
  LuStethoscope,
  LuSmartphone,
  LuGem,
  LuPartyPopper,
  LuHouse,
  LuLayers,
  LuBadgeIndianRupee,
  LuHeadset,
  LuHandshake,
} from 'react-icons/lu';

export const SERVICES = [
  { id: 'presence', icon: LuMapPin },
  { id: 'branding', icon: LuPalette },
  { id: 'social', icon: LuMegaphone },
  { id: 'marketing', icon: LuTrendingUp },
  { id: 'management', icon: LuReceipt },
  { id: 'insights', icon: LuChartNoAxesCombined },
];

export const INDUSTRIES = [
  { id: 'restaurants', icon: LuUtensils, services: ['presence', 'social', 'marketing'] },
  { id: 'clothing', icon: LuShirt, services: ['social', 'branding', 'presence'] },
  { id: 'general', icon: LuShoppingBasket, services: ['presence', 'management'] },
  { id: 'salons', icon: LuScissors, services: ['social', 'presence', 'marketing'] },
  { id: 'coaching', icon: LuGraduationCap, services: ['presence', 'branding', 'management'] },
  { id: 'clinics', icon: LuStethoscope, services: ['presence', 'management'] },
  { id: 'electronics', icon: LuSmartphone, services: ['branding', 'presence', 'management'] },
  { id: 'jewellery', icon: LuGem, services: ['branding', 'social', 'insights'] },
  { id: 'events', icon: LuPartyPopper, services: ['presence', 'social', 'management'] },
  { id: 'home', icon: LuHouse, services: ['presence', 'social', 'branding'] },
];

export const WHY_ICONS = [LuLayers, LuBadgeIndianRupee, LuHeadset, LuHandshake];

// Demo projects. `d` holds the words shown inside each mock-up. To show a real
// photo or design instead, add image: '/portfolio/your-file.jpg' (put the file
// in public/portfolio/).
export const PORTFOLIO = [
  {
    id: 'rasoi', cat: 'web', art: 'web', tone: 'saffron',
    d: { url: 'rasoicorner.in', nav: ['Menu', 'About', 'Contact'], h1: ['Ghar jaisa', 'swaad, roz.'], sub: 'Thali, snacks and sweets', cta: 'See the menu', phoneCta: 'Order on WhatsApp', listTitle: "Today's favourites", items: [['Veg Thali', '₹120'], ['Paneer Tikka', '₹180'], ['Masala Chai', '₹20']] },
  },
  {
    id: 'swarn', cat: 'branding', art: 'brand', tone: 'gold',
    d: { tag: 'FINE JEWELLERY', person: 'Proprietor', addr: 'Sadar Bazaar, Raipur' },
  },
  {
    id: 'saanchi', cat: 'social', art: 'grid', tone: 'rose',
    d: { handle: 'saanchi.boutique', bio: 'Sarees, suits and lehengas', highlights: ['New', 'Sarees', 'Suits', 'Reviews'], posts: ['NEW', '', 'SALE', '', 'LEHENGA', '', 'SUITS', '', 'REEL'], feature: ['Wedding', 'Collection'], featureCta: 'Shop now', caption: 'New arrivals every Friday' },
  },
  {
    id: 'verma', cat: 'creatives', art: 'poster', tone: 'blue',
    d: { title: ['Diwali', 'Dhamaka'], offer: 'Exchange Offer', sub: 'TV, fridge and washing machine', foot: 'Main Road, Bhilai', square: ['Festive', 'Offers'] },
  },
  {
    id: 'achar', cat: 'setup', art: 'setup', tone: 'saffron',
    d: { shop: 'Maa Ke Achar', kind: 'Homemade pickles and papad', hours: 'Orders 9 am to 8 pm', catTitle: 'Catalogue', products: [['Aam ka Achar 500 g', '₹180'], ['Moong Papad 250 g', '₹90']], chat: 'Order on WhatsApp', listTitle: 'ORDER', listMeta: 'No. 014', rows: [['Aam ka Achar x 2', '₹360'], ['Moong Papad x 1', '₹90'], ['Delivery', '₹30']], totalLabel: 'Total', total: '₹480', listFoot: 'Paid by UPI', checks: ['WhatsApp shop', 'UPI payments', 'Product labels'] },
  },
  {
    id: 'kirana', cat: 'setup', art: 'setup', tone: 'leaf',
    d: { shop: 'Sharma Kirana', kind: 'Grocery store', hours: 'Closes 9 pm', catTitle: 'Catalogue', products: [['Atta 5 kg', '₹245'], ['Sunflower Oil 1 L', '₹150']], chat: 'Send your list on WhatsApp', listTitle: 'TAX INVOICE', listMeta: 'No. 1042', rows: [['Rice 5 kg', '₹320'], ['Toor Dal 1 kg', '₹160'], ['Sugar 1 kg', '₹45']], totalLabel: 'Total', total: '₹525', listFoot: 'Prices include GST', checks: ['Google Maps', 'WhatsApp', 'Billing'] },
  },
  {
    id: 'pragati', cat: 'web', art: 'web', tone: 'blue',
    d: { url: 'pragaticlasses.in', nav: ['Courses', 'Faculty', 'Contact'], h1: ['Admissions', 'open now'], sub: 'Class 9 to 12, JEE and NEET', cta: 'Apply online', phoneCta: 'Enquire on WhatsApp', listTitle: 'Our batches', items: [['Foundation', 'Class 9 to 10'], ['Target JEE', 'Class 11 to 12'], ['NEET Prep', 'Class 11 to 12']] },
  },
  {
    id: 'nayra', cat: 'branding', art: 'brand', tone: 'rose',
    d: { tag: 'HAIR, SKIN, BRIDAL', person: 'Salon Manager', addr: 'Shankar Nagar, Raipur' },
  },
  {
    id: 'chai', cat: 'social', art: 'grid', tone: 'saffron',
    d: { name: 'Chai Pe Charcha', handle: 'chaipecharcha.cafe', bio: 'Chai, snacks and good talk', highlights: ['Menu', 'Combos', 'Events', 'Reviews'], posts: ['CHAI', '', 'COMBO', '', 'OPEN', '', 'SNACKS', '', 'REEL'], feature: ['Kulhad', 'Chai ₹15'], featureCta: 'Visit today', caption: 'Evening combo, 4 to 7 pm' },
  },
  {
    id: 'apna', cat: 'creatives', art: 'poster', tone: 'leaf',
    d: { title: ['Grand', 'Opening'], offer: 'Sunday, 10 am', sub: 'Fresh groceries and daily needs', foot: 'Near Bus Stand, Durg', square: ['Now', 'Open'] },
  },
  {
    id: 'care', cat: 'setup', art: 'setup', tone: 'blue',
    d: { shop: 'Care Plus Clinic', kind: 'General physician', hours: 'Closes 8 pm', catTitle: 'Book a visit', products: [['General check-up', 'Today, 10:30 am'], ['Follow-up visit', 'Today, 5:00 pm']], chat: 'Book on WhatsApp', listTitle: 'APPOINTMENTS', listMeta: 'Today', rows: [['Token 12', '10:30 am'], ['Token 13', '10:45 am'], ['Token 14', '11:00 am']], totalLabel: 'Booked', total: '14', listFoot: 'Reminders sent on WhatsApp', checks: ['Google listing', 'Bookings', 'Reminders'] },
  },
];

export const PORTFOLIO_CATEGORIES = ['web', 'branding', 'social', 'creatives', 'setup'];

export const TIERS = ['starter', 'growth', 'premium'];
export const RECOMMENDED_TIER = 'growth';

// Digital audit: weights add up to 100. "Partly" earns half.
export const AUDIT_WEIGHTS = {
  maps: 20,
  website: 15,
  whatsapp: 15,
  social: 15,
  reviews: 15,
  management: 20,
};
export const AUDIT_GAP_SERVICE = {
  maps: 'presence',
  website: 'presence',
  whatsapp: 'presence',
  social: 'social',
  reviews: 'marketing',
  management: 'management',
};
export const ANSWER_VALUE = { yes: 1, partly: 0.5, no: 0 };

export function scoreAudit(answers) {
  return Math.round(
    Object.entries(AUDIT_WEIGHTS).reduce((sum, [key, weight]) => sum + weight * (ANSWER_VALUE[answers[key]] ?? 0), 0),
  );
}

export function auditLevel(score) {
  if (score >= 75) return 'high';
  if (score >= 40) return 'mid';
  return 'low';
}

export const NAV_SECTIONS = ['home', 'services', 'industries', 'portfolio', 'tools', 'about', 'contact'];

// Every section on the home page, in order (used to highlight where the visitor is).
export const ALL_SECTIONS = ['home', 'services', 'industries', 'portfolio', 'pricing', 'audit', 'tools', 'about', 'contact', 'faq'];

// ---- Free tools: outside links. Search words stay in English for better results. ----
export const INDUSTRY_SEARCH = {
  restaurants: 'restaurant',
  clothing: 'clothing store',
  general: 'grocery store',
  salons: 'salon',
  coaching: 'coaching classes',
  clinics: 'clinic',
  electronics: 'electronics shop',
  jewellery: 'jewellery shop',
  events: 'wedding planner',
  home: 'homemade products',
};
export const IDEA_KINDS = [
  { id: 'logo', pinterest: 'logo design', canva: 'logo' },
  { id: 'poster', pinterest: 'offer poster design', canva: 'sale poster' },
  { id: 'board', pinterest: 'shop sign board design', canva: 'shop banner' },
  { id: 'insta', pinterest: 'instagram post design', canva: 'instagram post' },
  { id: 'menu', pinterest: 'menu price list design', canva: 'price list' },
  { id: 'card', pinterest: 'visiting card design', canva: 'business card' },
  { id: 'label', pinterest: 'product label packaging design', canva: 'product label' },
];
export const pinterestUrl = (q) => `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(q)}`;
export const canvaUrl = (q) => `https://www.canva.com/templates/?query=${encodeURIComponent(q)}`;
export const googleSearchUrl = (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}`;
export const googleMapsUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
export const TOOL_LINKS = [
  { id: 'gbp', url: 'https://www.google.com/business/' },
  { id: 'wab', url: 'https://business.whatsapp.com/' },
  { id: 'canva', url: 'https://www.canva.com/' },
  { id: 'pinterest', url: 'https://www.pinterest.com/' },
  { id: 'trends', url: 'https://trends.google.com/trends/?geo=IN' },
];

// Founder photos, in the same order as `about.founders` in en.js / hi.js.
// Put square photos in /public/founders/ and use paths like '/founders/name.jpg'.
// Leave as null to show the "photo coming soon" placeholder.
export const FOUNDER_PHOTOS = [null, null, null];
