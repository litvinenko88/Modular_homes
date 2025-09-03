import styles from './SocialLinks.module.css';

const socialNetworks = [
  { name: 'ВКонтакте', url: '#', icon: '🔵' },
  { name: 'YouTube', url: '#', icon: '📺' },
  { name: 'RuTube', url: '#', icon: '🎬' },
  { name: 'Instagram', url: '#', icon: '📷' }
];

const contactButtons = [
  { name: 'Телефон', url: 'tel:89964179001', icon: '📞', text: '8 (996) 417-90-01' },
  { name: 'Telegram', url: 'https://t.me/litvinenko_n_v', icon: '✈️', text: 'Написать в Telegram' },
  { name: 'WhatsApp', url: 'https://wa.me/89964179001', icon: '💬', text: 'Написать в WhatsApp' }
];

export default function SocialLinks() {
  return (
    <section className={styles.socialSection}>
      <div className={styles.container}>
        <div className={styles.contactButtons}>
          <h2 className={styles.title}>Свяжитесь с нами</h2>
          <div className={styles.buttonsGrid}>
            {contactButtons.map((button, index) => (
              <a
                key={index}
                href={button.url}
                className={styles.contactButton}
                target={button.name !== 'Телефон' ? '_blank' : '_self'}
                rel={button.name !== 'Телефон' ? 'noopener noreferrer' : ''}
              >
                <span className={styles.buttonIcon}>{button.icon}</span>
                <span className={styles.buttonText}>{button.text}</span>
              </a>
            ))}
          </div>
        </div>

        <div className={styles.socialNetworks}>
          <h3 className={styles.socialTitle}>Мы в социальных сетях</h3>
          <div className={styles.socialGrid}>
            {socialNetworks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                className={styles.socialLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.socialIcon}>{social.icon}</span>
                <span className={styles.socialName}>{social.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}