'use client';

import { useState } from 'react';

export default function Confirmation({ data, onPrev }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Сохраняем данные локально для статического сайта
      localStorage.setItem('constructor-project', JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        id: Date.now()
      }));
      
      // Имитация отправки
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
    } catch (error) {
      alert('Ошибка при сохранении проекта.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="confirmation success">
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h2>Заявка успешно отправлена!</h2>
          <p>Наш архитектор свяжется с вами в течение 24 часов для обсуждения проекта.</p>
          <p>Мы отправили подтверждение на email: <strong>{data.formData.email}</strong></p>
          
          <div className="next-steps">
            <h3>Что дальше?</h3>
            <ul>
              <li>Архитектор изучит ваш проект</li>
              <li>Подготовит предварительную смету</li>
              <li>Свяжется с вами для уточнения деталей</li>
              <li>Предложит варианты реализации</li>
            </ul>
          </div>
        </div>

        <style jsx>{`
          .confirmation.success {
            text-align: center;
            padding: 40px;
          }
          .success-icon {
            font-size: 64px;
            margin-bottom: 20px;
          }
          .success-message h2 {
            color: #4caf50;
            margin-bottom: 20px;
          }
          .success-message p {
            font-size: 16px;
            margin-bottom: 15px;
            color: #666;
          }
          .next-steps {
            background: #f5f5f5;
            padding: 20px;
            border-radius: 8px;
            margin-top: 30px;
            text-align: left;
          }
          .next-steps ul {
            list-style: none;
            padding: 0;
          }
          .next-steps li {
            padding: 8px 0;
            border-bottom: 1px solid #ddd;
          }
          .next-steps li:before {
            content: "→ ";
            color: #4caf50;
            font-weight: bold;
          }
        `}</style>
      </div>
    );
  }

  const totalArea = data.modules.reduce((sum, module) => sum + (module.width * module.height), 0);
  const roomsCount = data.rooms.length;

  return (
    <div className="confirmation">
      <h2>Подтверждение проекта</h2>
      
      <div className="summary-grid">
        <div className="project-summary">
          <h3>Ваш проект</h3>
          <div className="summary-item">
            <span>Общая площадь:</span>
            <strong>{totalArea} м²</strong>
          </div>
          <div className="summary-item">
            <span>Количество модулей:</span>
            <strong>{data.modules.length}</strong>
          </div>
          <div className="summary-item">
            <span>Количество комнат:</span>
            <strong>{roomsCount}</strong>
          </div>
          <div className="summary-item">
            <span>Размер участка:</span>
            <strong>{data.lotSize.width}×{data.lotSize.height} м</strong>
          </div>
        </div>

        <div className="contact-summary">
          <h3>Контактные данные</h3>
          <div className="summary-item">
            <span>Имя:</span>
            <strong>{data.formData.name}</strong>
          </div>
          <div className="summary-item">
            <span>Телефон:</span>
            <strong>{data.formData.phone}</strong>
          </div>
          <div className="summary-item">
            <span>Email:</span>
            <strong>{data.formData.email}</strong>
          </div>
        </div>

        <div className="preferences-summary">
          <h3>Предпочтения</h3>
          <div className="summary-item">
            <span>Проживающих:</span>
            <strong>{data.formData.adults} взр. + {data.formData.children} дет.</strong>
          </div>
          <div className="summary-item">
            <span>Стиль:</span>
            <strong>{getStyleName(data.formData.style)}</strong>
          </div>
          <div className="summary-item">
            <span>Бюджет:</span>
            <strong>{getBudgetName(data.formData.budget)}</strong>
          </div>
          {data.formData.timeline && (
            <div className="summary-item">
              <span>Сроки:</span>
              <strong>{data.formData.timeline}</strong>
            </div>
          )}
        </div>

        {(data.formData?.additionalRooms?.length > 0) && (
          <div className="additional-rooms">
            <h3>Дополнительные помещения</h3>
            <div className="rooms-list">
              {(data.formData?.additionalRooms || []).map(roomId => (
                <span key={roomId} className="room-tag">
                  {getRoomName(roomId)}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.formData.additionalWishes && (
          <div className="additional-wishes">
            <h3>Дополнительные пожелания</h3>
            <p>{data.formData.additionalWishes}</p>
          </div>
        )}
      </div>

      <div className="navigation">
        <button onClick={onPrev} className="prev-btn">
          Назад
        </button>
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="submit-btn"
        >
          {isSubmitting ? 'Отправляем...' : 'Отправить на расчет'}
        </button>
      </div>

      <style jsx>{`
        .confirmation {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .project-summary, .contact-summary, .preferences-summary, 
        .additional-rooms, .additional-wishes {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #2196f3;
        }
        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .summary-item:last-child {
          border-bottom: none;
        }
        .rooms-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .room-tag {
          background: #e3f2fd;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 14px;
          color: #1976d2;
        }
        .additional-wishes p {
          background: white;
          padding: 15px;
          border-radius: 4px;
          margin: 10px 0 0 0;
          font-style: italic;
        }
        .navigation {
          display: flex;
          gap: 20px;
          justify-content: center;
        }
        .prev-btn, .submit-btn {
          padding: 15px 30px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          min-width: 150px;
        }
        .prev-btn {
          background: #757575;
          color: white;
        }
        .submit-btn {
          background: #4caf50;
          color: white;
        }
        .submit-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

function getStyleName(styleId) {
  const styles = {
    scandi: 'Сканди',
    classic: 'Классика',
    loft: 'Лофт',
    modern: 'Модерн'
  };
  return styles[styleId] || styleId;
}

function getBudgetName(budgetId) {
  const budgets = {
    under_1m: 'до 1 млн руб.',
    '1m_1.5m': '1-1.5 млн руб.',
    '1.5m_2m': '1.5-2 млн руб.',
    over_2m: '2 млн руб. и выше'
  };
  return budgets[budgetId] || budgetId;
}

function getRoomName(roomId) {
  const rooms = {
    wardrobe: 'Гардеробная',
    office: 'Кабинет',
    laundry: 'Прачечная',
    guest_bedroom: 'Гостевая спальня',
    pantry: 'Кладовая',
    gym: 'Спортзал'
  };
  return rooms[roomId] || roomId;
}