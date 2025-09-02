/**
 * Константы приложения
 */

// Брейкпоинты для адаптивности
export const BREAKPOINTS = {
  XS: 320,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1400
};

// Задержки анимаций
export const ANIMATION_DELAYS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 800
};

// Размеры для изображений
export const IMAGE_SIZES = {
  THUMBNAIL: { width: 150, height: 150 },
  SMALL: { width: 300, height: 200 },
  MEDIUM: { width: 600, height: 400 },
  LARGE: { width: 1200, height: 800 },
  HERO: { width: 1920, height: 1080 }
};

// Лимиты для форм
export const FORM_LIMITS = {
  NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 100,
  PHONE_MAX_LENGTH: 20,
  MESSAGE_MAX_LENGTH: 1000,
  SUBJECT_MAX_LENGTH: 100
};

// Регулярные выражения для валидации
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  NAME: /^[a-zA-Zа-яА-ЯёЁ\s\-']{2,50}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
};

// Сообщения об ошибках
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Поле обязательно для заполнения',
  INVALID_EMAIL: 'Неверный формат email',
  INVALID_PHONE: 'Неверный формат телефона',
  INVALID_NAME: 'Имя может содержать только буквы, пробелы и дефисы',
  TOO_LONG: 'Превышена максимальная длина',
  TOO_SHORT: 'Слишком короткое значение',
  NETWORK_ERROR: 'Ошибка сети. Попробуйте позже',
  UNKNOWN_ERROR: 'Произошла неизвестная ошибка'
};

// Настройки производительности
export const PERFORMANCE_CONFIG = {
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,
  INTERSECTION_THRESHOLD: 0.1,
  LAZY_LOAD_MARGIN: '50px'
};

// SEO константы
export const SEO_CONFIG = {
  SITE_NAME: 'Easy House',
  DEFAULT_TITLE: 'Строительство модульных домов под ключ за 30 дней | От 655 000₽',
  DEFAULT_DESCRIPTION: 'Модульные дома от производителя под ключ за 30 дней. Полноценный дом с отделкой и коммуникациями. Доставка и гарантия.',
  DEFAULT_KEYWORDS: 'модульный дом под ключ, модульный дом цена, купить модульный дом, готовый модульный дом, производство модульных домов',
  OG_IMAGE_WIDTH: 1200,
  OG_IMAGE_HEIGHT: 630
};

// Цвета темы
export const THEME_COLORS = {
  PRIMARY: '#31323d',
  ACCENT: '#df682b',
  LIGHT: '#eee8f4',
  WHITE: '#ffffff',
  BLACK: '#000000',
  GRAY: '#666666',
  GRAY_LIGHT: '#f5f5f5'
};

// Z-index слои
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070
};