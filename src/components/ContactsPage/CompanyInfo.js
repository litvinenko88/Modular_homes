import styles from './CompanyInfo.module.css';

export default function CompanyInfo() {
  return (
    <section className={styles.companyInfo}>
      <div className={styles.container}>
        <h2 className={styles.title}>Реквизиты компании</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <h3 className={styles.cardTitle}>Основная информация</h3>
            <div className={styles.infoText}>
              <p><strong>Название организации:</strong></p>
              <p>ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ БАЖАНОВ ВЛАДИМИР АЛЕКСАНДРОВИЧ</p>
              <p><strong>ИНН:</strong> 263411519024</p>
              <p><strong>ОГРНИП:</strong> 322265100067452</p>
            </div>
          </div>

          <div className={styles.infoCard}>
            <h3 className={styles.cardTitle}>Юридический адрес</h3>
            <div className={styles.infoText}>
              <p>355013, РОССИЯ, СТАВРОПОЛЬСКИЙ КРАЙ, Г СТАВРОПОЛЬ, УЛ СЕВРЮКОВА, Д 94</p>
            </div>
          </div>

          <div className={styles.infoCard}>
            <h3 className={styles.cardTitle}>Банковские реквизиты</h3>
            <div className={styles.infoText}>
              <p><strong>Расчетный счет:</strong> 40802810400003407449</p>
              <p><strong>Банк:</strong> АО «ТБанк»</p>
              <p><strong>ИНН банка:</strong> 7710140679</p>
              <p><strong>БИК:</strong> 044525974</p>
              <p><strong>Корр. счет:</strong> 30101810145250000974</p>
            </div>
          </div>

          <div className={styles.infoCard}>
            <h3 className={styles.cardTitle}>Адрес банка</h3>
            <div className={styles.infoText}>
              <p>127287, г. Москва, ул. Хуторская 2-я, д. 38А, стр. 26</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}