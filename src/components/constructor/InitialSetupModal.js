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
    <div className="modal-overlay">
      <div className="modal-container">
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
        }

        .modal-container {
          background: var(--white);
          border-radius: 16px;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          background: var(--primary-dark);
          color: var(--white);
          padding: 24px;
          border-radius: 16px 16px 0 0;
          text-align: center;
        }

        .modal-header h2 {
          font-size: 24px;
          margin-bottom: 8px;
        }

        .modal-header p {
          opacity: 0.9;
          font-size: 14px;
        }

        .modal-content {
          padding: 24px;
        }

        .section {
          margin-bottom: 32px;
        }

        .section h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 18px;
          margin-bottom: 16px;
          color: var(--primary-dark);
        }

        .section-icon {
          font-size: 20px;
        }

        .lot-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .input-group label {
          font-weight: 500;
          color: var(--text-dark);
          font-size: 14px;
        }

        .input-group input {
          padding: 12px;
          border: 2px solid var(--border-gray);
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s;
        }

        .input-group input:focus {
          outline: none;
          border-color: var(--accent-orange);
        }

        .house-selection-tabs {
          display: flex;
          background: var(--light-purple);
          border-radius: 8px;
          padding: 4px;
          margin-bottom: 20px;
        }

        .house-selection-tabs button {
          flex: 1;
          padding: 12px;
          border: none;
          background: transparent;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .house-selection-tabs button.active {
          background: var(--accent-orange);
          color: var(--white);
        }

        .series-selector {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .series-selector button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: 2px solid var(--border-gray);
          background: var(--white);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }

        .series-selector button.active {
          border-color: var(--accent-orange);
          background: var(--light-purple);
        }

        .series-icon {
          font-size: 16px;
        }

        .houses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .house-card {
          border: 2px solid var(--border-gray);
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
          background: var(--white);
        }

        .house-card:hover {
          border-color: var(--accent-orange);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .house-card.selected {
          border-color: var(--accent-orange);
          background: var(--light-purple);
        }

        .house-visual {
          text-align: center;
          margin-bottom: 12px;
        }

        .house-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .house-dimensions {
          font-weight: bold;
          color: var(--accent-orange);
          font-size: 16px;
        }

        .house-info h4 {
          font-size: 14px;
          margin-bottom: 8px;
          color: var(--text-dark);
        }

        .house-specs {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: var(--text-light);
        }

        .custom-house {
          border: 2px solid var(--border-gray);
          border-radius: 12px;
          padding: 20px;
          background: var(--light-purple);
        }

        .custom-visual {
          text-align: center;
          margin-bottom: 20px;
        }

        .custom-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .custom-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .custom-info {
          display: flex;
          justify-content: space-between;
          padding: 12px;
          background: var(--white);
          border-radius: 8px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          text-align: center;
        }

        .info-item span {
          font-size: 12px;
          color: var(--text-light);
        }

        .info-item strong {
          font-size: 14px;
          color: var(--accent-orange);
        }

        .modal-footer {
          padding: 24px;
          border-top: 1px solid var(--border-gray);
          text-align: center;
        }

        .proceed-btn {
          background: var(--dark-green);
          color: var(--white);
          border: none;
          padding: 16px 32px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 12px;
        }

        .proceed-btn:hover:not(:disabled) {
          background: #245a22;
          transform: translateY(-1px);
        }

        .proceed-btn:disabled {
          background: var(--border-gray);
          cursor: not-allowed;
        }

        .warning {
          color: var(--accent-orange);
          font-size: 14px;
          margin: 0;
        }

        @media (max-width: 768px) {
          .modal-container {
            margin: 10px;
            max-height: 95vh;
          }

          .lot-inputs,
          .custom-inputs {
            grid-template-columns: 1fr;
          }

          .houses-grid {
            grid-template-columns: 1fr;
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