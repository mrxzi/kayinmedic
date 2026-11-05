import type { FoodItem } from '../types';

export const FOOD_DATABASE: FoodItem[] = [
  // AMAN - BRAT & Makanan Ramah Pencernaan
  {
    id: 'banana',
    name: 'Pisang Matang',
    category: 'BRAT',
    isSafe: true,
    badge: 'Sangat Aman (B - BRAT)',
    shortReason: 'Kaya pektin & kalium untuk memadatkan feses dan memulihkan energi.',
    details: 'Pisang mengandung serat larut (pektin) yang membantu menyerap cairan berlebih di usus serta mengembalikan elektrolit kalium yang terbuang saat diare.',
    consumptionTips: 'Pilih pisang yang sudah matang kuning berbintik cokelat kecil (mudah dicerna).'
  },
  {
    id: 'rice-porridge',
    name: 'Bubur / Nasi Putih Polos',
    category: 'BRAT',
    isSafe: true,
    badge: 'Sangat Aman (R - BRAT)',
    shortReason: 'Rendah serat, sangat mudah diserap tubuh tanpa membebani usus.',
    details: 'Nasi putih dan bubur adalah sumber karbohidrat sederhana yang ramah bagi lambung dan usus yang sedang radang.',
    consumptionTips: 'Sajikan hangat dengan sedikit taburan garam untuk menambah cita rasa dan natrium.'
  },
  {
    id: 'boiled-apple',
    name: 'Apel Rebus / Saus Apel',
    category: 'BRAT',
    isSafe: true,
    badge: 'Sangat Aman (A - BRAT)',
    shortReason: 'Pektin alami menenangkan usus, tekstur rebus mudah dicerna.',
    details: 'Mengukus atau merebus apel memecah serat kasarnya sehingga aman untuk dinding usus dan membantu mengentalkan feses.',
    consumptionTips: 'Kupas kulitnya terlebih dahulu sebelum dikukus atau diblender halus.'
  },
  {
    id: 'toasted-bread',
    name: 'Roti Tawar Putih Panggang',
    category: 'BRAT',
    isSafe: true,
    badge: 'Sangat Aman (T - BRAT)',
    shortReason: 'Menyerap asam lambung dan cairan berlebih di saluran cerna.',
    details: 'Panggang ringan tanpa mentega atau selai manis. Roti tawar putih lebih cepat dicerna dibanding roti gandum utuh saat diare.',
    consumptionTips: 'Bisa dimakan perlahan atau dicelupkan ke kaldu ayam bening.'
  },
  {
    id: 'oralit',
    name: 'Oralit / Larutan Gula Garam',
    category: 'Minuman',
    isSafe: true,
    badge: 'Wajib Dikonsumsi ⭐',
    shortReason: 'Standar emas medis WHO untuk mencegah dehidrasi akibat diare.',
    details: 'Menggantikan ion natrium, kalium, dan glukosa yang hilang secara instan. Menjaga fungsi sel tubuh agar tidak lemas atau syok.',
    consumptionTips: 'Minum 1 gelas setiap kali selesai buang air besar cair, teguk perlahan.'
  },
  {
    id: 'coconut-water',
    name: 'Air Kelapa Murni Alami',
    category: 'Minuman',
    isSafe: true,
    badge: 'Elektrolit Alami',
    shortReason: 'Sumber kalium dan mineral alami yang menyegarkan perut.',
    details: 'Air kelapa memiliki komposisi isotonik mirip cairan tubuh yang aman diserap lambung.',
    consumptionTips: 'Pilih air kelapa murni tanpa sirup gula, es batu kotor, atau susu kental manis.'
  },
  {
    id: 'chicken-broth',
    name: 'Kaldu Ayam Bening Hangat',
    category: 'Minuman',
    isSafe: true,
    badge: 'Hangat & Menutrisi',
    shortReason: 'Memberikan hidrasi hangat, natrium, dan asam amino penenang usus.',
    details: 'Kuah bening hangat membantu menenangkan kram perut dan memberikan nutrisi tanpa serat yang memberatkan.',
    consumptionTips: 'Pastikan minyak/lemak ayam disaring terlebih dahulu agar kuah benar-benar bening.'
  },
  {
    id: 'boiled-potato',
    name: 'Kentang Rebus / Tumbuk Polos',
    category: 'Makanan Pokok',
    isSafe: true,
    badge: 'Aman & Mengenyangkan',
    shortReason: 'Tinggi kalium, lembut di lambung, dan mengenyangkan.',
    details: 'Kentang rebus tanpa kulit mengandung pati yang menenangkan dinding usus.',
    consumptionTips: 'Kupas bersih kulitnya, jangan tambahkan mentega, susu sapi, atau keju.'
  },
  {
    id: 'steamed-chicken',
    name: 'Dada Ayam Rebus / Suwir Polos',
    category: 'Protein',
    isSafe: true,
    badge: 'Protein Ramah Cerna',
    shortReason: 'Protein tanpa lemak untuk memulihkan stamina saat lemas.',
    details: 'Dada ayam tanpa kulit memiliki kadar lemak sangat rendah, sehingga tidak memicu kontraksi usus berlebih.',
    consumptionTips: 'Rebus dengan sedikit garam atau jahe tipis, suwir halus sebelum dimakan.'
  },
  {
    id: 'boiled-carrots',
    name: 'Wortel Rebus Empuk',
    category: 'Sayur & Buah',
    isSafe: true,
    badge: 'Sayuran Aman',
    shortReason: 'Kaya nutrisi dan vitamin A, tidak menimbulkan gas di perut.',
    details: 'Wortel yang direbus hingga empuk memiliki pektin yang baik tanpa serat kasar yang menggores usus.',
    consumptionTips: 'Rebus dalam kaldu sup bening sampai benar-benar lunak.'
  },
  {
    id: 'crackers',
    name: 'Biskuit Crackers / Biskuit Asin',
    category: 'Camilan & Bumbu',
    isSafe: true,
    badge: 'Meredakan Mual',
    shortReason: 'Kandungan garam ringannya membantu menggantikan natrium dan menahan mual.',
    details: 'Biskuit renyah polos rendah lemak cocok sebagai camilan ketika selera makan sedang turun.',
    consumptionTips: 'Kunyah perlahan sedikit demi sedikit saat perut terasa kosong bergas.'
  },
  {
    id: 'chamomile-tea',
    name: 'Teh Chamomile / Peppermint Encer',
    category: 'Minuman',
    isSafe: true,
    badge: 'Pereda Kram Perut',
    shortReason: 'Sifat antispasmodik herbal merilekskan otot polos usus yang kram.',
    details: 'Membantu mengurangi kontraksi berlebih dan rasa begah melilit.',
    consumptionTips: 'Sajikan hangat-hangat kuku, buat encer tanpa kafein dan tanpa gula berlebih.'
  },

  // PANTANG - Makanan Pemicu Iritasi & Diare
  {
    id: 'spicy-food',
    name: 'Sambal & Makanan Pedas',
    category: 'Camilan & Bumbu',
    isSafe: false,
    badge: 'Pantang Keras 🚫',
    shortReason: 'Capsaicin membakar mukosa usus dan mempercepat pergerakan feses.',
    details: 'Kandungan capsaicin pada cabai dan lada mengiritasi dinding usus yang sedang luka, memicu rasa panas di anus dan kram melilit berlipat ganda.',
    consumptionTips: 'Hindari total sampai minimal 3 hari setelah feses kembali normal padat.'
  },
  {
    id: 'coconut-milk',
    name: 'Makanan Bersantan (Gulai, Lodeh, Opor)',
    category: 'Makanan Pokok',
    isSafe: false,
    badge: 'Pantang Lemak Tinggi',
    shortReason: 'Santan tinggi asam lemak yang memicu kontraksi peristaltik usus hebat.',
    details: 'Lemak jenuh pada santan membutuhkan kerja keras enzim pencernaan. Saat diare, usus tidak mampu mengolah lemak sehingga langsung dibuang sebagai cairan diare.',
    consumptionTips: 'Ganti menu berkuah santan dengan sup bening atau kaldu rebusan.'
  },
  {
    id: 'dairy-milk',
    name: 'Susu Sapi, Keju, Es Krim (Laktosa)',
    category: 'Minuman',
    isSafe: false,
    badge: 'Pantang Laktosa',
    shortReason: 'Enzim laktase anjlok saat diare, laktosa akan membusuk memicu gas & diare parah.',
    details: 'Kerusakan sementara vili usus membuat tubuh intoleran laktosa sekunder. Susu sapi akan langsung memicu bunyi perut gemuruh dan diare cair.',
    consumptionTips: 'Stop semua olahan susu hewani sementara waktu (1-2 minggu masa pemulihan).'
  },
  {
    id: 'coffee-caffeine',
    name: 'Kopi & Minuman Berkafein',
    category: 'Minuman',
    isSafe: false,
    badge: 'Pantang Dehidrasi',
    shortReason: 'Kafein adalah laksatif alami dan diuretik yang mempercepat dehidrasi.',
    details: 'Kafein merangsang otot usus berkontraksi lebih liar serta meningkatkan pembuangan cairan melalui ginjal.',
    consumptionTips: 'Ganti kopi harian dengan air hangat, oralit, atau teh herbal chamomile.'
  },
  {
    id: 'soda-sweet-drinks',
    name: 'Minuman Bersoda & Boba Manis',
    category: 'Minuman',
    isSafe: false,
    badge: 'Pantang Gula & Gas',
    shortReason: 'Karbondioksida memicu perut kembung begah; kadar gula tinggi menarik air ke usus.',
    details: 'Tingginya fruktosa / sirup jagung menciptakan efek osmotik yang menarik cairan tubuh ke dalam rongga usus, membuat diare semakin cair.',
    consumptionTips: 'Hindari minuman kemasan manis berperisa selama masa sakit.'
  },
  {
    id: 'fried-oily-food',
    name: 'Gorengan & Makanan Berminyak',
    category: 'Camilan & Bumbu',
    isSafe: false,
    badge: 'Pantang Minyak',
    shortReason: 'Minyak gorengan memperlambat pengosongan lambung dan memicu mules mendadak.',
    details: 'Minyak panas sulit diemulsikan saat enzim empedu dan pencernaan tidak stabil, memicu kram dan feses berlendir.',
    consumptionTips: 'Pilih metode memasak rebus, kukus, atau panggang kering.'
  },
  {
    id: 'acidic-fruits',
    name: 'Buah Sangat Asam (Jeruk, Nanas, Mangga)',
    category: 'Sayur & Buah',
    isSafe: false,
    badge: 'Pantang Asam',
    shortReason: 'Tingkat keasaman tinggi mengikis dinding lambung dan memperparah nyeri melilit.',
    details: 'Asam sitrat dalam jumlah tinggi dapat mengiritasi saluran cerna yang sedang rapuh.',
    consumptionTips: 'Konsumsi buah manis lembut seperti pisang matang atau apel kukus.'
  },
  {
    id: 'gassy-veggies',
    name: 'Sayuran Pemicu Gas (Kol, Brokoli, Sawi)',
    category: 'Sayur & Buah',
    isSafe: false,
    badge: 'Pantang Gas Perut',
    shortReason: 'Raffinose dalam kol dan kembang kol memproduksi gas berlebih di usus.',
    details: 'Memicu perut kembung kencang, kram melilit, dan sendawa berbau tidak sedap.',
    consumptionTips: 'Ganti dengan sayuran ramah cerna seperti wortel dan labu siam rebus.'
  },
  {
    id: 'instant-noodles',
    name: 'Mie Instan Pedas / Bumbu Kuat',
    category: 'Makanan Pokok',
    isSafe: false,
    badge: 'Pantang Pengawet & MSG',
    shortReason: 'Tinggi natrium buatan, minyak gorengan mie, dan bumbu tajam bikin perut begah.',
    details: 'Mie instan diproses dengan teknik deep-frying dan mengandung bumbu tajam yang sangat berat bagi usus sensitif.',
    consumptionTips: 'Ganti karbohidrat dengan bubur beras putih alami buatan sendiri.'
  },
  {
    id: 'artificial-sweetener',
    name: 'Permen Karet & Pemanis Bebas Gula',
    category: 'Camilan & Bumbu',
    isSafe: false,
    badge: 'Efek Pencahar',
    shortReason: 'Sorbitol dan xylitol memiliki efek laksatif (pencahar) alami yang kuat.',
    details: 'Pemanis alkohol tidak diserap dengan baik di usus kecil sehingga menarik air dan memfermentasi gas di usus besar.',
    consumptionTips: 'Periksa label makanan dari pemanis berakhiran -ol seperti sorbitol, manitol, xylitol.'
  }
];
