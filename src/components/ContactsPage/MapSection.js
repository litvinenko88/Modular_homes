import { useEffect, useRef, useState } from 'react';
import styles from './MapSection.module.css';

export default function MapSection() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Инициализация Leaflet карты
    const initMap = () => {
      if (typeof window !== 'undefined' && window.L && mapRef.current && !mapInstanceRef.current) {
      // Координаты Ставрополя, ул. Севрюкова, 94
      const coordinates = [45.0448, 41.9691];
      
      // Создание карты
      mapInstanceRef.current = window.L.map(mapRef.current, {
        center: coordinates,
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        dragging: true,
        touchZoom: true
      });

      // Добавление тайлов OpenStreetMap
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);

      // Создание кастомной иконки
      const customIcon = window.L.divIcon({
        html: `
          <div style="
            background: linear-gradient(135deg, #df682b 0%, #e8763a 100%);
            width: 40px;
            height: 40px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 4px 15px rgba(223, 104, 43, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              color: white;
              font-size: 16px;
              transform: rotate(45deg);
              font-weight: bold;
            ">🏠</div>
          </div>
        `,
        className: 'custom-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      });

      // Добавление маркера
      const marker = window.L.marker(coordinates, { icon: customIcon })
        .addTo(mapInstanceRef.current);

      // Создание popup с информацией
      const popupContent = `
        <div style="text-align: center; padding: 10px; font-family: Arial, sans-serif;">
          <h3 style="margin: 0 0 10px 0; color: #df682b; font-size: 18px;">Easy House</h3>
          <p style="margin: 5px 0; color: #333; font-size: 14px;">
            <strong>📍 Адрес:</strong><br>
            г. Ставрополь, ул. Севрюкова, 94
          </p>
          <p style="margin: 5px 0; color: #333; font-size: 14px;">
            <strong>🏭 Производственная база</strong>
          </p>
          <p style="margin: 10px 0 5px 0; color: #666; font-size: 12px;">
            <strong>📞 Телефон:</strong> 8 (996) 417-90-01
          </p>
          <div style="margin-top: 15px;">
            <a href="https://www.google.com/maps/dir/?api=1&destination=45.0448,41.9691" 
               target="_blank" 
               style="
                 background: linear-gradient(135deg, #df682b 0%, #e8763a 100%);
                 color: white;
                 padding: 8px 16px;
                 border-radius: 6px;
                 text-decoration: none;
                 font-size: 12px;
                 font-weight: bold;
                 display: inline-block;
                 margin: 2px;
               ">
              🗺️ Маршрут в Google Maps
            </a>
            <a href="https://yandex.ru/maps/?pt=41.9691,45.0448&z=15&l=map" 
               target="_blank" 
               style="
                 background: linear-gradient(135deg, #df682b 0%, #e8763a 100%);
                 color: white;
                 padding: 8px 16px;
                 border-radius: 6px;
                 text-decoration: none;
                 font-size: 12px;
                 font-weight: bold;
                 display: inline-block;
                 margin: 2px;
               ">
              🗺️ Яндекс.Карты
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
      });

      // Открытие popup по умолчанию
      marker.openPopup();

      // Добавление анимации появления маркера
      setTimeout(() => {
        marker.setLatLng(coordinates);
      }, 500);

        // Добавление обработчика клика по карте
        mapInstanceRef.current.on('click', function(e) {
          console.log('Clicked at:', e.latlng);
        });
      }
    };

    // Задержка для загрузки Leaflet
    const timer = setTimeout(initMap, 1000);

    return () => {
      clearTimeout(timer);
      // Очистка карты при размонтировании компонента
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mounted]);

  const handleRouteClick = () => {
    // Открытие маршрута в Google Maps
    const url = `https://www.google.com/maps/dir/?api=1&destination=45.0448,41.9691`;
    window.open(url, '_blank');
  };

  const handleYandexRoute = () => {
    // Открытие маршрута в Яндекс.Картах
    const url = `https://yandex.ru/maps/?pt=41.9691,45.0448&z=15&l=map`;
    window.open(url, '_blank');
  };

  return (
    <section className={styles.mapSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Как нас найти</h2>
        <div className={styles.mapContainer}>
          <div ref={mapRef} className={styles.map} id="leaflet-map">
            {!mounted && (
              <div className={styles.mapPlaceholder}>
                <div className={styles.placeholderContent}>
                  <div className={styles.placeholderIcon}>📍</div>
                  <h3>Наш адрес</h3>
                  <p>г. Ставрополь, ул. Севрюкова, 94</p>
                  <p>Производственная база Easy House</p>
                  <div className={styles.loadingText}>Загрузка карты...</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Информационная панель */}
          <div className={styles.mapInfo}>
            <div className={styles.infoCard}>
              <div className={styles.infoHeader}>
                <div className={styles.infoIcon}>📍</div>
                <h3>Наш адрес</h3>
              </div>
              <div className={styles.infoContent}>
                <p><strong>г. Ставрополь, ул. Севрюкова, 94</strong></p>
                <p>Производственная база Easy House</p>
                <div className={styles.coordinates}>
                  <small>Координаты: 45.0448, 41.9691</small>
                </div>
              </div>
              <div className={styles.infoActions}>
                <button onClick={handleRouteClick} className={styles.routeBtn}>
                  <span>🗺️</span>
                  Google Maps
                </button>
                <button onClick={handleYandexRoute} className={styles.routeBtn}>
                  <span>🗺️</span>
                  Яндекс.Карты
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Дополнительная информация */}
        <div className={styles.additionalInfo}>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <div className={styles.itemIcon}>🚗</div>
              <h4>На автомобиле</h4>
              <p>Бесплатная парковка на территории. GPS: 45.0448, 41.9691</p>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.itemIcon}>🚌</div>
              <h4>Общественный транспорт</h4>
              <p>Автобусы №15, 22 до остановки "Севрюкова"</p>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.itemIcon}>🏭</div>
              <h4>Производство</h4>
              <p>Экскурсии по производству по предварительной записи</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}