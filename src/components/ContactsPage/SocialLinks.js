import styles from './SocialLinks.module.css';

const socialNetworks = [
  { 
    name: 'ВКонтакте', 
    url: '#', 
    color: '#0077ff',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zM12 18.5A6.5 6.5 0 1118.5 12 6.508 6.508 0 0112 18.5zm6.5-11.5a1.5 1.5 0 111.5-1.5A1.5 1.5 0 0118.5 7z"/>
      </svg>
    )
  },
  { 
    name: 'YouTube', 
    url: '#', 
    color: '#ff0000',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  },
  { 
    name: 'Telegram', 
    url: 'https://t.me/litvinenko_n_v', 
    color: '#0088cc',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-.962 6.502-.378 1.73-.891 2.058-1.302 2.058-.44 0-.845-.294-1.24-.788-.292-.364-.521-.695-.656-.88-.394-.539-.692-.846-.692-.846-.26-.188-.455-.613-.157-.613.47 0 .963.278 1.36.641.694.635 1.525 1.492 1.525 1.492.156.212.373.405.606.405.234 0 .429-.193.429-.193.191-.135.353-.286.353-.286.158-.14.355-.31.355-.31.223-.195.4-.359.4-.359.305-.267.577-.49.577-.49.4-.35.72-.625.72-.625.207-.18.36-.311.36-.311.115-.1.186-.155.186-.155.058-.05.088-.075.088-.075.02-.017.029-.025.029-.025.006-.005.009-.008.009-.008.001-.001.001-.001.001-.001-.097-.188-.36-.477-.36-.477-.188-.365-.477-.731-.477-.731-.123-.239-.199-.387-.199-.387-.083-.162-.125-.243-.125-.243-.027-.052-.041-.078-.041-.078-.007-.014-.011-.021-.011-.021-.001-.002-.001-.003-.001-.003 0-.001 0-.001 0-.001.024-.048.071-.143.071-.143.097-.188.245-.477.245-.477.188-.365.477-.731.477-.731.123-.239.199-.387.199-.387.083-.162.125-.243.125-.243.027-.052.041-.078.041-.078.007-.014.011-.021.011-.021.001-.002.001-.003.001-.003 0-.001 0-.001 0-.001z"/>
      </svg>
    )
  },
  { 
    name: 'WhatsApp', 
    url: 'https://wa.me/79964179001', 
    color: '#25d366',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
      </svg>
    )
  }
];

const quickActions = [
  { 
    name: 'Позвонить', 
    url: 'tel:89964179001', 
    color: '#10b981',
    text: '8 (996) 417-90-01',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
      </svg>
    )
  },
  { 
    name: 'Написать Email', 
    url: 'mailto:info@easyhouse.ru', 
    color: '#3b82f6',
    text: 'info@easyhouse.ru',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
    )
  }
];

export default function SocialLinks() {
  return (
    <section className={styles.socialSection}>
      <div className={styles.container}>
        {/* Быстрые действия */}
        <div className={styles.quickActions}>
          <h2 className={styles.sectionTitle}>Свяжитесь с нами прямо сейчас</h2>
          <div className={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.url}
                className={styles.actionButton}
                style={{ '--action-color': action.color }}
                target={action.name !== 'Позвонить' ? '_blank' : '_self'}
                rel={action.name !== 'Позвонить' ? 'noopener noreferrer' : ''}
              >
                <div className={styles.actionIcon}>
                  {action.icon}
                </div>
                <div className={styles.actionContent}>
                  <span className={styles.actionName}>{action.name}</span>
                  <span className={styles.actionText}>{action.text}</span>
                </div>
                <div className={styles.actionArrow}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Социальные сети */}
        <div className={styles.socialNetworks}>
          <h3 className={styles.socialTitle}>Следите за нами в социальных сетях</h3>
          <p className={styles.socialSubtitle}>
            Узнавайте первыми о новых проектах, акциях и полезных советах по строительству
          </p>
          <div className={styles.socialGrid}>
            {socialNetworks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                className={styles.socialCard}
                style={{ '--social-color': social.color }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={styles.socialIcon}>
                  {social.icon}
                </div>
                <span className={styles.socialName}>{social.name}</span>
                <div className={styles.socialHover}>
                  <span>Подписаться</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className={styles.additionalInfo}>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>⚡</div>
              <h4>Быстрый ответ</h4>
              <p>Отвечаем на сообщения в WhatsApp и Telegram в течение 15 минут в рабочее время</p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>🎯</div>
              <h4>Персональный подход</h4>
              <p>Каждый клиент получает индивидуальную консультацию и персонального менеджера</p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>🔒</div>
              <h4>Конфиденциальность</h4>
              <p>Ваши данные защищены и не передаются третьим лицам</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}