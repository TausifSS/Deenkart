/**
 * DeenKart Product Catalog & Categories Seed Data
 * Curated authentic Islamic essentials with accurate pricing, specifications, and imagery.
 */

const CATEGORIES_DATA = [
  {
    id: "quran-translations",
    name: "Qur'an & Translations",
    shortName: "Qur'an",
    itemCount: "120+ Items",
    icon: "fa-book-quran",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=600&q=80",
    description: "Authentic Mushafs, translations in English, Urdu & regional languages, Tajweed editions."
  },
  {
    id: "islamic-books",
    name: "Islamic Books",
    shortName: "Islamic Books",
    itemCount: "450+ Items",
    icon: "fa-book",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    description: "Authentic Hadith collections (Bukhari, Muslim), Seerah, Fiqh, and spiritual development."
  },
  {
    id: "prayer-mats",
    name: "Prayer Mats (Sajjadah)",
    shortName: "Prayer Mats",
    itemCount: "200+ Items",
    icon: "fa-rug",
    image: "https://images.unsplash.com/photo-1591017403286-fd8493524e1e?auto=format&fit=crop&w=600&q=80",
    description: "Luxurious velvet, orthopedic memory foam, and pocket travel prayer mats."
  },
  {
    id: "tasbih-accessories",
    name: "Tasbih & Misbaha",
    shortName: "Tasbih",
    itemCount: "150+ Items",
    icon: "fa-gem",
    image: "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=600&q=80",
    description: "Handcrafted 33 and 99 bead gemstone, crystal, olive wood, and digital tasbih counters."
  },
  {
    id: "hijab-abaya",
    name: "Hijab & Abaya",
    shortName: "Hijab & Abaya",
    itemCount: "300+ Items",
    icon: "fa-vest",
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=600&q=80",
    description: "Premium Nida abayas, modal hijabs, khimars, crinkle scarves and modest wraps."
  },
  {
    id: "mens-wear",
    name: "Men's Wear & Jubba",
    shortName: "Men's Wear",
    itemCount: "180+ Items",
    icon: "fa-shirt",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
    description: "Tailored Emirati & Saudi thobes, embroidered kurtas, Islamic cotton tees and loungewear."
  },
  {
    id: "topi-caps",
    name: "Topi / Prayer Caps",
    shortName: "Topi / Caps",
    itemCount: "90+ Items",
    icon: "fa-hat-cowboy",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80",
    description: "Omani, Turkish, Barkati, crochet, and soft velvet prayer caps for men and boys."
  },
  {
    id: "attar-fragrance",
    name: "Attar & Fragrances",
    shortName: "Attar",
    itemCount: "100+ Items",
    icon: "fa-bottle-droplet",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80",
    description: "100% alcohol-free pure oils: Royal White Oudh, Dehn al Oudh, Musk, Amber & Floral."
  },
  {
    id: "islamic-decor",
    name: "Islamic Home Decor",
    shortName: "Home Decor",
    itemCount: "120+ Items",
    icon: "fa-couch",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
    description: "Laser cut Ayat-ul-Kursi frames, brass lanterns, Islamic wall clocks and crescent lamps."
  },
  {
    id: "kids-collection",
    name: "Kids Collection",
    shortName: "Kids",
    itemCount: "180+ Items",
    icon: "fa-child-reaching",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
    description: "My First Quran storybooks, Arabic alphabet wooden puzzles, and children's prayer sets."
  },
  {
    id: "gifts-combos",
    name: "Gifts & Combos",
    shortName: "Gifts",
    itemCount: "90+ Items",
    icon: "fa-gift",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
    description: "Curated Ramadan hampers, Nikah gifts, Ajwa date boxes and luxury Quran gift sets."
  }
];

const PRODUCTS_DATA = [
  {
    id: "prod-quran-english",
    name: "The Noble Qur'an (English Translation)",
    subtitle: "Clear translation. Easy to read. A must-have for every Muslim home.",
    category: "quran-translations",
    categoryName: "Qur'an & Translations",
    price: 599,
    originalPrice: 849,
    discount: 29,
    rating: 4.9,
    reviewsCount: 1200,
    reviewsCountText: "1.2K",
    stock: 24,
    bestseller: true,
    featured: true,
    offer: true,
    subTag: "translation",
    tags: ["quran", "english", "translation", "with cover", "darussalam", "holy quran", "book", "all"],
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1591017403286-fd8493524e1e?auto=format&fit=crop&w=800&q=80"
    ],
    highlights: ["Original Edition", "High Quality Print", "Easy to Read", "Ideal Gift"],
    specs: {
      "Language": "Arabic & English",
      "Publisher": "Darussalam Publications",
      "Pages": "1236",
      "Binding": "Hardcover with Gold Foil",
      "Size": "A5 (Standard)",
      "Weight": "1.2 kg",
      "Delivery": "Available in Shikrapur (Same/Next Day)"
    },
    description: "The Noble Qur'an with English translation is a clear and authentic edition, perfect for daily reading, learning and sharing with family."
  },
  {
    id: "prod-quran-urdu",
    name: "Qur'an with Urdu Translation",
    subtitle: "Authentic translation with comprehensive word-by-word tafseer.",
    category: "quran-translations",
    categoryName: "Qur'an & Translations",
    price: 649,
    originalPrice: 899,
    discount: 28,
    rating: 4.8,
    reviewsCount: 856,
    reviewsCountText: "856",
    stock: 18,
    bestseller: false,
    featured: false,
    offer: true,
    subTag: "translation",
    tags: ["quran", "urdu", "translation", "tarjuma", "tafsir", "all"],
    image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80"
    ],
    highlights: ["Word by Word Meaning", "Tajweed Color Coding", "Large Bold Font", "Ribbon Marker"],
    specs: {
      "Language": "Arabic & Urdu",
      "Translation By": "Maulana Fateh Muhammad Jalandhari",
      "Pages": "1050",
      "Binding": "Rexine Hardcover",
      "Weight": "1.3 kg"
    },
    description: "Clear and lucid Urdu translation alongside high-grade Arabic calligraphy. An ideal companion for daily tilawat and comprehension."
  },
  {
    id: "prod-quran-arabic-only",
    name: "Qur'an (Arabic Only)",
    subtitle: "Authentic 15-line Uthmani script Mushaf with gold-embossed navy cover.",
    category: "quran-translations",
    categoryName: "Qur'an & Translations",
    price: 499,
    originalPrice: 699,
    discount: 29,
    rating: 4.9,
    reviewsCount: 2100,
    reviewsCountText: "2.1K",
    stock: 35,
    bestseller: true,
    featured: true,
    offer: true,
    subTag: "arabic",
    tags: ["quran", "arabic", "mushaf", "with cover", "uthmani", "all"],
    image: "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=800&q=80"
    ],
    highlights: ["15-Line Saudi Standard", "Gold Foil Embossed", "Durable Rexine Cover", "Crystal Clear Text"],
    specs: {
      "Script": "Uthmani 15 Lines",
      "Binding": "Padded Leatherette",
      "Pages": "611",
      "Weight": "850 g"
    },
    description: "Standard 15-line Arabic Mushaf ideal for Huffaz and daily Quran recitation. High-grade cream paper with easy-on-the-eyes calligraphy."
  },
  {
    id: "prod-quran-tafsir-set",
    name: "Qur'an Tafsir Set",
    subtitle: "Complete authentic Tafsir collection with comprehensive scholarly commentary.",
    category: "quran-translations",
    categoryName: "Qur'an & Translations",
    price: 1299,
    originalPrice: 1799,
    discount: 27,
    rating: 4.8,
    reviewsCount: 320,
    reviewsCountText: "320",
    stock: 14,
    bestseller: false,
    featured: true,
    offer: true,
    subTag: "tafsir",
    tags: ["quran", "tafsir", "set", "translation", "with cover", "books", "all"],
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
    ],
    highlights: ["Complete Volume Set", "Detailed Commentary", "Verified Sources", "Gold Trim Edges"],
    specs: {
      "Language": "Arabic with Urdu/English Translation",
      "Binding": "Hardbound Deluxe Edition",
      "Weight": "3.8 kg"
    },
    description: "In-depth Tafsir providing historical context, linguistic nuances, and wisdom behind the divine revelations."
  },
  {
    id: "prod-prayer-mat-emerald",
    name: "Premium Prayer Mat (Sajjadah)",
    subtitle: "Plush orthopedic foam with timeless Turkish floral embroidery.",
    category: "prayer-mats",
    categoryName: "Prayer Mats (Sajjadah)",
    price: 499,
    originalPrice: 699,
    discount: 29,
    rating: 4.9,
    reviewsCount: 340,
    stock: 30,
    bestseller: true,
    featured: true,
    offer: true,
    tags: ["prayer mat", "janamaz", "sajjadah", "carpet", "velvet", "emerald"],
    image: "https://images.unsplash.com/photo-1591017403286-fd8493524e1e?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1591017403286-fd8493524e1e?auto=format&fit=crop&w=800&q=80"
    ],
    highlights: ["Knee Cushioning Support", "Non-Slip Backing", "Handmade Fringe", "Washable Velvet"],
    specs: {
      "Material": "Super-soft Microfiber Velvet",
      "Dimensions": "115 cm x 70 cm",
      "Thickness": "12 mm Padded",
      "Color": "Deep Emerald Green & Gold Trim",
      "Origin": "Imported Istanbul"
    },
    description: "Engineered for maximum comfort during extended Salah and Taraweeh prayers. Features an anti-skid rubber base and ergonomic knee support."
  },
  {
    id: "prod-crystal-tasbih",
    name: "Crystal Tasbih (99 Beads)",
    subtitle: "Precision cut faceted green glass beads with silky tassel.",
    category: "tasbih-accessories",
    categoryName: "Tasbih & Misbaha",
    price: 279,
    originalPrice: 399,
    discount: 30,
    rating: 4.7,
    reviewsCount: 98,
    stock: 45,
    bestseller: false,
    featured: true,
    offer: true,
    tags: ["tasbih", "misbaha", "beads", "dhikr", "crystal", "emerald"],
    image: "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=800&q=80"
    ],
    highlights: ["99 Faceted Beads", "Heavy Durable Thread", "Metallic Dividers", "Gift Pouch Included"],
    specs: {
      "Bead Size": "8 mm diameter",
      "Count": "99 Beads with 33-bead separators",
      "Material": "Bohemian Cut Crystal",
      "Weight": "85 grams"
    },
    description: "A calming tactile feel for daily remembrance and dhikr. Comes secured with a gold-tone metallic finial and soft silk tassel."
  },
  {
    id: "prod-oud-arab-attar",
    name: "Oud Al Arab Attar (50ml Luxury Edition)",
    subtitle: "Rich woody Cambodian oud blended with warm amber & floral notes.",
    category: "attar-fragrance",
    categoryName: "Attar & Fragrances",
    price: 499,
    originalPrice: 599,
    discount: 17,
    rating: 4.8,
    reviewsCount: 76,
    stock: 22,
    bestseller: false,
    featured: true,
    offer: true,
    tags: ["attar", "perfume", "oud", "alcohol free", "halal fragrance", "musk"],
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
    ],
    highlights: ["100% Alcohol-Free", "Long Lasting (18+ Hours)", "Roll-On & Dipstick", "Artisan Crystal Decanter"],
    specs: {
      "Volume": "50 ml / 1.7 fl oz",
      "Type": "Concentrated Perfume Oil (Ittar)",
      "Scent Profile": "Smoky Agarwood, Ambergris, Damascus Rose",
      "Alcohol Content": "0% Pure Oil"
    },
    description: "A royal Arabian attar formulated strictly without alcohol. Opens with crisp spicy saffron and settles into an opulent warm oud that radiates longevity for Jummah and daily prayers."
  },
  {
    id: "prod-nida-abaya-black",
    name: "Nida Abaya (Midnight Black)",
    subtitle: "Flowing Korean Nida fabric with refined gold cuff embroidery.",
    category: "hijab-abaya",
    categoryName: "Hijab & Abaya",
    price: 1299,
    originalPrice: 1749,
    discount: 26,
    rating: 4.6,
    reviewsCount: 54,
    stock: 14,
    bestseller: true,
    featured: true,
    offer: true,
    tags: ["abaya", "burqa", "hijab", "modest clothing", "islamic dress", "nida"],
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80"
    ],
    highlights: ["Breathable Korean Nida", "Wrinkle Resistant", "Concealed Front Zipper", "Matching Scarf Included"],
    specs: {
      "Fabric": "Premium Matte Nida Fabric",
      "Available Sizes": "52, 54, 56, 58 (Length in inches)",
      "Pattern": "Classic Front Open with Buttons/Zip",
      "Care": "Hand Wash or Gentle Machine Cycle"
    },
    description: "Graceful and modest drapery suited for all-day comfort, gatherings, and daily wear. Breathable and opaque fabric designed for Indian climate conditions."
  },
  {
    id: "prod-men-embroidered-kurta",
    name: "Embroidered Kurta (Men's Ivory)",
    subtitle: "Crisp cotton-linen blend with minimal geometric neck embroidery.",
    category: "mens-wear",
    categoryName: "Men's Wear & Jubba",
    price: 899,
    originalPrice: 1199,
    discount: 25,
    rating: 4.8,
    reviewsCount: 110,
    stock: 16,
    bestseller: false,
    featured: true,
    offer: false,
    tags: ["kurta", "men", "thobe", "jubba", "cotton", "eid wear", "clothing"],
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
    ],
    highlights: ["100% Breathable Cotton", "Subtle Collar Threadwork", "Dual Deep Pockets", "Pre-Shrunk Quality"],
    specs: {
      "Material": "Pure Long-Staple Cotton",
      "Sizes": "38, 40, 42, 44",
      "Fit": "Comfort Regular Fit",
      "Occasion": "Jummah, Eid, Daily Modest Wear"
    },
    description: "An elegant, lightweight white-ivory kurta tailored for absolute dignity, breathable comfort, and timeless elegance."
  },
  {
    id: "prod-my-first-quran-kids",
    name: "My First Qur'an (Kids Edition)",
    subtitle: "Simple language with charming full-color illustrated stories.",
    category: "quran-translations",
    secondaryCategory: "kids-collection",
    categoryName: "Qur'an & Translations",
    price: 399,
    originalPrice: 599,
    discount: 33,
    rating: 4.7,
    reviewsCount: 642,
    reviewsCountText: "642",
    stock: 35,
    bestseller: false,
    featured: true,
    offer: true,
    subTag: "kids",
    tags: ["kids", "children", "quran", "stories", "learning", "books", "all"],
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80"
    ],
    highlights: ["Kid-Friendly Language", "Full Color Illustrations", "Durable Board Paper", "Ages 4 to 12"],
    specs: {
      "Format": "Hardcover Storybook",
      "Pages": "320 Illustrated Pages",
      "Language": "English with simple Arabic phrases",
      "Publisher": "Goodword Books"
    },
    description: "Nurture love for Allah and His Prophets in young hearts through engaging bedtime stories, gentle morals, and vibrant illustrations."
  },
  {
    id: "prod-wooden-rehal-stand",
    name: "Qur'an Rehal (Wooden)",
    subtitle: "Foldable sheesham hardwood with carved floral jaali work.",
    category: "quran-translations",
    secondaryCategory: "prayer-mats",
    categoryName: "Qur'an & Translations",
    price: 499,
    originalPrice: 699,
    discount: 29,
    rating: 4.9,
    reviewsCount: 1100,
    reviewsCountText: "1.1K",
    stock: 20,
    bestseller: false,
    featured: false,
    offer: true,
    subTag: "with-cover",
    tags: ["quran", "rehal", "stand", "wooden", "handcrafted", "folding", "with cover", "all"],
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"
    ],
    highlights: ["Solid Sheesham Wood", "Smooth Natural Wax Polish", "Collapsible Single-Piece Carving", "Ergonomic Angle"],
    specs: {
      "Dimensions": "12 x 8 inches",
      "Wood Type": "Natural Indian Rosewood",
      "Finish": "Antique Hand-Rubbed Wax"
    },
    description: "A sacred pedestal for reciting the Holy Quran. Hand-carved from a single piece of treated wood without metal hinges or nails."
  },
  {
    id: "prod-ramadan-gift-hamper",
    name: "Ramadan & Eid Mubarak Luxury Gift Box",
    subtitle: "Includes Ajwa dates, 99-bead tasbih, attar, and Dua booklet.",
    category: "gifts-combos",
    categoryName: "Gifts & Combos",
    price: 1499,
    originalPrice: 1999,
    discount: 25,
    rating: 5.0,
    reviewsCount: 89,
    stock: 15,
    bestseller: false,
    featured: true,
    offer: true,
    tags: ["gift", "hamper", "ramadan", "eid", "dates", "combo", "box"],
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80"
    ],
    highlights: ["Authentic Medina Ajwa Dates (250g)", "Oud Attar (12ml)", "Velvet Tasbih Pouch", "Custom Greeting Card"],
    specs: {
      "Box Style": "Emerald Green Foil Embossed Rigid Box",
      "Weight": "1.1 kg",
      "Shelf Life": "Dates: 6 Months fresh"
    },
    description: "The most thoughtful gift for Ramadan, Eid, weddings, or welcoming family back from Umrah. Beautifully arranged and ready to present."
  },
  {
    id: "prod-prayer-cap-turkish",
    name: "Turkish Velvet Kufi / Prayer Cap",
    subtitle: "Structured diamond stitched premium prayer topi with soft cotton lining.",
    category: "topi-caps",
    categoryName: "Topi / Prayer Caps",
    price: 199,
    originalPrice: 299,
    discount: 33,
    rating: 4.8,
    reviewsCount: 77,
    stock: 50,
    bestseller: false,
    featured: false,
    offer: false,
    tags: ["topi", "kufi", "cap", "prayer hat", "turkish"],
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80"
    ],
    highlights: ["Breathable Cotton Interior", "Crush-Resistant Shape", "Multiple Sizes Available", "Washable"],
    specs: {
      "Material": "Soft Velour with Cotton Lining",
      "Sizes": "S (21.5 in), M (22.5 in), L (23.5 in)",
      "Colors": "Charcoal Black, Midnight Navy, Forest Green"
    },
    description: "Comfortable and dignified prayer cap designed to fit snugly during Sujood without slipping."
  },
  {
    id: "prod-bukhari-set",
    name: "Sahih Al-Bukhari (Complete 9-Volume Deluxe Set)",
    subtitle: "Complete authentic Hadith collection with full Arabic text and English/Urdu translation.",
    category: "islamic-books",
    categoryName: "Islamic Books",
    price: 3499,
    originalPrice: 4200,
    discount: 17,
    rating: 5.0,
    reviewsCount: 195,
    reviewsCountText: "195",
    stock: 8,
    bestseller: true,
    featured: true,
    offer: false,
    tags: ["bukhari", "hadith", "islamic books", "sunnah", "darussalam", "books", "all"],
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
    ],
    highlights: ["Complete 9 Volumes", "Authentic Darussalam", "Gold Embossed Spine", "Arabic & English"],
    specs: {
      "Author": "Imam Muhammad al-Bukhari",
      "Publisher": "Darussalam Publications",
      "Binding": "Hardcover Box Set",
      "Volumes": "9 Deluxe Volumes"
    },
    description: "The most authentic book of Hadith after the Holy Qur'an, compiled meticulously by Imam Bukhari. Essential for every Islamic household."
  },
  {
    id: "prod-sealed-nectar",
    name: "The Sealed Nectar (Ar-Raheeq Al-Makhtum)",
    subtitle: "Award-winning complete biography of the Noble Prophet Muhammad (PBUH).",
    category: "islamic-books",
    categoryName: "Islamic Books",
    price: 449,
    originalPrice: 599,
    discount: 25,
    rating: 4.9,
    reviewsCount: 420,
    reviewsCountText: "420",
    stock: 25,
    bestseller: true,
    featured: true,
    offer: true,
    tags: ["seerah", "prophet", "biography", "islamic books", "sealed nectar", "books", "all"],
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80"
    ],
    highlights: ["First Prize Winner Muslim World League", "Comprehensive Seerah", "Maps & Lineages", "Clear Typeface"],
    specs: {
      "Author": "Safiur Rahman Al-Mubarakpuri",
      "Pages": "580",
      "Binding": "Hardbound Edition"
    },
    description: "A complete authoritative book on the life of Prophet Muhammad (PBUH) by Sheikh Safiur Rahman Al-Mubarakpuri."
  },
  {
    id: "prod-fortress-muslim",
    name: "Fortress of the Muslim (Hisn al-Muslim)",
    subtitle: "Authentic invocations and supplications from the Qur'an and Sunnah.",
    category: "islamic-books",
    categoryName: "Islamic Books",
    price: 149,
    originalPrice: 199,
    discount: 25,
    rating: 4.9,
    reviewsCount: 880,
    reviewsCountText: "880",
    stock: 50,
    bestseller: true,
    featured: false,
    offer: false,
    tags: ["dua", "supplication", "hisn muslim", "pocket book", "islamic books", "all"],
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
    ],
    highlights: ["Pocket Size", "Arabic with Transliteration & Translation", "Everyday Duas", "Durable Rexine"],
    specs: {
      "Author": "Sa'id bin Wahf Al-Qahtani",
      "Pages": "240",
      "Size": "Pocket (10x7 cm)"
    },
    description: "Pocket-sized authentic collection of daily prayers, morning/evening adhkar and invocations for every Muslim."
  },
  {
    id: "prod-ayatul-kursi-frame",
    name: "Ayat al-Kursi Gold Mirror Wall Art (24x18 Inch)",
    subtitle: "Stunning 3D Islamic calligraphy mirror frame for home protection and barakah.",
    category: "islamic-decor",
    categoryName: "Islamic Home Decor",
    price: 899,
    originalPrice: 1299,
    discount: 31,
    rating: 4.9,
    reviewsCount: 160,
    reviewsCountText: "160",
    stock: 15,
    bestseller: true,
    featured: true,
    offer: true,
    tags: ["decor", "wall art", "ayatul kursi", "frame", "calligraphy", "all"],
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"
    ],
    highlights: ["3D Mirror Acrylic Finish", "Easy Wall Hanging", "Fade Resistant", "Gift Box Packed"],
    specs: {
      "Dimensions": "60 cm x 45 cm",
      "Material": "Premium Gold Acrylic on Wood Base",
      "Mounting": "Pre-installed sawtooth hanger"
    },
    description: "Handcrafted Ayat al-Kursi calligraphy in reflective gold mirror finish. Brings elegance, remembrance and barakah to your living room or entrance."
  },
  {
    id: "prod-kaaba-tapestry-clock",
    name: "Islamic Wooden Wall Clock with Kaaba Calligraphy",
    subtitle: "Silent quartz movement with engraved Arabic numerals and gold accents.",
    category: "islamic-decor",
    categoryName: "Islamic Home Decor",
    price: 649,
    originalPrice: 899,
    discount: 28,
    rating: 4.8,
    reviewsCount: 88,
    reviewsCountText: "88",
    stock: 20,
    bestseller: false,
    featured: true,
    offer: false,
    tags: ["decor", "clock", "wall clock", "kaaba", "wooden", "all"],
    image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80"
    ],
    highlights: ["Silent Sweep Movement", "Laser Engraved Wood", "AA Battery Operated", "Modern Minimalist"],
    specs: {
      "Diameter": "30 cm",
      "Material": "Natural Engineered Wood",
      "Movement": "Silent Quartz"
    },
    description: "Quiet sweep mechanism ensures zero ticking noise while serving as a beautiful reminder of Islamic heritage."
  }
];

// Sample orders matching exact DeenKart customer reference
const INITIAL_SAMPLE_ORDERS = [
  {
    id: "DK10234",
    date: "12 Aug 2025, 10:24 AM",
    items: [
      {
        id: "prod-quran-english",
        name: "Qur'an (English Translation)",
        price: 699,
        qty: 1,
        image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=300&q=80"
      }
    ],
    itemCountText: "1 item • ₹699",
    subtotal: 699,
    deliveryFee: 0,
    discount: 0,
    total: 699,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    statusNote: "Alhamdulillah! 🎉",
    actionType: "buy_again",
    actionLabel: "Buy Again",
    deliveryAddress: {
      name: "Tausif Shaikh",
      phone: "+91 98765 43210",
      house: "Flat No. 203, Al-Hidayah Apartments",
      area: "Naya Nagar, Near Jama Masjid",
      pincode: "412208",
      city: "Shikrapur"
    }
  },
  {
    id: "DK10233",
    date: "10 Aug 2025, 06:18 PM",
    items: [
      {
        id: "prod-crystal-tasbih",
        name: "Premium Tasbih (99 Beads)",
        price: 299,
        qty: 1,
        image: "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=300&q=80"
      }
    ],
    itemCountText: "1 item • ₹299",
    subtotal: 299,
    deliveryFee: 0,
    discount: 0,
    total: 299,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    orderStatus: "Out for Delivery",
    statusNote: "Arriving Today",
    actionType: "track_order",
    actionLabel: "Track Order",
    deliveryAddress: {
      name: "Tausif Shaikh",
      phone: "+91 98765 43210",
      house: "Flat No. 203, Al-Hidayah Apartments",
      area: "Naya Nagar, Near Jama Masjid",
      pincode: "412208",
      city: "Shikrapur"
    }
  },
  {
    id: "DK10232",
    date: "08 Aug 2025, 03:12 PM",
    items: [
      {
        id: "prod-nida-abaya-black",
        name: "Nida Abaya (Black)",
        price: 1299,
        qty: 1,
        image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=300&q=80"
      }
    ],
    itemCountText: "1 item • ₹1,299",
    subtotal: 1299,
    deliveryFee: 0,
    discount: 0,
    total: 1299,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    orderStatus: "Processing",
    statusNote: "Preparing your order",
    actionType: "view_details",
    actionLabel: "View Details",
    deliveryAddress: {
      name: "Tausif Shaikh",
      phone: "+91 98765 43210",
      house: "Flat No. 203, Al-Hidayah Apartments",
      area: "Naya Nagar, Near Jama Masjid",
      pincode: "412208",
      city: "Shikrapur"
    }
  },
  {
    id: "DK10231",
    date: "05 Aug 2025, 11:50 AM",
    items: [
      {
        id: "prod-oud-arab-attar",
        name: "Oud Al Arab Attar (50ml)",
        price: 499,
        qty: 1,
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=300&q=80"
      }
    ],
    itemCountText: "1 item • ₹499",
    subtotal: 499,
    deliveryFee: 0,
    discount: 0,
    total: 499,
    paymentMethod: "COD",
    paymentStatus: "Pending",
    orderStatus: "Pending",
    statusNote: "Waiting for confirmation",
    actionType: "cancel_order",
    actionLabel: "Cancel Order",
    deliveryAddress: {
      name: "Tausif Shaikh",
      phone: "+91 98765 43210",
      house: "Flat No. 203, Al-Hidayah Apartments",
      area: "Naya Nagar, Near Jama Masjid",
      pincode: "412208",
      city: "Shikrapur"
    }
  },
  {
    id: "DK10230",
    date: "28 Jul 2025, 07:40 PM",
    items: [
      {
        id: "prod-prayer-mat-emerald",
        name: "Sajadah Prayer Mat",
        price: 499,
        qty: 2,
        image: "https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=300&q=80"
      }
    ],
    itemCountText: "2 items • ₹998",
    subtotal: 998,
    deliveryFee: 0,
    discount: 0,
    total: 998,
    paymentMethod: "COD",
    paymentStatus: "Pending",
    orderStatus: "Cancelled",
    statusNote: "Order was cancelled",
    actionType: "view_details",
    actionLabel: "View Details",
    deliveryAddress: {
      name: "Tausif Shaikh",
      phone: "+91 98765 43210",
      house: "Flat No. 203, Al-Hidayah Apartments",
      area: "Naya Nagar, Near Jama Masjid",
      pincode: "412208",
      city: "Shikrapur"
    }
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "New Ramadan Collection is Live!",
    message: "Explore our latest luxury prayer mats, premium ajwa dates, and exclusive attars for Ramadan.",
    time: "2 hours ago",
    read: false,
    type: "promo"
  },
  {
    id: "notif-2",
    title: "Free Delivery in Shikrapur Today",
    message: "Place any order above ₹499 and enjoy free doorstep delivery in Shikrapur (PIN: 412208).",
    time: "1 day ago",
    read: false,
    type: "shipping"
  },
  {
    id: "notif-3",
    title: "Sahih Bukhari 6-Volume Set Restocked",
    message: "The authentic Arabic-English Darussalam edition is back in stock in limited quantities.",
    time: "3 days ago",
    read: true,
    type: "product"
  }
];
