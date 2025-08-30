export const siteContent = {
  rf: {
    hero: {
      title: 'Модульные дома по всей России',
      subtitle: 'Быстрое строительство качественных домов с доставкой в любой регион',
      buttonText: 'Начать проектирование'
    },
    advantages: {
      title: 'Преимущества модульных домов',
      items: [
        {
          title: 'Быстрое строительство',
          description: 'Готовый дом за 30-60 дней'
        },
        {
          title: 'Доступная цена',
          description: 'От 850 000 рублей за дом'
        },
        {
          title: 'Качественные материалы',
          description: 'Сертифицированные материалы'
        }
      ]
    },
    contact: {
      phone: '+7 (800) 555-0199',
      email: 'info@easyhouse.ru'
    }
  },
  sk: {
    hero: {
      title: 'Модульные дома в Ставропольском крае',
      subtitle: 'Строительство и доставка модульных домов по Ставропольскому краю',
      buttonText: 'Заказать в СК'
    },
    advantages: {
      title: 'Почему выбирают нас в Ставрополе',
      items: [
        {
          title: 'Местное производство',
          description: 'Производство в Ставрополе'
        },
        {
          title: 'Быстрая доставка',
          description: 'Доставка по краю за 1-2 дня'
        },
        {
          title: 'Региональные цены',
          description: 'От 750 000 рублей за дом'
        }
      ]
    },
    contact: {
      phone: '+7 (8652) 555-0123',
      email: 'stavropol@easyhouse.ru'
    }
  },
  kk: {
    hero: {
      title: 'Модульные дома в Краснодарском крае',
      subtitle: 'Качественные дома для юга России с учетом климатических особенностей',
      buttonText: 'Заказать в КК'
    },
    advantages: {
      title: 'Специально для Краснодарского края',
      items: [
        {
          title: 'Климатическая адаптация',
          description: 'Дома адаптированы под южный климат'
        },
        {
          title: 'Быстрая установка',
          description: 'Монтаж за 15-30 дней'
        },
        {
          title: 'Выгодные цены',
          description: 'От 780 000 рублей за дом'
        }
      ]
    },
    contact: {
      phone: '+7 (861) 555-0145',
      email: 'krasnodar@easyhouse.ru'
    }
  },
  kchr: {
    hero: {
      title: 'Модульные дома в КЧР',
      subtitle: 'Надежные дома для горных и равнинных районов Карачаево-Черкесии',
      buttonText: 'Заказать в КЧР'
    },
    advantages: {
      title: 'Для условий КЧР',
      items: [
        {
          title: 'Горный климат',
          description: 'Усиленная конструкция для гор'
        },
        {
          title: 'Доставка в горы',
          description: 'Доставка в труднодоступные места'
        },
        {
          title: 'Специальные цены',
          description: 'От 720 000 рублей за дом'
        }
      ]
    },
    contact: {
      phone: '+7 (87822) 555-0167',
      email: 'kchr@easyhouse.ru'
    }
  },
  kbr: {
    hero: {
      title: 'Модульные дома в КБР',
      subtitle: 'Современные решения для Кабардино-Балкарии с доставкой по всей республике',
      buttonText: 'Заказать в КБР'
    },
    advantages: {
      title: 'Преимущества в КБР',
      items: [
        {
          title: 'Сейсмостойкость',
          description: 'Конструкции выдерживают землетрясения'
        },
        {
          title: 'Местная поддержка',
          description: 'Сервис и поддержка в регионе'
        },
        {
          title: 'Доступность',
          description: 'От 700 000 рублей за дом'
        }
      ]
    },
    contact: {
      phone: '+7 (8662) 555-0189',
      email: 'kbr@easyhouse.ru'
    }
  }
};

export const getContentByRegion = (regionId) => siteContent[regionId] || siteContent.rf;