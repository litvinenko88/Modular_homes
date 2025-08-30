export const regions = [
  { 
    id: 'rf', 
    full: 'Вся Россия', 
    short: 'РФ',
    slug: 'russia'
  },
  { 
    id: 'stavropolskiy-kray', 
    full: 'Ставропольский край', 
    short: 'СК',
    slug: 'stavropolskiy-kray'
  },
  { 
    id: 'krasnodarskiy-kray', 
    full: 'Краснодарский край', 
    short: 'КК',
    slug: 'krasnodarskiy-kray'
  },
  { 
    id: 'karachaevo-cherkesskaya-respublika', 
    full: 'Республика КЧР', 
    short: 'КЧР',
    slug: 'karachaevo-cherkesskaya-respublika'
  },
  { 
    id: 'kabardino-balkarskaya-respublika', 
    full: 'Республика КБР', 
    short: 'КБР',
    slug: 'kabardino-balkarskaya-respublika'
  }
];

export const getRegionById = (id) => regions.find(region => region.id === id);
export const getRegionBySlug = (slug) => regions.find(region => region.slug === slug);

// Маппинг старых ID на новые для обратной совместимости
export const regionMapping = {
  'sk': 'stavropolskiy-kray',
  'kk': 'krasnodarskiy-kray', 
  'kchr': 'karachaevo-cherkesskaya-respublika',
  'kbr': 'kabardino-balkarskaya-respublika'
};