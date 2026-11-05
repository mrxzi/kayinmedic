import type { BristolStoolType } from '../types';

export const BRISTOL_SCALE_DATA: BristolStoolType[] = [
  {
    type: 1,
    name: 'Tipe 1: Bongkahan Keras',
    category: 'constipation',
    badgeLabel: 'Konstipasi Berat',
    shortDesc: 'Gumpalan keras terpisah seperti kacang, sangat sulit dikeluarkan.',
    detailedDesc: 'Feses terlalu lama berada di usus besar sehingga airnya terserap habis. Menandakan dehidrasi atau kekurangan serat.',
    appearance: 'hard_lumps',
    isDiarrhea: false,
    alertLevel: 'none',
    advice: 'Perbanyak minum air hangat dan buah kaya serat perlahan.'
  },
  {
    type: 2,
    name: 'Tipe 2: Menggumpal Kasar',
    category: 'constipation',
    badgeLabel: 'Konstipasi Ringan',
    shortDesc: 'Berbentuk seperti sosis padat namun permukaannya berbenjol-benjol.',
    detailedDesc: 'Feses masih agak keras dan membutuhkan sedikit dorongan untuk keluar.',
    appearance: 'lumpy_sausage',
    isDiarrhea: false,
    alertLevel: 'none',
    advice: 'Cukupi hidrasi harian minimal 2 liter air mineral.'
  },
  {
    type: 3,
    name: 'Tipe 3: Sosis Beretakan',
    category: 'normal',
    badgeLabel: 'Normal & Sehat',
    shortDesc: 'Berbentuk silinder/sosis dengan sedikit retakan halus di permukaan.',
    detailedDesc: 'Bentuk feses yang tergolong normal dan sehat, mudah dikeluarkan.',
    appearance: 'cracked_sausage',
    isDiarrhea: false,
    alertLevel: 'none',
    advice: 'Kondisi usus baik! Pertahankan asupan makanan bergizi seimbang.'
  },
  {
    type: 4,
    name: 'Tipe 4: Halus & Lembut',
    category: 'normal',
    badgeLabel: 'Sangat Ideal',
    shortDesc: 'Berbentuk sosis atau ular, sangat mulus, halus, dan lembut.',
    detailedDesc: 'Bentuk paling ideal! Menandakan keseimbangan cairan dan flora usus yang sangat prima.',
    appearance: 'smooth_sausage',
    isDiarrhea: false,
    alertLevel: 'none',
    advice: 'Pencernaan kamu bekerja dengan sempurna! Pertahankan ya sayang.'
  },
  {
    type: 5,
    name: 'Tipe 5: Butiran Lembek',
    category: 'diarrhea',
    badgeLabel: 'Waspada Diare Awal',
    shortDesc: 'Gumpalan lembut dengan tepian tegas yang keluar dengan sangat mudah.',
    detailedDesc: 'Pencernaan bergerak lebih cepat dari biasanya. Seringkali merupakan fase awal diare atau usus sedang reaktif.',
    appearance: 'soft_blobs',
    isDiarrhea: true,
    alertLevel: 'moderate',
    advice: '⚠️ Kurangi makanan berlemak, hindari susu sapi, dan mulai siapkan air elektrolit/oralit.'
  },
  {
    type: 6,
    name: 'Tipe 6: Lembek & Bergerigi',
    category: 'diarrhea',
    badgeLabel: 'Diare Sedang',
    shortDesc: 'Potongan lembek tidak beraturan, bertepi ampas, konsistensi seperti bubur cair.',
    detailedDesc: 'Usus mengalami peradangan ringan / iritasi dan gagal menyerap cairan secara maksimal. Risiko dehidrasi mulai meningkat.',
    appearance: 'mushy_pieces',
    isDiarrhea: true,
    alertLevel: 'high',
    advice: '🚨 Segera minum 1 gelas Oralit tiap selesai BAB untuk mencegah dehidrasi & lemas!'
  },
  {
    type: 7,
    name: 'Tipe 7: Cair Sepenuhnya',
    category: 'diarrhea',
    badgeLabel: 'Diare Akut / Berat',
    shortDesc: 'Cair seluruhnya tanpa ada ampas padat (hanya air kecokelatan/keruh).',
    detailedDesc: 'Diare akut aktif. Cairan dan garam mineral keluar secara masif. Berpotensi membuat tubuh lemas dan pusing jika cairan tidak segera diganti.',
    appearance: 'watery_liquid',
    isDiarrhea: true,
    alertLevel: 'high',
    advice: '🚨 KONDISI PERINGATAN: Wajib minum larutan Oralit sekarang! Jika disertai demam tinggi atau lemas ekstrem, segera kabari pasangan atau dokter!'
  }
];
