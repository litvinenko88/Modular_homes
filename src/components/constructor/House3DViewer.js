'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function House3DViewer({ 
  elements, 
  walls, 
  doors, 
  windows, 
  initialData,
  onClose 
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const frameRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    // Инициализация сцены
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Небесно-голубой фон
    sceneRef.current = scene;

    // Камера
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;

    // Рендерер
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Освещение
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    // Основной направленный свет (солнце)
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
    sunLight.position.set(50, 80, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 4096;
    sunLight.shadow.mapSize.height = 4096;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 500;
    sunLight.shadow.camera.left = -100;
    sunLight.shadow.camera.right = 100;
    sunLight.shadow.camera.top = 100;
    sunLight.shadow.camera.bottom = -100;
    scene.add(sunLight);
    
    // Дополнительный свет для подсветки теней
    const fillLight = new THREE.DirectionalLight(0x87CEEB, 0.3);
    fillLight.position.set(-30, 40, -30);
    scene.add(fillLight);

    // Земля и окружение
    const groundGeometry = new THREE.PlaneGeometry(300, 300);
    const groundMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x228B22,
      transparent: true,
      opacity: 0.8
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Дорожка к дому
    const pathGeometry = new THREE.PlaneGeometry(3, 20);
    const pathMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
    const path = new THREE.Mesh(pathGeometry, pathMaterial);
    path.rotation.x = -Math.PI / 2;
    path.position.set(0, 0.01, 25);
    path.receiveShadow = true;
    scene.add(path);
    
    // Несколько деревьев вокруг дома
    addTrees(scene);

    // Создание 3D модели дома
    create3DModel(scene);

    // Позиционирование камеры
    const houseElement = elements.find(el => el.type === 'house');
    if (houseElement) {
      const houseWidth = houseElement.realWidth * 10;
      const houseHeight = houseElement.realHeight * 10;
      const distance = Math.max(houseWidth, houseHeight) * 1.5;
      
      camera.position.set(distance, distance * 0.8, distance);
      camera.lookAt(0, 0, 0);
    }

    // Управление мышью
    let mouseDown = false;
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const onMouseDown = (event) => {
      mouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const onMouseUp = () => {
      mouseDown = false;
    };

    const onMouseMove = (event) => {
      if (!mouseDown) return;

      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;

      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.01;

      targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationX));

      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const onWheel = (event) => {
      event.preventDefault();
      const scale = event.deltaY > 0 ? 1.1 : 0.9;
      camera.position.multiplyScalar(scale);
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('wheel', onWheel);

    // Анимация
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      // Плавное вращение
      currentRotationX += (targetRotationX - currentRotationX) * 0.1;
      currentRotationY += (targetRotationY - currentRotationY) * 0.1;

      // Применяем вращение к камере
      const radius = camera.position.length();
      camera.position.x = radius * Math.sin(currentRotationY) * Math.cos(currentRotationX);
      camera.position.y = radius * Math.sin(currentRotationX);
      camera.position.z = radius * Math.cos(currentRotationY) * Math.cos(currentRotationX);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();
    setIsLoading(false);

    // Обработка изменения размера
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('wheel', onWheel);
      
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, [elements, walls, doors, windows]);

  const create3DModel = (scene) => {
    const houseElement = elements.find(el => el.type === 'house');
    if (!houseElement) return;

    // Масштаб: 1 метр = 10 единиц Three.js
    const scale = 10;
    const wallHeight = 3 * scale; // 3 метра высота стен
    const wallThickness = 0.2 * scale; // 20 см толщина стен

    // Создаем группу для дома
    const houseGroup = new THREE.Group();

    // Материалы с улучшенными свойствами
    const wallMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xF5F5DC,
      shininess: 10,
      specular: 0x111111
    }); // Бежевые стены
    
    const roofMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x8B0000,
      shininess: 30,
      specular: 0x222222
    }); // Темно-красная крыша
    
    const floorMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xDEB887,
      shininess: 5
    }); // Деревянный пол
    
    const doorMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x654321,
      shininess: 20,
      specular: 0x333333
    }); // Темно-коричневые двери
    
    const windowMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x87CEEB, 
      transparent: true, 
      opacity: 0.6,
      shininess: 100,
      specular: 0xffffff
    }); // Стеклянные окна
    
    const windowFrameMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xFFFFFF,
      shininess: 10
    }); // Белые рамы окон

    // Размеры дома в метрах, переведенные в единицы Three.js
    const houseWidth = houseElement.realWidth * scale;
    const houseDepth = houseElement.realHeight * scale;

    // Пол
    const floorGeometry = new THREE.BoxGeometry(houseWidth, 0.2 * scale, houseDepth);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = 0.1 * scale;
    floor.castShadow = true;
    floor.receiveShadow = true;
    houseGroup.add(floor);

    // Внешние стены дома
    createExteriorWalls(houseGroup, houseWidth, houseDepth, wallHeight, wallThickness, wallMaterial);

    // Внутренние стены
    createInteriorWalls(houseGroup, wallHeight, wallThickness, wallMaterial, scale);

    // Двери
    createDoors(houseGroup, wallHeight, doorMaterial, scale);

    // Окна
    createWindows(houseGroup, wallHeight, windowMaterial, windowFrameMaterial, scale);

    // Крыша
    createRoof(houseGroup, houseWidth, houseDepth, wallHeight, roofMaterial);
    
    // Дополнительные детали
    addHouseDetails(houseGroup, houseWidth, houseDepth, wallHeight, scale);

    scene.add(houseGroup);
  };

  const createExteriorWalls = (houseGroup, width, depth, height, thickness, material) => {
    // Передняя стена
    const frontWall = new THREE.BoxGeometry(width, height, thickness);
    const frontWallMesh = new THREE.Mesh(frontWall, material);
    frontWallMesh.position.set(0, height / 2, depth / 2);
    frontWallMesh.castShadow = true;
    houseGroup.add(frontWallMesh);

    // Задняя стена
    const backWall = new THREE.BoxGeometry(width, height, thickness);
    const backWallMesh = new THREE.Mesh(backWall, material);
    backWallMesh.position.set(0, height / 2, -depth / 2);
    backWallMesh.castShadow = true;
    houseGroup.add(backWallMesh);

    // Левая стена
    const leftWall = new THREE.BoxGeometry(thickness, height, depth);
    const leftWallMesh = new THREE.Mesh(leftWall, material);
    leftWallMesh.position.set(-width / 2, height / 2, 0);
    leftWallMesh.castShadow = true;
    houseGroup.add(leftWallMesh);

    // Правая стена
    const rightWall = new THREE.BoxGeometry(thickness, height, depth);
    const rightWallMesh = new THREE.Mesh(rightWall, material);
    rightWallMesh.position.set(width / 2, height / 2, 0);
    rightWallMesh.castShadow = true;
    houseGroup.add(rightWallMesh);
  };

  const createInteriorWalls = (houseGroup, wallHeight, wallThickness, material, scale) => {
    const houseElement = elements.find(el => el.type === 'house');
    if (!houseElement) return;

    // Центрируем координаты относительно дома
    const houseX = houseElement.x;
    const houseY = houseElement.y;
    const houseWidth = houseElement.width;
    const houseHeight = houseElement.height;

    walls.forEach(wall => {
      // Переводим координаты стены в локальные координаты дома
      const localX1 = (wall.x1 - houseX - houseWidth / 2) / 30 * scale;
      const localY1 = (wall.y1 - houseY - houseHeight / 2) / 30 * scale;
      const localX2 = (wall.x2 - houseX - houseWidth / 2) / 30 * scale;
      const localY2 = (wall.y2 - houseY - houseHeight / 2) / 30 * scale;

      const wallLength = Math.sqrt(
        Math.pow(localX2 - localX1, 2) + Math.pow(localY2 - localY1, 2)
      );

      if (wallLength < 0.1) return; // Игнорируем очень короткие стены

      const wallGeometry = new THREE.BoxGeometry(wallLength, wallHeight, wallThickness);
      const wallMesh = new THREE.Mesh(wallGeometry, material);

      // Позиция стены
      const centerX = (localX1 + localX2) / 2;
      const centerZ = -(localY1 + localY2) / 2; // Инвертируем Y для Three.js
      wallMesh.position.set(centerX, wallHeight / 2, centerZ);

      // Поворот стены
      const angle = Math.atan2(localY2 - localY1, localX2 - localX1);
      wallMesh.rotation.y = -angle; // Инвертируем угол

      wallMesh.castShadow = true;
      houseGroup.add(wallMesh);
    });
  };

  const createDoors = (houseGroup, wallHeight, material, scale) => {
    const houseElement = elements.find(el => el.type === 'house');
    if (!houseElement) return;

    doors.forEach(door => {
      const wall = walls.find(w => w.id === door.wallId) || getHouseBoundaryById(door.wallId);
      if (!wall) return;

      // Переводим координаты в локальные координаты дома
      const houseX = houseElement.x;
      const houseY = houseElement.y;
      const houseWidth = houseElement.width;
      const houseHeight = houseElement.height;

      const doorX = wall.x1 + (wall.x2 - wall.x1) * door.position;
      const doorY = wall.y1 + (wall.y2 - wall.y1) * door.position;

      const localX = (doorX - houseX - houseWidth / 2) / 30 * scale;
      const localZ = -(doorY - houseY - houseHeight / 2) / 30 * scale;

      const doorWidth = door.realWidth * scale;
      const doorHeight = 2.1 * scale; // Стандартная высота двери 2.1м

      const doorGeometry = new THREE.BoxGeometry(doorWidth, doorHeight, 0.05 * scale);
      const doorMesh = new THREE.Mesh(doorGeometry, material);

      doorMesh.position.set(localX, doorHeight / 2, localZ);

      // Поворот двери в соответствии со стеной
      const isHorizontal = Math.abs(wall.x2 - wall.x1) > Math.abs(wall.y2 - wall.y1);
      if (!isHorizontal) {
        doorMesh.rotation.y = Math.PI / 2;
      }

      doorMesh.castShadow = true;
      houseGroup.add(doorMesh);
    });
  };

  const createWindows = (houseGroup, wallHeight, glassMaterial, frameMaterial, scale) => {
    const houseElement = elements.find(el => el.type === 'house');
    if (!houseElement) return;

    windows.forEach(window => {
      const wall = walls.find(w => w.id === window.wallId) || getHouseBoundaryById(window.wallId);
      if (!wall) return;

      // Переводим координаты в локальные координаты дома
      const houseX = houseElement.x;
      const houseY = houseElement.y;
      const houseWidth = houseElement.width;
      const houseHeight = houseElement.height;

      const windowX = wall.x1 + (wall.x2 - wall.x1) * window.position;
      const windowY = wall.y1 + (wall.y2 - wall.y1) * window.position;

      const localX = (windowX - houseX - houseWidth / 2) / 30 * scale;
      const localZ = -(windowY - houseY - houseHeight / 2) / 30 * scale;

      const windowWidth = window.realWidth * scale;
      const windowHeight = 1.2 * scale; // Стандартная высота окна 1.2м
      const frameThickness = 0.1 * scale;

      // Создаем группу для окна
      const windowGroup = new THREE.Group();

      // Рама окна
      const frameGeometry = new THREE.BoxGeometry(
        windowWidth + frameThickness, 
        windowHeight + frameThickness, 
        frameThickness
      );
      const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
      windowGroup.add(frameMesh);

      // Стекло
      const glassGeometry = new THREE.BoxGeometry(
        windowWidth * 0.9, 
        windowHeight * 0.9, 
        0.02 * scale
      );
      const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial);
      glassMesh.position.z = frameThickness / 4;
      windowGroup.add(glassMesh);

      // Перемычки окна
      const crossbarGeometry = new THREE.BoxGeometry(windowWidth * 0.9, 0.02 * scale, frameThickness / 2);
      const crossbarMesh = new THREE.Mesh(crossbarGeometry, frameMaterial);
      windowGroup.add(crossbarMesh);

      const verticalBarGeometry = new THREE.BoxGeometry(0.02 * scale, windowHeight * 0.9, frameThickness / 2);
      const verticalBarMesh = new THREE.Mesh(verticalBarGeometry, frameMaterial);
      windowGroup.add(verticalBarMesh);

      windowGroup.position.set(localX, wallHeight / 2, localZ);

      // Поворот окна в соответствии со стеной
      const isHorizontal = Math.abs(wall.x2 - wall.x1) > Math.abs(wall.y2 - wall.y1);
      if (!isHorizontal) {
        windowGroup.rotation.y = Math.PI / 2;
      }

      windowGroup.children.forEach(child => {
        child.castShadow = true;
      });
      
      houseGroup.add(windowGroup);
    });
  };

  const createRoof = (houseGroup, width, depth, wallHeight, material) => {
    // Двускатная крыша
    const roofHeight = Math.min(width, depth) * 0.25;
    const roofOverhang = Math.min(width, depth) * 0.05;
    
    // Основная часть крыши
    const roofGeometry = new THREE.CylinderGeometry(
      0, 
      Math.max(width, depth) * 0.7, 
      roofHeight, 
      4
    );
    const roof = new THREE.Mesh(roofGeometry, material);
    roof.position.y = wallHeight + roofHeight / 2;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    houseGroup.add(roof);
    
    // Карниз (свес крыши)
    const eaveGeometry = new THREE.BoxGeometry(
      width + roofOverhang * 2, 
      0.1, 
      depth + roofOverhang * 2
    );
    const eaveMaterial = new THREE.MeshPhongMaterial({ color: 0x654321 });
    const eave = new THREE.Mesh(eaveGeometry, eaveMaterial);
    eave.position.y = wallHeight - 0.05;
    eave.castShadow = true;
    houseGroup.add(eave);
  };

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

  const addHouseDetails = (houseGroup, width, depth, wallHeight, scale) => {
    // Материалы для деталей
    const foundationMaterial = new THREE.MeshPhongMaterial({ color: 0x696969 });
    const gutterMaterial = new THREE.MeshPhongMaterial({ color: 0x2F4F4F });
    const chimneyMaterial = new THREE.MeshPhongMaterial({ color: 0x8B0000 });
    
    // Фундамент
    const foundationGeometry = new THREE.BoxGeometry(
      width + 0.4 * scale, 
      0.5 * scale, 
      depth + 0.4 * scale
    );
    const foundation = new THREE.Mesh(foundationGeometry, foundationMaterial);
    foundation.position.y = -0.25 * scale;
    foundation.castShadow = true;
    foundation.receiveShadow = true;
    houseGroup.add(foundation);
    
    // Водосточные желоба
    const gutterGeometry = new THREE.CylinderGeometry(0.05 * scale, 0.05 * scale, width, 8);
    
    // Передний желоб
    const frontGutter = new THREE.Mesh(gutterGeometry, gutterMaterial);
    frontGutter.rotation.z = Math.PI / 2;
    frontGutter.position.set(0, wallHeight - 0.1 * scale, depth / 2 + 0.1 * scale);
    houseGroup.add(frontGutter);
    
    // Задний желоб
    const backGutter = new THREE.Mesh(gutterGeometry, gutterMaterial);
    backGutter.rotation.z = Math.PI / 2;
    backGutter.position.set(0, wallHeight - 0.1 * scale, -depth / 2 - 0.1 * scale);
    houseGroup.add(backGutter);
    
    // Водосточная труба
    const drainPipeGeometry = new THREE.CylinderGeometry(
      0.05 * scale, 
      0.05 * scale, 
      wallHeight - 0.2 * scale, 
      8
    );
    const drainPipe = new THREE.Mesh(drainPipeGeometry, gutterMaterial);
    drainPipe.position.set(
      width / 2 - 0.2 * scale, 
      (wallHeight - 0.2 * scale) / 2, 
      depth / 2 + 0.1 * scale
    );
    houseGroup.add(drainPipe);
    
    // Дымоход (если дом достаточно большой)
    if (width > 6 * scale && depth > 6 * scale) {
      const chimneyGeometry = new THREE.BoxGeometry(
        0.6 * scale, 
        1.5 * scale, 
        0.6 * scale
      );
      const chimney = new THREE.Mesh(chimneyGeometry, chimneyMaterial);
      chimney.position.set(
        width / 4, 
        wallHeight + 0.75 * scale, 
        -depth / 4
      );
      chimney.castShadow = true;
      houseGroup.add(chimney);
      
      // Колпак дымохода
      const capGeometry = new THREE.BoxGeometry(
        0.8 * scale, 
        0.1 * scale, 
        0.8 * scale
      );
      const cap = new THREE.Mesh(capGeometry, chimneyMaterial);
      cap.position.set(
        width / 4, 
        wallHeight + 1.55 * scale, 
        -depth / 4
      );
      houseGroup.add(cap);
    }
    
    // Крыльцо над входом (если есть двери)
    if (doors.length > 0) {
      const porchMaterial = new THREE.MeshPhongMaterial({ color: 0xD2B48C });
      const porchGeometry = new THREE.BoxGeometry(
        2 * scale, 
        0.1 * scale, 
        1 * scale
      );
      const porch = new THREE.Mesh(porchGeometry, porchMaterial);
      porch.position.set(0, 0.05 * scale, depth / 2 + 0.5 * scale);
      porch.castShadow = true;
      porch.receiveShadow = true;
      houseGroup.add(porch);
      
      // Колонны крыльца
      const columnGeometry = new THREE.CylinderGeometry(
        0.1 * scale, 
        0.1 * scale, 
        2.5 * scale, 
        8
      );
      const columnMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
      
      const leftColumn = new THREE.Mesh(columnGeometry, columnMaterial);
      leftColumn.position.set(-0.8 * scale, 1.25 * scale, depth / 2 + 0.8 * scale);
      houseGroup.add(leftColumn);
      
      const rightColumn = new THREE.Mesh(columnGeometry, columnMaterial);
      rightColumn.position.set(0.8 * scale, 1.25 * scale, depth / 2 + 0.8 * scale);
      houseGroup.add(rightColumn);
      
      // Навес крыльца
      const canopyGeometry = new THREE.BoxGeometry(
        2.5 * scale, 
        0.1 * scale, 
        1.5 * scale
      );
      const canopy = new THREE.Mesh(canopyGeometry, porchMaterial);
      canopy.position.set(0, 2.5 * scale, depth / 2 + 0.6 * scale);
      canopy.castShadow = true;
      houseGroup.add(canopy);
    }
  };
  
  const addTrees = (scene) => {
    const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    const leavesMaterial = new THREE.MeshPhongMaterial({ color: 0x228B22 });
    
    // Позиции деревьев
    const treePositions = [
      { x: -40, z: -30, scale: 1.2 },
      { x: 35, z: -25, scale: 0.8 },
      { x: -30, z: 40, scale: 1.0 },
      { x: 45, z: 35, scale: 1.1 },
      { x: -50, z: 10, scale: 0.9 }
    ];
    
    treePositions.forEach(pos => {
      const treeGroup = new THREE.Group();
      
      // Ствол
      const trunkGeometry = new THREE.CylinderGeometry(
        0.5 * pos.scale, 
        0.8 * pos.scale, 
        8 * pos.scale, 
        8
      );
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.y = 4 * pos.scale;
      trunk.castShadow = true;
      treeGroup.add(trunk);
      
      // Крона
      const leavesGeometry = new THREE.SphereGeometry(4 * pos.scale, 8, 6);
      const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
      leaves.position.y = 10 * pos.scale;
      leaves.castShadow = true;
      treeGroup.add(leaves);
      
      treeGroup.position.set(pos.x, 0, pos.z);
      scene.add(treeGroup);
    });
  };

  return (
    <div className="house-3d-viewer">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Загрузка 3D модели...</p>
        </div>
      )}
      
      <div className="viewer-controls">
        <button className="close-btn" onClick={onClose}>
          ✕ Закрыть 3D
        </button>
        <div className="controls-info">
          <span>🖱️ Перетаскивайте для поворота</span>
          <span>🔍 Колесо мыши для масштаба</span>
        </div>
      </div>
      
      <div ref={mountRef} className="viewer-container" />

      <style jsx>{`
        .house-3d-viewer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #000;
          z-index: 1000;
          display: flex;
          flex-direction: column;
        }

        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          z-index: 1001;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid #fff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .viewer-controls {
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 1001;
          pointer-events: none;
        }

        .close-btn {
          background: var(--accent-orange);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          transition: all 0.3s ease;
          pointer-events: auto;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .close-btn:hover {
          background: #c55a24;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
        }

        .controls-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
          color: white;
          font-size: 14px;
          background: rgba(0, 0, 0, 0.6);
          padding: 12px 16px;
          border-radius: 6px;
          backdrop-filter: blur(10px);
        }

        .viewer-container {
          flex: 1;
          width: 100%;
          height: 100%;
        }

        .viewer-container canvas {
          display: block;
          cursor: grab;
        }

        .viewer-container canvas:active {
          cursor: grabbing;
        }

        @media (max-width: 768px) {
          .viewer-controls {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .controls-info {
            font-size: 12px;
            text-align: center;
          }

          .close-btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}