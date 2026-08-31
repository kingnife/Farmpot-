export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT Abuja', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara'
];

export const NIGERIAN_LGAS_BY_STATE: Record<string, string[]> = {
  'Lagos': ['Ikeja', 'Apapa', 'Ikorodu', 'Epe', 'Lagos Island', 'Surulere', 'Oshodi-Isolo', 'Alimosho', 'Eti-Osa', 'Badagry'],
  'Kaduna': ['Zaria', 'Kaduna North', 'Kaduna South', 'Chikun', 'Giwa', 'Igabi', 'Ikara', 'Kudan', 'Lere', 'Makarfi', 'Soba'],
  'Kano': ['Nassarawa', 'Kura', 'Dala', 'Fagge', 'Kano Municipal', 'Gwale', 'Tarauni', 'Bichi', 'Dawakin Kudu', 'Dawakin Tofa', 'Wudil', 'Bagwai'],
  'Oyo': ['Iseyin', 'Ibadan North', 'Ibadan South-West', 'Ogbomoso North', 'Ogbomoso South', 'Oyo East', 'Oyo West', 'Saki West', 'Saki East', 'Afijio', 'Akinyele'],
  'Ogun': ['Sagamu', 'Abeokuta South', 'Abeokuta North', 'Ado-Odo/Ota', 'Ijebu Ode', 'Ifo', 'Obafemi Owode', 'Yewa South'],
  'Benue': ['Gboko', 'Makurdi', 'Otukpo', 'Vandeikya', 'Katsina-Ala', 'Gwer East', 'Gwer West', 'Buruku', 'Ushongo'],
  'Plateau': ['Jos North', 'Jos South', 'Jos East', 'Barkin Ladi', 'Bassa', 'Bokkos', 'Mangu', 'Pankshin', 'Riyom', 'Shendam'],
  'FCT Abuja': ['Municipal', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali', 'Abaji'],
  'Niger': ['Chanchaga', 'Bida', 'Kontagora', 'Suleja', 'Mokwa', 'Rafi', 'Shiroro', 'Lavun'],
  'Bauchi': ['Bauchi', 'Azare', 'Misau', 'Katagum', 'Jama\'are', 'Toro', 'Alkaleri', 'Dass'],
  'Taraba': ['Jalingo', 'Wukari', 'Bali', 'Gashaka', 'Takum', 'Sardauna', 'Karim Lamido'],
  'Katsina': ['Katsina', 'Funtua', 'Daura', 'Malumfashi', 'Kankia', 'Bakori', 'Dandume'],
  'Jigawa': ['Dutse', 'Hadejia', 'Kazaure', 'Gumel', 'Ringim', 'Birnin Kudu'],
  'Kebbi': ['Birnin Kebbi', 'Argungu', 'Yauri', 'Zuru', 'Jega', 'Bagudo'],
  'Nasarawa': ['Lafia', 'Keffi', 'Akwanga', 'Karu', 'Doma', 'Nasarawa'],
  'Delta': ['Warri South', 'Asaba (Oshimili South)', 'Ughelli North', 'Sapele', 'Ika North-East'],
  'Rivers': ['Port Harcourt', 'Obio-Akpor', 'Eleme', 'Ikwerre', 'Oyigbo', 'Bonny'],
  'Edo': ['Oredo (Benin City)', 'Ikpoba-Okha', 'Egor', 'Esan West', 'Ovia North-East'],
  'Enugu': ['Enugu North', 'Enugu South', 'Enugu East', 'Nsukka', 'Udi', 'Ezeagu'],
  'Anambra': ['Awka South', 'Onitsha North', 'Onitsha South', 'Nnewi North', 'Aguata', 'Ogbaru'],
};

export const NIGERIAN_BANKS = [
  'Access Bank Nigeria PLC',
  'Zenith Bank PLC',
  'Guaranty Trust Bank (GTBank)',
  'First Bank of Nigeria',
  'United Bank for Africa (UBA)',
  'Stanbic IBTC Bank',
  'Sterling Bank PLC',
  'Fidelity Bank PLC',
  'First City Monument Bank (FCMB)',
  'Union Bank of Nigeria',
  'Wema Bank PLC',
  'Polaris Bank',
  'Ecobank Nigeria',
  'Kuda Microfinance Bank',
  'Moniepoint Microfinance Bank',
  'OPay Digital Services',
  'Palmpay Limited',
  'Jaiz Bank PLC (Non-Interest)',
  'Taj Bank PLC'
];

export const COMMODITY_SUGGESTIONS = [
  'Roma Tomatoes',
  'Yellow Maize',
  'White Maize',
  'Soybeans',
  'Cassava Tubers',
  'Chili Pepper',
  'Sweet Corn',
  'White Yam',
  'Paddy Rice',
  'Milled Parboiled Rice',
  'Cocoa Beans',
  'Split Ginger',
  'Sesame Seeds',
  'Raw Cashew Nuts',
  'Red Palm Oil',
  'Sorghum',
  'Millet',
  'Cowpea / Brown Beans',
  'Groundnut (Peanuts)',
  'Irish Potatoes'
];

export const AVATAR_PRESETS = [
  { label: 'Amina (Buyer / Processor)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
  { label: 'Alhaji Musa (Farmer / Zaria)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
  { label: 'Chief Adeleke (Farmer / Oyo)', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
  { label: 'Emeka (Transporter / Haulage)', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80' },
  { label: 'Dr. Sanusi (Admin / Executive)', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80' },
  { label: 'Hadiza (Farmer / Kano)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80' },
  { label: 'Tunde (Corporate Trader)', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80' },
  { label: 'Chinyere (Agro Enterprise)', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80' },
];
