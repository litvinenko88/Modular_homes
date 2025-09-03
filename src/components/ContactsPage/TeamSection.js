import styles from './TeamSection.module.css';

const teamMembers = [
  { name: 'Владимир Бажанов', position: 'Руководитель', photo: '/img/sotrudnik/1.jpg' },
  { name: 'Анна Петрова', position: 'Старший менеджер', photo: '/img/team/manager1.jpg' },
  { name: 'Михаил Сидоров', position: 'Менеджер', photo: '/img/team/manager2.jpg' },
  { name: 'Елена Козлова', position: 'Конструктор', photo: '/img/team/constructor.jpg' },
  { name: 'Дмитрий Волков', position: 'Проектировщик', photo: '/img/team/designer.jpg' },
  { name: 'Ольга Морозова', position: 'Бухгалтер', photo: '/img/team/accountant.jpg' },
  { name: 'Сергей Иванов', position: 'Сантехник', photo: '/img/team/plumber.jpg' },
  { name: 'Алексей Смирнов', position: 'Электрик', photo: '/img/team/electrician.jpg' },
  { name: 'Николай Попов', position: 'Сборщик', photo: '/img/team/assembler.jpg' },
  { name: 'Игорь Федоров', position: 'Зав. складом', photo: '/img/team/warehouse.jpg' },
  { name: 'Андрей Новиков', position: 'Отделочник', photo: '/img/team/finisher.jpg' },
  { name: 'Павел Орлов', position: 'Разнорабочий', photo: '/img/team/worker1.jpg' },
  { name: 'Виктор Лебедев', position: 'Разнорабочий', photo: '/img/team/worker2.jpg' }
];

export default function TeamSection() {
  return (
    <section className={styles.teamSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Наша команда</h2>
        <p className={styles.subtitle}>
          Профессионалы, которые воплощают ваши мечты в реальность
        </p>
        
        <div className={styles.teamGrid}>
          {teamMembers.map((member, index) => (
            <div key={index} className={styles.teamCard}>
              <div className={styles.photoContainer}>
                <img src={member.photo} alt={member.name} className={styles.memberPhoto} />
              </div>
              <h3 className={styles.memberName}>{member.name}</h3>
              <p className={styles.memberPosition}>{member.position}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}