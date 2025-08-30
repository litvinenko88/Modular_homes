export const regions = [
  { 
    id: 'rf', 
    full: 'Вся Россия', 
    short: 'РФ',
    slug: 'russia'
  },
  { 
    id: 'sk', 
    full: 'Ставропольский край', 
    short: 'СК',
    slug: 'stavropol'
  },
  { 
    id: 'kk', 
    full: 'Краснодарский край', 
    short: 'КК',
    slug: 'krasnodar'
  },
  { 
    id: 'kchr', 
    full: 'Республика КЧР', 
    short: 'КЧР',
    slug: 'karachaevo-cherkessia'
  },
  { 
    id: 'kbr', 
    full: 'Республика КБР', 
    short: 'КБР',
    slug: 'kabardino-balkaria'
  }
];

export const getRegionById = (id) => regions.find(region => region.id === id);
export const getRegionBySlug = (slug) => regions.find(region => region.slug === slug);