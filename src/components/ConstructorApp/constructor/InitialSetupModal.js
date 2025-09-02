'use client';

import { useState } from 'react';

const HOUSE_SERIES = {
  arkhangelsk: {
    name: 'Серия "Архангельск"',
    icon: '🏠',
    models: [
      { id: 'arch-6x2.5', width: 6, height: 2.5, title: 'Новый Архангельск', area: 15, price: 450000 },
      { id: 'arch-7x2.5', width: 7, height: 2.5, title: 'Новый Архангельск', area: 17.5, price: 525000 },
      { id: 'arch-8x2.5', width: 8, height: 2.5, title: 'Новый Архангельск', area: 20, price: 600000 },
      { id: 'arch-6x5', width: 6, height: 5, title: 'Угловой Архангельск', area: 30, price: 900000 },
      { id: 'arch-7x5', width: 7, height: 5, title: 'Угловой Архангельск', area: 35, price: 1050000 },
      { id: 'arch-8x5', width: 8, height: 5, title: 'Угловой Архангельск', area: 40, price: 1200000 }
    ]
  },
  barn: {
    name: 'Серия "Барн"',
    icon: '🏘️',
    models: [
      { id: 'barn-6x2.5', width: 6, height: 2.5, title: 'Барнхаус', area: 15, price: 480000 },
      { id: 'barn-7x2.5', width: 7, height: 2.5, title: 'Барнхаус', area: 17.5, price: 560000 },
      { id: 'barn-8x2.5', width: 8, height: 2.5, title: 'Барнхаус', area: 20, price: 640000 },
      { id: 'barn-6x5', width: 6, height: 5, title: 'Барн с террасой', area: 30, price: 960000 },
      { id: 'barn-7x5', width: 7, height: 5, title: 'Барн с террасой', area: 35, price: 1120000 },
      { id: 'barn-8x5', width: 8, height: 5, title: 'Барн с террасой', area: 40, price: 1280000 }
    ]
  },
  multi: {
    name: 'Многомодульные решения',
    icon: '🏢',
    models: [
      { id: 'dvin-6x5', width: 6, height: 5, title: 'Двухмодульная Двинея', area: 30, price: 900000 },
      { id: 'dvin-7x5', width: 7, height: 5, title: 'Двухмодульная Двинея', area: 35, price: 1050000 },
      { id: 'dvin-8x5', width: 8, height: 5, title: 'Двухмодульная Двинея', area: 40, price: 1200000 },
      { id: 'barn4-7x10', width: 7, height: 10, title: 'Четырехмодульный Барн', area: 70, price: 2100000 },
      { id: 'barn4-8x10', width: 8, height: 10, title: 'Четырехмодульный Барн', area: 80, price: 2400000 }
    ]
  }
};

export default function InitialSetupModal({ onComplete }) {
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [customMode, setCustomMode] = useState(false);
  const [customWidth, setCustomWidth] = useState(6);
  const [customHeight, setCustomHeight] = useState(2.5);
  const [lotWidth, setLotWidth] = useState(20);
  const [lotHeight, setLotHeight] = useState(15);
  const [selectedSeries, setSelectedSeries] = useState('arkhangelsk');

  const canProceed = (selectedHouse || customMode) && lotWidth > 0 && lotHeight > 0;

  const handleHouseSelect = (house) => {
    setSelectedHouse(house);
    setCustomMode(false);
  };

  const handleCustomMode = () => {
    setCustomMode(true);
    setSelectedHouse(null);
  };

  const handleProceed = () => {
    const houseData = customMode 
      ? {
          id: `custom-${Date.now()}`,
          width: customWidth,
          height: customHeight,
          area: customWidth * customHeight,
          price: (customWidth * customHeight) * 30000,
          title: `Модуль ${customWidth}×${customHeight}м`
        }
      : selectedHouse;

    onComplete({
      house: houseData,
      lotSize: { width: lotWidth, height: lotHeight }
    });
  };

  return (
    <div className="modal-overlay fade-in">
      <div className="modal-container slide-in">
        <div className="modal-header">
          <h2>Настройка конструктора</h2>
          <p>Выберите размер дома и участка для начала проектирования</p>
        </div>

        <div className="modal-content">
          {/* Размеры участка */}
          <div className="section">
            <h3>
              <span className="section-icon">📐</span>
              Размеры участка
            </h3>
            <div className="lot-inputs">
              <div className="input-group">
                <label>Ширина участка (м)</label>
                <input 
                  type="number" 
                  value={lotWidth}
                  onChange={(e) => setLotWidth(Number(e.target.value))}
                  min="10" max="100"
                />
              </div>
              <div className="input-group">
                <label>Длина участка (м)</label>
                <input 
                  type="number" 
                  value={lotHeight}
                  onChange={(e) => setLotHeight(Number(e.target.value))}
                  min="10" max="100"
                />
              </div>
            </div>
          </div>

          {/* Выбор дома */}
          <div className="section">
            <h3>
              <span className="section-icon">🏠</span>
              Выбор дома
            </h3>
            
            <div className="house-selection-tabs">
              <button 
                className={!customMode ? 'active' : ''}
                onClick={() => setCustomMode(false)}
              >
                Готовые проекты
              </button>
              <button 
                className={customMode ? 'active' : ''}
                onClick={handleCustomMode}
              >
                Свои размеры
              </button>
            </div>

            {!customMode ? (
              <div className="preset-houses">
                <div className="series-selector">
                  {Object.entries(HOUSE_SERIES).map(([key, series]) => (
                    <button
                      key={key}
                      className={selectedSeries === key ? 'active' : ''}
                      onClick={() => setSelectedSeries(key)}
                    >
                      <span className="series-icon">{series.icon}</span>
                      {series.name}
                    </button>
                  ))}
                </div>

                <div className="houses-grid">
                  {HOUSE_SERIES[selectedSeries].models.map(house => (
                    <div 
                      key={house.id}
                      className={`house-card ${selectedHouse?.id === house.id ? 'selected' : ''}`}
                      onClick={() => handleHouseSelect(house)}
                    >
                      <div className="house-visual">
                        <div className="house-icon">🏠</div>
                        <div className="house-dimensions">
                          {house.width}×{house.height}м
                        </div>
                      </div>
                      <div className="house-info">
                        <h4>{house.title}</h4>
                        <div className="house-specs">
                          <span className="area">{house.area}м²</span>
                          <span className="price">{(house.price / 1000).toFixed(0)}к ₽</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="custom-house">
                <div className="custom-visual">
                  <div className="custom-icon">📏</div>
                  <h4>Индивидуальный размер</h4>
                </div>
                <div className="custom-inputs">
                  <div className="input-group">
                    <label>Ширина дома (м)</label>
                    <input 
                      type="number" 
                      value={customWidth}
                      onChange={(e) => setCustomWidth(Number(e.target.value))}
                      min="2" max="20" step="0.5"
                    />
                  </div>
                  <div className="input-group">
                    <label>Длина дома (м)</label>
                    <input 
                      type="number" 
                      value={customHeight}
                      onChange={(e) => setCustomHeight(Number(e.target.value))}
                      min="2" max="30" step="0.5"
                    />
                  </div>
                </div>
                <div className="custom-info">
                  <div className="info-item">
                    <span>Площадь:</span>
                    <strong>{(customWidth * customHeight).toFixed(1)}м²</strong>
                  </div>
                  <div className="info-item">
                    <span>Примерная стоимость:</span>
                    <strong>{((customWidth * customHeight) * 30).toFixed(0)}к ₽</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="proceed-btn"
            onClick={handleProceed}
            disabled={!canProceed}
          >
            Перейти к конструктору
          </button>
          {!canProceed && (
            <p className="warning">
              Выберите размер дома и укажите размеры участка
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .modal-container {
          background: var(--white);
          border-radius: 16px;
          max-width: 1000px;
          width: 100%;
          max-height: 95vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          animation: slideIn 0.4s ease-out;
        }

        .modal-header {
          background: linear-gradient(135deg, var(--color-primary) 0%, rgba(49, 50, 61, 0.95) 100%);
          color: var(--white);
          padding: 32px 24px;
          border-radius: 16px 16px 0 0;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .modal-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(223, 104, 43, 0.1) 0%, transparent 50%);
          z-index: 1;
        }

        .modal-header h2 {
          font-size: 28px;
          margin-bottom: 8px;
          font-weight: 700;
          position: relative;
          z-index: 2;
        }

        .modal-header p {
          opacity: 0.9;
          font-size: 16px;
          margin: 0;
          position: relative;
          z-index: 2;
        }

        .modal-content {
          padding: 32px 24px;
        }

        .section {
          margin-bottom: 32px;
        }

        .section h3 {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 20px;
          margin-bottom: 20px;
          color: var(--color-primary);
          font-weight: 600;
        }

        .section-icon {
          font-size: 16px;
        }

        .lot-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .input-group label {
          font-weight: 500;
          color: var(--text-dark);
          font-size: 12px;
        }

        .input-group input {
          padding: 8px 10px;
          border: 1px solid var(--border-gray);
          border-radius: 4px;
          font-size: 13px;
          transition: border-color 0.2s;
        }

        .input-group input:focus {
          outline: none;
          border-color: var(--accent-orange);
        }

        .house-selection-tabs {
          display: flex;
          background: var(--light-purple);
          border-radius: 6px;
          padding: 3px;
          margin-bottom: 12px;
        }

        .house-selection-tabs button {
          flex: 1;
          padding: 8px 10px;
          border: none;
          background: transparent;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          font-size: 12px;
        }

        .house-selection-tabs button.active {
          background: var(--accent-orange);
          color: var(--white);
        }

        .series-selector {
          display: flex;
          gap: 6px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .series-selector button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border: 1px solid var(--border-gray);
          background: var(--white);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 11px;
        }

        .series-selector button.active {
          border-color: var(--accent-orange);
          background: var(--light-purple);
        }

        .series-icon {
          font-size: 14px;
        }

        .houses-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .house-card {
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: var(--color-white);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 140px;
        }

        .house-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(223, 104, 43, 0.05) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .house-card:hover {
          border-color: var(--color-accent);
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(223, 104, 43, 0.15);
        }

        .house-card:hover::before {
          opacity: 1;
        }

        .house-card.selected {
          border-color: var(--color-accent);
          background: linear-gradient(135deg, rgba(223, 104, 43, 0.08) 0%, rgba(223, 104, 43, 0.03) 100%);
          box-shadow: 0 6px 16px rgba(223, 104, 43, 0.2);
        }

        .house-card.selected::after {
          content: '✓';
          position: absolute;
          top: 8px;
          right: 8px;
          width: 20px;
          height: 20px;
          background: var(--color-accent);
          color: var(--color-white);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          z-index: 3;
        }

        .house-visual {
          text-align: center;
          margin-bottom: 12px;
          position: relative;
          z-index: 2;
          flex-shrink: 0;
        }

        .house-icon {
          font-size: 28px;
          margin-bottom: 6px;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
          display: block;
        }

        .house-dimensions {
          font-weight: 600;
          color: var(--color-accent);
          font-size: 14px;
          background: rgba(223, 104, 43, 0.1);
          padding: 3px 8px;
          border-radius: 12px;
          display: inline-block;
          white-space: nowrap;
        }

        .house-info {
          position: relative;
          z-index: 2;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .house-info h4 {
          font-size: 12px;
          margin-bottom: 8px;
          color: var(--color-primary);
          font-weight: 600;
          line-height: 1.3;
          white-space: normal;
          overflow: visible;
          text-overflow: unset;
          min-height: 32px;
          display: flex;
          align-items: center;
        }

        .house-specs {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          font-weight: 500;
          gap: 6px;
          margin-top: auto;
        }

        .house-specs .area {
          color: var(--color-primary);
          background: rgba(49, 50, 61, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .house-specs .price {
          color: var(--color-accent);
          background: rgba(223, 104, 43, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          white-space: nowrap;
          flex-shrink: 0;
          font-weight: 600;
        }

        .custom-house {
          border: 1px solid var(--border-gray);
          border-radius: 8px;
          padding: 14px;
          background: var(--light-purple);
        }

        .custom-visual {
          text-align: center;
          margin-bottom: 12px;
        }

        .custom-icon {
          font-size: 24px;
          margin-bottom: 4px;
        }

        .custom-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 12px;
        }

        .custom-info {
          display: flex;
          justify-content: space-between;
          padding: 8px;
          background: var(--white);
          border-radius: 6px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-align: center;
        }

        .info-item span {
          font-size: 10px;
          color: var(--text-light);
        }

        .info-item strong {
          font-size: 12px;
          color: var(--accent-orange);
        }

        .modal-footer {
          padding: 24px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          background: #f9fafb;
        }

        .proceed-btn {
          background: linear-gradient(135deg, var(--color-accent) 0%, #e8763a 100%);
          color: var(--white);
          border: none;
          padding: 16px 32px;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin-bottom: 12px;
          box-shadow: 0 4px 12px rgba(223, 104, 43, 0.3);
          position: relative;
          overflow: hidden;
        }

        .proceed-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.6s ease;
        }

        .proceed-btn:hover:not(:disabled)::before {
          left: 100%;
        }

        .proceed-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(223, 104, 43, 0.4);
        }

        .proceed-btn:disabled {
          background: var(--border-gray);
          cursor: not-allowed;
        }

        .warning {
          color: var(--accent-orange);
          font-size: 11px;
          margin: 0;
        }

        @media (max-width: 768px) {
          .modal-container {
            margin: 10px;
            max-height: 95vh;
            max-width: calc(100vw - 20px);
          }

          .modal-header {
            padding: 24px 16px;
          }

          .modal-header h2 {
            font-size: 24px;
          }

          .modal-content {
            padding: 24px 16px;
          }

          .lot-inputs,
          .custom-inputs {
            grid-template-columns: 1fr;
          }

          .houses-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }

          .house-card {
            padding: 12px;
            min-height: 120px;
          }

          .house-info h4 {
            min-height: 40px;
          }

          .series-selector {
            flex-direction: column;
          }

          .custom-info {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}