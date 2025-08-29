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
  const [elements, setElements] = useState([]);
  const [walls, setWalls] = useState([]);
  const [fixedElements, setFixedElements] = useState(new Set());
  const [lotFixed, setLotFixed] = useState(true);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [unlockAnimation, setUnlockAnimation] = useState(null);
  const [isDrawingWall, setIsDrawingWall] = useState(false);
  const [wallDrawStart, setWallDrawStart] = useState(null);
  const [currentWallEnd, setCurrentWallEnd] = useState(null);
  const [hoveredWall, setHoveredWall] = useState(null);
  const [panelCollapsed, setPanelCollapsed] = useState(false);

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
  }, [zoom, panOffset, initialData, selectedElement, elements, walls, isDrawingWall, wallDrawStart, currentWallEnd, hoveredElement, hoveredWall]);
  
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
    drawWalls(ctx);
    
    // Рисуем предварительный просмотр стены
    if (isDrawingWall && wallDrawStart && currentWallEnd) {
      ctx.strokeStyle = '#ff9800';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(wallDrawStart.x * zoom, wallDrawStart.y * zoom);
      ctx.lineTo(currentWallEnd.x * zoom, currentWallEnd.y * zoom);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Показываем длину при рисовании
      const pixelLength = Math.sqrt(
        Math.pow((currentWallEnd.x - wallDrawStart.x), 2) + 
        Math.pow((currentWallEnd.y - wallDrawStart.y), 2)
      );
      const lengthInMm = (pixelLength / 30) * 1000;
      
      const centerX = ((wallDrawStart.x + currentWallEnd.x) / 2) * zoom;
      const centerY = ((wallDrawStart.y + currentWallEnd.y) / 2) * zoom;
      
      ctx.fillStyle = '#ff9800';
      ctx.font = `${Math.max(10, 12 * zoom)}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(`${lengthInMm.toFixed(0)}мм`, centerX, centerY - 10);
    }
    
    ctx.restore();
  };

  const drawGrid = (ctx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Определяем размер сетки в зависимости от масштаба
    let gridSize = 20 * zoom;
    
    // Адаптируем размер сетки для читаемости
    while (gridSize < 8) gridSize *= 2;
    while (gridSize > 80) gridSize /= 2;
    
    // Минимальный размер сетки
    if (gridSize < 5) return;
    
    // Вычисляем область для рисования с очень большим запасом
    const margin = Math.max(canvas.width, canvas.height) * 2;
    const worldLeft = -panOffset.x - margin;
    const worldTop = -panOffset.y - margin;
    const worldRight = -panOffset.x + canvas.width + margin;
    const worldBottom = -panOffset.y + canvas.height + margin;
    
    // Находим начальные точки сетки с запасом
    const startX = Math.floor(worldLeft / gridSize) * gridSize;
    const startY = Math.floor(worldTop / gridSize) * gridSize;
    const endX = Math.ceil(worldRight / gridSize) * gridSize + gridSize;
    const endY = Math.ceil(worldBottom / gridSize) * gridSize + gridSize;
    
    // Основная сетка
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 0.5;
    
    // Рисуем вертикальные линии
    for (let x = startX; x <= endX; x += gridSize) {
      const screenX = x + panOffset.x;
      // Рисуем линию даже если она выходит за границы экрана
      ctx.beginPath();
      ctx.moveTo(screenX, -margin);
      ctx.lineTo(screenX, canvas.height + margin);
      ctx.stroke();
    }
    
    // Рисуем горизонтальные линии
    for (let y = startY; y <= endY; y += gridSize) {
      const screenY = y + panOffset.y;
      // Рисуем линию даже если она выходит за границы экрана
      ctx.beginPath();
      ctx.moveTo(-margin, screenY);
      ctx.lineTo(canvas.width + margin, screenY);
      ctx.stroke();
    }
    
    // Крупная сетка (каждые 5 линий)
    if (gridSize <= 50) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      
      const majorGridSize = gridSize * 5;
      const majorStartX = Math.floor(worldLeft / majorGridSize) * majorGridSize;
      const majorStartY = Math.floor(worldTop / majorGridSize) * majorGridSize;
      const majorEndX = Math.ceil(worldRight / majorGridSize) * majorGridSize + majorGridSize;
      const majorEndY = Math.ceil(worldBottom / majorGridSize) * majorGridSize + majorGridSize;
      
      // Крупные вертикальные линии
      for (let x = majorStartX; x <= majorEndX; x += majorGridSize) {
        const screenX = x + panOffset.x;
        ctx.beginPath();
        ctx.moveTo(screenX, -margin);
        ctx.lineTo(screenX, canvas.height + margin);
        ctx.stroke();
      }
      
      // Крупные горизонтальные линии
      for (let y = majorStartY; y <= majorEndY; y += majorGridSize) {
        const screenY = y + panOffset.y;
        ctx.beginPath();
        ctx.moveTo(-margin, screenY);
        ctx.lineTo(canvas.width + margin, screenY);
        ctx.stroke();
      }
    }
  };

  const drawLot = (ctx) => {
    const houseElement = elements.find(el => el.type === 'house');
    if (!houseElement) return;
    
    // Расчет позиции участка
    let lotX, lotY;
    const lotW = initialData.lotSize.width * 30 * zoom;
    const lotH = initialData.lotSize.height * 30 * zoom;
    
    if (lotFixed) {
      // Если участок зафиксирован, он остается на месте
      lotX = 100;
      lotY = 100;
    } else {
      // Участок следует за домом
      lotX = houseElement.x * zoom - 50 * zoom;
      lotY = houseElement.y * zoom - 50 * zoom;
    }
    
    // Проверяем, выходит ли дом за границы участка
    const scaledHouseX = houseElement.x * zoom;
    const scaledHouseY = houseElement.y * zoom;
    const scaledHouseW = houseElement.width * zoom;
    const scaledHouseH = houseElement.height * zoom;
    
    const houseExceedsLot = (
      scaledHouseX < lotX || 
      scaledHouseY < lotY ||
      scaledHouseX + scaledHouseW > lotX + lotW ||
      scaledHouseY + scaledHouseH > lotY + lotH
    );
    
    // Заливка участка
    ctx.fillStyle = houseExceedsLot ? 'rgba(255, 0, 0, 0.1)' : 'rgba(200, 200, 200, 0.05)';
    ctx.fillRect(lotX, lotY, lotW, lotH);
    
    // Контур участка
    ctx.strokeStyle = houseExceedsLot ? '#ff0000' : (lotFixed ? '#2196f3' : '#666');
    ctx.lineWidth = Math.max(2, 3 * zoom);
    const dashSize = Math.max(8, 15 * zoom);
    ctx.setLineDash([dashSize, dashSize * 0.6]);
    ctx.strokeRect(lotX, lotY, lotW, lotH);
    ctx.setLineDash([]);
    
    // Подсветка участка при наведении в режиме фиксации
    if (selectedTool === 'fix' && hoveredElement?.type === 'lot') {
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 3;
      ctx.strokeRect(lotX, lotY, lotW, lotH);
    }
    
    // Красный замок для зафиксированного участка (всегда видим)
    if (lotFixed && zoom >= 0.4) {
      const lockX = lotX + lotW - 30;
      const lockY = lotY + 10;
      
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(lockX, lockY, 20, 20);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.strokeRect(lockX, lockY, 20, 20);
      
      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🔒', lockX + 10, lockY + 14);
    }
    
    // Анимация зеленого замка при снятии фиксации
    if (unlockAnimation?.type === 'lot' && zoom >= 0.4) {
      const lockX = lotX + lotW - 30;
      const lockY = lotY + 10;
      
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(lockX, lockY, 20, 20);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.strokeRect(lockX, lockY, 20, 20);
      
      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🔓', lockX + 10, lockY + 14);
    }
    
    // Размеры участка
    if (zoom >= 0.3) {
      ctx.fillStyle = houseExceedsLot ? '#ff0000' : '#666';
      ctx.font = `${Math.max(10, 14 * zoom)}px Arial`;
      ctx.textAlign = 'center';
      
      const lotArea = (initialData.lotSize.width * initialData.lotSize.height / 100).toFixed(2);
      
      ctx.fillText(
        `${(initialData.lotSize.width * 1000).toFixed(0)}мм`,
        lotX + lotW / 2,
        lotY - 10 * zoom
      );
      
      ctx.save();
      ctx.translate(lotX - 20 * zoom, lotY + lotH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(`${(initialData.lotSize.height * 1000).toFixed(0)}мм`, 0, 0);
      ctx.restore();
      
      // Показываем площадь в сотках
      ctx.fillText(
        `${lotArea} соток`,
        lotX + lotW / 2,
        lotY + lotH + 20 * zoom
      );
    }
    
    if (houseExceedsLot && zoom >= 0.4) {
      ctx.fillStyle = '#ff0000';
      ctx.font = `${Math.max(10, 12 * zoom)}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(
        'Дом выходит за границы участка!',
        lotX + lotW / 2,
        lotY + lotH + 25 * zoom
      );
    }
  };

  const drawElements = (ctx) => {
    elements.forEach(element => {
      drawElement(ctx, element);
    });
  };
  
  const drawElement = (ctx, element) => {
    const isSelected = selectedElement?.id === element.id;
    const isFixed = fixedElements.has(element.id);
    const isHovered = selectedTool === 'select' && hoveredElement?.id === element.id;
    
    // Масштабируем размеры элемента
    const scaledWidth = element.width * zoom;
    const scaledHeight = element.height * zoom;
    const scaledX = element.x * zoom;
    const scaledY = element.y * zoom;
    
    // Основа элемента
    if (element.type === 'house') {
      ctx.fillStyle = isSelected ? '#d4c5e8' : (isHovered ? '#f0e8ff' : (isFixed ? '#e8f4d4' : '#eee8f4'));
    } else {
      ctx.fillStyle = isSelected ? '#c5d4e8' : (isHovered ? '#e8f0ff' : (isFixed ? '#d4e8c5' : '#e8f4ee'));
    }
    
    ctx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
    
    // Контур
    ctx.strokeStyle = isSelected ? '#df682b' : (isHovered ? '#9c27b0' : (isFixed ? '#4caf50' : '#31323d'));
    ctx.lineWidth = isSelected ? Math.max(2, 3 * zoom) : (isHovered ? Math.max(2, 2 * zoom) : Math.max(1, 2 * zoom));
    ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
    
    // Подсветка элемента при наведении в режиме фиксации
    if (selectedTool === 'fix' && hoveredElement?.id === element.id) {
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 3;
      ctx.strokeRect(scaledX - 2, scaledY - 2, scaledWidth + 4, scaledHeight + 4);
    }
    
    // Красный замок для зафиксированного элемента (всегда видим)
    if (isFixed && zoom >= 0.4) {
      const lockX = scaledX + scaledWidth - 25;
      const lockY = scaledY + 5;
      
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(lockX, lockY, 20, 20);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.strokeRect(lockX, lockY, 20, 20);
      
      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🔒', lockX + 10, lockY + 14);
    }
    
    // Анимация зеленого замка при снятии фиксации
    if (unlockAnimation?.id === element.id && zoom >= 0.4) {
      const lockX = scaledX + scaledWidth - 25;
      const lockY = scaledY + 5;
      
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(lockX, lockY, 20, 20);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.strokeRect(lockX, lockY, 20, 20);
      
      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🔓', lockX + 10, lockY + 14);
    }
    
    // Информация об элементе
    if (zoom >= 0.3) {
      ctx.fillStyle = '#31323d';
      ctx.font = `${Math.max(8, 10 * zoom)}px Arial`;
      ctx.textAlign = 'center';
      
      const centerX = scaledX + scaledWidth / 2;
      const centerY = scaledY + scaledHeight / 2;
      
      if (element.realWidth && element.realHeight) {
        ctx.fillText(
          `${(element.realWidth * 1000).toFixed(0)}×${(element.realHeight * 1000).toFixed(0)}мм`,
          centerX,
          centerY - 5 * zoom
        );
        
        if (element.type === 'house') {
          ctx.fillText(
            `${(element.realWidth * element.realHeight).toFixed(1)}м²`,
            centerX,
            centerY + 10 * zoom
          );
        }
      }
    }
    
    // Размеры по краям
    if (zoom >= 0.5) {
      ctx.fillStyle = '#df682b';
      ctx.font = `${Math.max(6, 8 * zoom)}px Arial`;
      
      const centerX = scaledX + scaledWidth / 2;
      const centerY = scaledY + scaledHeight / 2;
      
      ctx.fillText(
        `${((element.realWidth || 0) * 1000).toFixed(0)}мм`,
        centerX,
        scaledY - 8 * zoom
      );
      
      ctx.save();
      ctx.translate(scaledX - 12 * zoom, centerY);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(`${((element.realHeight || 0) * 1000).toFixed(0)}мм`, 0, 0);
      ctx.restore();
    }
    
    // Маркеры для изменения размера
    if (isSelected && selectedTool === 'select' && !isFixed) {
      drawResizeHandles(ctx, { ...element, x: scaledX, y: scaledY, width: scaledWidth, height: scaledHeight });
    }
  };
  
  const drawWalls = (ctx) => {
    walls.forEach(wall => {
      drawWall(ctx, wall);
    });
  };
  
  const drawWall = (ctx, wall) => {
    const isSelected = selectedElement?.id === wall.id;
    const isHovered = selectedTool === 'select' && hoveredWall?.id === wall.id;
    
    // Масштабируем координаты
    const x1 = wall.x1 * zoom;
    const y1 = wall.y1 * zoom;
    const x2 = wall.x2 * zoom;
    const y2 = wall.y2 * zoom;
    
    // Рисуем стену
    ctx.strokeStyle = isSelected ? '#df682b' : (isHovered ? '#ff9800' : '#8B4513');
    ctx.lineWidth = Math.max(3, wall.thickness * 30 * zoom);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    
    // Маркеры на концах стены
    if (isSelected && selectedTool === 'select') {
      ctx.fillStyle = '#df682b';
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      
      const handleSize = Math.max(6, 8 * zoom);
      
      // Маркеры на концах
      ctx.beginPath();
      ctx.arc(x1, y1, handleSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(x2, y2, handleSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Маркер в центре для перемещения
      const centerX = (x1 + x2) / 2;
      const centerY = (y1 + y2) / 2;
      ctx.fillStyle = '#2196f3';
      ctx.beginPath();
      ctx.arc(centerX, centerY, handleSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Кнопки управления (выше размеров)
      const buttonY = Math.min(y1, y2) - 40;
      const buttonSize = 24;
      
      // Проверяем, соединена ли стена с другими
      const isConnected = walls.some(w => w.id !== wall.id && 
        ((Math.abs(w.x1 - wall.x1) < 5 && Math.abs(w.y1 - wall.y1) < 5) ||
         (Math.abs(w.x2 - wall.x2) < 5 && Math.abs(w.y2 - wall.y2) < 5) ||
         (Math.abs(w.x1 - wall.x2) < 5 && Math.abs(w.y1 - wall.y2) < 5) ||
         (Math.abs(w.x2 - wall.x1) < 5 && Math.abs(w.y2 - wall.y1) < 5)));
      
      const buttonCount = isConnected ? 3 : 2;
      const startX = centerX - (buttonCount * buttonSize + (buttonCount - 1) * 5) / 2;
      
      // Кнопка удаления
      ctx.fillStyle = '#ff4444';
      ctx.fillRect(startX, buttonY, buttonSize, buttonSize);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.strokeRect(startX, buttonY, buttonSize, buttonSize);
      ctx.fillStyle = '#fff';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🗑️', startX + buttonSize/2, buttonY + 16);
      
      // Кнопка поворота
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(startX + buttonSize + 5, buttonY, buttonSize, buttonSize);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.strokeRect(startX + buttonSize + 5, buttonY, buttonSize, buttonSize);
      ctx.fillStyle = '#fff';
      ctx.fillText('🔄', startX + buttonSize + 5 + buttonSize/2, buttonY + 16);
      
      // Кнопка разъединения (если стена соединена)
      if (isConnected) {
        ctx.fillStyle = '#ff9800';
        ctx.fillRect(startX + 2 * (buttonSize + 5), buttonY, buttonSize, buttonSize);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(startX + 2 * (buttonSize + 5), buttonY, buttonSize, buttonSize);
        ctx.fillStyle = '#fff';
        ctx.fillText('🔗', startX + 2 * (buttonSize + 5) + buttonSize/2, buttonY + 16);
      }
    }
    
    // Показываем длину стены (ниже кнопок)
    if (zoom >= 0.4) {
      const centerX = (x1 + x2) / 2;
      const centerY = (y1 + y2) / 2;
      const textY = isSelected ? Math.min(y1, y2) - 10 : centerY + 4;
      
      ctx.fillStyle = '#8B4513';
      ctx.font = `${Math.max(8, 10 * zoom)}px Arial`;
      ctx.textAlign = 'center';
      
      // Фон для текста
      const textWidth = ctx.measureText(`${wall.length.toFixed(1)}м`).width;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(centerX - textWidth/2 - 2, textY - 8, textWidth + 4, 16);
      
      ctx.fillStyle = '#8B4513';
      ctx.font = `${Math.max(6, 8 * zoom)}px Arial`;
      ctx.fillText(`${(wall.length * 1000).toFixed(0)}мм`, centerX, textY - 15);
    }
  };
  
  const drawResizeHandles = (ctx, element) => {
    const handleSize = Math.max(6, 8 * zoom);
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
    const worldX = (clientX - panOffset.x) / zoom;
    const worldY = (clientY - panOffset.y) / zoom;
    
    if (selectedTool === 'fix') {
      // Проверяем клик по элементам (приоритет над участком)
      const clickedElement = getElementAt(worldX, worldY);
      const clickedWall = getWallAt(worldX, worldY);
      
      if (clickedElement) {
        if (fixedElements.has(clickedElement.id)) {
          setFixedElements(prev => {
            const newSet = new Set(prev);
            newSet.delete(clickedElement.id);
            return newSet;
          });
          setUnlockAnimation({ id: clickedElement.id });
          setTimeout(() => setUnlockAnimation(null), 2000);
        } else {
          setFixedElements(prev => new Set(prev).add(clickedElement.id));
        }
        drawCanvas();
        return;
      }
      
      if (clickedWall) {
        if (fixedElements.has(clickedWall.id)) {
          setFixedElements(prev => {
            const newSet = new Set(prev);
            newSet.delete(clickedWall.id);
            return newSet;
          });
          setUnlockAnimation({ id: clickedWall.id });
          setTimeout(() => setUnlockAnimation(null), 2000);
        } else {
          setFixedElements(prev => new Set(prev).add(clickedWall.id));
        }
        drawCanvas();
        return;
      }
      
      // Проверяем клик по участку (только если не попали в элементы)
      if (isPointInLot(worldX, worldY)) {
        if (lotFixed) {
          setLotFixed(false);
          setUnlockAnimation({ type: 'lot' });
          setTimeout(() => setUnlockAnimation(null), 2000);
        } else {
          setLotFixed(true);
        }
        drawCanvas();
        return;
      }
    } else if (selectedTool === 'wall') {
      // Проверяем, что клик внутри дома
      if (isPointInHouse(worldX, worldY)) {
        setIsDrawingWall(true);
        // Сохраняем координаты в пикселях (worldX уже в пикселях)
        setWallDrawStart({ x: worldX, y: worldY });
        setCurrentWallEnd({ x: worldX, y: worldY });
      }
      return;
    } else if (selectedTool === 'select') {
      // Проверяем клик по маркерам изменения размера
      if (selectedElement && !fixedElements.has(selectedElement.id)) {
        const handle = getResizeHandle(clientX, clientY, selectedElement);
        if (handle) {
          setResizeHandle({ elementId: selectedElement.id, handle });
          return;
        }
      }
      
      // Проверяем клик по кнопкам управления выбранного элемента
      if (selectedElement && checkControlButtons(clientX, clientY, selectedElement)) {
        return;
      }
      
      // Проверяем клик по элементам (стены имеют приоритет)
      const clickedWall = getWallAt(worldX, worldY);
      const clickedElement = getElementAt(worldX, worldY);
      
      if (clickedWall) {
        setSelectedElement(clickedWall);
        if (!fixedElements.has(clickedWall.id)) {
          setDraggedElement({ 
            element: clickedWall, 
            startX: worldX, 
            startY: worldY 
          });
        }
        return;
      } else if (clickedElement) {
        setSelectedElement(clickedElement);
        if (!fixedElements.has(clickedElement.id)) {
          setDraggedElement({ 
            element: clickedElement, 
            startX: worldX - clickedElement.x, 
            startY: worldY - clickedElement.y 
          });
        }
        return;
      }
      
      setSelectedElement(null);
    }
    
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };
  

  
  const isPointInLot = (x, y) => {
    const houseElement = elements.find(el => el.type === 'house');
    if (!houseElement) return false;
    
    let lotX, lotY;
    const lotW = initialData.lotSize.width * 30;
    const lotH = initialData.lotSize.height * 30;
    
    if (lotFixed) {
      lotX = 100 / zoom;
      lotY = 100 / zoom;
    } else {
      lotX = houseElement.x - 50;
      lotY = houseElement.y - 50;
    }
    
    return x >= lotX && x <= lotX + lotW && y >= lotY && y <= lotY + lotH;
  };
  
  const isPointInHouse = (x, y) => {
    const houseElement = elements.find(el => el.type === 'house');
    if (!houseElement) return false;
    
    // Переводим координаты в пиксели для сравнения
    const houseX = houseElement.x;
    const houseY = houseElement.y;
    const houseW = houseElement.width;
    const houseH = houseElement.height;
    
    return x >= houseX && x <= houseX + houseW &&
           y >= houseY && y <= houseY + houseH;
  };
  
  const addWall = (x, y) => {
    const newWall = {
      id: Date.now(),
      x1: x,
      y1: y,
      x2: x + 2, // 2 метра по умолчанию
      y2: y,
      length: 2,
      thickness: 0.2, // 20 см
      type: 'interior'
    };
    
    setWalls(prev => [...prev, newWall]);
    setSelectedElement(newWall);
  };
  
  const getWallAt = (x, y) => {
    for (let i = walls.length - 1; i >= 0; i--) {
      const wall = walls[i];
      const distance = distanceToLine(x, y, wall.x1, wall.y1, wall.x2, wall.y2);
      if (distance < 1.5) { // Увеличиваем область клика
        return wall;
      }
    }
    return null;
  };
  
  const distanceToLine = (px, py, x1, y1, x2, y2) => {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    
    if (lenSq === 0) return Math.sqrt(A * A + B * B);
    
    const param = Math.max(0, Math.min(1, dot / lenSq));
    const xx = x1 + param * C;
    const yy = y1 + param * D;
    
    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
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
  
  const getResizeHandle = (clientX, clientY, element) => {
    const handleSize = Math.max(6, 8 * zoom);
    const tolerance = handleSize;
    
    // Преобразуем координаты элемента в экранные
    const scaledX = element.x * zoom;
    const scaledY = element.y * zoom;
    const scaledWidth = element.width * zoom;
    const scaledHeight = element.height * zoom;
    
    const handles = [
      { id: 'nw', x: scaledX, y: scaledY },
      { id: 'ne', x: scaledX + scaledWidth, y: scaledY },
      { id: 'sw', x: scaledX, y: scaledY + scaledHeight },
      { id: 'se', x: scaledX + scaledWidth, y: scaledY + scaledHeight },
      { id: 'n', x: scaledX + scaledWidth/2, y: scaledY },
      { id: 's', x: scaledX + scaledWidth/2, y: scaledY + scaledHeight },
      { id: 'w', x: scaledX, y: scaledY + scaledHeight/2 },
      { id: 'e', x: scaledX + scaledWidth, y: scaledY + scaledHeight/2 }
    ];
    
    for (const handle of handles) {
      const screenX = handle.x + panOffset.x;
      const screenY = handle.y + panOffset.y;
      if (Math.abs(clientX - screenX) <= tolerance && Math.abs(clientY - screenY) <= tolerance) {
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
    const worldX = (clientX - panOffset.x) / zoom;
    const worldY = (clientY - panOffset.y) / zoom;
    
    // Обновляем курсор и подсветку
    if (selectedTool === 'fix') {
      canvas.style.cursor = 'pointer';
      
      // Приоритет элементам над участком
      const hoveredEl = getElementAt(worldX, worldY) || getWallAt(worldX, worldY);
      
      if (hoveredEl) {
        setHoveredElement(hoveredEl);
      } else if (isPointInLot(worldX, worldY)) {
        setHoveredElement({ type: 'lot' });
      } else {
        setHoveredElement(null);
      }
    } else if (selectedTool === 'select') {
      // Подсветка при наведении в режиме выбора
      const hoveredWallEl = getWallAt(worldX, worldY);
      const hoveredEl = getElementAt(worldX, worldY);
      
      if (hoveredWallEl) {
        setHoveredWall(hoveredWallEl);
        setHoveredElement(null);
        canvas.style.cursor = 'pointer';
      } else if (hoveredEl) {
        setHoveredElement(hoveredEl);
        setHoveredWall(null);
        canvas.style.cursor = 'pointer';
      } else {
        setHoveredElement(null);
        setHoveredWall(null);
        canvas.style.cursor = 'grab';
      }
    } else {
      setHoveredElement(null);
      setHoveredWall(null);
      canvas.style.cursor = selectedTool === 'wall' ? 'crosshair' : 'default';
    }
    
    // Обновляем конец стены при рисовании
    if (isDrawingWall && wallDrawStart) {
      const deltaX = Math.abs(worldX - wallDrawStart.x);
      const deltaY = Math.abs(worldY - wallDrawStart.y);
      
      // Ограничиваем до 90 градусов (горизонталь или вертикаль)
      let endX, endY;
      if (deltaX > deltaY) {
        // Горизонтальная линия
        endX = worldX;
        endY = wallDrawStart.y;
      } else {
        // Вертикальная линия
        endX = wallDrawStart.x;
        endY = worldY;
      }
      
      // Ограничиваем координаты границами дома
      const houseElement = elements.find(el => el.type === 'house');
      if (houseElement) {
        endX = Math.max(houseElement.x, Math.min(houseElement.x + houseElement.width, endX));
        endY = Math.max(houseElement.y, Math.min(houseElement.y + houseElement.height, endY));
      }
      
      setCurrentWallEnd({ x: endX, y: endY });
    }
    
    if (resizeHandle && !fixedElements.has(resizeHandle.elementId)) {
      resizeElement(worldX, worldY);
      return;
    }
    
    if (draggedElement && selectedTool === 'select' && !fixedElements.has(draggedElement.element.id)) {
      if (draggedElement.element.type === 'house') {
        let newX = worldX - draggedElement.startX;
        let newY = worldY - draggedElement.startY;
        
        // Ограничиваем перемещение дома в пределах участка (если участок зафиксирован)
        if (lotFixed) {
          const lotX = 100 / zoom;
          const lotY = 100 / zoom;
          const lotW = initialData.lotSize.width * 30;
          const lotH = initialData.lotSize.height * 30;
          
          newX = Math.max(lotX, Math.min(lotX + lotW - draggedElement.element.width, newX));
          newY = Math.max(lotY, Math.min(lotY + lotH - draggedElement.element.height, newY));
        }
        
        setElements(prev => prev.map(el => 
          el.id === draggedElement.element.id 
            ? { ...el, x: newX, y: newY }
            : el
        ));
      } else if (draggedElement.element.x1 !== undefined) {
        const deltaX = worldX - draggedElement.startX;
        const deltaY = worldY - draggedElement.startY;
        
        setWalls(prev => prev.map(wall => 
          wall.id === draggedElement.element.id 
            ? { 
                ...wall, 
                x1: wall.x1 + deltaX, 
                y1: wall.y1 + deltaY,
                x2: wall.x2 + deltaX, 
                y2: wall.y2 + deltaY
              }
            : wall
        ));
        
        setDraggedElement({ ...draggedElement, startX: worldX, startY: worldY });
      }
      return;
    }
    
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
    
    updateCursor(clientX, clientY);
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
  
  const updateCursor = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    let cursor = 'default';
    
    if (selectedTool === 'select') {
      cursor = 'grab';
      
      if (selectedElement) {
        const handle = getResizeHandle(clientX, clientY, selectedElement);
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
        }
      }
      
      if (isDragging) cursor = 'grabbing';
    } else if (selectedTool === 'wall') {
      cursor = 'crosshair';
    }
    
    canvas.style.cursor = cursor;
  };
  
  const rotateElement = (elementId) => {
    const element = elements.find(el => el.id === elementId) || walls.find(w => w.id === elementId);
    if (!element) return;
    
    if (element.type === 'house') {
      // Поворачиваем дом (меняем местами ширину и высоту)
      setElements(prev => prev.map(el => 
        el.id === elementId 
          ? { 
              ...el, 
              width: el.height, 
              height: el.width,
              realWidth: el.realHeight,
              realHeight: el.realWidth
            }
          : el
      ));
    } else if (element.x1 !== undefined) {
      // Поворачиваем стену на 90 градусов, сохраняя длину
      const centerX = (element.x1 + element.x2) / 2;
      const centerY = (element.y1 + element.y2) / 2;
      const lengthInPixels = element.length * 30; // Переводим метры в пиксели
      
      // Определяем новое направление
      const isHorizontal = Math.abs(element.x2 - element.x1) > Math.abs(element.y2 - element.y1);
      
      let newX1, newY1, newX2, newY2;
      if (isHorizontal) {
        // Была горизонтальная, становится вертикальная
        newX1 = centerX;
        newY1 = centerY - lengthInPixels / 2;
        newX2 = centerX;
        newY2 = centerY + lengthInPixels / 2;
      } else {
        // Была вертикальная, становится горизонтальная
        newX1 = centerX - lengthInPixels / 2;
        newY1 = centerY;
        newX2 = centerX + lengthInPixels / 2;
        newY2 = centerY;
      }
      
      setWalls(prev => prev.map(wall => 
        wall.id === elementId 
          ? { ...wall, x1: newX1, y1: newY1, x2: newX2, y2: newY2 }
          : wall
      ));
    }
  };
  
  // Функция разъединения стен
  const disconnectWall = (wallId) => {
    const wall = walls.find(w => w.id === wallId);
    if (!wall) return;
    
    // Сдвигаем концы стены на небольшое расстояние
    const offset = 10;
    const isHorizontal = Math.abs(wall.x2 - wall.x1) > Math.abs(wall.y2 - wall.y1);
    
    setWalls(prev => prev.map(w => {
      if (w.id === wallId) {
        if (isHorizontal) {
          return { ...w, x1: w.x1 + offset, x2: w.x2 - offset };
        } else {
          return { ...w, y1: w.y1 + offset, y2: w.y2 - offset };
        }
      }
      return w;
    }));
  };

  // Проверка клика по кнопкам управления
  const checkControlButtons = (clientX, clientY, element) => {
    if (!element || selectedTool !== 'select') return false;
    
    if (element.x1 !== undefined) { // Это стена
      const x1 = element.x1 * zoom + panOffset.x;
      const y1 = element.y1 * zoom + panOffset.y;
      const x2 = element.x2 * zoom + panOffset.x;
      const y2 = element.y2 * zoom + panOffset.y;
      const centerX = (x1 + x2) / 2;
      const buttonY = Math.min(y1, y2) - 40;
      const buttonSize = 24;
      
      // Проверяем, соединена ли стена
      const isConnected = walls.some(w => w.id !== element.id && 
        ((Math.abs(w.x1 - element.x1) < 5 && Math.abs(w.y1 - element.y1) < 5) ||
         (Math.abs(w.x2 - element.x2) < 5 && Math.abs(w.y2 - element.y2) < 5) ||
         (Math.abs(w.x1 - element.x2) < 5 && Math.abs(w.y1 - element.y2) < 5) ||
         (Math.abs(w.x2 - element.x1) < 5 && Math.abs(w.y2 - element.y1) < 5)));
      
      const buttonCount = isConnected ? 3 : 2;
      const startX = centerX - (buttonCount * buttonSize + (buttonCount - 1) * 5) / 2;
      
      // Кнопка удаления
      if (clientX >= startX && clientX <= startX + buttonSize &&
          clientY >= buttonY && clientY <= buttonY + buttonSize) {
        deleteElement(element.id);
        return true;
      }
      
      // Кнопка поворота
      if (clientX >= startX + buttonSize + 5 && clientX <= startX + 2 * buttonSize + 5 &&
          clientY >= buttonY && clientY <= buttonY + buttonSize) {
        rotateElement(element.id);
        return true;
      }
      
      // Кнопка разъединения (если есть)
      if (isConnected && clientX >= startX + 2 * (buttonSize + 5) && 
          clientX <= startX + 3 * buttonSize + 10 &&
          clientY >= buttonY && clientY <= buttonY + buttonSize) {
        disconnectWall(element.id);
        return true;
      }
    }
    
    return false;
  };
  
  // Проверка и соединение стен
  const checkWallConnections = (newWall) => {
    const connectionThreshold = 15; // Порог для соединения в пикселях
    
    walls.forEach(existingWall => {
      // Проверяем все возможные соединения концов стен
      const connections = [
        { new: 'start', existing: 'start', newCoord: [newWall.x1, newWall.y1], existingCoord: [existingWall.x1, existingWall.y1] },
        { new: 'start', existing: 'end', newCoord: [newWall.x1, newWall.y1], existingCoord: [existingWall.x2, existingWall.y2] },
        { new: 'end', existing: 'start', newCoord: [newWall.x2, newWall.y2], existingCoord: [existingWall.x1, existingWall.y1] },
        { new: 'end', existing: 'end', newCoord: [newWall.x2, newWall.y2], existingCoord: [existingWall.x2, existingWall.y2] }
      ];
      
      connections.forEach(conn => {
        const distance = Math.sqrt(
          Math.pow(conn.newCoord[0] - conn.existingCoord[0], 2) + 
          Math.pow(conn.newCoord[1] - conn.existingCoord[1], 2)
        );
        
        if (distance < connectionThreshold) {
          // Соединяем стены
          if (conn.new === 'start') {
            newWall.x1 = conn.existingCoord[0];
            newWall.y1 = conn.existingCoord[1];
          } else {
            newWall.x2 = conn.existingCoord[0];
            newWall.y2 = conn.existingCoord[1];
          }
        }
      });
    });
    
    return newWall;
  };
  
  // Удаление элемента
  const deleteElement = (elementId) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
    setWalls(prev => prev.filter(wall => wall.id !== elementId));
    setSelectedElement(null);
  };

  // Функции для изменения размеров элементов
  const updateElementSize = (dimension, value) => {
    if (!selectedElement || !value || value <= 0) return;
    
    if (selectedElement.type === 'house') {
      const newWidth = dimension === 'width' ? value : selectedElement.realWidth;
      const newHeight = dimension === 'height' ? value : selectedElement.realHeight;
      
      setElements(prev => prev.map(el => 
        el.id === selectedElement.id 
          ? { 
              ...el, 
              width: newWidth * 30,
              height: newHeight * 30,
              realWidth: newWidth,
              realHeight: newHeight
            }
          : el
      ));
      
      // Обновляем selectedElement
      setSelectedElement(prev => ({
        ...prev,
        width: (dimension === 'width' ? value : prev.realWidth) * 30,
        height: (dimension === 'height' ? value : prev.realHeight) * 30,
        realWidth: dimension === 'width' ? value : prev.realWidth,
        realHeight: dimension === 'height' ? value : prev.realHeight
      }));
    }
  };
  
  const updateWallLength = (newLength) => {
    if (!selectedElement || selectedElement.x1 === undefined || !newLength || newLength <= 0) return;
    
    const wall = selectedElement;
    const houseElement = elements.find(el => el.type === 'house');
    if (!houseElement) return;
    
    const centerX = (wall.x1 + wall.x2) / 2;
    const centerY = (wall.y1 + wall.y2) / 2;
    const isHorizontal = Math.abs(wall.x2 - wall.x1) > Math.abs(wall.y2 - wall.y1);
    const lengthInPixels = newLength * 30;
    
    let newX1, newY1, newX2, newY2;
    if (isHorizontal) {
      newX1 = centerX - lengthInPixels / 2;
      newY1 = wall.y1;
      newX2 = centerX + lengthInPixels / 2;
      newY2 = wall.y2;
    } else {
      newX1 = wall.x1;
      newY1 = centerY - lengthInPixels / 2;
      newX2 = wall.x2;
      newY2 = centerY + lengthInPixels / 2;
    }
    
    // Ограничиваем стену границами дома
    newX1 = Math.max(houseElement.x, Math.min(houseElement.x + houseElement.width, newX1));
    newY1 = Math.max(houseElement.y, Math.min(houseElement.y + houseElement.height, newY1));
    newX2 = Math.max(houseElement.x, Math.min(houseElement.x + houseElement.width, newX2));
    newY2 = Math.max(houseElement.y, Math.min(houseElement.y + houseElement.height, newY2));
    
    // Пересчитываем реальную длину после ограничения
    const actualLength = Math.sqrt(
      Math.pow(newX2 - newX1, 2) + Math.pow(newY2 - newY1, 2)
    ) / 30;
    
    setWalls(prev => prev.map(w => 
      w.id === selectedElement.id 
        ? { ...w, x1: newX1, y1: newY1, x2: newX2, y2: newY2, length: actualLength }
        : w
    ));
    
    // Обновляем selectedElement
    setSelectedElement(prev => ({
      ...prev,
      x1: newX1,
      y1: newY1,
      x2: newX2,
      y2: newY2,
      length: actualLength
    }));
  };

  const handleCanvasMouseUp = () => {
    if (isDrawingWall && wallDrawStart && currentWallEnd) {
      // Создаем стену только если есть длина (в пикселях)
      const pixelLength = Math.sqrt(
        Math.pow(currentWallEnd.x - wallDrawStart.x, 2) + 
        Math.pow(currentWallEnd.y - wallDrawStart.y, 2)
      );
      
      if (pixelLength > 15) { // Минимальная длина стены в пикселях
        const lengthInMeters = pixelLength / 30; // Переводим в метры
        const newWall = {
          id: Date.now(),
          x1: wallDrawStart.x,
          y1: wallDrawStart.y,
          x2: currentWallEnd.x,
          y2: currentWallEnd.y,
          length: lengthInMeters, // В метрах
          thickness: 0.121, // 121 мм
          type: 'interior'
        };
        
        // Проверяем пересечения с существующими стенами и соединяем их
        const connectedWall = checkWallConnections(newWall);
        setWalls(prev => [...prev, connectedWall]);
        setSelectedElement(connectedWall);
      }
    }
    
    setIsDrawingWall(false);
    setWallDrawStart(null);
    setCurrentWallEnd(null);
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
            <span>Дом: {(initialData.house.width * 1000).toFixed(0)}×{(initialData.house.height * 1000).toFixed(0)}мм</span>
            <span>Участок: {(initialData.lotSize.width * 1000).toFixed(0)}×{(initialData.lotSize.height * 1000).toFixed(0)}мм ({((initialData.lotSize.width * initialData.lotSize.height) / 100).toFixed(2)} соток)</span>
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
        <div className={`control-panel ${panelCollapsed ? 'collapsed' : ''}`}>
          <div className="panel-header">
            <button 
              className="calculate-btn"
              title="Отправить проект на расчет"
              onClick={() => alert('Проект отправлен на расчет!')}
            >
              📊 На расчет
            </button>
            <button 
              className="collapse-btn"
              title="Свернуть"
              onClick={() => setPanelCollapsed(!panelCollapsed)}
            >
              {panelCollapsed ? '◀' : '▶'}
            </button>
          </div>

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
                { id: 'fix', name: 'Фиксация', icon: '🔒' },
                { id: 'rotate', name: 'Поворот', icon: '🔄' }
              ].map(tool => (
                <button
                  key={tool.id}
                  className={`tool-btn ${selectedTool === tool.id ? 'active' : ''}`}
                  onClick={() => {
                    if (tool.id === 'rotate' && selectedElement) {
                      rotateElement(selectedElement.id);
                    } else {
                      setSelectedTool(tool.id);
                    }
                  }}
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

          {selectedElement && (
            <div className="panel-section">
              <h3>Размеры элемента</h3>
              <div className="size-controls">
                {selectedElement.realWidth !== undefined && (
                  <div className="size-input">
                    <label>Ширина (мм):</label>
                    <input 
                      type="number" 
                      min="100"
                      max="50000"
                      step="10"
                      value={Math.round((selectedElement.realWidth || 0) * 1000)}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (value && value > 0) {
                          updateElementSize('width', value / 1000);
                        }
                      }}
                    />
                  </div>
                )}
                {selectedElement.realHeight !== undefined && (
                  <div className="size-input">
                    <label>Высота (мм):</label>
                    <input 
                      type="number" 
                      min="100"
                      max="50000"
                      step="10"
                      value={Math.round((selectedElement.realHeight || 0) * 1000)}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (value && value > 0) {
                          updateElementSize('height', value / 1000);
                        }
                      }}
                    />
                  </div>
                )}
                {selectedElement.length !== undefined && (
                  <div className="size-input">
                    <label>Длина (мм):</label>
                    <input 
                      type="number" 
                      min="100"
                      max="20000"
                      step="10"
                      value={Math.round((selectedElement.length || 0) * 1000)}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (value && value > 0) {
                          updateWallLength(value / 1000);
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

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
                      <strong>{((houseElement.realWidth || 0) * 1000).toFixed(0)}×{((houseElement.realHeight || 0) * 1000).toFixed(0)}мм</strong>
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
                      <strong>{(initialData.house.width * 1000).toFixed(0)}×{(initialData.house.height * 1000).toFixed(0)}мм</strong>
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
                <strong>{(initialData.lotSize.width * 1000).toFixed(0)}×{(initialData.lotSize.height * 1000).toFixed(0)}мм ({((initialData.lotSize.width * initialData.lotSize.height) / 100).toFixed(2)} соток)</strong>
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
        
        {/* Свернутая панель */}
        {panelCollapsed && (
          <div className="collapsed-panel">
            <button 
              className="expand-btn"
              onClick={() => setPanelCollapsed(false)}
              title="Развернуть панель"
            >
              ◀
            </button>
          </div>
        )}
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
          transition: transform 0.3s ease, width 0.3s ease;
          position: relative;
        }
        
        .control-panel.collapsed {
          transform: translateX(100%);
          width: 0;
          min-width: 0;
          padding: 0;
          overflow: hidden;
        }
        
        .collapsed-panel {
          position: fixed;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1000;
        }
        
        .expand-btn {
          background: var(--primary-dark);
          color: var(--white);
          border: none;
          padding: 20px 8px;
          border-radius: 8px 0 0 8px;
          cursor: pointer;
          font-size: 20px;
          box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
        
        .expand-btn:hover {
          background: var(--accent-orange);
          padding-left: 12px;
        }
        
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .calculate-btn {
          background: var(--accent-orange);
          color: var(--white);
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .calculate-btn:hover {
          background: #c55a24;
          transform: translateY(-1px);
        }
        
        .collapse-btn {
          background: transparent;
          color: var(--white);
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 6px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }
        
        .collapse-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--accent-orange);
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
        
        .size-controls {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .size-input {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .size-input label {
          font-size: 12px;
          opacity: 0.8;
        }
        
        .size-input input {
          padding: 6px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
          color: var(--white);
          font-size: 14px;
        }
        
        .size-input input:focus {
          outline: none;
          border-color: var(--accent-orange);
          background: rgba(255, 255, 255, 0.15);
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
            transform: none;
          }
          
          .control-panel.collapsed {
            transform: translateY(100%);
            height: 0;
            padding: 0;
          }
          
          .collapsed-panel {
            position: fixed;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            right: auto;
            top: auto;
          }
          
          .expand-btn {
            border-radius: 8px 8px 0 0;
            padding: 8px 20px;
          }
          
          .panel-header {
            flex-direction: column;
            gap: 8px;
          }
          
          .calculate-btn {
            width: 100%;
            justify-content: center;
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