'use client';

import { useState, useRef, useEffect } from 'react';

export default function ConstructorInterface({ initialData, onBack }) {
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedTool, setSelectedTool] = useState('select');
  const [view3D, setView3D] = useState(false);

  const SCALE = 30 * zoom;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const resizeCanvas = () => {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        drawCanvas();
      };
      
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      
      return () => window.removeEventListener('resize', resizeCanvas);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(drawCanvas, 10);
    return () => clearTimeout(timer);
  }, [zoom, panOffset, initialData]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0 || canvas.height === 0) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    
    drawGrid(ctx);
    drawLot(ctx);
    drawHouse(ctx);
    
    ctx.restore();
  };

  const drawGrid = (ctx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const gridSize = Math.max(10, SCALE / 2);
    const startX = Math.floor(-panOffset.x / gridSize) * gridSize;
    const startY = Math.floor(-panOffset.y / gridSize) * gridSize;
    const endX = startX + canvas.width + Math.abs(panOffset.x) + gridSize;
    const endY = startY + canvas.height + Math.abs(panOffset.y) + gridSize;
    
    // Мелкая сетка
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 0.5;
    
    for (let x = startX; x <= endX; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    for (let y = startY; y <= endY; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Крупная сетка
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    for (let x = startX; x <= endX; x += gridSize * 5) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    for (let y = startY; y <= endY; y += gridSize * 5) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  };

  const drawLot = (ctx) => {
    const lotX = 100;
    const lotY = 100;
    const lotW = initialData.lotSize.width * SCALE;
    const lotH = initialData.lotSize.height * SCALE;
    
    // Контур участка
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 3;
    ctx.setLineDash([15, 10]);
    ctx.strokeRect(lotX, lotY, lotW, lotH);
    ctx.setLineDash([]);
    
    // Размеры участка
    ctx.fillStyle = '#666';
    ctx.font = `${Math.max(14, 14 * zoom)}px Arial`;
    ctx.textAlign = 'center';
    
    // Ширина участка (сверху)
    ctx.fillText(
      `${initialData.lotSize.width}м`,
      lotX + lotW / 2,
      lotY - 10
    );
    
    // Высота участка (слева)
    ctx.save();
    ctx.translate(lotX - 20, lotY + lotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${initialData.lotSize.height}м`, 0, 0);
    ctx.restore();
  };

  const drawHouse = (ctx) => {
    const houseX = 150;
    const houseY = 150;
    const houseW = initialData.house.width * SCALE;
    const houseH = initialData.house.height * SCALE;
    
    // Основа дома
    ctx.fillStyle = '#eee8f4';
    ctx.fillRect(houseX, houseY, houseW, houseH);
    
    // Контур дома
    ctx.strokeStyle = '#31323d';
    ctx.lineWidth = 3;
    ctx.strokeRect(houseX, houseY, houseW, houseH);
    
    // Информация о доме
    ctx.fillStyle = '#31323d';
    ctx.font = `${Math.max(12, 12 * zoom)}px Arial`;
    ctx.textAlign = 'center';
    
    const centerX = houseX + houseW / 2;
    const centerY = houseY + houseH / 2;
    
    ctx.fillText(
      `${initialData.house.width}×${initialData.house.height}м`,
      centerX,
      centerY - 10
    );
    
    ctx.fillText(
      `${initialData.house.area}м²`,
      centerX,
      centerY + 10
    );
    
    // Размеры дома
    ctx.fillStyle = '#df682b';
    ctx.font = `${Math.max(10, 10 * zoom)}px Arial`;
    
    // Ширина дома (сверху)
    ctx.fillText(
      `${initialData.house.width}м`,
      centerX,
      houseY - 10
    );
    
    // Высота дома (слева)
    ctx.save();
    ctx.translate(houseX - 15, centerY);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${initialData.house.height}м`, 0, 0);
    ctx.restore();
  };

  const handleCanvasMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleCanvasMouseMove = (e) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.3, Math.min(5, prev * delta)));
  };

  return (
    <div className="constructor-interface">
      {/* Хедер */}
      <div className="constructor-header">
        <div className="header-left">
          <button className="back-btn" onClick={onBack}>
            ← Назад к настройке
          </button>
          <h1>Конструктор модульных домов</h1>
        </div>
        <div className="header-right">
          <div className="project-info">
            <span>Дом: {initialData.house.width}×{initialData.house.height}м</span>
            <span>Участок: {initialData.lotSize.width}×{initialData.lotSize.height}м</span>
          </div>
        </div>
      </div>

      <div className="constructor-body">
        {/* Рабочая область */}
        <div className="workspace">
          <canvas 
            ref={canvasRef}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            onWheel={handleWheel}
          />
        </div>

        {/* Панель управления */}
        <div className="control-panel">
          <div className="panel-section">
            <h3>Режим просмотра</h3>
            <div className="view-toggle">
              <button 
                className={!view3D ? 'active' : ''}
                onClick={() => setView3D(false)}
              >
                2D План
              </button>
              <button 
                className={view3D ? 'active' : ''}
                onClick={() => setView3D(true)}
              >
                3D Вид
              </button>
            </div>
          </div>

          <div className="panel-section">
            <h3>Инструменты</h3>
            <div className="tools-grid">
              {[
                { id: 'select', name: 'Выбор', icon: '👆' },
                { id: 'wall', name: 'Стена', icon: '🧱' },
                { id: 'door', name: 'Дверь', icon: '🚪' },
                { id: 'window', name: 'Окно', icon: '🪟' },
                { id: 'room', name: 'Комната', icon: '🏠' },
                { id: 'stairs', name: 'Лестница', icon: '🪜' }
              ].map(tool => (
                <button
                  key={tool.id}
                  className={`tool-btn ${selectedTool === tool.id ? 'active' : ''}`}
                  onClick={() => setSelectedTool(tool.id)}
                >
                  <span className="tool-icon">{tool.icon}</span>
                  <span className="tool-name">{tool.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="panel-section">
            <h3>Управление</h3>
            <div className="zoom-controls">
              <button onClick={() => setZoom(prev => Math.min(5, prev * 1.2))}>
                🔍+
              </button>
              <span>{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(prev => Math.max(0.3, prev / 1.2))}>
                🔍-
              </button>
              <button onClick={() => { setZoom(1); setPanOffset({ x: 0, y: 0 }); }}>
                🎯 Сброс
              </button>
            </div>
          </div>

          <div className="panel-section">
            <h3>Информация о проекте</h3>
            <div className="project-details">
              <div className="detail-item">
                <span>Название:</span>
                <strong>{initialData.house.title}</strong>
              </div>
              <div className="detail-item">
                <span>Размеры дома:</span>
                <strong>{initialData.house.width}×{initialData.house.height}м</strong>
              </div>
              <div className="detail-item">
                <span>Площадь:</span>
                <strong>{initialData.house.area}м²</strong>
              </div>
              <div className="detail-item">
                <span>Участок:</span>
                <strong>{initialData.lotSize.width}×{initialData.lotSize.height}м</strong>
              </div>
              {initialData.house.price && (
                <div className="detail-item">
                  <span>Стоимость:</span>
                  <strong>{(initialData.house.price / 1000).toFixed(0)}к ₽</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .constructor-interface {
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--light-gray);
        }

        .constructor-header {
          background: var(--primary-dark);
          color: var(--white);
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .back-btn {
          background: var(--accent-orange);
          color: var(--white);
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .back-btn:hover {
          background: #c55a24;
        }

        .constructor-header h1 {
          font-size: 20px;
          margin: 0;
        }

        .header-right .project-info {
          display: flex;
          gap: 20px;
          font-size: 14px;
          opacity: 0.9;
        }

        .constructor-body {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        .workspace {
          flex: 1;
          position: relative;
          background: var(--white);
        }

        canvas {
          width: 100%;
          height: 100%;
          cursor: ${isDragging ? 'grabbing' : 'grab'};
          touch-action: none;
        }

        .control-panel {
          width: 25%;
          min-width: 300px;
          max-width: 400px;
          background: var(--primary-dark);
          color: var(--white);
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .panel-section h3 {
          margin: 0 0 12px 0;
          font-size: 16px;
          color: var(--white);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding-bottom: 8px;
        }

        .view-toggle {
          display: flex;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          overflow: hidden;
        }

        .view-toggle button {
          flex: 1;
          padding: 10px;
          border: none;
          background: transparent;
          color: var(--white);
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-toggle button.active {
          background: var(--accent-orange);
        }

        .tools-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .tool-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 12px 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: transparent;
          color: var(--white);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tool-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .tool-btn.active {
          background: var(--accent-orange);
          border-color: var(--accent-orange);
        }

        .tool-icon {
          font-size: 20px;
        }

        .tool-name {
          font-size: 11px;
        }

        .zoom-controls {
          display: grid;
          grid-template-columns: 1fr auto 1fr 1fr;
          gap: 8px;
          align-items: center;
        }

        .zoom-controls button {
          padding: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: transparent;
          color: var(--white);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .zoom-controls button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .zoom-controls span {
          text-align: center;
          font-size: 12px;
        }

        .project-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 13px;
        }

        .detail-item span {
          opacity: 0.8;
        }

        .detail-item strong {
          color: var(--accent-orange);
        }

        @media (max-width: 768px) {
          .constructor-header {
            flex-direction: column;
            gap: 12px;
            padding: 12px 16px;
          }

          .header-left {
            width: 100%;
            justify-content: space-between;
          }

          .header-right .project-info {
            flex-direction: column;
            gap: 4px;
            text-align: center;
          }

          .constructor-body {
            flex-direction: column;
          }

          .control-panel {
            width: 100%;
            min-width: auto;
            max-width: none;
            height: 40%;
            padding: 16px;
            gap: 16px;
          }

          .workspace {
            height: 60%;
          }

          .tools-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .zoom-controls {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
    </div>
  );
}