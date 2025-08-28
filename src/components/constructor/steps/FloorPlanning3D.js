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

export default function FloorPlanning3D({ data, updateData, onNext, onPrev }) {
  const canvasRef = useRef(null);
  const [view3D, setView3D] = useState(false);
  const [selectedTool, setSelectedTool] = useState('wall');
  const [selectedWallType, setSelectedWallType] = useState('interior');
  const [selectedOpeningType, setSelectedOpeningType] = useState('door');
  const [wallLength, setWallLength] = useState(3);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

  const SCALE = view3D ? 15 : 20;
  const WALL_HEIGHT = 2.7; // метры

  useEffect(() => {
    const timer = setTimeout(drawCanvas, 10);
    return () => clearTimeout(timer);
  }, [data.walls, data.openings, view3D, rotation]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (view3D) {
      draw3D(ctx);
    } else {
      draw2D(ctx);
    }
  };

  const draw2D = (ctx) => {
    // Рисуем контур дома
    drawHouseOutline(ctx);
    
    // Рисуем стены
    data.walls.forEach(wall => {
      const wallType = WALL_TYPES.find(t => t.id === wall.type);
      ctx.strokeStyle = wallType?.color || '#333';
      ctx.lineWidth = wallType?.thickness * SCALE || 3;
      
      ctx.beginPath();
      ctx.moveTo(100 + wall.x1 * SCALE, 100 + wall.y1 * SCALE);
      ctx.lineTo(100 + wall.x2 * SCALE, 100 + wall.y2 * SCALE);
      ctx.stroke();
    });
    
    // Рисуем проемы
    data.openings.forEach(opening => {
      const wall = data.walls.find(w => w.id === opening.wallId);
      const openingType = OPENING_TYPES.find(t => t.id === opening.type);
      if (wall && openingType) {
        drawOpening2D(ctx, wall, opening, openingType);
      }
    });
  };

  const draw3D = (ctx) => {
    ctx.save();
    ctx.translate(400, 300);
    
    // Применяем поворот
    const cosY = Math.cos(rotation.y);
    const sinY = Math.sin(rotation.y);
    const cosX = Math.cos(rotation.x);
    const sinX = Math.sin(rotation.x);
    
    // Рисуем пол
    drawFloor3D(ctx, cosY, sinY, cosX, sinX);
    
    // Рисуем стены в 3D
    data.walls.forEach(wall => {
      drawWall3D(ctx, wall, cosY, sinY, cosX, sinX);
    });
    
    // Рисуем проемы в 3D
    data.openings.forEach(opening => {
      const wall = data.walls.find(w => w.id === opening.wallId);
      if (wall) {
        drawOpening3D(ctx, wall, opening, cosY, sinY, cosX, sinX);
      }
    });
    
    ctx.restore();
  };

  const drawFloor3D = (ctx, cosY, sinY, cosX, sinX) => {
    if (data.modules.length === 0) return;
    
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

  const drawWall3D = (ctx, wall, cosY, sinY, cosX, sinX) => {
    const wallType = WALL_TYPES.find(t => t.id === wall.type);
    ctx.fillStyle = wallType?.color || '#8B4513';
    ctx.strokeStyle = '#654321';
    
    // Углы стены (низ и верх)
    const bottomStart = project3D(wall.x1, 0, wall.y1, cosY, sinY, cosX, sinX);
    const bottomEnd = project3D(wall.x2, 0, wall.y2, cosY, sinY, cosX, sinX);
    const topStart = project3D(wall.x1, WALL_HEIGHT, wall.y1, cosY, sinY, cosX, sinX);
    const topEnd = project3D(wall.x2, WALL_HEIGHT, wall.y2, cosY, sinY, cosX, sinX);
    
    // Рисуем стену как четырехугольник
    ctx.beginPath();
    ctx.moveTo(bottomStart.x, bottomStart.y);
    ctx.lineTo(bottomEnd.x, bottomEnd.y);
    ctx.lineTo(topEnd.x, topEnd.y);
    ctx.lineTo(topStart.x, topStart.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  const drawOpening3D = (ctx, wall, opening, cosY, sinY, cosX, sinX) => {
    const openingType = OPENING_TYPES.find(t => t.id === opening.type);
    if (!openingType) return;
    
    // Вычисляем позицию проема на стене
    const wallLength = Math.sqrt(
      Math.pow(wall.x2 - wall.x1, 2) + Math.pow(wall.y2 - wall.y1, 2)
    );
    const ratio = opening.position / wallLength;
    
    const openingX = wall.x1 + (wall.x2 - wall.x1) * ratio;
    const openingZ = wall.y1 + (wall.y2 - wall.y1) * ratio;
    
    ctx.fillStyle = opening.type === 'window' ? '#87CEEB' : '#8B4513';
    
    // Рисуем проем
    const openingBottom = project3D(openingX, 0, openingZ, cosY, sinY, cosX, sinX);
    const openingTop = project3D(openingX, openingType.height, openingZ, cosY, sinY, cosX, sinX);
    
    ctx.beginPath();
    ctx.arc(openingBottom.x, openingBottom.y, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(openingTop.x, openingTop.y, 5, 0, Math.PI * 2);
    ctx.fill();
  };

  const project3D = (x, y, z, cosY, sinY, cosX, sinX) => {
    // Простая изометрическая проекция
    const rotatedX = x * cosY - z * sinY;
    const rotatedZ = x * sinY + z * cosY;
    const rotatedY = y * cosX - rotatedZ * sinX;
    
    return {
      x: rotatedX * SCALE,
      y: rotatedY * SCALE - rotatedZ * SCALE * 0.5
    };
  };

  const drawHouseOutline = (ctx) => {
    if (data.modules.length === 0) return;
    
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

  const drawOpening2D = (ctx, wall, opening, openingType) => {
    const wallLength = Math.sqrt(
      Math.pow(wall.x2 - wall.x1, 2) + Math.pow(wall.y2 - wall.y1, 2)
    );
    const ratio = opening.position / wallLength;
    
    const openingX = wall.x1 + (wall.x2 - wall.x1) * ratio;
    const openingY = wall.y1 + (wall.y2 - wall.y1) * ratio;
    
    ctx.fillStyle = openingType.color;
    ctx.beginPath();
    ctx.arc(100 + openingX * SCALE, 100 + openingY * SCALE, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Подпись
    ctx.fillStyle = '#333';
    ctx.font = '10px Arial';
    ctx.fillText(
      openingType.name,
      100 + openingX * SCALE + 10,
      100 + openingY * SCALE
    );
  };

  const handleCanvasMouseDown = (e) => {
    if (view3D) {
      setIsDragging(true);
      const rect = canvasRef.current.getBoundingClientRect();
      setLastMouse({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      return;
    }

    if (selectedTool === 'wall') {
      addWall(e);
    } else if (selectedTool === 'opening') {
      addOpening(e);
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (!isDragging || !view3D) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const deltaX = mouseX - lastMouse.x;
    const deltaY = mouseY - lastMouse.y;
    
    setRotation(prev => ({
      x: prev.x + deltaY * 0.01,
      y: prev.y + deltaX * 0.01
    }));
    
    setLastMouse({ x: mouseX, y: mouseY });
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  const addWall = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - 100) / SCALE;
    const y = (e.clientY - rect.top - 100) / SCALE;
    
    // Добавляем стену заданной длины горизонтально
    const newWall = {
      id: Date.now(),
      x1: x,
      y1: y,
      x2: x + wallLength,
      y2: y,
      type: selectedWallType,
      length: wallLength
    };
    
    updateData({
      walls: [...data.walls, newWall]
    });
  };

  const addOpening = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - 100) / SCALE;
    const y = (e.clientY - rect.top - 100) / SCALE;
    
    // Находим ближайшую стену
    const nearestWall = data.walls.reduce((nearest, wall) => {
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
        position: 1, // позиция на стене
        width: OPENING_TYPES.find(t => t.id === selectedOpeningType)?.width || 0.9
      };
      
      updateData({
        openings: [...data.openings, newOpening]
      });
    }
  };

  const distanceToLine = (px, py, x1, y1, x2, y2) => {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    
    if (lenSq === 0) return Math.sqrt(A * A + B * B);
    
    const param = dot / lenSq;
    
    let xx, yy;
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
    
    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  return (
    <div className="floor-planning-3d">
      <div className="controls">
        <div className="view-toggle">
          <button 
            className={!view3D ? 'active' : ''}
            onClick={() => setView3D(false)}
          >
            2D
          </button>
          <button 
            className={view3D ? 'active' : ''}
            onClick={() => setView3D(true)}
          >
            3D
          </button>
        </div>

        <div className="tools">
          <h3>Инструменты</h3>
          <button 
            className={selectedTool === 'wall' ? 'active' : ''}
            onClick={() => setSelectedTool('wall')}
          >
            Стена
          </button>
          <button 
            className={selectedTool === 'opening' ? 'active' : ''}
            onClick={() => setSelectedTool('opening')}
          >
            Проем
          </button>
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
                min="0.5"
                max="10"
                step="0.1"
              />
            </div>
          </div>
        )}

        {selectedTool === 'opening' && (
          <div className="opening-settings">
            <h4>Тип проема</h4>
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

        <div className="navigation">
          <button onClick={onPrev} className="prev-btn">
            Назад
          </button>
          <button onClick={onNext} className="next-btn">
            Далее
          </button>
        </div>
      </div>

      <div className="canvas-area">
        {view3D && (
          <div className="help-text">
            Перетаскивайте мышью для поворота 3D модели
          </div>
        )}
        <canvas 
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
        />
      </div>

      <style jsx>{`
        .floor-planning-3d {
          display: flex;
          gap: 20px;
          height: 600px;
        }
        .controls {
          width: 300px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .view-toggle {
          display: flex;
          background: #f0f0f0;
          border-radius: 8px;
          overflow: hidden;
        }
        .view-toggle button {
          flex: 1;
          padding: 10px;
          border: none;
          background: transparent;
          cursor: pointer;
        }
        .view-toggle button.active {
          background: #2196f3;
          color: white;
        }
        .tools, .wall-settings, .opening-settings {
          background: #f5f5f5;
          padding: 15px;
          border-radius: 8px;
        }
        .tools button {
          display: block;
          width: 100%;
          margin-bottom: 10px;
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
          padding: 5px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .canvas-area {
          flex: 1;
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
        }
        .help-text {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 12px;
          z-index: 1;
        }
        canvas {
          cursor: ${view3D ? 'grab' : 'crosshair'};
          background: white;
        }
        canvas:active {
          cursor: ${view3D ? 'grabbing' : 'crosshair'};
        }
        .navigation {
          display: flex;
          gap: 10px;
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
          .floor-planning-3d {
            flex-direction: column;
            height: auto;
          }
          .controls {
            width: 100%;
            order: 2;
          }
          .canvas-area {
            height: 400px;
            order: 1;
          }
          canvas {
            width: 100%;
            height: 100%;
          }
        }
      `}</style>
    </div>
  );
}