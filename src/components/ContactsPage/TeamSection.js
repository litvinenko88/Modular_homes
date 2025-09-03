import styles from "./TeamSection.module.css";

const teamMembers = [
  {
    name: "Владимир Бажанов",
    position: "Руководитель",
    photo: "/img/sotrudnik/1.jpg",
  },
  {
    name: "Анна Петрова",
    position: "Старший менеджер",
    photo: "/img/sotrudnik/2.jpg",
  },
  {
    name: "Михаил Сидоров",
    position: "Менеджер",
    photo: "/img/sotrudnik/3.jpg",
  },
  {
    name: "Елена Козлова",
    position: "Конструктор",
    photo: "/img/sotrudnik/4.jpg",
  },
  {
    name: "Дмитрий Волков",
    position: "Проектировщик",
    photo: "/img/sotrudnik/5.jpg",
  },
  {
    name: "Ольга Морозова",
    position: "Бухгалтер",
    photo: "/img/sotrudnik/6.jpg",
  },
  {
    name: "Сергей Иванов",
    position: "Сантехник",
    photo: "/img/sotrudnik/7.jpg",
  },
  {
    name: "Алексей Смирнов",
    position: "Электрик",
    photo: "/img/sotrudnik/8.jpg",
  },
  {
    name: "Николай Попов",
    position: "Сборщик",
    photo: "/img/sotrudnik/9.jpg",
  },
  {
    name: "Игорь Федоров",
    position: "Зав. складом",
    photo: "/img/sotrudnik/10.jpg",
  },
  {
    name: "Андрей Новиков",
    position: "Отделочник",
    photo: "/img/sotrudnik/11.jpg",
  },
  {
    name: "Павел Орлов",
    position: "Разнорабочий",
    photo: "/img/sotrudnik/12.jpg",
  },
  {
    name: "Виктор Лебедев",
    position: "Разнорабочий",
    photo: "/img/sotrudnik/13.jpg",
  },
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
                <img
                  src={member.photo}
                  alt={`${member.name} - ${member.position} компании Easy House`}
                  className={styles.memberPhoto}
                />
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
