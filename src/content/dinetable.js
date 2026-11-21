// DineTable — DigiHut's restaurant system. Text for the Services card and the
// product tour page (#/dinetable). Screenshots live in /public/dinetable/.
// The tour shows pictures only: no DineTable code is shipped with this site.

export const DT_IMG = (name) => `/dinetable/${name}.jpg`;

/** Pixel sizes, so the page doesn't jump while screenshots load. */
export const DT_SIZE = {'g00-tablet':[1700,1007],'g01-welcome':[600,1216],'g02-home':[600,1216],'g03-menu':[600,1216],'g04-dish':[600,1216],'g05-cart':[600,1216],'g06-orders':[600,1216],'g07-help':[600,1216],'g08-play':[600,1216],'g09-rewards':[600,1216],'g10-bill':[600,1216],'g11-pay':[600,1216],'g12-paid':[600,1216],'g13-support':[600,1216],'g14-privacy':[600,1216],'k01-kitchen':[1700,658],'o-analytics':[1700,1062],'o-analytics2':[1700,1062],'o-brand':[1700,1062],'o-brand2':[1700,1062],'o-editor':[1700,1062],'o-layout':[1700,1062],'o-menu':[1700,1062],'o-offers':[1700,1062],'o01-lock':[1700,935],'s01-floor':[1700,1062],'s02-floor-queue':[1700,1062]};

const en = {
  card: {
    badge: 'New · For restaurants',
    title: 'A complete ecosystem for your restaurant',
    desc: 'DineTable connects your guests, staff, kitchen and you in one system. Guests order and pay from the table, the kitchen gets orders instantly, and you see your sales live.',
    parts: [
      ['Guest QR ordering', 'Menu, ordering, games and payment on the guest’s phone'],
      ['Staff floor', 'Every table, call and order — live'],
      ['Kitchen display', 'Tickets with timers, no paper slips'],
      ['Owner dashboard', 'Sales, menu, offers and tables in one place'],
    ],
    tour: 'Take the tour',
    ask: 'Ask for a free demo',
    imgAlt: 'DineTable guest menu on a tablet and phone',
  },
  page: {
    back: 'Back to services',
    badge: 'DineTable by DigiHut · product tour',
    title: 'One system for your whole restaurant',
    intro: 'Guests order and pay from the table. Staff see every table live. The kitchen gets tickets instantly. You see your sales as they happen. Here is how it works.',
    flow: [
      ['Scan', 'Guest scans the table QR'],
      ['Order', 'Picks dishes, sizes and extras'],
      ['Cook', 'Kitchen gets the ticket live'],
      ['Serve', 'Staff see what’s ready'],
      ['Pay', 'Split, tip and pay at the table'],
      ['Grow', 'Owner sees sales and reviews'],
    ],
    jump: 'Jump to',
    how: 'How to use',
    zoom: 'Tap a screenshot to see it bigger',
    close: 'Close',
    demoNote: 'Screens show demo data.',
    chapters: {
      guest: ['The guest app', 'Everything your guests see on their own phone — no app download, no login. Your restaurant’s name, logo and colours.'],
      staff: ['The staff floor', 'One screen for waiters and managers. Every table, every call and every order — live.'],
      kitchen: ['The kitchen display', 'No more paper tickets. Orders appear on a screen the moment they are confirmed.'],
      owner: ['The owner dashboard', 'Your sales, menu, offers, tables and branding — in one PIN-protected place that guests never see.'],
      trust: ['Built-in safety and trust', 'Small details that protect your restaurant and your guests.'],
    },
    tablet: ['Works on tablets too', 'Mount a tablet at each table or at the counter. The same app switches to a wide layout with a side menu.', ['Table tablets in cafés and family restaurants', 'Self-order kiosk at the counter', 'Showing the menu on a big screen']],
    trust: [
      ['No fake orders', 'A new table’s first order is confirmed by staff in one tap, so nobody can order from home using a photo of the QR.'],
      ['Owner data stays private', 'Sales, analytics and settings sit behind the owner login. Guest phones only get the menu and their own order.'],
      ['Trusted payments', 'UPI, cards and wallets are processed by payment partners. Card numbers and UPI PINs never touch the restaurant’s system.'],
      ['Privacy-ready', 'Privacy policy, terms and help pages come filled in with your restaurant’s details.'],
    ],
    ctaTitle: 'Want DineTable in your restaurant?',
    ctaText: 'We set everything up for you — menu, photos, table QR stands, branding and staff training. Pick only the parts you need.',
    ctaBtn: 'Ask for a free demo on WhatsApp',
    wa: 'Hello DigiHut, I saw the DineTable tour. I would like a free demo for my restaurant.',
  },
  steps: {
    guest: [
      ['g01-welcome', 'Scan the table QR', 'Guests scan the QR code on their table and your menu opens in the browser.', ['Point the phone camera at the QR on the table', 'Choose how many guests are at the table', 'Tap “View menu & order”']],
      ['g02-home', 'Offers and categories', 'The home screen shows today’s offer, a search bar and all your categories.', ['Tap the offer to apply its promo code', 'Use the filter button to show veg dishes only', 'Tap a category to jump to those dishes']],
      ['g03-menu', 'The menu', 'Every dish shows its price, rating, description, spice level, allergens and photo.', ['Tap ADD or the dish to open it', 'Tap the heart to save a favourite', '“Customisable” means sizes or extras are available']],
      ['g04-dish', 'Dish details', 'Guests choose the size, add extras, set the spice level and leave a note for the kitchen.', ['Pick a size, for example Half or Full', 'Tick extras like cheese topping', 'Write allergy notes, then tap Add to Cart']],
      ['g05-cart', 'The cart', 'A clear cart with a progress bar to a free dessert, promo codes and the full total.', ['Change quantities or remove items', 'Enter a promo code and tap Apply', 'Tap Place Order']],
      ['g06-orders', 'Live order tracking', 'Guests follow their order from Placed to Served and see each dish ticked off as it’s cooked.', ['Open the Orders tab anytime', 'Green ticks show dishes that are ready', 'Use Wi-Fi, games or rewards while waiting']],
      ['g07-help', 'Call a waiter in one tap', 'No more waving. Guests ask for a waiter, water, cutlery or the bill from their phone.', ['Tap “Call waiter”', 'Choose what you need', 'See when a waiter is on the way']],
      ['g08-play', 'Games while you wait', 'Tic-tac-toe against friends or another table, plus a food trivia leaderboard.', ['Open the Play tab', 'Choose “vs Table 8” or “With my table”', 'Wins earn reward points']],
      ['g09-rewards', 'Rewards that bring guests back', 'Guests earn points on every order and redeem them for free dishes or discounts.', ['Points are added automatically', 'Check in for bonus points', 'Tap Redeem to use a reward on the bill']],
      ['g10-bill', 'Split the bill', 'Pay in full, split equally or split by item — each person pays from their own phone.', ['Open the Pay tab', 'Choose how to split', 'Add an optional tip for the staff']],
      ['g11-pay', 'Pay at the table', 'UPI, Google Pay, Apple Pay, card, bank transfer or cash — no waiting for the bill.', ['Choose a payment method', 'Tap Pay', 'Choosing cash calls a waiter to collect it']],
      ['g12-paid', 'Receipt and review', 'An instant receipt by email and a one-tap review after paying.', ['Enter an email to get the receipt', 'Tap the stars and pick tags', 'The review appears on the owner dashboard']],
      ['g13-support', 'Help and support', 'Common questions answered, plus a box to message the staff directly.', ['Tap the table badge, then Help & support', 'Open a question to see the answer', 'Send a message that staff see instantly']],
      ['g14-privacy', 'Privacy policy and terms', 'Legal pages filled in with your restaurant’s name and contact details.', ['Linked from the welcome screen and the menu', 'Explains what data is used and why', 'Updates when you change your details']],
    ],
    staff: [
      ['s01-floor', 'Live floor map', 'Every table, colour-coded by status: seated, new order, cooking, food ready, needs help and paid.', ['Tap a table to see its guests, orders and bill', 'Red tables need attention', 'Open or close a table in one tap']],
      ['s02-floor-queue', 'The action queue', 'Everything staff need to act on: guest calls, new orders to confirm and food ready to serve.', ['“On my way” tells the guest someone is coming', '“Confirm & send” checks a new table and sends its order to the kitchen', 'Orders waiting over a minute turn red and alert the manager']],
    ],
    kitchen: [
      ['k01-kitchen', 'Tickets with timers', 'Each order becomes a ticket. The timer turns amber at 5 minutes and red at 10, so late orders stand out.', ['Filter by station: Tandoor, Curry, Wok, Dessert, Bar', 'Tap a dish when it’s done', 'Bump the ticket when it’s ready — the guest is told instantly']],
    ],
    owner: [
      ['o01-lock', 'Owner-only access', 'The owner area is locked. Staff and guests can’t see sales or change prices.', ['Enter your PIN to unlock', 'Lock it again with one tap', 'Guests never receive any owner data']],
      ['o-analytics', 'Live analytics', 'Today’s revenue compared with last week, orders, average order value, tips, rating and waiter response time.', ['Updates every time a table pays', 'Revenue by hour shows your busy times', 'Hover a bar to see the exact amount']],
      ['o-analytics2', 'Dishes, payments and staff', 'Top dishes, how guests paid, what’s happening right now, staff performance and the latest reviews.', ['Spot best-sellers to promote', 'See how much is paid digitally', 'Compare waiters by calls handled and tips']],
      ['o-menu', 'Menu manager', 'Add dishes in seconds. Upload a photo of your printed menu and AI reads the dishes and prices for you.', ['Upload a photo to scan a printed menu', 'Add a photo to any dish', 'Switch a dish off when it’s sold out']],
      ['o-editor', 'Edit any dish', 'Change the name, price, discount, category, kitchen station, spice level, allergens, sizes and extras.', ['Set an original price to show a discount', 'Add sizes like Half/Full with their own rates', 'Add extras guests can tick, like extra cheese']],
      ['o-offers', 'Offers and rewards', 'Create promo codes, put dishes on discount and set your loyalty rewards.', ['Add a code with its % off and switch it on', 'Apply a % discount to any dish', 'Choose points per ₹ and what rewards cost']],
      ['o-layout', 'Floor layout', 'Set up your tables to match your restaurant — or upload a photo and AI arranges them for you.', ['Drag tables to move them', 'Tap a table to change its seats and shape', 'Upload a seating photo to arrange tables automatically']],
      ['o-brand', 'Your brand', 'Your restaurant’s name, logo and colours on every guest phone, with a live preview.', ['Upload your logo', 'Pick a brand colour', 'Set your Wi-Fi, UPI ID and contact details']],
      ['o-brand2', 'Order protection', 'Choose how strictly orders are checked, to stop orders from people who aren’t at the table.', ['Staff confirm the first order (recommended)', 'Table code for the strictest control', 'No check for self-service counters']],
    ],
  },
};

const hi = {
  card: {
    badge: 'नया · रेस्टोरेंट के लिए',
    title: 'आपके रेस्टोरेंट के लिए पूरा इकोसिस्टम',
    desc: 'DineTable आपके ग्राहकों, स्टाफ, किचन और आपको एक ही सिस्टम में जोड़ता है। ग्राहक टेबल से ही ऑर्डर और पेमेंट करते हैं, किचन को ऑर्डर तुरंत मिलता है और आप अपनी बिक्री लाइव देखते हैं।',
    parts: [
      ['ग्राहक QR ऑर्डरिंग', 'मेन्यू, ऑर्डर, गेम्स और पेमेंट ग्राहक के फ़ोन पर'],
      ['स्टाफ फ़्लोर', 'हर टेबल, हर कॉल और हर ऑर्डर — लाइव'],
      ['किचन डिस्प्ले', 'टाइमर वाले टिकट, कागज़ की पर्ची नहीं'],
      ['मालिक डैशबोर्ड', 'बिक्री, मेन्यू, ऑफ़र और टेबल एक ही जगह'],
    ],
    tour: 'टूर देखें',
    ask: 'फ़्री डेमो के लिए पूछें',
    imgAlt: 'टैबलेट और फ़ोन पर DineTable का मेन्यू',
  },
  page: {
    back: 'सेवाओं पर वापस जाएं',
    badge: 'DigiHut का DineTable · प्रोडक्ट टूर',
    title: 'पूरे रेस्टोरेंट के लिए एक सिस्टम',
    intro: 'ग्राहक टेबल से ऑर्डर और पेमेंट करते हैं। स्टाफ हर टेबल लाइव देखता है। किचन को टिकट तुरंत मिलता है। आप अपनी बिक्री उसी समय देखते हैं। देखिए यह कैसे काम करता है।',
    flow: [
      ['स्कैन', 'ग्राहक टेबल का QR स्कैन करता है'],
      ['ऑर्डर', 'डिश, साइज़ और एक्स्ट्रा चुनता है'],
      ['कुकिंग', 'किचन को टिकट लाइव मिलता है'],
      ['सर्व', 'स्टाफ देखता है क्या तैयार है'],
      ['पेमेंट', 'बिल बांटें, टिप दें, टेबल पर पे करें'],
      ['ग्रोथ', 'मालिक बिक्री और रिव्यू देखता है'],
    ],
    jump: 'सीधे जाएं',
    how: 'कैसे इस्तेमाल करें',
    zoom: 'बड़ा देखने के लिए स्क्रीनशॉट पर टैप करें',
    close: 'बंद करें',
    demoNote: 'स्क्रीन में डेमो डेटा दिखाया गया है।',
    chapters: {
      guest: ['ग्राहक ऐप', 'ग्राहक अपने फ़ोन पर जो कुछ देखते हैं — न ऐप डाउनलोड, न लॉगिन। आपके रेस्टोरेंट का नाम, लोगो और रंग।'],
      staff: ['स्टाफ फ़्लोर', 'वेटर और मैनेजर के लिए एक स्क्रीन। हर टेबल, हर कॉल और हर ऑर्डर — लाइव।'],
      kitchen: ['किचन डिस्प्ले', 'अब कागज़ के टिकट नहीं। ऑर्डर कन्फ़र्म होते ही स्क्रीन पर आ जाता है।'],
      owner: ['मालिक डैशबोर्ड', 'आपकी बिक्री, मेन्यू, ऑफ़र, टेबल और ब्रांडिंग — PIN से सुरक्षित एक जगह, जिसे ग्राहक कभी नहीं देखते।'],
      trust: ['सुरक्षा और भरोसा', 'छोटी-छोटी बातें जो आपके रेस्टोरेंट और ग्राहकों को सुरक्षित रखती हैं।'],
    },
    tablet: ['टैबलेट पर भी चलता है', 'हर टेबल या काउंटर पर टैबलेट लगाएं। वही ऐप साइड मेन्यू के साथ चौड़े लेआउट में बदल जाता है।', ['कैफ़े और फ़ैमिली रेस्टोरेंट में टेबल टैबलेट', 'काउंटर पर खुद ऑर्डर करने वाला कियोस्क', 'बड़ी स्क्रीन पर मेन्यू दिखाना']],
    trust: [
      ['नकली ऑर्डर नहीं', 'नई टेबल का पहला ऑर्डर स्टाफ एक टैप में कन्फ़र्म करता है, ताकि कोई QR की फ़ोटो से घर बैठे ऑर्डर न कर सके।'],
      ['मालिक का डेटा सुरक्षित', 'बिक्री, एनालिटिक्स और सेटिंग्स मालिक के लॉगिन के पीछे हैं। ग्राहक के फ़ोन पर सिर्फ़ मेन्यू और उनका अपना ऑर्डर जाता है।'],
      ['भरोसेमंद पेमेंट', 'UPI, कार्ड और वॉलेट पेमेंट पार्टनर के ज़रिए होते हैं। कार्ड नंबर और UPI PIN रेस्टोरेंट के सिस्टम तक कभी नहीं पहुंचते।'],
      ['प्राइवेसी के लिए तैयार', 'प्राइवेसी पॉलिसी, नियम और हेल्प पेज आपके रेस्टोरेंट की जानकारी के साथ पहले से भरे मिलते हैं।'],
    ],
    ctaTitle: 'क्या आप अपने रेस्टोरेंट में DineTable चाहते हैं?',
    ctaText: 'हम सब कुछ आपके लिए सेटअप करते हैं — मेन्यू, फ़ोटो, टेबल QR स्टैंड, ब्रांडिंग और स्टाफ ट्रेनिंग। सिर्फ़ वही हिस्से चुनें जिनकी आपको ज़रूरत है।',
    ctaBtn: 'WhatsApp पर फ़्री डेमो के लिए पूछें',
    wa: 'नमस्ते DigiHut, मैंने DineTable का टूर देखा। मुझे अपने रेस्टोरेंट के लिए फ़्री डेमो चाहिए।',
  },
  steps: {
    guest: [
      ['g01-welcome', 'टेबल का QR स्कैन करें', 'ग्राहक अपनी टेबल का QR स्कैन करते हैं और ब्राउज़र में आपका मेन्यू खुल जाता है।', ['फ़ोन का कैमरा टेबल के QR पर रखें', 'टेबल पर कितने लोग हैं, चुनें', '“View menu & order” पर टैप करें']],
      ['g02-home', 'ऑफ़र और कैटेगरी', 'होम स्क्रीन पर आज का ऑफ़र, सर्च और सारी कैटेगरी दिखती हैं।', ['प्रोमो कोड लगाने के लिए ऑफ़र पर टैप करें', 'सिर्फ़ वेज डिश देखने के लिए फ़िल्टर बटन दबाएं', 'किसी कैटेगरी पर टैप करके उसकी डिश देखें']],
      ['g03-menu', 'मेन्यू', 'हर डिश के साथ दाम, रेटिंग, विवरण, तीखापन, एलर्जी जानकारी और फ़ोटो।', ['डिश खोलने के लिए ADD या डिश पर टैप करें', 'पसंदीदा सेव करने के लिए दिल पर टैप करें', '“Customisable” का मतलब साइज़ या एक्स्ट्रा मिल सकते हैं']],
      ['g04-dish', 'डिश की जानकारी', 'ग्राहक साइज़ चुनते हैं, एक्स्ट्रा जोड़ते हैं, तीखापन तय करते हैं और किचन के लिए नोट लिखते हैं।', ['साइज़ चुनें, जैसे Half या Full', 'चीज़ टॉपिंग जैसे एक्स्ट्रा पर टिक करें', 'एलर्जी नोट लिखें, फिर Add to Cart दबाएं']],
      ['g05-cart', 'कार्ट', 'फ़्री डेज़र्ट तक की प्रोग्रेस बार, प्रोमो कोड और पूरे टोटल वाला साफ़ कार्ट।', ['मात्रा बदलें या आइटम हटाएं', 'प्रोमो कोड डालकर Apply दबाएं', 'Place Order पर टैप करें']],
      ['g06-orders', 'लाइव ऑर्डर ट्रैकिंग', 'ग्राहक अपना ऑर्डर Placed से Served तक देखते हैं, और हर डिश बनते ही टिक हो जाती है।', ['कभी भी Orders टैब खोलें', 'हरे टिक मतलब डिश तैयार है', 'इंतज़ार में Wi-Fi, गेम्स या रिवॉर्ड इस्तेमाल करें']],
      ['g07-help', 'एक टैप में वेटर बुलाएं', 'हाथ हिलाने की ज़रूरत नहीं। ग्राहक फ़ोन से वेटर, पानी, कटलरी या बिल मांगते हैं।', ['“Call waiter” पर टैप करें', 'जो चाहिए वह चुनें', 'देखें कि वेटर आ रहा है']],
      ['g08-play', 'इंतज़ार में गेम्स', 'दोस्तों या दूसरी टेबल के साथ टिक-टैक-टो, और फ़ूड क्विज़ लीडरबोर्ड।', ['Play टैब खोलें', '“vs Table 8” या “With my table” चुनें', 'जीतने पर रिवॉर्ड पॉइंट मिलते हैं']],
      ['g09-rewards', 'रिवॉर्ड जो ग्राहकों को वापस लाते हैं', 'हर ऑर्डर पर पॉइंट मिलते हैं, जिनसे फ़्री डिश या डिस्काउंट लिया जा सकता है।', ['पॉइंट अपने-आप जुड़ते हैं', 'बोनस पॉइंट के लिए चेक-इन करें', 'बिल पर रिवॉर्ड के लिए Redeem दबाएं']],
      ['g10-bill', 'बिल बांटें', 'पूरा बिल दें, बराबर बांटें या आइटम के हिसाब से — हर व्यक्ति अपने फ़ोन से पे करता है।', ['Pay टैब खोलें', 'बांटने का तरीका चुनें', 'चाहें तो स्टाफ के लिए टिप जोड़ें']],
      ['g11-pay', 'टेबल पर पेमेंट', 'UPI, Google Pay, Apple Pay, कार्ड, बैंक ट्रांसफ़र या कैश — बिल का इंतज़ार नहीं।', ['पेमेंट का तरीका चुनें', 'Pay पर टैप करें', 'कैश चुनने पर वेटर लेने आता है']],
      ['g12-paid', 'रसीद और रिव्यू', 'पेमेंट के बाद तुरंत ईमेल पर रसीद और एक टैप में रिव्यू।', ['रसीद के लिए ईमेल डालें', 'स्टार पर टैप करें और टैग चुनें', 'रिव्यू मालिक के डैशबोर्ड पर दिखता है']],
      ['g13-support', 'मदद और सपोर्ट', 'आम सवालों के जवाब, और स्टाफ को सीधे मैसेज भेजने की सुविधा।', ['टेबल बैज पर टैप करें, फिर Help & support', 'जवाब देखने के लिए सवाल खोलें', 'मैसेज भेजें जो स्टाफ तुरंत देखता है']],
      ['g14-privacy', 'प्राइवेसी पॉलिसी और नियम', 'आपके रेस्टोरेंट के नाम और संपर्क के साथ भरे हुए कानूनी पेज।', ['वेलकम स्क्रीन और मेन्यू से लिंक', 'बताता है कौन सा डेटा क्यों इस्तेमाल होता है', 'आपकी जानकारी बदलने पर अपडेट होता है']],
    ],
    staff: [
      ['s01-floor', 'लाइव फ़्लोर मैप', 'हर टेबल स्टेटस के हिसाब से रंग में: बैठे हैं, नया ऑर्डर, बन रहा है, खाना तैयार, मदद चाहिए और पेड।', ['मेहमान, ऑर्डर और बिल देखने के लिए टेबल पर टैप करें', 'लाल टेबल पर ध्यान चाहिए', 'एक टैप में टेबल खोलें या बंद करें']],
      ['s02-floor-queue', 'काम की लिस्ट', 'स्टाफ को जो करना है सब एक जगह: ग्राहक कॉल, कन्फ़र्म करने वाले नए ऑर्डर और सर्व करने के लिए तैयार खाना।', ['“On my way” से ग्राहक को पता चलता है कोई आ रहा है', '“Confirm & send” नई टेबल चेक करके ऑर्डर किचन भेजता है', 'एक मिनट से ज़्यादा रुके ऑर्डर लाल होकर मैनेजर को अलर्ट करते हैं']],
    ],
    kitchen: [
      ['k01-kitchen', 'टाइमर वाले टिकट', 'हर ऑर्डर एक टिकट बनता है। 5 मिनट पर टाइमर पीला और 10 पर लाल हो जाता है, ताकि देर वाले ऑर्डर दिखें।', ['स्टेशन से फ़िल्टर करें: तंदूर, करी, वोक, डेज़र्ट, बार', 'डिश बनते ही उस पर टैप करें', 'तैयार होने पर टिकट बंप करें — ग्राहक को तुरंत पता चलता है']],
    ],
    owner: [
      ['o01-lock', 'सिर्फ़ मालिक के लिए', 'मालिक वाला हिस्सा लॉक रहता है। स्टाफ और ग्राहक बिक्री नहीं देख सकते, न दाम बदल सकते हैं।', ['खोलने के लिए अपना PIN डालें', 'एक टैप में फिर लॉक करें', 'ग्राहकों को मालिक का कोई डेटा नहीं जाता']],
      ['o-analytics', 'लाइव एनालिटिक्स', 'आज की कमाई पिछले हफ़्ते से तुलना के साथ, ऑर्डर, औसत ऑर्डर, टिप, रेटिंग और वेटर का समय।', ['हर पेमेंट के साथ अपडेट होता है', 'घंटे के हिसाब से कमाई से व्यस्त समय पता चलता है', 'सही रकम देखने के लिए बार पर माउस ले जाएं']],
      ['o-analytics2', 'डिश, पेमेंट और स्टाफ', 'टॉप डिश, ग्राहकों ने कैसे पे किया, अभी क्या चल रहा है, स्टाफ का काम और नए रिव्यू।', ['बेस्ट-सेलर पहचानें और प्रमोट करें', 'देखें कितना पेमेंट डिजिटल हुआ', 'कॉल और टिप से वेटर की तुलना करें']],
      ['o-menu', 'मेन्यू मैनेजर', 'सेकंडों में डिश जोड़ें। छपे मेन्यू की फ़ोटो डालें और AI डिश और दाम खुद पढ़ लेता है।', ['छपे मेन्यू को स्कैन करने के लिए फ़ोटो डालें', 'किसी भी डिश में फ़ोटो जोड़ें', 'डिश खत्म होने पर उसे बंद करें']],
      ['o-editor', 'कोई भी डिश बदलें', 'नाम, दाम, डिस्काउंट, कैटेगरी, किचन स्टेशन, तीखापन, एलर्जी, साइज़ और एक्स्ट्रा बदलें।', ['डिस्काउंट दिखाने के लिए असली दाम डालें', 'Half/Full जैसे साइज़ अलग दाम के साथ जोड़ें', 'एक्स्ट्रा चीज़ जैसे विकल्प जोड़ें']],
      ['o-offers', 'ऑफ़र और रिवॉर्ड', 'प्रोमो कोड बनाएं, डिश पर डिस्काउंट दें और लॉयल्टी रिवॉर्ड तय करें।', ['% छूट के साथ कोड बनाएं और चालू करें', 'किसी भी डिश पर % डिस्काउंट लगाएं', 'हर ₹ पर पॉइंट और रिवॉर्ड की कीमत तय करें']],
      ['o-layout', 'फ़्लोर लेआउट', 'अपने रेस्टोरेंट जैसी टेबल लगाएं — या फ़ोटो डालें और AI टेबल खुद लगा देता है।', ['टेबल खिसकाने के लिए ड्रैग करें', 'सीट और शेप बदलने के लिए टेबल पर टैप करें', 'बैठने की जगह की फ़ोटो से टेबल अपने-आप लगाएं']],
      ['o-brand', 'आपका ब्रांड', 'हर ग्राहक के फ़ोन पर आपके रेस्टोरेंट का नाम, लोगो और रंग, लाइव प्रीव्यू के साथ।', ['अपना लोगो अपलोड करें', 'ब्रांड का रंग चुनें', 'Wi-Fi, UPI ID और संपर्क जानकारी डालें']],
      ['o-brand2', 'ऑर्डर सुरक्षा', 'तय करें ऑर्डर कितनी सख़्ती से चेक हों, ताकि टेबल पर न बैठे लोग ऑर्डर न कर सकें।', ['स्टाफ पहला ऑर्डर कन्फ़र्म करे (सुझाया गया)', 'सबसे सख़्त कंट्रोल के लिए टेबल कोड', 'सेल्फ़-सर्विस काउंटर के लिए कोई चेक नहीं']],
    ],
  },
};

export const DINETABLE = { en, hi };
