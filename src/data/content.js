export const siteContent = {
  rf: {
    hero: {
      title: 'Модульные дома по всей России',
      subtitle: 'Быстрое строительство качественных домов с доставкой в любой регион',
      buttonText: 'Начать проектирование'
    },
    contact: {
      phone: '+7 (800) 555-0199',
      email: 'info@easyhouse.ru'
    }
  },
  'stavropolskiy-kray': {
    hero: {
      title: 'Модульные дома в Ставропольском крае',
      subtitle: 'Строительство и доставка модульных домов по Ставропольскому краю',
      buttonText: 'Заказать в СК'
    },
    contact: {
      phone: '+7 (8652) 555-0123',
      email: 'stavropol@easyhouse.ru'
    }
  },
  'krasnodarskiy-kray': {
    hero: {
      title: 'Модульные дома в Краснодарском крае',
      subtitle: 'Качественные дома для юга России с учетом климатических особенностей',
      buttonText: 'Заказать в КК'
    },
    contact: {
      phone: '+7 (861) 555-0145',
      email: 'krasnodar@easyhouse.ru'
    }
  },
  'karachaevo-cherkesskaya-respublika': {
    hero: {
      title: 'Модульные дома в КЧР',
      subtitle: 'Надежные дома для горных и равнинных районов Карачаево-Черкесии',
      buttonText: 'Заказать в КЧР'
    },
    contact: {
      phone: '+7 (87822) 555-0167',
      email: 'kchr@easyhouse.ru'
    }
  },
  'kabardino-balkarskaya-respublika': {
    hero: {
      title: 'Модульные дома в КБР',
      subtitle: 'Современные решения для Кабардино-Балкарии с доставкой по всей республике',
      buttonText: 'Заказать в КБР'
    },
    contact: {
      phone: '+7 (8662) 555-0189',
      email: 'kbr@easyhouse.ru'
    }
  }
};

export const getContentByRegion = (regionId) => siteContent[regionId] || siteContent.rf;