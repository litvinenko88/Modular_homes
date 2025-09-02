'use client';

import { useState } from 'react';

const STYLES = [
  { id: 'scandi', name: 'Сканди', image: '🏠' },
  { id: 'classic', name: 'Классика', image: '🏛️' },
  { id: 'loft', name: 'Лофт', image: '🏭' },
  { id: 'modern', name: 'Модерн', image: '🏢' }
];

const BUDGET_RANGES = [
  { id: 'under_1m', label: 'до 1 млн руб.' },
  { id: '1m_1.5m', label: '1-1.5 млн руб.' },
  { id: '1.5m_2m', label: '1.5-2 млн руб.' },
  { id: 'over_2m', label: '2 млн руб. и выше' }
];

const ADDITIONAL_ROOMS = [
  { id: 'wardrobe', label: 'Гардеробная' },
  { id: 'office', label: 'Кабинет' },
  { id: 'laundry', label: 'Прачечная' },
  { id: 'guest_bedroom', label: 'Гостевая спальня' },
  { id: 'pantry', label: 'Кладовая' },
  { id: 'gym', label: 'Спортзал' }
];

export default function ArchitectForm({ data, updateData, onNext, onPrev }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    adults: 2,
    children: 0,
    additionalRooms: [],
    style: '',
    budget: '',
    timeline: '',
    lotOption: 'specify',
    lotWidth: data.lotSize.width || 0,
    lotHeight: data.lotSize.height || 0,
    additionalWishes: '',
    ...data.formData
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleRoomToggle = (roomId) => {
    const rooms = formData.additionalRooms || [];
    const newRooms = rooms.includes(roomId)
      ? rooms.filter(id => id !== roomId)
      : [...rooms, roomId];
    
    setFormData(prev => ({ ...prev, additionalRooms: newRooms }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Укажите имя';
    if (!formData.phone.trim()) newErrors.phone = 'Укажите телефон';
    if (!formData.email.trim()) newErrors.email = 'Укажите email';
    if (!formData.style) newErrors.style = 'Выберите стиль';
    if (!formData.budget) newErrors.budget = 'Выберите бюджет';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      updateData({ formData });
      onNext();
    }
  };

  return (
    <div className="architect-form">
      <div className="form-container">
        <h2>Анкета для архитектора</h2>
        
        <div className="form-section">
          <h3>Контактные данные</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Имя *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'error' : ''}
                placeholder="Ваше имя"
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label>Телефон *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={errors.phone ? 'error' : ''}
                placeholder="+7 (___) ___-__-__"
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={errors.email ? 'error' : ''}
              placeholder="your@email.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>О проекте</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Взрослые</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.adults}
                onChange={(e) => handleInputChange('adults', Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Дети</label>
              <input
                type="number"
                min="0"
                max="10"
                value={formData.children}
                onChange={(e) => handleInputChange('children', Number(e.target.value))}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Дополнительные помещения</label>
            <div className="checkbox-grid">
              {ADDITIONAL_ROOMS.map(room => (
                <label key={room.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={(formData.additionalRooms || []).includes(room.id)}
                    onChange={() => handleRoomToggle(room.id)}
                  />
                  {room.label}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Стиль *</label>
            <div className="style-grid">
              {STYLES.map(style => (
                <div
                  key={style.id}
                  className={`style-option ${formData.style === style.id ? 'selected' : ''}`}
                  onClick={() => handleInputChange('style', style.id)}
                >
                  <div className="style-icon">{style.image}</div>
                  <div className="style-name">{style.name}</div>
                </div>
              ))}
            </div>
            {errors.style && <span className="error-text">{errors.style}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Бюджет *</label>
              <select
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                className={errors.budget ? 'error' : ''}
              >
                <option value="">Выберите диапазон</option>
                {BUDGET_RANGES.map(range => (
                  <option key={range.id} value={range.id}>
                    {range.label}
                  </option>
                ))}
              </select>
              {errors.budget && <span className="error-text">{errors.budget}</span>}
            </div>
            <div className="form-group">
              <label>Желаемые сроки</label>
              <input
                type="text"
                value={formData.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
                placeholder="Q3 2024"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Участок</h3>
          <div className="radio-group">
            <label className="radio-item">
              <input
                type="radio"
                name="lotOption"
                value="specify"
                checked={formData.lotOption === 'specify'}
                onChange={(e) => handleInputChange('lotOption', e.target.value)}
              />
              Указать размеры
            </label>
            <label className="radio-item">
              <input
                type="radio"
                name="lotOption"
                value="upload"
                checked={formData.lotOption === 'upload'}
                onChange={(e) => handleInputChange('lotOption', e.target.value)}
              />
              Приложить план
            </label>
          </div>

          {formData.lotOption === 'specify' && (
            <div className="form-row">
              <div className="form-group">
                <label>Ширина (м)</label>
                <input
                  type="number"
                  value={formData.lotWidth}
                  onChange={(e) => handleInputChange('lotWidth', Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label>Длина (м)</label>
                <input
                  type="number"
                  value={formData.lotHeight}
                  onChange={(e) => handleInputChange('lotHeight', Number(e.target.value))}
                />
              </div>
            </div>
          )}

          {formData.lotOption === 'upload' && (
            <div className="form-group">
              <label>Файл плана участка</label>
              <input type="file" accept=".pdf,.jpg,.png" />
            </div>
          )}
        </div>

        <div className="form-section">
          <div className="form-group">
            <label>Дополнительные пожелания</label>
            <textarea
              value={formData.additionalWishes}
              onChange={(e) => handleInputChange('additionalWishes', e.target.value)}
              placeholder="Опишите ваши пожелания к проекту..."
              rows="4"
            />
          </div>
        </div>

        <div className="navigation">
          <button onClick={onPrev} className="prev-btn">
            Назад
          </button>
          <button onClick={handleNext} className="next-btn">
            Далее
          </button>
        </div>
      </div>

      <style jsx>{`
        .architect-form {
          max-width: 800px;
          margin: 0 auto;
        }
        .form-container {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .form-section {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        .form-section:last-of-type {
          border-bottom: none;
        }
        .form-row {
          display: flex;
          gap: 20px;
        }
        .form-group {
          flex: 1;
          margin-bottom: 15px;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #333;
        }
        .form-group input, .form-group select, .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        .form-group input.error, .form-group select.error {
          border-color: #f44336;
        }
        .error-text {
          color: #f44336;
          font-size: 12px;
          margin-top: 5px;
          display: block;
        }
        .checkbox-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: normal;
        }
        .style-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }
        .style-option {
          border: 2px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .style-option:hover {
          border-color: #2196f3;
        }
        .style-option.selected {
          border-color: #2196f3;
          background: #e3f2fd;
        }
        .style-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }
        .radio-group {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
        }
        .radio-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: normal;
        }
        .navigation {
          display: flex;
          gap: 20px;
          margin-top: 30px;
        }
        .prev-btn, .next-btn {
          flex: 1;
          padding: 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        .prev-btn {
          background: #757575;
          color: white;
        }
        .next-btn {
          background: #4caf50;
          color: white;
        }
        
        @media (max-width: 768px) {
          .architect-form {
            padding: 10px;
          }
          .form-container {
            padding: 20px;
          }
          .form-row {
            flex-direction: column;
            gap: 0;
          }
          .style-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .checkbox-grid {
            grid-template-columns: 1fr;
          }
          .radio-group {
            flex-direction: column;
            gap: 10px;
          }
          .navigation {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}