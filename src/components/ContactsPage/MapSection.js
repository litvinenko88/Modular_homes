import { useEffect, useRef, useState } from 'react';
import styles from './MapSection.module.css';

export default function MapSection() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Инициализация Яндекс.Карт
    const initMap = () => {
      if (typeof window !== 'undefined' && window.ymaps && mapRef.current && !mapInstanceRef.current) {
        console.log('Инициализация Яндекс.Карт...');
        
        window.ymaps.ready(() => {
          try {
            console.log('ymaps.ready выполнен');
            
            // Координаты Ставрополя, ул. Севрюкова, 94
            const coordinates = [45.0448, 41.9691];
            
            // Создание карты
            mapInstanceRef.current = new window.ymaps.Map(mapRef.current, {
              center: coordinates,
              zoom: 16,
              controls: ['zoomControl', 'fullscreenControl']
            });

            console.log('Карта создана');

            // Создание метки
            const placemark = new window.ymaps.Placemark(coordinates, {
              balloonContentHeader: '<strong style="color: #df682b;">Easy House</strong>',
              balloonContentBody: `
                <div style="padding: 15px; font-family: Arial, sans-serif; line-height: 1.4;">
                  <p style="margin: 8px 0; color: #333; font-size: 14px;">
                    <strong>📍 Адрес:</strong><br>
                    г. Ставрополь, ул. Севрюкова, 94
                  </p>
                  <p style="margin: 8px 0; color: #333; font-size: 14px;">
                    <strong>🏭 Производственная база модульных домов</strong>
                  </p>
                  <p style="margin: 8px 0; color: #666; font-size: 13px;">
                    <strong>📞 Телефон:</strong> 8 (996) 417-90-01
                  </p>
                  <p style="margin: 8px 0; color: #666; font-size: 13px;">
                    <strong>🕒 Режим работы:</strong> Пн-Пт 8:00-20:00, Сб 10:00-16:00
                  </p>
                  <div style="text-align: center; margin-top: 15px;">
                    <a href="tel:89964179001" style="
                      background: #df682b;
                      color: white;
                      padding: 8px 16px;
                      border-radius: 6px;
                      text-decoration: none;
                      font-size: 12px;
                      font-weight: bold;
                      display: inline-block;
                      margin: 3px;
                    ">📞 Позвонить</a>
                    <a href="https://wa.me/79964179001" target="_blank" style="
                      background: #25d366;
                      color: white;
                      padding: 8px 16px;
                      border-radius: 6px;
                      text-decoration: none;
                      font-size: 12px;
                      font-weight: bold;
                      display: inline-block;
                      margin: 3px;
                    ">💬 WhatsApp</a>
                  </div>
                </div>
              `,
              hintContent: 'Easy House - производство модульных домов'
            }, {
              preset: 'islands#redHomeIcon',
              iconColor: '#df682b'
            });

            // Добавление метки на карту
            mapInstanceRef.current.geoObjects.add(placemark);
            
            console.log('Метка добавлена');

            // Открытие балуна через небольшую задержку
            setTimeout(() => {
              placemark.balloon.open();
            }, 1000);

            setMapLoaded(true);
            console.log('Карта успешно загружена');
            
          } catch (error) {
            console.error('Ошибка инициализации Яндекс.Карт:', error);
            setMapError(true);
          }
        });
      }
    };

    // Проверка и загрузка API Яндекс.Карт
    const loadYandexMaps = () => {
      // Проверяем, есть ли уже скрипт
      if (document.querySelector('script[src*="api-maps.yandex.ru"]')) {
        console.log('Скрипт Яндекс.Карт уже загружен');
        return;
      }

      console.log('Загружаем скрипт Яндекс.Карт...');
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?apikey=c5bfbaa0-c71b-4913-a5e1-8e22a733a686&lang=ru_RU';
      script.async = true;
      
      script.onload = () => {
        console.log('Скрипт Яндекс.Карт загружен');
      };
      
      script.onerror = () => {
        console.error('Ошибка загрузки скрипта Яндекс.Карт');
        setMapError(true);
      };
      
      document.head.appendChild(script);
    };

    // Загружаем API если его нет
    if (typeof window !== 'undefined') {
      if (!window.ymaps) {
        loadYandexMaps();
      }
    }

    // Проверяем готовность API каждые 500мс
    const checkInterval = setInterval(() => {
      if (typeof window !== 'undefined' && window.ymaps) {
        console.log('Яндекс.Карты готовы к использованию');
        clearInterval(checkInterval);
        initMap();
      }
    }, 500);
    
    // Fallback таймер на 20 секунд
    const fallbackTimer = setTimeout(() => {
      clearInterval(checkInterval);
      if (typeof window !== 'undefined' && window.ymaps) {
        initMap();
      } else {
        console.warn('Яндекс.Карты не удалось загрузить за 20 секунд');
        setMapError(true);
      }
    }, 20000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(fallbackTimer);
      
      // Очистка карты при размонтировании компонента
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.destroy();
        } catch (e) {
          console.warn('Ошибка при уничтожении карты:', e);
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleRouteClick = () => {
    const url = `https://yandex.ru/maps/?rtext=~45.0448,41.9691&rtt=auto`;
    window.open(url, '_blank');
  };

  const handleGoogleRoute = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=45.0448,41.9691`;
    window.open(url, '_blank');
  };

  return (
    <section className={styles.mapSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Как нас найти</h2>
        <div className={styles.mapContainer}>
          <div 
            ref={mapRef} 
            className={styles.map} 
            id="yandex-map"
            style={{ width: '100%', height: '100%' }}
          >
            {(!mapLoaded && !mapError) && (
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
            
            {mapError && (
              <div className={styles.mapPlaceholder}>
                <div className={styles.placeholderContent}>
                  <div className={styles.placeholderIcon}>⚠️</div>
                  <h3>Карта временно недоступна</h3>
                  <p>г. Ставрополь, ул. Севрюкова, 94</p>
                  <p>Производственная база Easy House</p>
                  <div className={styles.errorText}>
                    Используйте кнопки ниже для построения маршрута
                  </div>
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
                  Яндекс.Карты
                </button>
                <button onClick={handleGoogleRoute} className={styles.routeBtn}>
                  <span>🗺️</span>
                  Google Maps
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