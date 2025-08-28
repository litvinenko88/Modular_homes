'use client';

import { useState, useRef, useEffect } from 'react';

const ROOM_TYPES = [
  { id: 'living_room', name: 'Гостиная', color: '#e3f2fd' },
  { id: 'bedroom', name: 'Спальня', color: '#f3e5f5' },
  { id: 'kitchen', name: 'Кухня', color: '#e8f5e8' },
  { id: 'bathroom', name: 'Санузел', color: '#fff3e0' },
  { id: 'hallway', name: 'Прихожая', color: '#fce4ec' }
];

export default function FloorPlanning({ data, updateData, onNext, onPrev }) {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState('select');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);

  const SCALE = 20;

  useEffect(() => {
    const timer = setTimeout(drawCanvas, 10);
    return () => clearTimeout(timer);
  }, [data.walls, data.rooms, data.openings]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем внешний контур дома
    drawHouseOutline(ctx);
    
    // Рисуем комнаты
    data.rooms.forEach(room => {
      const roomType = ROOM_TYPES.find(t => t.id === room.type);
      if (roomType) {
        ctx.fillStyle = roomType.color;
        ctx.fillRect(
          50 + room.x * SCALE,
          50 + room.y * SCALE,
          room.width * SCALE,
          room.height * SCALE
        );
        
        // Подпись комнаты
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          roomType.name,
          50 + (room.x + room.width/2) * SCALE,
          50 + (room.y + room.height/2) * SCALE
        );
      }
    });
    
    // Рисуем стены
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    data.walls.forEach(wall => {
      ctx.beginPath();
      ctx.moveTo(50 + wall.x1 * SCALE, 50 + wall.y1 * SCALE);
      ctx.lineTo(50 + wall.x2 * SCALE, 50 + wall.y2 * SCALE);
      ctx.stroke();
    });
    
    // Рисуем проемы
    data.openings.forEach(opening => {
      const wall = data.walls.find(w => w.id === opening.wallId);
      if (wall) {
        ctx.strokeStyle = opening.type === 'door' ? '#4caf50' : '#2196f3';
        ctx.lineWidth = 5;
        ctx.beginPath();
        
        const wallLength = Math.sqrt(
          Math.pow(wall.x2 - wall.x1, 2) + Math.pow(wall.y2 - wall.y1, 2)
        );
        const ratio = opening.position / wallLength;
        
        const openingX = wall.x1 + (wall.x2 - wall.x1) * ratio;
        const openingY = wall.y1 + (wall.y2 - wall.y1) * ratio;
        
        ctx.moveTo(50 + openingX * SCALE, 50 + openingY * SCALE);
        ctx.lineTo(50 + (openingX + 0.5) * SCALE, 50 + (openingY + 0.5) * SCALE);
        ctx.stroke();
      }
    });
  };

  const drawHouseOutline = (ctx) => {
    if (data.modules.length === 0) return;
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    
    data.modules.forEach(module => {
      ctx.strokeRect(
        50 + module.x * SCALE,
        50 + module.y * SCALE,
        module.width * SCALE,
        module.height * SCALE
      );
    });
  };

  const handleCanvasMouseDown = (e) => {
    if (tool !== 'wall') return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - 50) / SCALE;
    const y = (e.clientY - rect.top - 50) / SCALE;
    
    setIsDrawing(true);
    setStartPoint({ x, y });
  };

  const handleCanvasMouseUp = (e) => {
    if (!isDrawing || tool !== 'wall') return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - 50) / SCALE;
    const y = (e.clientY - rect.top - 50) / SCALE;
    
    if (startPoint) {
      const newWall = {
        id: Date.now(),
        x1: startPoint.x,
        y1: startPoint.y,
        x2: x,
        y2: y,
        type: 'interior'
      };
      
      updateData({
        walls: [...data.walls, newWall]
      });
    }
    
    setIsDrawing(false);
    setStartPoint(null);
  };

  const handleCanvasClick = (e) => {
    if (tool !== 'select') return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - 50) / SCALE;
    const y = (e.clientY - rect.top - 50) / SCALE;
    
    // Находим комнату по клику
    const clickedRoom = data.rooms.find(room =>
      x >= room.x && x <= room.x + room.width &&
      y >= room.y && y <= room.y + room.height
    );
    
    setSelectedRoom(clickedRoom);
  };

  const addRoom = () => {
    const newRoom = {
      id: Date.now(),
      x: 2,
      y: 2,
      width: 4,
      height: 3,
      type: 'living_room',
      name: 'Новая комната'
    };
    
    updateData({
      rooms: [...data.rooms, newRoom]
    });
  };

  const updateRoomType = (roomType) => {
    if (selectedRoom) {
      updateData({
        rooms: data.rooms.map(room =>
          room.id === selectedRoom.id
            ? { ...room, type: roomType }
            : room
        )
      });
      setSelectedRoom({ ...selectedRoom, type: roomType });
    }
  };

  return (
    <div className="floor-planning">
      <div className="controls">
        <div className="tools">
          <h3>Инструменты</h3>
          <button 
            className={tool === 'select' ? 'active' : ''}
            onClick={() => setTool('select')}
          >
            Выбрать
          </button>
          <button 
            className={tool === 'wall' ? 'active' : ''}
            onClick={() => setTool('wall')}
          >
            Стена
          </button>
          <button onClick={addRoom}>
            Добавить комнату
          </button>
        </div>

        {selectedRoom && (
          <div className="room-properties">
            <h3>Свойства комнаты</h3>
            <div className="room-types">
              {ROOM_TYPES.map(roomType => (
                <button
                  key={roomType.id}
                  className={selectedRoom.type === roomType.id ? 'active' : ''}
                  onClick={() => updateRoomType(roomType.id)}
                  style={{ backgroundColor: roomType.color }}
                >
                  {roomType.name}
                </button>
              ))}
            </div>
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
        <canvas 
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={handleCanvasMouseDown}
          onMouseUp={handleCanvasMouseUp}
          onClick={handleCanvasClick}
        />
      </div>

      <style jsx>{`
        .floor-planning {
          display: flex;
          gap: 20px;
          height: 600px;
        }
        .controls {
          width: 300px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .tools, .room-properties {
          background: #f5f5f5;
          padding: 15px;
          border-radius: 8px;
        }
        .tools button, .room-types button {
          display: block;
          width: 100%;
          margin-bottom: 10px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
        }
        .tools button.active, .room-types button.active {
          background: #2196f3;
          color: white;
        }
        .room-types button {
          border: 2px solid #333;
        }
        .canvas-area {
          flex: 1;
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
        }
        canvas {
          cursor: crosshair;
          background: white;
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
      `}</style>
    </div>
  );
}