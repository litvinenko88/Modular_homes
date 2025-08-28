'use client';

import { useState, useRef, useEffect } from 'react';

const HOUSE_SERIES = {
  arkhangelsk: {
    name: 'Серия "Архангельск"',
    models: [
      { id: 'arch-6x2.5', width: 6, height: 2.5, title: 'Новый Архангельск 6×2.5м', area: 15, price: 450000 },
      { id: 'arch-7x2.5', width: 7, height: 2.5, title: 'Новый Архангельск 7×2.5м', area: 17.5, price: 525000 },
      { id: 'arch-8x2.5', width: 8, height: 2.5, title: 'Новый Архангельск 8×2.5м', area: 20, price: 600000 },
      { id: 'arch-6x5', width: 6, height: 5, title: 'Угловой Архангельск 6×5м', area: 30, price: 900000 },
      { id: 'arch-7x5', width: 7, height: 5, title: 'Угловой Архангельск 7×5м', area: 35, price: 1050000 },
      { id: 'arch-8x5', width: 8, height: 5, title: 'Угловой Архангельск 8×5м', area: 40, price: 1200000 }
    ]
  },
  barn: {
    name: 'Серия "Барн"',
    models: [
      { id: 'barn-6x2.5', width: 6, height: 2.5, title: 'Барнхаус 6×2.5м', area: 15, price: 480000 },
      { id: 'barn-7x2.5', width: 7, height: 2.5, title: 'Барнхаус 7×2.5м', area: 17.5, price: 560000 },
      { id: 'barn-8x2.5', width: 8, height: 2.5, title: 'Барнхаус 8×2.5м', area: 20, price: 640000 },
      { id: 'barn-6x5', width: 6, height: 5, title: 'Барн с террасой 6×5м', area: 30, price: 960000 },
      { id: 'barn-7x5', width: 7, height: 5, title: 'Барн с террасой 7×5м', area: 35, price: 1120000 },
      { id: 'barn-8x5', width: 8, height: 5, title: 'Барн с террасой 8×5м', area: 40, price: 1280000 }
    ]
  },
  multi: {
    name: 'Многомодульные решения',
    models: [
      { id: 'dvin-6x5', width: 6, height: 5, title: 'Двухмодульная Двинея 6×5м', area: 30, price: 900000 },
      { id: 'dvin-7x5', width: 7, height: 5, title: 'Двухмодульная Двинея 7×5м', area: 35, price: 1050000 },
      { id: 'dvin-8x5', width: 8, height: 5, title: 'Двухмодульная Двинея 8×5м', area: 40, price: 1200000 },
      { id: 'barn4-7x10', width: 7, height: 10, title: 'Четырехмодульный Барн 7×10м', area: 70, price: 2100000 },
      { id: 'barn4-8x10', width: 8, height: 10, title: 'Четырехмодульный Барн 8×10м', area: 80, price: 2400000 }
    ]
  }
};

const CUSTOM_MODULE_COLORS = ['#e3f2fd', '#f3e5f5', '#e8f5e8', '#fff3e0', '#fce4ec', '#e0f2f1'];

export default function ModuleSelection({ data, updateData, onNext }) {
  const canvasRef = useRef(null);
  const [lotWidth, setLotWidth] = useState(data.lotSize.width || 20);
  const [lotHeight, setLotHeight] = useState(data.lotSize.height || 15);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [selectedSeries, setSelectedSeries] = useState('arkhangelsk');
  const [customMode, setCustomMode] = useState(false);
  const [customWidth, setCustomWidth] = useState(6);
  const [customHeight, setCustomHeight] = useState(2.5);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggedModule, setDraggedModule] = useState(null);

  const SCALE = 20 * zoom; // пикселей на метр с учетом масштаба

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
  }, [data.modules, lotWidth, lotHeight, zoom, panOffset, selectedModuleId]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0 || canvas.height === 0) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    
    // Рисуем сетку
    drawGrid(ctx);
    
    // Рисуем участок
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    ctx.strokeRect(100, 100, lotWidth * SCALE, lotHeight * SCALE);
    ctx.setLineDash([]);
    
    // Подпись участка
    ctx.fillStyle = '#666';
    ctx.font = `${Math.max(12, 12 * zoom)}px Arial`;
    ctx.fillText(`Участок ${lotWidth}×${lotHeight}м`, 100, 90);
    
    // Рисуем модули
    (data.modules || []).forEach(module => {
      drawModule(ctx, module);
    });
    
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
    
    // Основная сетка
    ctx.strokeStyle = '#e8e8e8';
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
    ctx.strokeStyle = '#d0d0d0';
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
  
  const drawModule = (ctx, module) => {
    const isSelected = module.id === selectedModuleId;
    const colorIndex = module.colorIndex || 0;
    const color = CUSTOM_MODULE_COLORS[colorIndex % CUSTOM_MODULE_COLORS.length];
    
    // Тень для выбранного модуля
    if (isSelected) {
      ctx.fillStyle = 'rgba(33, 150, 243, 0.3)';
      ctx.fillRect(
        100 + module.x * SCALE + 3, 
        100 + module.y * SCALE + 3, 
        module.width * SCALE, 
        module.height * SCALE
      );
    }
    
    // Основной модуль
    ctx.fillStyle = isSelected ? '#2196f3' : color;
    ctx.fillRect(
      100 + module.x * SCALE, 
      100 + module.y * SCALE, 
      module.width * SCALE, 
      module.height * SCALE
    );
    
    // Рамка
    ctx.strokeStyle = isSelected ? '#1976d2' : '#333';
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.strokeRect(
      100 + module.x * SCALE, 
      100 + module.y * SCALE, 
      module.width * SCALE, 
      module.height * SCALE
    );
    
    // Размеры модуля
    ctx.fillStyle = '#333';
    ctx.font = `${Math.max(10, 10 * zoom)}px Arial`;
    ctx.textAlign = 'center';
    
    const centerX = 100 + (module.x + module.width/2) * SCALE;
    const centerY = 100 + (module.y + module.height/2) * SCALE;
    
    ctx.fillText(
      `${module.width}×${module.height}м`,
      centerX,
      centerY - 5
    );
    
    if (module.area) {
      ctx.fillText(
        `${module.area}м²`,
        centerX,
        centerY + 10
      );
    }
    
    // Маркеры для изменения размера
    if (isSelected) {
      drawResizeHandles(ctx, module);
    }
  };
  
  const drawResizeHandles = (ctx, module) => {
    const moduleX = 100 + module.x * SCALE;
    const moduleY = 100 + module.y * SCALE;
    const moduleW = module.width * SCALE;
    const moduleH = module.height * SCALE;
    
    // Маркеры для изменения размера
    const handles = [
      { x: moduleX + moduleW, y: moduleY + moduleH },
      { x: moduleX, y: moduleY + moduleH },
      { x: moduleX + moduleW, y: moduleY },
    ];
    
    ctx.fillStyle = '#ff5722';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    
    handles.forEach(handle => {
      ctx.beginPath();
      ctx.arc(handle.x, handle.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
    
    // Кнопка поворота
    const rotateX = moduleX + moduleW / 2;
    const rotateY = moduleY - 25;
    
    ctx.fillStyle = '#2196f3';
    ctx.beginPath();
    ctx.arc(rotateX, rotateY, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Стрелка поворота
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(rotateX, rotateY, 6, 0, Math.PI * 1.5);
    ctx.stroke();
    
    // Линия к модулю
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(rotateX, rotateY + 12);
    ctx.lineTo(rotateX, moduleY);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const handleCanvasMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const x = (clientX - panOffset.x - 100) / SCALE;
    const y = (clientY - panOffset.y - 100) / SCALE;
    
    // Проверяем клик по кнопке поворота
    const selectedModule = (data.modules || []).find(m => m.id === selectedModuleId);
    if (selectedModule) {
      const rotateX = 100 + (selectedModule.x + selectedModule.width / 2) * SCALE + panOffset.x;
      const rotateY = 100 + selectedModule.y * SCALE + panOffset.y - 25;
      const distanceToRotate = Math.sqrt(
        Math.pow(clientX - rotateX, 2) + Math.pow(clientY - rotateY, 2)
      );
      
      if (distanceToRotate <= 12) {
        rotateModule(selectedModuleId);
        return;
      }
    }
    
    // Проверяем клик по модулю
    const clickedModule = (data.modules || []).find(module => 
      x >= module.x && x <= module.x + module.width &&
      y >= module.y && y <= module.y + module.height
    );
    
    if (clickedModule) {
      setSelectedModuleId(clickedModule.id);
      startDragModule(clickedModule.id, clientX, clientY);
    } else {
      setSelectedModuleId(null);
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };
  
  const handleCanvasMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    
    if (draggedModule) {
      dragModule(clientX, clientY);
    } else if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };
  
  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    endDragModule();
  };
  
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.3, Math.min(5, prev * delta)));
  };
  
  // Поддержка тач-жестов
  const [touchStart, setTouchStart] = useState(null);
  const [touchDistance, setTouchDistance] = useState(null);
  
  const handleTouchStart = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const clientX = touch.clientX - rect.left;
      const clientY = touch.clientY - rect.top;
      const x = (clientX - panOffset.x - 100) / SCALE;
      const y = (clientY - panOffset.y - 100) / SCALE;
      
      // Проверяем тач по модулю
      const touchedModule = (data.modules || []).find(module => 
        x >= module.x && x <= module.x + module.width &&
        y >= module.y && y <= module.y + module.height
      );
      
      if (touchedModule) {
        setSelectedModuleId(touchedModule.id);
        startDragModule(touchedModule.id, clientX, clientY);
      } else {
        setSelectedModuleId(null);
        setTouchStart({ x: touch.clientX, y: touch.clientY });
        setIsDragging(true);
        setDragStart({ x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y });
      }
    } else if (e.touches.length === 2) {
      const distance = Math.sqrt(
        Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
        Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
      );
      setTouchDistance(distance);
      setIsDragging(false);
      endDragModule();
    }
  };
  
  const handleTouchMove = (e) => {
    e.preventDefault();
    
    if (e.touches.length === 1) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches[0].clientX - rect.left;
      const clientY = e.touches[0].clientY - rect.top;
      
      if (draggedModule) {
        dragModule(clientX, clientY);
      } else if (isDragging && touchStart) {
        setPanOffset({
          x: e.touches[0].clientX - dragStart.x,
          y: e.touches[0].clientY - dragStart.y
        });
      }
    } else if (e.touches.length === 2 && touchDistance) {
      const newDistance = Math.sqrt(
        Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
        Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
      );
      
      const scale = newDistance / touchDistance;
      setZoom(prev => Math.max(0.3, Math.min(5, prev * scale)));
      setTouchDistance(newDistance);
    }
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchStart(null);
    setTouchDistance(null);
    endDragModule();
  };

  const addModule = (moduleData) => {
    const newModule = {
      id: Date.now(),
      x: 2,
      y: 2,
      width: moduleData.width,
      height: moduleData.height,
      area: moduleData.area || moduleData.width * moduleData.height,
      price: moduleData.price || 0,
      type: moduleData.id,
      title: moduleData.title,
      colorIndex: data.modules.length % CUSTOM_MODULE_COLORS.length
    };
    
    updateData({
      modules: [...data.modules, newModule],
      lotSize: { width: lotWidth, height: lotHeight }
    });
  };
  
  const addCustomModule = () => {
    const customModule = {
      id: `custom-${Date.now()}`,
      width: customWidth,
      height: customHeight,
      area: customWidth * customHeight,
      price: (customWidth * customHeight) * 30000,
      title: `Модуль ${customWidth}×${customHeight}м`
    };
    addModule(customModule);
  };
  
  const rotateModule = (moduleId) => {
    const updatedModules = (data.modules || []).map(module => {
      if (module.id === moduleId) {
        return {
          ...module,
          width: module.height,
          height: module.width,
          rotation: (module.rotation || 0) + 90
        };
      }
      return module;
    });
    
    updateData({ modules: updatedModules });
  };
  
  const startDragModule = (moduleId, startX, startY) => {
    setDraggedModule({ id: moduleId, startX, startY });
  };
  
  const dragModule = (currentX, currentY) => {
    if (!draggedModule) return;
    
    const deltaX = (currentX - draggedModule.startX) / SCALE;
    const deltaY = (currentY - draggedModule.startY) / SCALE;
    
    const updatedModules = (data.modules || []).map(module => {
      if (module.id === draggedModule.id) {
        return {
          ...module,
          x: Math.max(0, Math.min(lotWidth - module.width, module.x + deltaX)),
          y: Math.max(0, Math.min(lotHeight - module.height, module.y + deltaY))
        };
      }
      return module;
    });
    
    updateData({ modules: updatedModules });
    setDraggedModule({ ...draggedModule, startX: currentX, startY: currentY });
  };
  
  const endDragModule = () => {
    setDraggedModule(null);
  };

  const deleteSelectedModule = () => {
    if (selectedModuleId) {
      updateData({
        modules: (data.modules || []).filter(m => m.id !== selectedModuleId)
      });
      setSelectedModuleId(null);
    }
  };

  const canProceed = (data.modules || []).length > 0;

  return (
    <div className="module-selection">
      <div className="controls">
        <div className="lot-settings">
          <h3>Размеры участка</h3>
          <div className="input-group">
            <label>Ширина (м):</label>
            <input 
              type="number" 
              value={lotWidth} 
              onChange={(e) => setLotWidth(Number(e.target.value))}
              min="10"
              max="50"
            />
          </div>
          <div className="input-group">
            <label>Длина (м):</label>
            <input 
              type="number" 
              value={lotHeight} 
              onChange={(e) => setLotHeight(Number(e.target.value))}
              min="10"
              max="50"
            />
          </div>
        </div>

        <div className="module-selection-panel">
          <div className="selection-mode">
            <button 
              className={!customMode ? 'active' : ''}
              onClick={() => setCustomMode(false)}
            >
              Готовые размеры
            </button>
            <button 
              className={customMode ? 'active' : ''}
              onClick={() => setCustomMode(true)}
            >
              Свои размеры
            </button>
          </div>
          
          {!customMode ? (
            <div className="preset-modules">
              <div className="series-selector">
                <select 
                  value={selectedSeries}
                  onChange={(e) => setSelectedSeries(e.target.value)}
                >
                  {Object.entries(HOUSE_SERIES).map(([key, series]) => (
                    <option key={key} value={key}>{series.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="modules-grid">
                {HOUSE_SERIES[selectedSeries].models.map(module => (
                  <div 
                    key={module.id}
                    className="module-card"
                    onClick={() => addModule(module)}
                  >
                    <div className="module-title">{module.title}</div>
                    <div className="module-specs">
                      <span>{module.area}м²</span>
                      <span>{(module.price / 1000).toFixed(0)}к ₽</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="custom-module">
              <h4>Создать модуль</h4>
              <div className="input-group">
                <label>Ширина (м):</label>
                <input 
                  type="number" 
                  value={customWidth}
                  onChange={(e) => setCustomWidth(Number(e.target.value))}
                  min="2"
                  max="12"
                  step="0.5"
                />
              </div>
              <div className="input-group">
                <label>Длина (м):</label>
                <input 
                  type="number" 
                  value={customHeight}
                  onChange={(e) => setCustomHeight(Number(e.target.value))}
                  min="2"
                  max="15"
                  step="0.5"
                />
              </div>
              <div className="custom-info">
                <div>Площадь: {(customWidth * customHeight).toFixed(1)}м²</div>
                <div>Примерная цена: {((customWidth * customHeight) * 30).toFixed(0)}к ₽</div>
              </div>
              <button onClick={addCustomModule} className="add-custom-btn">
                Добавить модуль
              </button>
            </div>
          )}
        </div>
        
        <div className="canvas-controls">
          <div className="zoom-controls">
            <button onClick={() => setZoom(prev => Math.min(3, prev * 1.2))}>
              +
            </button>
            <span>{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(prev => Math.max(0.5, prev / 1.2))}>
              -
            </button>
            <button onClick={() => { setZoom(1); setPanOffset({ x: 0, y: 0 }); }}>
              Сброс
            </button>
          </div>
        </div>

        <div className="actions">
          {selectedModuleId && (
            <button onClick={deleteSelectedModule} className="delete-btn">
              Удалить модуль
            </button>
          )}
          <button 
            onClick={onNext} 
            disabled={!canProceed}
            className="next-btn"
          >
            Далее
          </button>
        </div>
      </div>

      <div className="canvas-area">
        <canvas 
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>

      <style jsx>{`
        .module-selection {
          display: flex;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .controls {
          width: 25%;
          min-width: 280px;
          max-width: 350px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          padding: 20px;
          background: white;
          border-right: 1px solid #e0e0e0;
          overflow-y: auto;
        }
        .lot-settings, .module-palette {
          background: #f5f5f5;
          padding: 15px;
          border-radius: 8px;
        }
        .input-group {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .input-group input {
          width: 80px;
          padding: 5px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .module-selection-panel {
          background: #f5f5f5;
          padding: 15px;
          border-radius: 8px;
        }
        .selection-mode {
          display: flex;
          background: #e0e0e0;
          border-radius: 6px;
          margin-bottom: 15px;
          overflow: hidden;
        }
        .selection-mode button {
          flex: 1;
          padding: 8px 12px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 12px;
        }
        .selection-mode button.active {
          background: #2196f3;
          color: white;
        }
        .series-selector select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-bottom: 10px;
        }
        .modules-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          max-height: 300px;
          overflow-y: auto;
        }
        .module-card {
          padding: 10px;
          border: 2px solid #ddd;
          border-radius: 6px;
          cursor: pointer;
          background: white;
          transition: all 0.2s;
        }
        .module-card:hover {
          border-color: #2196f3;
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .module-title {
          font-size: 11px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .module-specs {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #666;
        }
        .custom-module h4 {
          margin: 0 0 10px 0;
          font-size: 14px;
        }
        .custom-info {
          background: #e8f5e8;
          padding: 8px;
          border-radius: 4px;
          margin: 10px 0;
          font-size: 11px;
        }
        .add-custom-btn {
          width: 100%;
          padding: 10px;
          background: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        .canvas-controls {
          background: #f5f5f5;
          padding: 10px;
          border-radius: 8px;
          margin-top: 10px;
        }
        .zoom-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .zoom-controls button {
          width: 30px;
          height: 30px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        .zoom-controls span {
          font-size: 12px;
          min-width: 40px;
          text-align: center;
        }
        .canvas-area {
          flex: 1;
          position: relative;
          overflow: hidden;
          background: #f8f9fa;
        }
        canvas {
          cursor: ${isDragging ? 'grabbing' : 'grab'};
          background: white;
          width: 100%;
          height: 100%;
          display: block;
          touch-action: none;
        }
        .actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .delete-btn {
          background: #f44336;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 4px;
          cursor: pointer;
        }
        .next-btn {
          background: #4caf50;
          color: white;
          border: none;
          padding: 15px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        .next-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        
        @media (max-width: 768px) {
          .module-selection {
            flex-direction: column;
          }
          .controls {
            width: 100%;
            min-width: auto;
            max-width: none;
            height: 40%;
            order: 2;
            padding: 15px;
            border-right: none;
            border-top: 1px solid #e0e0e0;
          }
          .canvas-area {
            height: 60%;
            order: 1;
          }
          .input-group {
            flex-direction: column;
            align-items: stretch;
            gap: 5px;
          }
          .input-group input {
            width: 100%;
          }
          .modules-grid {
            max-height: 200px;
          }
        }
        
        @media (max-width: 480px) {
          .controls {
            padding: 10px;
            gap: 10px;
          }
          .module-card {
            padding: 8px;
          }
          .module-title {
            font-size: 10px;
          }
          .module-specs {
            font-size: 9px;
          }
        }
      `}</style>
    </div>
  );
}