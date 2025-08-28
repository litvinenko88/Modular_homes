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
  const [selectedElement, setSelectedElement] = useState(null);
  const [draggedElement, setDraggedElement] = useState(null);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [elements, setElements] = useState([
    {
      id: 'house',
      type: 'house',
      x: 150,
      y: 150,
      width: initialData?.house.width * 30 || 180,
      height: initialData?.house.height * 30 || 75,
      realWidth: initialData?.house.width || 6,
      realHeight: initialData?.house.height || 2.5
    }
  ]);

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
  }, [zoom, panOffset, initialData, selectedElement, elements]);
  
  useEffect(() => {
    if (initialData) {
      setElements([{
        id: 'house',
        type: 'house',
        x: 150,
        y: 150,
        width: initialData.house.width * 30,
        height: initialData.house.height * 30,
        realWidth: initialData.house.width,
        realHeight: initialData.house.height
      }]);
    }
  }, [initialData]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0 || canvas.height === 0) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    
    drawGrid(ctx);
    drawLot(ctx);
    drawElements(ctx);
    
    ctx.restore();
  };

  const drawGrid = (ctx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Адаптивный размер сетки в зависимости от масштаба
    let baseGridSize = 20;
    
    // Подбираем оптимальный размер сетки для текущего масштаба
    if (zoom < 0.5) {
      baseGridSize = 40;
    } else if (zoom > 2) {
      baseGridSize = 10;
    }
    
    const gridSize = baseGridSize * zoom;
    
    // Если сетка слишком мелкая или крупная, не рисуем её
    if (gridSize < 5 || gridSize > 200) return;
    
    // Вычисляем границы видимой области с учетом панорамирования
    const visibleLeft = -panOffset.x;
    const visibleTop = -panOffset.y;
    const visibleRight = visibleLeft + canvas.width;
    const visibleBottom = visibleTop + canvas.height;
    
    // Расширяем область для полного покрытия с запасом
    const margin = gridSize * 2;
    const startX = Math.floor((visibleLeft - margin) / gridSize) * gridSize;
    const startY = Math.floor((visibleTop - margin) / gridSize) * gridSize;
    const endX = Math.ceil((visibleRight + margin) / gridSize) * gridSize;
    const endY = Math.ceil((visibleBottom + margin) / gridSize) * gridSize;
    
    // Мелкая сетка (основная)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;
    
    // Рисуем вертикальные линии
    for (let x = startX; x <= endX; x += gridSize) {
      const screenX = x + panOffset.x;
      ctx.beginPath();
      ctx.moveTo(screenX, 0);
      ctx.lineTo(screenX, canvas.height);
      ctx.stroke();
    }
    
    // Рисуем горизонтальные линии
    for (let y = startY; y <= endY; y += gridSize) {
      const screenY = y + panOffset.y;
      ctx.beginPath();
      ctx.moveTo(0, screenY);
      ctx.lineTo(canvas.width, screenY);
      ctx.stroke();
    }
    
    // Крупная сетка (каждые 5 линий) - только если основная сетка достаточно мелкая
    if (gridSize <= 50) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = Math.max(0.5, Math.min(2, zoom));
      
      const majorGridSize = gridSize * 5;
      const majorStartX = Math.floor((visibleLeft - margin) / majorGridSize) * majorGridSize;
      const majorStartY = Math.floor((visibleTop - margin) / majorGridSize) * majorGridSize;
      const majorEndX = Math.ceil((visibleRight + margin) / majorGridSize) * majorGridSize;
      const majorEndY = Math.ceil((visibleBottom + margin) / majorGridSize) * majorGridSize;
      
      // Рисуем крупные вертикальные линии
      for (let x = majorStartX; x <= majorEndX; x += majorGridSize) {
        const screenX = x + panOffset.x;
        ctx.beginPath();
        ctx.moveTo(screenX, 0);
        ctx.lineTo(screenX, canvas.height);
        ctx.stroke();
      }
      
      // Рисуем крупные горизонтальные линии
      for (let y = majorStartY; y <= majorEndY; y += majorGridSize) {
        const screenY = y + panOffset.y;
        ctx.beginPath();
        ctx.moveTo(0, screenY);
        ctx.lineTo(canvas.width, screenY);
        ctx.stroke();
      }
    }
    
    // Супер крупная сетка для очень мелкого масштаба
    if (zoom <= 0.3 && gridSize <= 20) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      
      const superGridSize = gridSize * 25;
      const superStartX = Math.floor((visibleLeft - margin) / superGridSize) * superGridSize;
      const superStartY = Math.floor((visibleTop - margin) / superGridSize) * superGridSize;
      const superEndX = Math.ceil((visibleRight + margin) / superGridSize) * superGridSize;
      const superEndY = Math.ceil((visibleBottom + margin) / superGridSize) * superGridSize;
      
      for (let x = superStartX; x <= superEndX; x += superGridSize) {
        const screenX = x + panOffset.x;
        ctx.beginPath();
        ctx.moveTo(screenX, 0);
        ctx.lineTo(screenX, canvas.height);
        ctx.stroke();
      }
      
      for (let y = superStartY; y <= superEndY; y += superGridSize) {
        const screenY = y + panOffset.y;
        ctx.beginPath();
        ctx.moveTo(0, screenY);
        ctx.lineTo(canvas.width, screenY);
        ctx.stroke();
      }
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

  const drawElements = (ctx) => {
    elements.forEach(element => {
      drawElement(ctx, element);
    });
  };
  
  const drawElement = (ctx, element) => {
    const isSelected = selectedElement?.id === element.id;
    
    // Основа элемента
    if (element.type === 'house') {
      ctx.fillStyle = isSelected ? '#d4c5e8' : '#eee8f4';
    } else {
      ctx.fillStyle = isSelected ? '#c5d4e8' : '#e8f4ee';
    }
    
    ctx.fillRect(element.x, element.y, element.width, element.height);
    
    // Контур
    ctx.strokeStyle = isSelected ? '#df682b' : '#31323d';
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.strokeRect(element.x, element.y, element.width, element.height);
    
    // Информация об элементе
    ctx.fillStyle = '#31323d';
    ctx.font = `${Math.max(10, 10 * zoom)}px Arial`;
    ctx.textAlign = 'center';
    
    const centerX = element.x + element.width / 2;
    const centerY = element.y + element.height / 2;
    
    if (element.realWidth && element.realHeight) {
      ctx.fillText(
        `${element.realWidth.toFixed(1)}×${element.realHeight.toFixed(1)}м`,
        centerX,
        centerY - 5
      );
      
      if (element.type === 'house') {
        ctx.fillText(
          `${(element.realWidth * element.realHeight).toFixed(1)}м²`,
          centerX,
          centerY + 10
        );
      }
    }
    
    // Размеры по краям
    if (zoom >= 0.5) {
      ctx.fillStyle = '#df682b';
      ctx.font = `${Math.max(8, 8 * zoom)}px Arial`;
      
      // Ширина (сверху)
      ctx.fillText(
        `${element.realWidth?.toFixed(1) || '0'}м`,
        centerX,
        element.y - 8
      );
      
      // Высота (слева)
      ctx.save();
      ctx.translate(element.x - 12, centerY);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(`${element.realHeight?.toFixed(1) || '0'}м`, 0, 0);
      ctx.restore();
    }
    
    // Маркеры для изменения размера
    if (isSelected) {
      drawResizeHandles(ctx, element);
    }
  };
  
  const drawResizeHandles = (ctx, element) => {
    const handleSize = Math.max(6, 6 * zoom);
    const handles = [
      { id: 'nw', x: element.x - handleSize/2, y: element.y - handleSize/2 },
      { id: 'ne', x: element.x + element.width - handleSize/2, y: element.y - handleSize/2 },
      { id: 'sw', x: element.x - handleSize/2, y: element.y + element.height - handleSize/2 },
      { id: 'se', x: element.x + element.width - handleSize/2, y: element.y + element.height - handleSize/2 },
      { id: 'n', x: element.x + element.width/2 - handleSize/2, y: element.y - handleSize/2 },
      { id: 's', x: element.x + element.width/2 - handleSize/2, y: element.y + element.height - handleSize/2 },
      { id: 'w', x: element.x - handleSize/2, y: element.y + element.height/2 - handleSize/2 },
      { id: 'e', x: element.x + element.width - handleSize/2, y: element.y + element.height/2 - handleSize/2 }
    ];
    
    ctx.fillStyle = '#df682b';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    
    handles.forEach(handle => {
      ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
      ctx.strokeRect(handle.x, handle.y, handleSize, handleSize);
    });
  };

  const handleCanvasMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const worldX = clientX - panOffset.x;
    const worldY = clientY - panOffset.y;
    
    // Проверяем клик по маркерам изменения размера
    if (selectedElement) {
      const handle = getResizeHandle(worldX, worldY, selectedElement);
      if (handle) {
        setResizeHandle({ elementId: selectedElement.id, handle });
        return;
      }
    }
    
    // Проверяем клик по элементам
    const clickedElement = getElementAt(worldX, worldY);
    if (clickedElement) {
      setSelectedElement(clickedElement);
      setDraggedElement({ 
        element: clickedElement, 
        startX: worldX - clickedElement.x, 
        startY: worldY - clickedElement.y 
      });
      return;
    }
    
    // Начинаем панорамирование
    setSelectedElement(null);
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };
  
  const getElementAt = (x, y) => {
    // Проверяем элементы в обратном порядке (сверху вниз)
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];
      if (x >= element.x && x <= element.x + element.width &&
          y >= element.y && y <= element.y + element.height) {
        return element;
      }
    }
    return null;
  };
  
  const getResizeHandle = (x, y, element) => {
    const handleSize = Math.max(6, 6 * zoom);
    const tolerance = handleSize;
    
    const handles = [
      { id: 'nw', x: element.x, y: element.y },
      { id: 'ne', x: element.x + element.width, y: element.y },
      { id: 'sw', x: element.x, y: element.y + element.height },
      { id: 'se', x: element.x + element.width, y: element.y + element.height },
      { id: 'n', x: element.x + element.width/2, y: element.y },
      { id: 's', x: element.x + element.width/2, y: element.y + element.height },
      { id: 'w', x: element.x, y: element.y + element.height/2 },
      { id: 'e', x: element.x + element.width, y: element.y + element.height/2 }
    ];
    
    for (const handle of handles) {
      if (Math.abs(x - handle.x) <= tolerance && Math.abs(y - handle.y) <= tolerance) {
        return handle.id;
      }
    }
    return null;
  };

  const handleCanvasMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const worldX = clientX - panOffset.x;
    const worldY = clientY - panOffset.y;
    
    // Изменение размера
    if (resizeHandle) {
      resizeElement(worldX, worldY);
      return;
    }
    
    // Перетаскивание элемента
    if (draggedElement) {
      const newX = worldX - draggedElement.startX;
      const newY = worldY - draggedElement.startY;
      
      setElements(prev => prev.map(el => 
        el.id === draggedElement.element.id 
          ? { ...el, x: newX, y: newY }
          : el
      ));
      return;
    }
    
    // Панорамирование
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
    
    // Обновляем курсор
    updateCursor(worldX, worldY);
  };
  
  const resizeElement = (worldX, worldY) => {
    const element = elements.find(el => el.id === resizeHandle.elementId);
    if (!element) return;
    
    let newX = element.x;
    let newY = element.y;
    let newWidth = element.width;
    let newHeight = element.height;
    
    const minSize = 30; // минимальный размер
    
    switch (resizeHandle.handle) {
      case 'nw':
        newWidth = element.x + element.width - worldX;
        newHeight = element.y + element.height - worldY;
        newX = worldX;
        newY = worldY;
        break;
      case 'ne':
        newWidth = worldX - element.x;
        newHeight = element.y + element.height - worldY;
        newY = worldY;
        break;
      case 'sw':
        newWidth = element.x + element.width - worldX;
        newHeight = worldY - element.y;
        newX = worldX;
        break;
      case 'se':
        newWidth = worldX - element.x;
        newHeight = worldY - element.y;
        break;
      case 'n':
        newHeight = element.y + element.height - worldY;
        newY = worldY;
        break;
      case 's':
        newHeight = worldY - element.y;
        break;
      case 'w':
        newWidth = element.x + element.width - worldX;
        newX = worldX;
        break;
      case 'e':
        newWidth = worldX - element.x;
        break;
    }
    
    // Проверяем минимальные размеры
    if (newWidth < minSize) {
      if (resizeHandle.handle.includes('w')) {
        newX = element.x + element.width - minSize;
      }
      newWidth = minSize;
    }
    
    if (newHeight < minSize) {
      if (resizeHandle.handle.includes('n')) {
        newY = element.y + element.height - minSize;
      }
      newHeight = minSize;
    }
    
    // Пересчитываем реальные размеры
    const realWidth = newWidth / 30; // 30 пикселей = 1 метр
    const realHeight = newHeight / 30;
    
    setElements(prev => prev.map(el => 
      el.id === resizeHandle.elementId 
        ? { 
            ...el, 
            x: newX, 
            y: newY, 
            width: newWidth, 
            height: newHeight,
            realWidth: Math.round(realWidth * 10) / 10, // округляем до 0.1
            realHeight: Math.round(realHeight * 10) / 10
          }
        : el
    ));
  };
  
  const updateCursor = (worldX, worldY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    let cursor = 'grab';
    
    if (selectedElement) {
      const handle = getResizeHandle(worldX, worldY, selectedElement);
      if (handle) {
        const cursors = {
          'nw': 'nw-resize',
          'ne': 'ne-resize', 
          'sw': 'sw-resize',
          'se': 'se-resize',
          'n': 'n-resize',
          's': 's-resize',
          'w': 'w-resize',
          'e': 'e-resize'
        };
        cursor = cursors[handle] || 'pointer';
      } else if (getElementAt(worldX, worldY)) {
        cursor = 'move';
      }
    } else if (getElementAt(worldX, worldY)) {
      cursor = 'pointer';
    }
    
    if (isDragging) cursor = 'grabbing';
    
    canvas.style.cursor = cursor;
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setDraggedElement(null);
    setResizeHandle(null);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.3, Math.min(5, prev * delta)));
  };
  
  // Поддержка тач-жестов
  const [touchDistance, setTouchDistance] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  
  const handleTouchStart = (e) => {
    e.preventDefault();
    
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      const clientX = touch.clientX - rect.left;
      const clientY = touch.clientY - rect.top;
      const worldX = clientX - panOffset.x;
      const worldY = clientY - panOffset.y;
      
      setTouchStart({ x: touch.clientX, y: touch.clientY });
      
      // Проверяем клик по элементам
      const clickedElement = getElementAt(worldX, worldY);
      if (clickedElement) {
        setSelectedElement(clickedElement);
        setDraggedElement({ 
          element: clickedElement, 
          startX: worldX - clickedElement.x, 
          startY: worldY - clickedElement.y 
        });
      } else {
        setSelectedElement(null);
        setIsDragging(true);
        setDragStart({ x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y });
      }
    } else if (e.touches.length === 2) {
      // Масштабирование
      const distance = Math.sqrt(
        Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
        Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
      );
      setTouchDistance(distance);
      setIsDragging(false);
      setDraggedElement(null);
    }
  };
  
  const handleTouchMove = (e) => {
    e.preventDefault();
    
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      const clientX = touch.clientX - rect.left;
      const clientY = touch.clientY - rect.top;
      const worldX = clientX - panOffset.x;
      const worldY = clientY - panOffset.y;
      
      if (draggedElement) {
        const newX = worldX - draggedElement.startX;
        const newY = worldY - draggedElement.startY;
        
        setElements(prev => prev.map(el => 
          el.id === draggedElement.element.id 
            ? { ...el, x: newX, y: newY }
            : el
        ));
      } else if (isDragging && touchStart) {
        setPanOffset({
          x: touch.clientX - dragStart.x,
          y: touch.clientY - dragStart.y
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
    setDraggedElement(null);
    setResizeHandle(null);
    setTouchDistance(null);
    setTouchStart(null);
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
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
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
              {(() => {
                const houseElement = elements.find(el => el.type === 'house');
                return houseElement ? (
                  <>
                    <div className="detail-item">
                      <span>Размеры дома:</span>
                      <strong>{houseElement.realWidth?.toFixed(1) || 0}×{houseElement.realHeight?.toFixed(1) || 0}м</strong>
                    </div>
                    <div className="detail-item">
                      <span>Площадь:</span>
                      <strong>{((houseElement.realWidth || 0) * (houseElement.realHeight || 0)).toFixed(1)}м²</strong>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="detail-item">
                      <span>Размеры дома:</span>
                      <strong>{initialData.house.width}×{initialData.house.height}м</strong>
                    </div>
                    <div className="detail-item">
                      <span>Площадь:</span>
                      <strong>{initialData.house.area}м²</strong>
                    </div>
                  </>
                );
              })()}
              <div className="detail-item">
                <span>Участок:</span>
                <strong>{initialData.lotSize.width}×{initialData.lotSize.height}м</strong>
              </div>
              {selectedElement && (
                <div className="detail-item selected-info">
                  <span>Выбран:</span>
                  <strong>{selectedElement.type === 'house' ? 'Дом' : 'Элемент'}</strong>
                </div>
              )}
              {initialData.house.price && (() => {
                const houseElement = elements.find(el => el.type === 'house');
                const currentArea = houseElement ? (houseElement.realWidth * houseElement.realHeight) : initialData.house.area;
                const pricePerSqm = initialData.house.price / initialData.house.area;
                const currentPrice = currentArea * pricePerSqm;
                return (
                  <div className="detail-item">
                    <span>Прим. стоимость:</span>
                    <strong>{(currentPrice / 1000).toFixed(0)}к ₽</strong>
                  </div>
                );
              })()}
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
          background: #3a3b47;
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
        
        .selected-info {
          background: rgba(223, 104, 43, 0.1);
          padding: 4px 8px;
          border-radius: 4px;
          margin: 4px 0;
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