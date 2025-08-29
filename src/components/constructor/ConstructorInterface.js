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
  const [fixedElements, setFixedElements] = useState(new Set(['house']));
  const [lotFixed, setLotFixed] = useState(true);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [unlockAnimation, setUnlockAnimation] = useState(null);
  const [isDrawingWall, setIsDrawingWall] = useState(false);
  const [wallDrawStart, setWallDrawStart] = useState(null);
  const [currentWallEnd, setCurrentWallEnd] = useState(null);
  const [hoveredWall, setHoveredWall] = useState(null);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [roomNames, setRoomNames] = useState({});
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [doors, setDoors] = useState([]);
  const [windows, setWindows] = useState([]);

  const SCALE = 30;

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
  }, [zoom, panOffset, initialData, selectedElement, elements, walls, doors, windows, isDrawingWall, wallDrawStart, currentWallEnd, hoveredElement, hoveredWall, roomNames]);

  // Обработка клавиш
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        confirmAction();
      } else if (e.key === 'Delete' && selectedElement) {
        e.preventDefault();
        deleteElement(selectedElement.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, historyIndex]);
  
  useEffect(() => {
    if (initialData) {
      const lotCenterX = 100 + (initialData.lotSize.width * 30) / 2;
      const lotCenterY = 100 + (initialData.lotSize.height * 30) / 2;
      const houseWidth = initialData.house.width * 30;
      const houseHeight = initialData.house.height * 30;
      
      const houseElement = {
        id: 'house',
        type: 'house',
        x: lotCenterX - houseWidth / 2,
        y: lotCenterY - houseHeight / 2,
        width: houseWidth,
        height: houseHeight,
        realWidth: initialData.house.width,
        realHeight: initialData.house.height
      };
      
      setElements([houseElement]);
      setFixedElements(new Set(['house']));
      saveToHistory({ elements: [houseElement], walls: [] });
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
    drawDoors(ctx);
    drawWindows(ctx);
    
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
      ctx.font = '12px Arial';
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
    
    // Вычисляем область для рисования с большим запасом
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
      ctx.beginPath();
      ctx.moveTo(screenX, -margin);
      ctx.lineTo(screenX, canvas.height + margin);
      ctx.stroke();
    }
    
    // Рисуем горизонтальные линии
    for (let y = startY; y <= endY; y += gridSize) {
      const screenY = y + panOffset.y;
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
      lotX = 100 * zoom;
      lotY = 100 * zoom;
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
      ctx.font = '14px Arial';
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
      ctx.font = '12px Arial';
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
      ctx.font = '10px Arial';
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
      ctx.font = '8px Arial';
      
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
    drawRooms(ctx);
  };

  // Система истории для Undo/Redo
  const saveToHistory = (state) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      elements: JSON.parse(JSON.stringify(state.elements || elements)),
      walls: JSON.parse(JSON.stringify(state.walls || walls)),
      doors: JSON.parse(JSON.stringify(state.doors || doors)),
      windows: JSON.parse(JSON.stringify(state.windows || windows))
    });
    
    // Ограничиваем историю 50 шагами
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(prev => prev + 1);
    }
    
    setHistory(newHistory);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setElements(prevState.elements);
      setWalls(prevState.walls);
      setDoors(prevState.doors || []);
      setWindows(prevState.windows || []);
      setHistoryIndex(prev => prev - 1);
      setSelectedElement(null);
    }
  };

  const confirmAction = () => {
    if (isDrawingWall && wallDrawStart && currentWallEnd) {
      // Завершаем рисование стены
      const pixelLength = Math.sqrt(
        Math.pow(currentWallEnd.x - wallDrawStart.x, 2) + 
        Math.pow(currentWallEnd.y - wallDrawStart.y, 2)
      );
      
      if (pixelLength > 15) {
        const lengthInMeters = pixelLength / 30;
        const newWall = {
          id: Date.now(),
          x1: wallDrawStart.x,
          y1: wallDrawStart.y,
          x2: currentWallEnd.x,
          y2: currentWallEnd.y,
          length: lengthInMeters,
          thickness: 0.121,
          type: 'interior'
        };
        
        const connectedWall = checkWallConnections(newWall);
        const newWalls = [...walls, connectedWall];
        setWalls(newWalls);
        setSelectedElement(connectedWall);
        saveToHistory({ elements, walls: newWalls });
        saveToHistory({ elements, walls: newWalls });
      }
      
      setIsDrawingWall(false);
      setWallDrawStart(null);
      setCurrentWallEnd(null);
    }
  };
  
  const findRooms = () => {
    const houseElement = elements.find(el => el.type === 'house');
    if (!houseElement) return [];
    
    // Создаем массив всех стен включая границы дома
    const allWalls = [...walls];
    
    // Добавляем границы дома как стены
    const houseBounds = [
      { id: 'house-top', x1: houseElement.x, y1: houseElement.y, x2: houseElement.x + houseElement.width, y2: houseElement.y, type: 'boundary' },
      { id: 'house-right', x1: houseElement.x + houseElement.width, y1: houseElement.y, x2: houseElement.x + houseElement.width, y2: houseElement.y + houseElement.height, type: 'boundary' },
      { id: 'house-bottom', x1: houseElement.x + houseElement.width, y1: houseElement.y + houseElement.height, x2: houseElement.x, y2: houseElement.y + houseElement.height, type: 'boundary' },
      { id: 'house-left', x1: houseElement.x, y1: houseElement.y + houseElement.height, x2: houseElement.x, y2: houseElement.y, type: 'boundary' }
    ];
    
    allWalls.push(...houseBounds);
    
    // Создаем сетку координат
    const xCoords = new Set([houseElement.x, houseElement.x + houseElement.width]);
    const yCoords = new Set([houseElement.y, houseElement.y + houseElement.height]);
    
    // Добавляем координаты стен
    walls.forEach(wall => {
      if (wall.x1 >= houseElement.x && wall.x1 <= houseElement.x + houseElement.width) xCoords.add(wall.x1);
      if (wall.x2 >= houseElement.x && wall.x2 <= houseElement.x + houseElement.width) xCoords.add(wall.x2);
      if (wall.y1 >= houseElement.y && wall.y1 <= houseElement.y + houseElement.height) yCoords.add(wall.y1);
      if (wall.y2 >= houseElement.y && wall.y2 <= houseElement.y + houseElement.height) yCoords.add(wall.y2);
    });
    
    // Добавляем пересечения стен
    const intersections = findAllIntersections(allWalls);
    intersections.forEach(point => {
      if (point.x >= houseElement.x && point.x <= houseElement.x + houseElement.width) xCoords.add(point.x);
      if (point.y >= houseElement.y && point.y <= houseElement.y + houseElement.height) yCoords.add(point.y);
    });
    
    const sortedX = Array.from(xCoords).sort((a, b) => a - b);
    const sortedY = Array.from(yCoords).sort((a, b) => a - b);
    
    const rooms = [];
    
    // Проверяем каждую ячейку сетки
    for (let i = 0; i < sortedX.length - 1; i++) {
      for (let j = 0; j < sortedY.length - 1; j++) {
        const x1 = sortedX[i];
        const x2 = sortedX[i + 1];
        const y1 = sortedY[j];
        const y2 = sortedY[j + 1];
        
        // Минимальный размер комнаты 0.5м x 0.5м
        if ((x2 - x1) >= 15 && (y2 - y1) >= 15) {
          if (isRoomFullyEnclosed(x1, y1, x2, y2, allWalls)) {
            const roomWalls = getRoomWalls(x1, y1, x2, y2, walls);
            rooms.push({
              bounds: { minX: x1, maxX: x2, minY: y1, maxY: y2 },
              walls: roomWalls,
              area: ((x2 - x1) * (y2 - y1)) / (30 * 30), // площадь в м²
              width: (x2 - x1) / 30, // ширина в метрах
              height: (y2 - y1) / 30 // высота в метрах
            });
          }
        }
      }
    }
    
    return rooms;
  };

  // Находим все пересечения стен включая границы дома
  const findAllIntersections = (wallList) => {
    const intersections = [];
    
    for (let i = 0; i < wallList.length; i++) {
      for (let j = i + 1; j < wallList.length; j++) {
        const intersection = getLineIntersection(
          wallList[i].x1, wallList[i].y1, wallList[i].x2, wallList[i].y2,
          wallList[j].x1, wallList[j].y1, wallList[j].x2, wallList[j].y2
        );
        
        if (intersection) {
          intersections.push(intersection);
        }
      }
    }
    
    return intersections;
  };

  // Проверяем, полностью ли окружена комната
  const isRoomFullyEnclosed = (x1, y1, x2, y2, allWalls) => {
    const tolerance = 2;
    
    // Стороны комнаты
    const sides = [
      { x1, y1, x2, y2: y1, name: 'top' },    // верх
      { x1: x2, y1, x2, y2, name: 'right' },  // право
      { x1, y1: y2, x2, y2, name: 'bottom' }, // низ
      { x1, y1, x2: x1, y2, name: 'left' }   // лево
    ];
    
    return sides.every(side => {
      return allWalls.some(wall => {
        return segmentsOverlap(
          side.x1, side.y1, side.x2, side.y2,
          wall.x1, wall.y1, wall.x2, wall.y2,
          tolerance
        );
      });
    });
  };

  // Находим пересечение двух линий
  const getLineIntersection = (x1, y1, x2, y2, x3, y3, x4, y4) => {
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (Math.abs(denom) < 0.001) return null; // Параллельные линии
    
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
    
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: x1 + t * (x2 - x1),
        y: y1 + t * (y2 - y1)
      };
    }
    
    return null;
  };

  // Улучшенная проверка перекрытия сегментов
  const segmentsOverlap = (x1, y1, x2, y2, x3, y3, x4, y4, tolerance) => {
    // Проверяем горизонтальные линии
    if (Math.abs(y1 - y2) < tolerance && Math.abs(y3 - y4) < tolerance && Math.abs(y1 - y3) < tolerance) {
      const min1 = Math.min(x1, x2);
      const max1 = Math.max(x1, x2);
      const min2 = Math.min(x3, x4);
      const max2 = Math.max(x3, x4);
      return Math.max(min1, min2) <= Math.min(max1, max2) + tolerance;
    }
    
    // Проверяем вертикальные линии
    if (Math.abs(x1 - x2) < tolerance && Math.abs(x3 - x4) < tolerance && Math.abs(x1 - x3) < tolerance) {
      const min1 = Math.min(y1, y2);
      const max1 = Math.max(y1, y2);
      const min2 = Math.min(y3, y4);
      const max2 = Math.max(y3, y4);
      return Math.max(min1, min2) <= Math.min(max1, max2) + tolerance;
    }
    
    return false;
  };

  // Получаем стены комнаты (только пользовательские стены, не границы дома)
  const getRoomWalls = (x1, y1, x2, y2, userWalls) => {
    const tolerance = 2;
    return userWalls.filter(wall => {
      // Проверяем, является ли стена границей комнаты
      const wallOnBoundary = (
        // Стена на верхней границе
        (Math.abs(wall.y1 - y1) < tolerance && Math.abs(wall.y2 - y1) < tolerance &&
         wall.x1 >= x1 - tolerance && wall.x2 <= x2 + tolerance) ||
        // Стена на нижней границе
        (Math.abs(wall.y1 - y2) < tolerance && Math.abs(wall.y2 - y2) < tolerance &&
         wall.x1 >= x1 - tolerance && wall.x2 <= x2 + tolerance) ||
        // Стена на левой границе
        (Math.abs(wall.x1 - x1) < tolerance && Math.abs(wall.x2 - x1) < tolerance &&
         wall.y1 >= y1 - tolerance && wall.y2 <= y2 + tolerance) ||
        // Стена на правой границе
        (Math.abs(wall.x1 - x2) < tolerance && Math.abs(wall.x2 - x2) < tolerance &&
         wall.y1 >= y1 - tolerance && wall.y2 <= y2 + tolerance)
      );
      
      return wallOnBoundary;
    });
  };
  
  const lineIntersectsRect = (x1, y1, x2, y2, rectX1, rectY1, rectX2, rectY2) => {
    // Проверяем, пересекает ли линия прямоугольник
    const centerX = (rectX1 + rectX2) / 2;
    const centerY = (rectY1 + rectY2) / 2;
    
    // Если стена проходит через центр комнаты, то комната заблокирована
    return pointOnLine(centerX, centerY, x1, y1, x2, y2, 5);
  };
  
  const pointOnLine = (px, py, x1, y1, x2, y2, tolerance) => {
    const dist = distanceToLine(px, py, x1, y1, x2, y2);
    return dist < tolerance;
  };
  
  // Проверяем соединение стен с границами дома
  const checkWallConnections = (newWall) => {
    const houseElement = elements.find(el => el.type === 'house');
    if (!houseElement) return newWall;
    
    const connectionThreshold = 15;
    
    // Проверяем соединение с существующими стенами
    walls.forEach(existingWall => {
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
    
    // Проверяем соединение с границами дома
    const houseBounds = [
      { x: houseElement.x, y: houseElement.y, width: houseElement.width, height: 0, type: 'top' },
      { x: houseElement.x + houseElement.width, y: houseElement.y, width: 0, height: houseElement.height, type: 'right' },
      { x: houseElement.x, y: houseElement.y + houseElement.height, width: houseElement.width, height: 0, type: 'bottom' },
      { x: houseElement.x, y: houseElement.y, width: 0, height: houseElement.height, type: 'left' }
    ];
    
    houseBounds.forEach(bound => {
      // Проверяем привязку к границам дома
      if (bound.type === 'top' || bound.type === 'bottom') {
        // Горизонтальные границы
        if (Math.abs(newWall.y1 - bound.y) < connectionThreshold) {
          newWall.y1 = bound.y;
        }
        if (Math.abs(newWall.y2 - bound.y) < connectionThreshold) {
          newWall.y2 = bound.y;
        }
      } else {
        // Вертикальные границы
        if (Math.abs(newWall.x1 - bound.x) < connectionThreshold) {
          newWall.x1 = bound.x;
        }
        if (Math.abs(newWall.x2 - bound.x) < connectionThreshold) {
          newWall.x2 = bound.x;
        }
      }
    });
    
    return newWall;
  };
  
  const calculateRoomArea = (room) => {
    if (!room.bounds) return 0;
    
    const width = (room.bounds.maxX - room.bounds.minX) / 30;
    const height = (room.bounds.maxY - room.bounds.minY) / 30;
    return width * height;
  };
  
  const getRoomCenter = (room) => {
    if (!room.bounds) return { x: 0, y: 0 };
    
    return {
      x: (room.bounds.minX + room.bounds.maxX) / 2,
      y: (room.bounds.minY + room.bounds.maxY) / 2
    };
  };
  
  const getRoomAt = (x, y) => {
    const rooms = findRooms();
    
    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      if (isPointInRoom(x, y, room)) {
        return i;
      }
    }
    return null;
  };
  
  const isPointInRoom = (x, y, room) => {
    if (!room.bounds) return false;
    
    return x >= room.bounds.minX && x <= room.bounds.maxX && 
           y >= room.bounds.minY && y <= room.bounds.maxY;
  };
  
  const handleRoomDoubleClick = (roomIndex) => {
    const newName = prompt('Введите название комнаты:', roomNames[roomIndex] || `Комната ${roomIndex + 1}`);
    if (newName !== null) {
      setRoomNames(prev => ({ ...prev, [roomIndex]: newName }));
    }
  };
  
  const drawRooms = (ctx) => {
    const rooms = findRooms();
    
    rooms.forEach((room, index) => {
      const center = getRoomCenter(room);
      const area = calculateRoomArea(room);
      
      if (area > 0.5) { // Показываем только комнаты больше 0.5 м²
        
        // Показываем площадь и название
        if (zoom >= 0.4) {
          ctx.fillStyle = '#2196f3';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          
          const roomName = roomNames[index] || `Комната ${index + 1}`;
          ctx.fillText(
            roomName,
            center.x * zoom,
            center.y * zoom - 8
          );
          
          ctx.font = '10px Arial';
          ctx.fillText(
            `${area.toFixed(1)}м²`,
            center.x * zoom,
            center.y * zoom + 8
          );
          
          // Показываем размеры комнаты
          const width = (room.bounds.maxX - room.bounds.minX) / 30;
          const height = (room.bounds.maxY - room.bounds.minY) / 30;
          
          ctx.fillStyle = '#666';
          ctx.font = '9px Arial';
          ctx.fillText(
            `${(width * 1000).toFixed(0)}×${(height * 1000).toFixed(0)}мм`,
            center.x * zoom,
            center.y * zoom + 20
          );
          
          // Показываем количество стен в комнате
          if (room.walls && room.walls.length > 0) {
            ctx.fillStyle = '#ff6b35';
            ctx.font = '8px Arial';
            ctx.fillText(
              `Стен: ${room.walls.length}`,
              center.x * zoom,
              center.y * zoom + 32
            );
          }
        }
      }
    });
  };
  
  const drawWall = (ctx, wall) => {
    const isSelected = selectedElement?.id === wall.id;
    const isHovered = selectedTool === 'select' && hoveredWall?.id === wall.id;
    
    // Масштабируем координаты (стены остаются на месте при масштабировании)
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
      
      const handleSize = Math.max(3, 4 * zoom);
      
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
    
    // Показываем длину стены
    if (zoom >= 0.4) {
      const centerX = (x1 + x2) / 2;
      const centerY = (y1 + y2) / 2;
      const isHorizontal = Math.abs(x2 - x1) > Math.abs(y2 - y1);
      
      ctx.fillStyle = '#8B4513';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      
      if (isHorizontal) {
        // Горизонтальная стена - текст горизонтально сверху
        const textY = isSelected ? Math.min(y1, y2) - 50 : Math.min(y1, y2) - 8;
        ctx.fillText(`${(wall.length * 1000).toFixed(0)}мм`, centerX, textY);
      } else {
        // Вертикальная стена - текст вертикально слева
        const textX = Math.min(x1, x2) - 8;
        ctx.save();
        ctx.translate(textX, centerY);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(`${(wall.length * 1000).toFixed(0)}мм`, 0, 0);
        ctx.restore();
      }
    }
  };
  
  const drawResizeHandles = (ctx, element) => {
    const handleSize = Math.max(4, 6 * zoom);
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
    } else if (selectedTool === 'door' || selectedTool === 'window') {
      // Проверяем клик по стене для размещения двери/окна
      const clickedWall = getWallAt(worldX, worldY) || getHouseBoundaryWall(worldX, worldY);
      if (clickedWall) {
        addDoorOrWindow(clickedWall, worldX, worldY, selectedTool);
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
        
        // Проверяем клик по маркерам стены
        const wallHandle = getWallResizeHandle(clientX, clientY, selectedElement);
        if (wallHandle) {
          setResizeHandle({ elementId: selectedElement.id, handle: wallHandle, isWall: true });
          return;
        }
      }
      
      // Проверяем клик по кнопкам управления выбранного элемента
      if (selectedElement && checkControlButtons(clientX, clientY, selectedElement)) {
        return;
      }
      
      // Проверяем клик по элементам (приоритет: двери/окна > стены > элементы)
      const clickedDoor = getDoorAt(worldX, worldY);
      const clickedWindow = getWindowAt(worldX, worldY);
      const clickedWall = getWallAt(worldX, worldY);
      const clickedElement = getElementAt(worldX, worldY);
      const clickedRoom = getRoomAt(worldX, worldY);
      
      if (clickedDoor) {
        setSelectedElement(clickedDoor);
        setDraggedElement({ 
          element: clickedDoor, 
          startX: worldX, 
          startY: worldY,
          type: 'door'
        });
        return;
      } else if (clickedWindow) {
        setSelectedElement(clickedWindow);
        setDraggedElement({ 
          element: clickedWindow, 
          startX: worldX, 
          startY: worldY,
          type: 'window'
        });
        return;
      } else if (clickedWall) {
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
      } else if (clickedRoom !== null) {
        // Клик по комнате - пока ничего не делаем
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
      lotX = 100;
      lotY = 100;
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
    const handleSize = Math.max(4, 6 * zoom);
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
  
  // Получение маркеров для изменения размера стены
  const getWallResizeHandle = (clientX, clientY, wall) => {
    if (!wall || wall.x1 === undefined) return null;
    
    const handleSize = Math.max(3, 4 * zoom);
    const tolerance = handleSize + 2;
    
    const x1 = wall.x1 * zoom + panOffset.x;
    const y1 = wall.y1 * zoom + panOffset.y;
    const x2 = wall.x2 * zoom + panOffset.x;
    const y2 = wall.y2 * zoom + panOffset.y;
    
    // Проверяем клик по концам стены
    if (Math.abs(clientX - x1) <= tolerance && Math.abs(clientY - y1) <= tolerance) {
      return 'start';
    }
    if (Math.abs(clientX - x2) <= tolerance && Math.abs(clientY - y2) <= tolerance) {
      return 'end';
    }
    
    return null;
  };
  
  // Изменение размера стены
  const resizeWall = (worldX, worldY) => {
    const wall = walls.find(w => w.id === resizeHandle.elementId);
    if (!wall) return;
    
    const houseElement = elements.find(el => el.type === 'house');
    if (!houseElement) return;
    
    // Ограничиваем координаты границами дома
    const constrainedX = Math.max(houseElement.x, Math.min(houseElement.x + houseElement.width, worldX));
    const constrainedY = Math.max(houseElement.y, Math.min(houseElement.y + houseElement.height, worldY));
    
    let newWall = { ...wall };
    
    if (resizeHandle.handle === 'start') {
      newWall.x1 = constrainedX;
      newWall.y1 = constrainedY;
    } else if (resizeHandle.handle === 'end') {
      newWall.x2 = constrainedX;
      newWall.y2 = constrainedY;
    }
    
    // Пересчитываем длину
    const length = Math.sqrt(
      Math.pow(newWall.x2 - newWall.x1, 2) + Math.pow(newWall.y2 - newWall.y1, 2)
    ) / 30;
    
    newWall.length = length;
    
    setWalls(prev => prev.map(w => w.id === wall.id ? newWall : w));
    setSelectedElement(newWall);
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
    
    if (draggedElement && selectedTool === 'select') {
      if (draggedElement.type === 'door') {
        moveDoorOrWindow(draggedElement.element, worldX, worldY, 'door');
        return;
      } else if (draggedElement.type === 'window') {
        moveDoorOrWindow(draggedElement.element, worldX, worldY, 'window');
        return;
      } else if (!fixedElements.has(draggedElement.element.id)) {
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
    if (resizeHandle.isWall) {
      resizeWall(worldX, worldY);
      return;
    }
    
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
        const wallHandle = getWallResizeHandle(clientX, clientY, selectedElement);
        
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
        } else if (wallHandle) {
          cursor = 'move';
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
      const newElements = elements.map(el => 
        el.id === elementId 
          ? { 
              ...el, 
              width: el.height, 
              height: el.width,
              realWidth: el.realHeight,
              realHeight: el.realWidth
            }
          : el
      );
      
      setElements(newElements);
      saveToHistory({ elements: newElements, walls });
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
      
      const newWalls = walls.map(wall => 
        wall.id === elementId 
          ? { ...wall, x1: newX1, y1: newY1, x2: newX2, y2: newY2 }
          : wall
      );
      
      setWalls(newWalls);
      saveToHistory({ elements, walls: newWalls });
    }
  };
  
  // Функция объединения стен
  const connectWall = (wallId) => {
    const wall = walls.find(w => w.id === wallId);
    if (!wall) return;
    
    const connectionThreshold = 20;
    const connectedWalls = [];
    
    // Находим стены для объединения
    walls.forEach(otherWall => {
      if (otherWall.id === wallId) return;
      
      const isParallel = (
        (Math.abs(wall.x2 - wall.x1) > Math.abs(wall.y2 - wall.y1)) === 
        (Math.abs(otherWall.x2 - otherWall.x1) > Math.abs(otherWall.y2 - otherWall.y1))
      );
      
      if (isParallel) {
        const distance1 = Math.sqrt(Math.pow(wall.x2 - otherWall.x1, 2) + Math.pow(wall.y2 - otherWall.y1, 2));
        const distance2 = Math.sqrt(Math.pow(wall.x1 - otherWall.x2, 2) + Math.pow(wall.y1 - otherWall.y2, 2));
        
        if (distance1 < connectionThreshold || distance2 < connectionThreshold) {
          connectedWalls.push(otherWall);
        }
      }
    });
    
    if (connectedWalls.length > 0) {
      // Объединяем стены
      const allWalls = [wall, ...connectedWalls];
      const minX = Math.min(...allWalls.map(w => Math.min(w.x1, w.x2)));
      const maxX = Math.max(...allWalls.map(w => Math.max(w.x1, w.x2)));
      const minY = Math.min(...allWalls.map(w => Math.min(w.y1, w.y2)));
      const maxY = Math.max(...allWalls.map(w => Math.max(w.y1, w.y2)));
      
      const isHorizontal = Math.abs(wall.x2 - wall.x1) > Math.abs(wall.y2 - wall.y1);
      
      const newWall = {
        ...wall,
        x1: isHorizontal ? minX : wall.x1,
        y1: isHorizontal ? wall.y1 : minY,
        x2: isHorizontal ? maxX : wall.x2,
        y2: isHorizontal ? wall.y2 : maxY,
        length: isHorizontal ? (maxX - minX) / 30 : (maxY - minY) / 30
      };
      
      const newWalls = walls.filter(w => w.id !== wallId && !connectedWalls.some(cw => cw.id === w.id));
      newWalls.push(newWall);
      
      setWalls(newWalls);
      setSelectedElement(newWall);
      saveToHistory({ elements, walls: newWalls });
    }
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
      
      // Кнопка объединения (если есть)
      if (isConnected && clientX >= startX + 2 * (buttonSize + 5) && 
          clientX <= startX + 3 * buttonSize + 10 &&
          clientY >= buttonY && clientY <= buttonY + buttonSize) {
        connectWall(element.id);
        return true;
      }
    }
    
    return false;
  };
  

  
  // Удаление элемента
  const deleteElement = (elementId) => {
    const newElements = elements.filter(el => el.id !== elementId);
    const newWalls = walls.filter(wall => wall.id !== elementId);
    const newDoors = doors.filter(door => door.id !== elementId);
    const newWindows = windows.filter(window => window.id !== elementId);
    
    setElements(newElements);
    setWalls(newWalls);
    setDoors(newDoors);
    setWindows(newWindows);
    setSelectedElement(null);
    
    saveToHistory({ elements: newElements, walls: newWalls, doors: newDoors, windows: newWindows });
  };

  // Функции для изменения размеров элементов
  const updateElementSize = (dimension, value) => {
    if (!selectedElement || !value || value <= 0) return;
    
    if (selectedElement.type === 'house') {
      const newWidth = dimension === 'width' ? value : selectedElement.realWidth;
      const newHeight = dimension === 'height' ? value : selectedElement.realHeight;
      
      const newElements = elements.map(el => 
        el.id === selectedElement.id 
          ? { 
              ...el, 
              width: newWidth * 30,
              height: newHeight * 30,
              realWidth: newWidth,
              realHeight: newHeight
            }
          : el
      );
      
      setElements(newElements);
      saveToHistory({ elements: newElements, walls });
      
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
    
    const newWalls = walls.map(w => 
      w.id === selectedElement.id 
        ? { ...w, x1: newX1, y1: newY1, x2: newX2, y2: newY2, length: actualLength }
        : w
    );
    
    setWalls(newWalls);
    saveToHistory({ elements, walls: newWalls });
    
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

  const handleCanvasDoubleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const worldX = (clientX - panOffset.x) / zoom;
    const worldY = (clientY - panOffset.y) / zoom;
    
    const roomIndex = getRoomAt(worldX, worldY);
    if (roomIndex !== null) {
      handleRoomDoubleClick(roomIndex);
    }
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
        const newWalls = [...walls, connectedWall];
        setWalls(newWalls);
        setSelectedElement(connectedWall);
        saveToHistory({ elements, walls: newWalls });
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

  // Получение стены границы дома
  const getHouseBoundaryWall = (x, y) => {
    const houseElement = elements.find(el => el.type === 'house');
    if (!houseElement) return null;
    
    const tolerance = 10;
    const hx = houseElement.x;
    const hy = houseElement.y;
    const hw = houseElement.width;
    const hh = houseElement.height;
    
    // Проверяем границы дома
    if (Math.abs(y - hy) < tolerance && x >= hx && x <= hx + hw) {
      return { id: 'house-top', x1: hx, y1: hy, x2: hx + hw, y2: hy, type: 'boundary' };
    }
    if (Math.abs(y - (hy + hh)) < tolerance && x >= hx && x <= hx + hw) {
      return { id: 'house-bottom', x1: hx, y1: hy + hh, x2: hx + hw, y2: hy + hh, type: 'boundary' };
    }
    if (Math.abs(x - hx) < tolerance && y >= hy && y <= hy + hh) {
      return { id: 'house-left', x1: hx, y1: hy, x2: hx, y2: hy + hh, type: 'boundary' };
    }
    if (Math.abs(x - (hx + hw)) < tolerance && y >= hy && y <= hy + hh) {
      return { id: 'house-right', x1: hx + hw, y1: hy, x2: hx + hw, y2: hy + hh, type: 'boundary' };
    }
    
    return null;
  };

  // Добавление двери или окна
  const addDoorOrWindow = (wall, clickX, clickY, type) => {
    const isHorizontal = Math.abs(wall.x2 - wall.x1) > Math.abs(wall.y2 - wall.y1);
    const wallLength = Math.sqrt(Math.pow(wall.x2 - wall.x1, 2) + Math.pow(wall.y2 - wall.y1, 2));
    
    // Находим позицию на стене
    let position;
    if (isHorizontal) {
      position = (clickX - Math.min(wall.x1, wall.x2)) / wallLength;
    } else {
      position = (clickY - Math.min(wall.y1, wall.y2)) / wallLength;
    }
    
    const newItem = {
      id: Date.now(),
      wallId: wall.id,
      position: Math.max(0.1, Math.min(0.9, position)),
      width: type === 'door' ? 25 : 45, // стандартные размеры: дверь 800мм, окно 1500мм
      realWidth: type === 'door' ? 0.8 : 1.5, // в метрах
      type: type
    };
    
    if (type === 'door') {
      setDoors(prev => [...prev, newItem]);
    } else {
      setWindows(prev => [...prev, newItem]);
    }
  };

  // Рисование дверей
  const drawDoors = (ctx) => {
    doors.forEach(door => {
      const wall = walls.find(w => w.id === door.wallId) || getHouseBoundaryById(door.wallId);
      if (!wall) return;
      
      const isHorizontal = Math.abs(wall.x2 - wall.x1) > Math.abs(wall.y2 - wall.y1);
      const doorX = wall.x1 + (wall.x2 - wall.x1) * door.position;
      const doorY = wall.y1 + (wall.y2 - wall.y1) * door.position;
      
      // Рисуем проем в стене (белая линия)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = Math.max(4, 6 * zoom);
      
      if (isHorizontal) {
        ctx.beginPath();
        ctx.moveTo((doorX - door.width/2) * zoom, doorY * zoom);
        ctx.lineTo((doorX + door.width/2) * zoom, doorY * zoom);
        ctx.stroke();
        
        // Рисуем дверь (дуга)
        ctx.strokeStyle = selectedElement?.id === door.id ? '#df682b' : '#8B4513';
        ctx.lineWidth = selectedElement?.id === door.id ? 3 : 2;
        ctx.beginPath();
        ctx.arc(doorX * zoom, doorY * zoom, door.width/2 * zoom, 0, Math.PI);
        ctx.stroke();
        
        // Показываем размер двери
        if (zoom >= 0.5) {
          ctx.fillStyle = '#8B4513';
          ctx.font = '8px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(`${(door.realWidth * 1000).toFixed(0)}мм`, doorX * zoom, (doorY - door.width/2 - 5) * zoom);
        }
      } else {
        ctx.beginPath();
        ctx.moveTo(doorX * zoom, (doorY - door.width/2) * zoom);
        ctx.lineTo(doorX * zoom, (doorY + door.width/2) * zoom);
        ctx.stroke();
        
        // Рисуем дверь (дуга)
        ctx.strokeStyle = selectedElement?.id === door.id ? '#df682b' : '#8B4513';
        ctx.lineWidth = selectedElement?.id === door.id ? 3 : 2;
        ctx.beginPath();
        ctx.arc(doorX * zoom, doorY * zoom, door.width/2 * zoom, -Math.PI/2, Math.PI/2);
        ctx.stroke();
        
        // Показываем размер двери
        if (zoom >= 0.5) {
          ctx.fillStyle = '#8B4513';
          ctx.font = '8px Arial';
          ctx.textAlign = 'center';
          ctx.save();
          ctx.translate((doorX - door.width/2 - 10) * zoom, doorY * zoom);
          ctx.rotate(-Math.PI / 2);
          ctx.fillText(`${(door.realWidth * 1000).toFixed(0)}мм`, 0, 0);
          ctx.restore();
        }
      }
    });
  };

  // Рисование окон
  const drawWindows = (ctx) => {
    windows.forEach(window => {
      const wall = walls.find(w => w.id === window.wallId) || getHouseBoundaryById(window.wallId);
      if (!wall) return;
      
      const isHorizontal = Math.abs(wall.x2 - wall.x1) > Math.abs(wall.y2 - wall.y1);
      const windowX = wall.x1 + (wall.x2 - wall.x1) * window.position;
      const windowY = wall.y1 + (wall.y2 - wall.y1) * window.position;
      
      // Рисуем проем в стене (белая линия)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = Math.max(4, 6 * zoom);
      
      if (isHorizontal) {
        ctx.beginPath();
        ctx.moveTo((windowX - window.width/2) * zoom, windowY * zoom);
        ctx.lineTo((windowX + window.width/2) * zoom, windowY * zoom);
        ctx.stroke();
        
        // Рисуем окно (прямоугольник)
        ctx.strokeStyle = selectedElement?.id === window.id ? '#df682b' : '#4169E1';
        ctx.lineWidth = selectedElement?.id === window.id ? 4 : 3;
        ctx.strokeRect((windowX - window.width/2) * zoom, (windowY - 5) * zoom, window.width * zoom, 10 * zoom);
        
        // Показываем размер окна
        if (zoom >= 0.5) {
          ctx.fillStyle = '#4169E1';
          ctx.font = '8px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(`${(window.realWidth * 1000).toFixed(0)}мм`, windowX * zoom, (windowY - 15) * zoom);
        }
      } else {
        ctx.beginPath();
        ctx.moveTo(windowX * zoom, (windowY - window.width/2) * zoom);
        ctx.lineTo(windowX * zoom, (windowY + window.width/2) * zoom);
        ctx.stroke();
        
        // Рисуем окно (прямоугольник)
        ctx.strokeStyle = selectedElement?.id === window.id ? '#df682b' : '#4169E1';
        ctx.lineWidth = selectedElement?.id === window.id ? 4 : 3;
        ctx.strokeRect((windowX - 5) * zoom, (windowY - window.width/2) * zoom, 10 * zoom, window.width * zoom);
        
        // Показываем размер окна
        if (zoom >= 0.5) {
          ctx.fillStyle = '#4169E1';
          ctx.font = '8px Arial';
          ctx.textAlign = 'center';
          ctx.save();
          ctx.translate((windowX - 15) * zoom, windowY * zoom);
          ctx.rotate(-Math.PI / 2);
          ctx.fillText(`${(window.realWidth * 1000).toFixed(0)}мм`, 0, 0);
          ctx.restore();
        }
      }
    });
  };

  // Получение границы дома по ID
  const getHouseBoundaryById = (id) => {
    const houseElement = elements.find(el => el.type === 'house');
    if (!houseElement) return null;
    
    const boundaries = {
      'house-top': { x1: houseElement.x, y1: houseElement.y, x2: houseElement.x + houseElement.width, y2: houseElement.y },
      'house-bottom': { x1: houseElement.x, y1: houseElement.y + houseElement.height, x2: houseElement.x + houseElement.width, y2: houseElement.y + houseElement.height },
      'house-left': { x1: houseElement.x, y1: houseElement.y, x2: houseElement.x, y2: houseElement.y + houseElement.height },
      'house-right': { x1: houseElement.x + houseElement.width, y1: houseElement.y, x2: houseElement.x + houseElement.width, y2: houseElement.y + houseElement.height }
    };
    
    return boundaries[id] ? { id, ...boundaries[id], type: 'boundary' } : null;
  };

  // Получение двери по координатам
  const getDoorAt = (x, y) => {
    for (let door of doors) {
      const wall = walls.find(w => w.id === door.wallId) || getHouseBoundaryById(door.wallId);
      if (!wall) continue;
      
      const doorX = wall.x1 + (wall.x2 - wall.x1) * door.position;
      const doorY = wall.y1 + (wall.y2 - wall.y1) * door.position;
      
      if (Math.abs(x - doorX) < door.width/2 && Math.abs(y - doorY) < door.width/2) {
        return door;
      }
    }
    return null;
  };

  // Получение окна по координатам
  const getWindowAt = (x, y) => {
    for (let window of windows) {
      const wall = walls.find(w => w.id === window.wallId) || getHouseBoundaryById(window.wallId);
      if (!wall) continue;
      
      const windowX = wall.x1 + (wall.x2 - wall.x1) * window.position;
      const windowY = wall.y1 + (wall.y2 - wall.y1) * window.position;
      
      if (Math.abs(x - windowX) < window.width/2 && Math.abs(y - windowY) < window.width/2) {
        return window;
      }
    }
    return null;
  };

  // Перемещение двери или окна по стене
  const moveDoorOrWindow = (item, worldX, worldY, type) => {
    const wall = walls.find(w => w.id === item.wallId) || getHouseBoundaryById(item.wallId);
    if (!wall) return;
    
    const isHorizontal = Math.abs(wall.x2 - wall.x1) > Math.abs(wall.y2 - wall.y1);
    const wallLength = Math.sqrt(Math.pow(wall.x2 - wall.x1, 2) + Math.pow(wall.y2 - wall.y1, 2));
    
    // Находим новую позицию на стене
    let newPosition;
    if (isHorizontal) {
      newPosition = (worldX - Math.min(wall.x1, wall.x2)) / wallLength;
    } else {
      newPosition = (worldY - Math.min(wall.y1, wall.y2)) / wallLength;
    }
    
    newPosition = Math.max(0.1, Math.min(0.9, newPosition));
    
    if (type === 'door') {
      setDoors(prev => prev.map(door => 
        door.id === item.id ? { ...door, position: newPosition } : door
      ));
    } else {
      setWindows(prev => prev.map(window => 
        window.id === item.id ? { ...window, position: newPosition } : window
      ));
    }
  };

  return (
    <div className="constructor-interface fade-in">
      {/* Хедер */}
      <div className="constructor-header">
        <div className="header-left">
          <button className="back-btn" onClick={onBack}>
            ⚙️ Настройки
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
            onDoubleClick={handleCanvasDoubleClick}
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
              📊 Рассчитать проект
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
            <div className="hotkeys-info">
              <div className="hotkey-item">
                <span>Ctrl+Z</span>
                <span>Отменить</span>
              </div>
              <div className="hotkey-item">
                <span>Enter</span>
                <span>Подтвердить</span>
              </div>
              <div className="hotkey-item">
                <span>Delete</span>
                <span>Удалить</span>
              </div>
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
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .constructor-header {
          background: var(--primary-dark);
          color: var(--white);
          padding: 8px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          min-height: 50px;
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
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }

        .back-btn:hover {
          background: #c55a24;
        }

        .constructor-header h1 {
          font-size: 16px;
          margin: 0;
          font-weight: 500;
        }

        .header-right .project-info {
          display: flex;
          gap: 12px;
          font-size: 11px;
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
          width: 280px;
          min-width: 280px;
          max-width: 280px;
          background: var(--primary-dark);
          color: var(--white);
          padding: 12px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
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
          margin-bottom: 8px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .calculate-btn {
          background: var(--accent-orange);
          color: var(--white);
          border: none;
          padding: 6px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 11px;
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
          padding: 4px 6px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }
        
        .collapse-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--accent-orange);
        }

        .panel-section h3 {
          margin: 0 0 8px 0;
          font-size: 13px;
          color: var(--white);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding-bottom: 4px;
          font-weight: 500;
        }

        .view-toggle {
          display: flex;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          overflow: hidden;
        }

        .view-toggle button {
          flex: 1;
          padding: 6px 8px;
          border: none;
          background: transparent;
          color: var(--white);
          cursor: pointer;
          transition: all 0.2s;
          font-size: 11px;
        }

        .view-toggle button.active {
          background: var(--accent-orange);
        }

        .tools-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 6px;
        }

        .tool-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 8px 4px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: transparent;
          color: var(--white);
          border-radius: 4px;
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
          font-size: 16px;
        }

        .tool-name {
          font-size: 9px;
        }

        .zoom-controls {
          display: grid;
          grid-template-columns: 1fr auto 1fr 1fr;
          gap: 4px;
          align-items: center;
        }

        .zoom-controls button {
          padding: 4px 6px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: transparent;
          color: var(--white);
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 11px;
        }

        .zoom-controls button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .zoom-controls span {
          text-align: center;
          font-size: 10px;
        }
        
        .hotkeys-info {
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .hotkey-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2px 0;
          font-size: 9px;
        }
        
        .hotkey-item span:first-child {
          background: rgba(255, 255, 255, 0.1);
          padding: 1px 4px;
          border-radius: 2px;
          font-family: monospace;
          font-size: 8px;
        }

        .project-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 3px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 10px;
        }

        .detail-item span {
          opacity: 0.8;
        }

        .detail-item strong {
          color: var(--accent-orange);
        }
        
        .selected-info {
          background: rgba(223, 104, 43, 0.1);
          padding: 2px 6px;
          border-radius: 3px;
          margin: 2px 0;
        }
        
        .size-controls {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .size-input {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .size-input label {
          font-size: 10px;
          opacity: 0.8;
        }
        
        .size-input input {
          padding: 4px 6px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.1);
          color: var(--white);
          font-size: 11px;
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