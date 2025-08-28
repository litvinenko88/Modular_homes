'use client';

import { useState, useRef, useEffect } from 'react';

const WALL_TYPES = [
  { id: 'exterior', name: 'Внешняя стена', thickness: 0.3, color: '#8B4513' },
  { id: 'interior', name: 'Перегородка', thickness: 0.15, color: '#D2B48C' },
  { id: 'load_bearing', name: 'Несущая стена', thickness: 0.25, color: '#A0522D' }
];

const OPENING_TYPES = [
  { id: 'door', name: 'Дверь', width: 0.9, height: 2.1, color: '#8B4513' },
  { id: 'window', name: 'Окно', width: 1.2, height: 1.4, color: '#87CEEB' }
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
  const [showDimensions, setShowDimensions] = useState(true);
  const [editingWall, setEditingWall] = useState(null);
  const [draggedElement, setDraggedElement] = useState(null);

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
  }, [data.walls, data.openings, data.rooms, view3D, rotation, zoom3D, selectedWallId, showDimensions, canvasSize]);

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
    const gridSize = Math.max(10, SCALE / 4);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Мелкая сетка
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 0.5;
    
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
    
    // Крупная сетка
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
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
      ctx.fillStyle = 'rgba(100, 200, 100, 0.1)';
      ctx.fillRect(
        100 + room.x * SCALE,
        100 + room.y * SCALE,
        room.width * SCALE,
        room.height * SCALE
      );
      
      ctx.strokeStyle = room.id === selectedRoomId ? '#4caf50' : '#90ee90';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(
        100 + room.x * SCALE,
        100 + room.y * SCALE,
        room.width * SCALE,
        room.height * SCALE
      );
      ctx.setLineDash([]);
      
      // Название комнаты
      ctx.fillStyle = '#2e7d32';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        room.name,
        100 + (room.x + room.width/2) * SCALE,
        100 + (room.y + room.height/2) * SCALE
      );
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
        
        ctx.fillStyle = openingType.color;
        ctx.beginPath();
        ctx.arc(100 + openingX * SCALE, 100 + openingY * SCALE, 10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#333';
        ctx.font = '10px Arial';
        ctx.fillText(
          openingType.name,
          100 + openingX * SCALE + 15,
          100 + openingY * SCALE
        );
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

    if (selectedTool === 'wall') {
      addWall(x, y);
    } else if (selectedTool === 'opening') {
      addOpening(x, y);
    } else if (selectedTool === 'room') {
      addRoom(x, y);
    } else if (selectedTool === 'select') {
      const clickedWall = selectWall(x, y);
      if (clickedWall) {
        startDragWall(clickedWall.id, clientX, clientY);
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
          const clickedWall = selectWall(x, y);
          if (clickedWall) {
            startDragWall(clickedWall.id, clientX, clientY);
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

  const addWall = (x, y) => {
    const angleRad = (wallAngle * Math.PI) / 180;
    const endX = x + wallLength * Math.cos(angleRad);
    const endY = y + wallLength * Math.sin(angleRad);
    
    const newWall = {
      id: Date.now(),
      x1: x,
      y1: y,
      x2: endX,
      y2: endY,
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
      const newOpening = {
        id: Date.now(),
        wallId: nearestWall.wall.id,
        type: selectedOpeningType,
        position: 1,
        width: OPENING_TYPES.find(t => t.id === selectedOpeningType)?.width || 0.9
      };
      
      updateData({
        openings: [...(data.openings || []), newOpening]
      });
    }
  };

  const addRoom = (x, y) => {
    const newRoom = {
      id: Date.now(),
      x: x,
      y: y,
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
      return distance < 0.3;
    });
    
    setSelectedWallId(clickedWall ? clickedWall.id : null);
    return clickedWall;
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
        </div>

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
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
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
        .tools, .wall-settings, .wall-edit, .view3d-controls, .display-options {
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
          cursor: ${view3D ? (isDragging ? 'grabbing' : 'grab') : 'crosshair'};
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