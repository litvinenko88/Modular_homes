'use client';

import { useState } from 'react';

export default function Confirmation({ data, onPrev }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      localStorage.setItem('constructor-project', JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        id: Date.now()
      }));
      
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

  return (
    <div className="confirmation">
      <h2>Подтверждение проекта</h2>
      
      <div className="summary-grid">
        <div className="project-summary">
          <h3>Ваш проект</h3>
          <div className="summary-item">
            <span>Размер дома:</span>
            <strong>{data.house.width}×{data.house.height} м</strong>
          </div>
          <div className="summary-item">
            <span>Площадь:</span>
            <strong>{data.house.area} м²</strong>
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
            <strong>{data.formData?.name || 'Не указано'}</strong>
          </div>
          <div className="summary-item">
            <span>Телефон:</span>
            <strong>{data.formData?.phone || 'Не указан'}</strong>
          </div>
          <div className="summary-item">
            <span>Email:</span>
            <strong>{data.formData?.email || 'Не указан'}</strong>
          </div>
        </div>
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
        .project-summary, .contact-summary {
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