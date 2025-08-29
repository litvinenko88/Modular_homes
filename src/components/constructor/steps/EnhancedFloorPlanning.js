'use client';

import { useState, useRef, useEffect } from 'react';

const WALL_TYPES = [
  { id: 'exterior', name: 'Внешняя стена', thickness: 0.3, color: '#8B4513' },
  { id: 'interior', name: 'Перегородка', thickness: 0.15, color: '#D2B48C' },
  { id: 'load_bearing', name: 'Несущая стена', thickness: 0.25, color: '#A0522D' }
];

const OPENING_TYPES = [
  { id: 'door', name: 'Дверь', width: 0.9, height: 2.1, color: '#8B4513' },
  { id: 'door_wide', name: 'Широкая дверь', width: 1.2, height: 2.1, color: '#8B4513' },
  { id: 'window', name: 'Окно', width: 1.2, height: 1.4, color: '#87CEEB' },
  { id: 'window_large', name: 'Большое окно', width: 1.8, height: 1.4, color: '#87CEEB' },
  { id: 'window_small', name: 'Малое окно', width: 0.8, height: 1.2, color: '#87CEEB' },
  { id: 'balcony_door', name: 'Балконная дверь', width: 0.8, height: 2.2, color: '#4682B4' }
];

const ROOM_TYPES = [
  'Гостиная', 'Спальня', 'Кухня', 'Ванная', 'Прихожая', 'Кладовая', 'Терраса'
];

export default function EnhancedFloorPlanning({ data, updateData, onNext, onPrev }) {
  const canvasRef = useRef(null);
  const [view3D, setView3D] = useState(false);
  const [selectedTool, setSelectedTool] = useState('wall');
  const [selectedWallType, setSelectedWallType] = useState('interior');
  const [selectedOpeningType, setSelectedOpeningType] = useState('door');
  const [wallLength, setWallLength] = useState(3);
  const [wallAngle, setWallAngle] = useState(0);
  const [rotation, setRotation] = useState({ x: -0.3, y: 0.5 });
  const [zoom3D, setZoom3D] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [selectedWallId, setSelectedWallId] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedOpeningId, setSelectedOpeningId] = useState(null);
  const [showDimensions, setShowDimensions] = useState(true);
  const [editingWall, setEditingWall] = useState(null);
  const [draggedElement, setDraggedElement] = useState(null);
  const [showAreaInfo, setShowAreaInfo] = useState(true);

  const [canvasSize, setCanvasSize] = useState({ width: 900, height: 700 });
  const SCALE = view3D ? 25 : 30;
  const WALL_HEIGHT = 2.7;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const resizeCanvas = () => {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        setCanvasSize({ width: rect.width, height: rect.height });
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
  }, [data.walls, data.openings, data.rooms, view3D, rotation, zoom3D, selectedWallId, selectedOpeningId, showDimensions, canvasSize]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0 || canvas.height === 0) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (view3D) {
      draw3D(ctx);
    } else {
      draw2D(ctx);
    }
  };

  const draw2D = (ctx) => {
    drawGrid2D(ctx);
    drawHouseOutline(ctx);
    drawRooms(ctx);
    drawWalls2D(ctx);
    drawOpenings2D(ctx);
    if (showDimensions) drawDimensions(ctx);
  };
  
  const drawGrid2D = (ctx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const gridSize = 20; // Фиксированный размер сетки
    
    ctx.save();
    
    // Мелкая сетка
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.8;
    
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Крупная сетка (каждые 5 линий)
    ctx.strokeStyle = '#d0d0d0';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 1;
    
    for (let x = 0; x <= canvas.width; x += gridSize * 5) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= canvas.height; y += gridSize * 5) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    ctx.restore();
  };

  const draw3D = (ctx) => {
    ctx.save();
    ctx.translate(400, 300);
    ctx.scale(zoom3D, zoom3D);
    
    const cosY = Math.cos(rotation.y);
    const sinY = Math.sin(rotation.y);
    const cosX = Math.cos(rotation.x);
    const sinX = Math.sin(rotation.x);
    
    drawFloor3D(ctx, cosY, sinY, cosX, sinX);
    drawWalls3D(ctx, cosY, sinY, cosX, sinX);
    drawOpenings3D(ctx, cosY, sinY, cosX, sinX);
    drawStairs3D(ctx, cosY, sinY, cosX, sinX);
    
    ctx.restore();
  };

  const drawHouseOutline = (ctx) => {
    if (!data.modules || data.modules.length === 0) return;
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    
    data.modules.forEach(module => {
      ctx.strokeRect(
        100 + module.x * SCALE,
        100 + module.y * SCALE,
        module.width * SCALE,
        module.height * SCALE
      );
    });
  };

  const drawRooms = (ctx) => {
    (data.rooms || []).forEach(room => {
      const area = room.width * room.height;
      const isSelected = room.id === selectedRoomId;
      
      ctx.fillStyle = 'rgba(100, 200, 100, 0.15)';
      ctx.fillRect(
        100 + room.x * SCALE,
        100 + room.y * SCALE,
        room.width * SCALE,
        room.height * SCALE
      );
      
      ctx.strokeStyle = isSelected ? '#4caf50' : '#90ee90';
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(
        100 + room.x * SCALE,
        100 + room.y * SCALE,
        room.width * SCALE,
        room.height * SCALE
      );
      ctx.setLineDash([]);
      
      // Название и площадь комнаты
      const centerX = 100 + (room.x + room.width/2) * SCALE;
      const centerY = 100 + (room.y + room.height/2) * SCALE;
      
      ctx.fillStyle = '#2e7d32';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(room.name, centerX, centerY - 8);
      
      ctx.font = '11px Arial';
      ctx.fillText(`${area.toFixed(1)} м²`, centerX, centerY + 8);
      
      // Размеры комнаты
      if (showDimensions) {
        ctx.fillStyle = '#666';
        ctx.font = '10px Arial';
        // Ширина
        ctx.fillText(
          `${room.width.toFixed(1)}м`,
          centerX,
          100 + room.y * SCALE - 5
        );
        // Высота
        ctx.save();
        ctx.translate(100 + room.x * SCALE - 15, centerY);
        ctx.rotate(-Math.PI/2);
        ctx.fillText(`${room.height.toFixed(1)}м`, 0, 0);
        ctx.restore();
      }
    });
  };

  const drawWalls2D = (ctx) => {
    (data.walls || []).forEach(wall => {
      const wallType = WALL_TYPES.find(t => t.id === wall.type);
      const isSelected = wall.id === selectedWallId;
      
      ctx.strokeStyle = isSelected ? '#ff5722' : (wallType?.color || '#333');
      ctx.lineWidth = (wallType?.thickness * SCALE || 3) + (isSelected ? 2 : 0);
      
      ctx.beginPath();
      ctx.moveTo(100 + wall.x1 * SCALE, 100 + wall.y1 * SCALE);
      ctx.lineTo(100 + wall.x2 * SCALE, 100 + wall.y2 * SCALE);
      ctx.stroke();
      
      // Маркеры для поворота
      if (isSelected) {
        drawRotationHandles(ctx, wall);
      }
    });
  };

  const drawRotationHandles = (ctx, wall) => {
    const centerX = 100 + (wall.x1 + wall.x2) / 2 * SCALE;
    const centerY = 100 + (wall.y1 + wall.y2) / 2 * SCALE;
    
    // Кнопка поворота
    ctx.fillStyle = '#2196f3';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY - 30, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Стрелка поворота
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY - 30, 8, 0, Math.PI * 1.5);
    ctx.stroke();
    
    // Линия к стене
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 15);
    ctx.lineTo(centerX, centerY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Маркеры для перетаскивания
    const handles = [
      { x: 100 + wall.x1 * SCALE, y: 100 + wall.y1 * SCALE },
      { x: 100 + wall.x2 * SCALE, y: 100 + wall.y2 * SCALE }
    ];
    
    ctx.fillStyle = '#ff5722';
    handles.forEach(handle => {
      ctx.beginPath();
      ctx.arc(handle.x, handle.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  };

  const drawOpeningHandles = (ctx, opening) => {
    const wall = data.walls?.find(w => w.id === opening.wallId);
    if (!wall) return;
    
    const wallLength = Math.sqrt(
      Math.pow(wall.x2 - wall.x1, 2) + Math.pow(wall.y2 - wall.y1, 2)
    );
    const ratio = opening.position / wallLength;
    const openingX = wall.x1 + (wall.x2 - wall.x1) * ratio;
    const openingY = wall.y1 + (wall.y2 - wall.y1) * ratio;
    
    const centerX = 100 + openingX * SCALE;
    const centerY = 100 + openingY * SCALE;
    
    // Кнопка удаления
    ctx.fillStyle = '#f44336';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY - 30, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Символ корзины
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Крышка корзины
    ctx.moveTo(centerX - 6, centerY - 34);
    ctx.lineTo(centerX + 6, centerY - 34);
    // Корпус корзины
    ctx.moveTo(centerX - 4, centerY - 32);
    ctx.lineTo(centerX - 3, centerY - 23);
    ctx.lineTo(centerX + 3, centerY - 23);
    ctx.lineTo(centerX + 4, centerY - 32);
    // Вертикальные линии
    ctx.moveTo(centerX - 2, centerY - 31);
    ctx.lineTo(centerX - 2, centerY - 25);
    ctx.moveTo(centerX + 2, centerY - 31);
    ctx.lineTo(centerX + 2, centerY - 25);
    ctx.stroke();
    
    // Линия к проему
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 15);
    ctx.lineTo(centerX, centerY);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const drawOpenings2D = (ctx) => {
    (data.openings || []).forEach(opening => {
      const wall = data.walls?.find(w => w.id === opening.wallId);
      const openingType = OPENING_TYPES.find(t => t.id === opening.type);
      if (wall && openingType) {
        const wallLength = Math.sqrt(
          Math.pow(wall.x2 - wall.x1, 2) + Math.pow(wall.y2 - wall.y1, 2)
        );
        const ratio = opening.position / wallLength;
        
        const openingX = wall.x1 + (wall.x2 - wall.x1) * ratio;
        const openingY = wall.y1 + (wall.y2 - wall.y1) * ratio;
        
        const isSelected = opening.id === selectedOpeningId;
        
        // Рисуем проем как прямоугольник на стене
        const wallAngle = Math.atan2(wall.y2 - wall.y1, wall.x2 - wall.x1);
        const perpAngle = wallAngle + Math.PI / 2;
        
        const openingWidth = openingType.width * SCALE;
        const wallThickness = (WALL_TYPES.find(t => t.id === wall.type)?.thickness || 0.2) * SCALE;
        
        ctx.save();
        ctx.translate(100 + openingX * SCALE, 100 + openingY * SCALE);
        ctx.rotate(wallAngle);
        
        // Фон проема (белый для показа разрыва в стене)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-openingWidth/2, -wallThickness/2, openingWidth, wallThickness);
        
        // Рамка проема
        ctx.strokeStyle = isSelected ? '#ff5722' : openingType.color;
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.strokeRect(-openingWidth/2, -wallThickness/2, openingWidth, wallThickness);
        
        // Символ типа проема
        ctx.fillStyle = openingType.color;
        if (opening.type.includes('door')) {
          // Дуга для двери
          ctx.beginPath();
          ctx.arc(-openingWidth/4, 0, openingWidth/3, 0, Math.PI/2);
          ctx.stroke();
        } else {
          // Крестик для окна
          ctx.beginPath();
          ctx.moveTo(-openingWidth/2, -wallThickness/2);
          ctx.lineTo(openingWidth/2, wallThickness/2);
          ctx.moveTo(openingWidth/2, -wallThickness/2);
          ctx.lineTo(-openingWidth/2, wallThickness/2);
          ctx.stroke();
        }
        
        ctx.restore();
        
        // Подпись
        ctx.fillStyle = isSelected ? '#ff5722' : '#333';
        ctx.font = isSelected ? 'bold 10px Arial' : '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          openingType.name,
          100 + openingX * SCALE,
          100 + openingY * SCALE - 20
        );
        
        // Размер проема
        if (showDimensions) {
          ctx.font = '9px Arial';
          ctx.fillText(
            `${openingType.width}м`,
            100 + openingX * SCALE,
            100 + openingY * SCALE + 25
          );
        }
        
        // Маркеры для выбранного проема
        if (isSelected) {
          drawOpeningHandles(ctx, opening);
        }
      }
    });
  };

  const drawDimensions = (ctx) => {
    (data.walls || []).forEach(wall => {
      const length = Math.sqrt(
        Math.pow(wall.x2 - wall.x1, 2) + Math.pow(wall.y2 - wall.y1, 2)
      );
      
      const centerX = 100 + (wall.x1 + wall.x2) / 2 * SCALE;
      const centerY = 100 + (wall.y1 + wall.y2) / 2 * SCALE;
      
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillRect(centerX - 20, centerY - 8, 40, 16);
      ctx.fillStyle = '#fff';
      ctx.fillText(`${length.toFixed(1)}м`, centerX, centerY + 4);
    });
  };

  const drawFloor3D = (ctx, cosY, sinY, cosX, sinX) => {
    if (!data.modules || data.modules.length === 0) return;
    
    ctx.fillStyle = '#F5F5DC';
    ctx.strokeStyle = '#DDD';
    
    data.modules.forEach(module => {
      const corners = [
        project3D(module.x, 0, module.y, cosY, sinY, cosX, sinX),
        project3D(module.x + module.width, 0, module.y, cosY, sinY, cosX, sinX),
        project3D(module.x + module.width, 0, module.y + module.height, cosY, sinY, cosX, sinX),
        project3D(module.x, 0, module.y + module.height, cosY, sinY, cosX, sinX)
      ];
      
      ctx.beginPath();
      ctx.moveTo(corners[0].x, corners[0].y);
      corners.forEach(corner => ctx.lineTo(corner.x, corner.y));
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
  };

  const drawWalls3D = (ctx, cosY, sinY, cosX, sinX) => {
    (data.walls || []).forEach(wall => {
      const wallType = WALL_TYPES.find(t => t.id === wall.type);
      ctx.fillStyle = wallType?.color || '#8B4513';
      ctx.strokeStyle = '#654321';
      
      const bottomStart = project3D(wall.x1, 0, wall.y1, cosY, sinY, cosX, sinX);
      const bottomEnd = project3D(wall.x2, 0, wall.y2, cosY, sinY, cosX, sinX);
      const topStart = project3D(wall.x1, WALL_HEIGHT, wall.y1, cosY, sinY, cosX, sinX);
      const topEnd = project3D(wall.x2, WALL_HEIGHT, wall.y2, cosY, sinY, cosX, sinX);
      
      ctx.beginPath();
      ctx.moveTo(bottomStart.x, bottomStart.y);
      ctx.lineTo(bottomEnd.x, bottomEnd.y);
      ctx.lineTo(topEnd.x, topEnd.y);
      ctx.lineTo(topStart.x, topStart.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
  };

  const drawOpenings3D = (ctx, cosY, sinY, cosX, sinX) => {
    (data.openings || []).forEach(opening => {
      const wall = data.walls?.find(w => w.id === opening.wallId);
      const openingType = OPENING_TYPES.find(t => t.id === opening.type);
      if (!wall || !openingType) return;
      
      const wallLength = Math.sqrt(
        Math.pow(wall.x2 - wall.x1, 2) + Math.pow(wall.y2 - wall.y1, 2)
      );
      const ratio = opening.position / wallLength;
      
      const openingX = wall.x1 + (wall.x2 - wall.x1) * ratio;
      const openingZ = wall.y1 + (wall.y2 - wall.y1) * ratio;
      
      ctx.fillStyle = opening.type === 'window' ? '#87CEEB' : '#8B4513';
      
      const openingBottom = project3D(openingX, 0, openingZ, cosY, sinY, cosX, sinX);
      const openingTop = project3D(openingX, openingType.height, openingZ, cosY, sinY, cosX, sinX);
      
      ctx.fillRect(openingBottom.x - 5, openingBottom.y - 5, 10, openingTop.y - openingBottom.y + 10);
    });
  };

  const drawStairs3D = (ctx, cosY, sinY, cosX, sinX) => {
    // Добавляем лестницы если есть второй этаж
    if (data.hasSecondFloor) {
      ctx.fillStyle = '#8B4513';
      const stairStart = project3D(2, 0, 2, cosY, sinY, cosX, sinX);
      const stairEnd = project3D(3, WALL_HEIGHT, 3, cosY, sinY, cosX, sinX);
      
      for (let i = 0; i < 10; i++) {
        const step = project3D(2 + i * 0.1, i * 0.27, 2 + i * 0.1, cosY, sinY, cosX, sinX);
        ctx.fillRect(step.x - 2, step.y - 1, 4, 2);
      }
    }
  };

  const project3D = (x, y, z, cosY, sinY, cosX, sinX) => {
    const rotatedX = x * cosY - z * sinY;
    const rotatedZ = x * sinY + z * cosY;
    const rotatedY = y * cosX - rotatedZ * sinX;
    
    return {
      x: rotatedX * SCALE,
      y: rotatedY * SCALE - rotatedZ * SCALE * 0.5
    };
  };

  const handleCanvasMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    
    if (view3D) {
      setIsDragging(true);
      setLastMouse({ x: clientX, y: clientY });
      return;
    }

    const x = (clientX - 100) / SCALE;
    const y = (clientY - 100) / SCALE;

    // Проверяем клик по кнопке поворота стены
    if (selectedWallId) {
      const selectedWall = (data.walls || []).find(w => w.id === selectedWallId);
      if (selectedWall) {
        const rotateX = 100 + (selectedWall.x1 + selectedWall.x2) / 2 * SCALE;
        const rotateY = 100 + (selectedWall.y1 + selectedWall.y2) / 2 * SCALE - 30;
        const distanceToRotate = Math.sqrt(
          Math.pow(clientX - rotateX, 2) + Math.pow(clientY - rotateY, 2)
        );
        
        if (distanceToRotate <= 15) {
          rotateSelectedWall(1);
          return;
        }
      }
    }
    
    // Проверяем клик по кнопке удаления проема
    if (selectedOpeningId) {
      const selectedOpening = (data.openings || []).find(o => o.id === selectedOpeningId);
      const wall = (data.walls || []).find(w => w.id === selectedOpening?.wallId);
      if (selectedOpening && wall) {
        const wallLength = Math.sqrt(
          Math.pow(wall.x2 - wall.x1, 2) + Math.pow(wall.y2 - wall.y1, 2)
        );
        const ratio = selectedOpening.position / wallLength;
        const openingX = wall.x1 + (wall.x2 - wall.x1) * ratio;
        const openingY = wall.y1 + (wall.y2 - wall.y1) * ratio;
        
        const deleteX = 100 + openingX * SCALE;
        const deleteY = 100 + openingY * SCALE - 30;
        const distanceToDelete = Math.sqrt(
          Math.pow(clientX - deleteX, 2) + Math.pow(clientY - deleteY, 2)
        );
        
        if (distanceToDelete <= 15) {
          deleteOpening(selectedOpeningId);
          return;
        }
      }
    }

    if (selectedTool === 'wall') {
      addWall(x, y);
    } else if (selectedTool === 'opening') {
      addOpening(x, y);
    } else if (selectedTool === 'room') {
      addRoom(x, y);
    } else if (selectedTool === 'select') {
      // Сначала проверяем клик по проему
      const clickedOpening = selectOpening(x, y);
      if (clickedOpening) {
        // Проверяем, не кликнули ли по корзине
        const wall = (data.walls || []).find(w => w.id === clickedOpening.wallId);
        if (wall) {
          const wallLength = Math.sqrt(
            Math.pow(wall.x2 - wall.x1, 2) + Math.pow(wall.y2 - wall.y1, 2)
          );
          const ratio = clickedOpening.position / wallLength;
          const openingX = wall.x1 + (wall.x2 - wall.x1) * ratio;
          const openingY = wall.y1 + (wall.y2 - wall.y1) * ratio;
          
          const deleteX = 100 + openingX * SCALE + 30;
          const deleteY = 100 + openingY * SCALE - 30;
          const distanceToDelete = Math.sqrt(
            Math.pow(clientX - deleteX, 2) + Math.pow(clientY - deleteY, 2)
          );
          
          // Если кликнули не по корзине, то начинаем перетаскивание
          if (distanceToDelete > 15) {
            startDragOpening(clickedOpening.id, clientX, clientY);
          }
        }
      } else {
        // Затем проверяем клик по стене
        const clickedWall = selectWall(x, y);
        if (clickedWall) {
          startDragWall(clickedWall.id, clientX, clientY);
        } else {
          // Если не попали в стену, проверяем комнаты
          const clickedRoom = selectRoom(x, y);
          if (!clickedRoom) {
            // Если ничего не выбрано, сбрасываем выделение
            setSelectedWallId(null);
            setSelectedRoomId(null);
            setSelectedOpeningId(null);
          }
        }
      }
    }
  };

  const handleCanvasMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    if (draggedElement && draggedElement.type === 'wall') {
      dragWall(mouseX, mouseY);
    } else if (draggedElement && draggedElement.type === 'opening') {
      dragOpening(mouseX, mouseY);
    } else if (isDragging && view3D) {
      const deltaX = mouseX - lastMouse.x;
      const deltaY = mouseY - lastMouse.y;
      
      setRotation(prev => ({
        x: Math.max(-Math.PI/2, Math.min(Math.PI/2, prev.x + deltaY * 0.01)),
        y: prev.y + deltaX * 0.01
      }));
      
      setLastMouse({ x: mouseX, y: mouseY });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    endDragElement();
  };
  
  // Поддержка тач-жестов
  const [touchDistance, setTouchDistance] = useState(null);
  
  const handleTouchStart = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const clientX = touch.clientX - rect.left;
      const clientY = touch.clientY - rect.top;
      
      if (view3D) {
        setIsDragging(true);
        setLastMouse({ x: clientX, y: clientY });
      } else {
        const x = (clientX - 100) / SCALE;
        const y = (clientY - 100) / SCALE;
        
        if (selectedTool === 'select') {
          const clickedOpening = selectOpening(x, y);
          if (clickedOpening) {
            startDragOpening(clickedOpening.id, clientX, clientY);
          } else {
            const clickedWall = selectWall(x, y);
            if (clickedWall) {
              startDragWall(clickedWall.id, clientX, clientY);
            } else {
              const clickedRoom = selectRoom(x, y);
              if (!clickedRoom) {
                setSelectedWallId(null);
                setSelectedRoomId(null);
                setSelectedOpeningId(null);
              }
            }
          }
        }
      }
    } else if (e.touches.length === 2 && view3D) {
      const distance = Math.sqrt(
        Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
        Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
      );
      setTouchDistance(distance);
      endDragElement();
    }
  };
  
  const handleTouchMove = (e) => {
    e.preventDefault();
    
    if (e.touches.length === 1) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches[0].clientX - rect.left;
      const clientY = e.touches[0].clientY - rect.top;
      
      if (view3D && isDragging) {
        const deltaX = clientX - lastMouse.x;
        const deltaY = clientY - lastMouse.y;
        
        setRotation(prev => ({
          x: Math.max(-Math.PI/2, Math.min(Math.PI/2, prev.x + deltaY * 0.01)),
          y: prev.y + deltaX * 0.01
        }));
        
        setLastMouse({ x: clientX, y: clientY });
      } else if (draggedElement) {
        if (draggedElement.type === 'wall') {
          dragWall(clientX, clientY);
        } else if (draggedElement.type === 'opening') {
          dragOpening(clientX, clientY);
        }
      }
    } else if (e.touches.length === 2 && touchDistance && view3D) {
      const newDistance = Math.sqrt(
        Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
        Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
      );
      
      const scale = newDistance / touchDistance;
      setZoom3D(prev => Math.max(0.3, Math.min(5, prev * scale)));
      setTouchDistance(newDistance);
    }
  };

  const snapToGrid = (value, gridSize = 0.1) => {
    return Math.round(value / gridSize) * gridSize;
  };

  const addWall = (x, y) => {
    // Привязка к сетке
    const snappedX = snapToGrid(x);
    const snappedY = snapToGrid(y);
    
    const angleRad = (wallAngle * Math.PI) / 180;
    const endX = snappedX + wallLength * Math.cos(angleRad);
    const endY = snappedY + wallLength * Math.sin(angleRad);
    
    const newWall = {
      id: Date.now(),
      x1: snappedX,
      y1: snappedY,
      x2: snapToGrid(endX),
      y2: snapToGrid(endY),
      type: selectedWallType,
      length: wallLength,
      angle: wallAngle
    };
    
    updateData({
      walls: [...(data.walls || []), newWall]
    });
  };

  const addOpening = (x, y) => {
    const nearestWall = (data.walls || []).reduce((nearest, wall) => {
      const distance = distanceToLine(x, y, wall.x1, wall.y1, wall.x2, wall.y2);
      return distance < (nearest.distance || Infinity) 
        ? { wall, distance } 
        : nearest;
    }, {});
    
    if (nearestWall.wall && nearestWall.distance < 0.5) {
      // Вычисляем позицию на стене
      const wallLength = Math.sqrt(
        Math.pow(nearestWall.wall.x2 - nearestWall.wall.x1, 2) + 
        Math.pow(nearestWall.wall.y2 - nearestWall.wall.y1, 2)
      );
      
      // Находим ближайшую точку на стене
      const A = x - nearestWall.wall.x1;
      const B = y - nearestWall.wall.y1;
      const C = nearestWall.wall.x2 - nearestWall.wall.x1;
      const D = nearestWall.wall.y2 - nearestWall.wall.y1;
      const dot = A * C + B * D;
      const lenSq = C * C + D * D;
      const param = Math.max(0, Math.min(1, dot / lenSq));
      
      const openingType = OPENING_TYPES.find(t => t.id === selectedOpeningType);
      const newOpening = {
        id: Date.now(),
        wallId: nearestWall.wall.id,
        type: selectedOpeningType,
        position: param * wallLength,
        width: openingType?.width || 0.9,
        height: openingType?.height || 2.1
      };
      
      updateData({
        openings: [...(data.openings || []), newOpening]
      });
    }
  };

  const addRoom = (x, y) => {
    // Привязка к сетке
    const snappedX = snapToGrid(x);
    const snappedY = snapToGrid(y);
    
    const newRoom = {
      id: Date.now(),
      x: snappedX,
      y: snappedY,
      width: 3,
      height: 3,
      name: ROOM_TYPES[0]
    };
    
    updateData({
      rooms: [...(data.rooms || []), newRoom]
    });
  };

  const selectWall = (x, y) => {
    const clickedWall = (data.walls || []).find(wall => {
      const distance = distanceToLine(x, y, wall.x1, wall.y1, wall.x2, wall.y2);
      return distance < 0.5;
    });
    
    setSelectedWallId(clickedWall ? clickedWall.id : null);
    setSelectedRoomId(null);
    setSelectedOpeningId(null);
    return clickedWall;
  };

  const selectRoom = (x, y) => {
    const clickedRoom = (data.rooms || []).find(room => {
      return x >= room.x && x <= room.x + room.width &&
             y >= room.y && y <= room.y + room.height;
    });
    
    setSelectedRoomId(clickedRoom ? clickedRoom.id : null);
    setSelectedWallId(null);
    setSelectedOpeningId(null);
    return clickedRoom;
  };

  const selectOpening = (x, y) => {
    const clickedOpening = (data.openings || []).find(opening => {
      const wall = data.walls?.find(w => w.id === opening.wallId);
      if (!wall) return false;
      
      const wallLength = Math.sqrt(
        Math.pow(wall.x2 - wall.x1, 2) + Math.pow(wall.y2 - wall.y1, 2)
      );
      const ratio = opening.position / wallLength;
      
      const openingX = wall.x1 + (wall.x2 - wall.x1) * ratio;
      const openingY = wall.y1 + (wall.y2 - wall.y1) * ratio;
      
      const distance = Math.sqrt(
        Math.pow(x - openingX, 2) + Math.pow(y - openingY, 2)
      );
      
      return distance < 0.3; // Радиус клика по проему
    });
    
    setSelectedOpeningId(clickedOpening ? clickedOpening.id : null);
    setSelectedWallId(null);
    setSelectedRoomId(null);
    return clickedOpening;
  };

  const calculateTotalHouseArea = () => {
    if (!data.modules || data.modules.length === 0) return 0;
    return data.modules.reduce((total, module) => {
      return total + (module.width * module.height);
    }, 0);
  };

  const calculateUsedArea = () => {
    if (!data.rooms || data.rooms.length === 0) return 0;
    return data.rooms.reduce((total, room) => {
      return total + (room.width * room.height);
    }, 0);
  };

  const calculateRemainingArea = () => {
    return calculateTotalHouseArea() - calculateUsedArea();
  };

  const updateRoomName = (roomId, newName) => {
    const updatedRooms = (data.rooms || []).map(room => {
      if (room.id === roomId) {
        return { ...room, name: newName };
      }
      return room;
    });
    updateData({ rooms: updatedRooms });
  };

  const updateRoomSize = (roomId, width, height) => {
    const updatedRooms = (data.rooms || []).map(room => {
      if (room.id === roomId) {
        return { ...room, width: Math.max(1, width), height: Math.max(1, height) };
      }
      return room;
    });
    updateData({ rooms: updatedRooms });
  };

  const deleteRoom = (roomId) => {
    const updatedRooms = (data.rooms || []).filter(room => room.id !== roomId);
    updateData({ rooms: updatedRooms });
    setSelectedRoomId(null);
  };

  const rotateSelectedWall = (direction) => {
    if (!selectedWallId) return;
    
    const updatedWalls = (data.walls || []).map(wall => {
      if (wall.id === selectedWallId) {
        const newAngle = (wall.angle || 0) + (direction * 90); // Поворот на 90 градусов
        const length = Math.sqrt(
          Math.pow(wall.x2 - wall.x1, 2) + Math.pow(wall.y2 - wall.y1, 2)
        );
        const angleRad = (newAngle * Math.PI) / 180;
        
        return {
          ...wall,
          x2: wall.x1 + length * Math.cos(angleRad),
          y2: wall.y1 + length * Math.sin(angleRad),
          angle: newAngle
        };
      }
      return wall;
    });
    
    updateData({ walls: updatedWalls });
  };
  
  const startDragWall = (wallId, startX, startY) => {
    setDraggedElement({ type: 'wall', id: wallId, startX, startY });
  };
  
  const dragWall = (currentX, currentY) => {
    if (!draggedElement || draggedElement.type !== 'wall') return;
    
    const deltaX = (currentX - draggedElement.startX) / SCALE;
    const deltaY = (currentY - draggedElement.startY) / SCALE;
    
    const updatedWalls = (data.walls || []).map(wall => {
      if (wall.id === draggedElement.id) {
        return {
          ...wall,
          x1: wall.x1 + deltaX,
          y1: wall.y1 + deltaY,
          x2: wall.x2 + deltaX,
          y2: wall.y2 + deltaY
        };
      }
      return wall;
    });
    
    updateData({ walls: updatedWalls });
    setDraggedElement({ ...draggedElement, startX: currentX, startY: currentY });
  };
  
  const endDragElement = () => {
    setDraggedElement(null);
  };

  const startDragOpening = (openingId, startX, startY) => {
    setDraggedElement({ type: 'opening', id: openingId, startX, startY });
  };

  const dragOpening = (currentX, currentY) => {
    if (!draggedElement || draggedElement.type !== 'opening') return;
    
    const opening = (data.openings || []).find(o => o.id === draggedElement.id);
    const wall = (data.walls || []).find(w => w.id === opening?.wallId);
    if (!opening || !wall) return;
    
    // Преобразуем координаты мыши в координаты мира
    const worldX = (currentX - 100) / SCALE;
    const worldY = (currentY - 100) / SCALE;
    
    // Находим ближайшую точку на стене
    const A = worldX - wall.x1;
    const B = worldY - wall.y1;
    const C = wall.x2 - wall.x1;
    const D = wall.y2 - wall.y1;
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    
    if (lenSq === 0) return;
    
    const param = Math.max(0, Math.min(1, dot / lenSq));
    const wallLength = Math.sqrt(lenSq);
    const newPosition = param * wallLength;
    
    // Проверяем, чтобы проем не выходил за границы стены
    const openingType = OPENING_TYPES.find(t => t.id === opening.type);
    const halfWidth = (openingType?.width || 0.9) / 2;
    const minPosition = halfWidth;
    const maxPosition = wallLength - halfWidth;
    
    const clampedPosition = Math.max(minPosition, Math.min(maxPosition, newPosition));
    
    const updatedOpenings = (data.openings || []).map(o => {
      if (o.id === draggedElement.id) {
        return { ...o, position: clampedPosition };
      }
      return o;
    });
    
    updateData({ openings: updatedOpenings });
  };

  const deleteOpening = (openingId) => {
    const updatedOpenings = (data.openings || []).filter(opening => opening.id !== openingId);
    updateData({ openings: updatedOpenings });
    setSelectedOpeningId(null);
  };

  const updateOpeningType = (openingId, newType) => {
    const openingType = OPENING_TYPES.find(t => t.id === newType);
    const updatedOpenings = (data.openings || []).map(opening => {
      if (opening.id === openingId) {
        return { 
          ...opening, 
          type: newType,
          width: openingType?.width || opening.width,
          height: openingType?.height || opening.height
        };
      }
      return opening;
    });
    updateData({ openings: updatedOpenings });
  };

  const updateWallLength = (newLength) => {
    if (!selectedWallId) return;
    
    const updatedWalls = (data.walls || []).map(wall => {
      if (wall.id === selectedWallId) {
        const angle = Math.atan2(wall.y2 - wall.y1, wall.x2 - wall.x1);
        return {
          ...wall,
          x2: wall.x1 + newLength * Math.cos(angle),
          y2: wall.y1 + newLength * Math.sin(angle),
          length: newLength
        };
      }
      return wall;
    });
    
    updateData({ walls: updatedWalls });
  };

  const deleteWall = (wallId) => {
    const updatedWalls = (data.walls || []).filter(wall => wall.id !== wallId);
    const updatedOpenings = (data.openings || []).filter(opening => opening.wallId !== wallId);
    
    updateData({ 
      walls: updatedWalls,
      openings: updatedOpenings
    });
    
    setSelectedWallId(null);
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

  return (
    <div className="enhanced-floor-planning">
      <div className="controls">
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

        <div className="tools">
          <h3>Инструменты</h3>
          {[
            { id: 'select', name: 'Выбор' },
            { id: 'wall', name: 'Стена' },
            { id: 'opening', name: 'Проем' },
            { id: 'room', name: 'Комната' }
          ].map(tool => (
            <button 
              key={tool.id}
              className={selectedTool === tool.id ? 'active' : ''}
              onClick={() => setSelectedTool(tool.id)}
            >
              {tool.name}
            </button>
          ))}
        </div>

        {selectedTool === 'wall' && (
          <div className="wall-settings">
            <h4>Настройки стены</h4>
            <select 
              value={selectedWallType}
              onChange={(e) => setSelectedWallType(e.target.value)}
            >
              {WALL_TYPES.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            <div className="input-group">
              <label>Длина (м):</label>
              <input 
                type="number" 
                value={wallLength}
                onChange={(e) => setWallLength(Number(e.target.value))}
                min="0.5" max="10" step="0.1"
              />
            </div>
            <div className="input-group">
              <label>Угол (°):</label>
              <input 
                type="number" 
                value={wallAngle}
                onChange={(e) => setWallAngle(Number(e.target.value))}
                min="0" max="360" step="15"
              />
            </div>
          </div>
        )}

        {selectedTool === 'opening' && (
          <div className="opening-settings">
            <h4>Настройки проема</h4>
            <select 
              value={selectedOpeningType}
              onChange={(e) => setSelectedOpeningType(e.target.value)}
            >
              {OPENING_TYPES.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedWallId && (
          <div className="wall-edit">
            <h4>Редактирование стены</h4>
            <div className="rotation-controls">
              <button onClick={() => rotateSelectedWall(-1)}>↺ -90°</button>
              <button onClick={() => rotateSelectedWall(1)}>↻ +90°</button>
            </div>
            <div className="input-group">
              <label>Длина:</label>
              <input 
                type="number" 
                value={(data.walls || []).find(w => w.id === selectedWallId)?.length || 0}
                onChange={(e) => updateWallLength(Number(e.target.value))}
                min="0.5" max="10" step="0.1"
              />
            </div>
            <button 
              className="delete-btn"
              onClick={() => deleteWall(selectedWallId)}
            >
              Удалить стену
            </button>
          </div>
        )}

        {selectedRoomId && (
          <div className="room-edit">
            <h4>Редактирование комнаты</h4>
            <div className="input-group">
              <label>Название:</label>
              <select 
                value={(data.rooms || []).find(r => r.id === selectedRoomId)?.name || ''}
                onChange={(e) => updateRoomName(selectedRoomId, e.target.value)}
              >
                {ROOM_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Ширина (м):</label>
              <input 
                type="number" 
                value={(data.rooms || []).find(r => r.id === selectedRoomId)?.width || 0}
                onChange={(e) => {
                  const room = (data.rooms || []).find(r => r.id === selectedRoomId);
                  if (room) updateRoomSize(selectedRoomId, Number(e.target.value), room.height);
                }}
                min="1" max="20" step="0.1"
              />
            </div>
            <div className="input-group">
              <label>Высота (м):</label>
              <input 
                type="number" 
                value={(data.rooms || []).find(r => r.id === selectedRoomId)?.height || 0}
                onChange={(e) => {
                  const room = (data.rooms || []).find(r => r.id === selectedRoomId);
                  if (room) updateRoomSize(selectedRoomId, room.width, Number(e.target.value));
                }}
                min="1" max="20" step="0.1"
              />
            </div>
            <div className="area-info">
              <p>Площадь: {((data.rooms || []).find(r => r.id === selectedRoomId)?.width * (data.rooms || []).find(r => r.id === selectedRoomId)?.height || 0).toFixed(1)} м²</p>
            </div>
            <button 
              className="delete-btn"
              onClick={() => deleteRoom(selectedRoomId)}
            >
              Удалить комнату
            </button>
          </div>
        )}

        {selectedOpeningId && (
          <div className="opening-edit">
            <h4>Редактирование проема</h4>
            <div className="input-group">
              <label>Тип:</label>
              <select 
                value={(data.openings || []).find(o => o.id === selectedOpeningId)?.type || ''}
                onChange={(e) => updateOpeningType(selectedOpeningId, e.target.value)}
              >
                {OPENING_TYPES.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            <div className="opening-info">
              {(() => {
                const opening = (data.openings || []).find(o => o.id === selectedOpeningId);
                const openingType = OPENING_TYPES.find(t => t.id === opening?.type);
                return openingType ? (
                  <div>
                    <p>Размер: {openingType.width}м × {openingType.height}м</p>
                    <p>Позиция на стене: {opening?.position?.toFixed(2)}м</p>
                  </div>
                ) : null;
              })()}
            </div>
            <div className="help-text">
              <small>Перетащите проем вдоль стены для изменения позиции</small>
            </div>
            <button 
              className="delete-btn"
              onClick={() => deleteOpening(selectedOpeningId)}
            >
              Удалить проем
            </button>
          </div>
        )}

        {view3D && (
          <div className="view3d-controls">
            <h4>3D Управление</h4>
            <div className="input-group">
              <label>Масштаб:</label>
              <input 
                type="range" 
                min="0.5" max="2" step="0.1"
                value={zoom3D}
                onChange={(e) => setZoom3D(Number(e.target.value))}
              />
            </div>
            <button onClick={() => setRotation({ x: -0.3, y: 0.5 })}>
              Сброс вида
            </button>
          </div>
        )}

        <div className="display-options">
          <label>
            <input 
              type="checkbox" 
              checked={showDimensions}
              onChange={(e) => setShowDimensions(e.target.checked)}
            />
            Показать размеры
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={showAreaInfo}
              onChange={(e) => setShowAreaInfo(e.target.checked)}
            />
            Показать площади
          </label>
        </div>

        {showAreaInfo && (
          <div className="area-summary">
            <h4>Площади</h4>
            <div className="area-item">
              <span>Общая площадь дома:</span>
              <strong>{calculateTotalHouseArea().toFixed(1)} м²</strong>
            </div>
            <div className="area-item">
              <span>Использовано:</span>
              <strong>{calculateUsedArea().toFixed(1)} м²</strong>
            </div>
            <div className="area-item remaining">
              <span>Остается:</span>
              <strong>{calculateRemainingArea().toFixed(1)} м²</strong>
            </div>
          </div>
        )}

        <div className="navigation">
          <button onClick={onPrev} className="prev-btn">Назад</button>
          <button onClick={onNext} className="next-btn">Далее</button>
        </div>
      </div>

      <div className="canvas-area">
        {view3D && (
          <div className="help-text">
            Перетаскивайте для поворота • Колесо мыши для масштаба
          </div>
        )}
        <canvas 
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          onWheel={(e) => {
            if (view3D) {
              e.preventDefault();
              const delta = e.deltaY > 0 ? 0.9 : 1.1;
              setZoom3D(prev => Math.max(0.3, Math.min(5, prev * delta)));
            }
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => {
            setIsDragging(false);
            setTouchDistance(null);
            endDragElement();
          }}
        />
      </div>

      <style jsx>{`
        .enhanced-floor-planning {
          display: flex;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .controls {
          width: 25%;
          min-width: 300px;
          max-width: 380px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          padding: 20px;
          background: white;
          border-right: 1px solid #e0e0e0;
          overflow-y: auto;
        }
        .view-toggle {
          display: flex;
          background: #f0f0f0;
          border-radius: 8px;
          overflow: hidden;
        }
        .view-toggle button {
          flex: 1;
          padding: 12px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-weight: bold;
        }
        .view-toggle button.active {
          background: #2196f3;
          color: white;
        }
        .tools, .wall-settings, .wall-edit, .view3d-controls, .display-options, .opening-settings, .room-edit, .opening-edit, .area-summary {
          background: #f5f5f5;
          padding: 15px;
          border-radius: 8px;
        }
        .tools button {
          display: block;
          width: 100%;
          margin-bottom: 8px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
        }
        .tools button.active {
          background: #2196f3;
          color: white;
        }
        .input-group {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 10px 0;
        }
        .input-group input, select {
          width: 100px;
          padding: 6px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .rotation-controls {
          display: flex;
          gap: 10px;
          margin: 10px 0;
        }
        .rotation-controls button {
          flex: 1;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
        }
        .delete-btn {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 4px;
          background: #f44336;
          color: white;
          cursor: pointer;
          margin-top: 10px;
          font-weight: bold;
        }
        .delete-btn:hover {
          background: #d32f2f;
        }
        .area-summary {
          background: #e8f5e8;
        }
        .area-item {
          display: flex;
          justify-content: space-between;
          margin: 8px 0;
          padding: 5px 0;
        }
        .area-item.remaining {
          border-top: 1px solid #ccc;
          padding-top: 10px;
          margin-top: 10px;
          font-weight: bold;
        }
        .area-info, .opening-info {
          background: #f0f8ff;
          padding: 8px;
          border-radius: 4px;
          margin: 10px 0;
          text-align: center;
        }
        .opening-edit .help-text {
          background: #fff3cd;
          padding: 8px;
          border-radius: 4px;
          margin: 10px 0;
          font-size: 12px;
          color: #856404;
        }
        .canvas-area {
          flex: 1;
          overflow: hidden;
          position: relative;
          background: #f8f9fa;
        }
        .help-text {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 12px;
          z-index: 1;
        }
        canvas {
          cursor: ${view3D ? (isDragging ? 'grabbing' : 'grab') : 
                    selectedTool === 'select' ? 'pointer' : 'crosshair'};
          display: block;
          width: 100%;
          height: 100%;
          background: white;
          touch-action: none;
        }
        .navigation {
          display: flex;
          gap: 10px;
        }
        .prev-btn, .next-btn {
          flex: 1;
          padding: 15px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
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
          .enhanced-floor-planning {
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
        }
        
        @media (max-width: 480px) {
          .controls {
            padding: 10px;
            gap: 10px;
            height: 45%;
          }
          .tools button {
            padding: 8px;
            font-size: 12px;
          }
          .input-group {
            flex-direction: column;
            align-items: stretch;
            gap: 5px;
          }
          .input-group input, select {
            width: 100%;
          }
          .rotation-controls button {
            padding: 6px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}