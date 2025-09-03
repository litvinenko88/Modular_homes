import { useEffect, useRef } from 'react';
import styles from './MapSection.module.css';

export default function MapSection() {
  const mapRef = useRef(null);

  useEffect(() => {
    // Инициализация Яндекс.Карты
    if (typeof window !== 'undefined' && window.ymaps) {
      window.ymaps.ready(() => {
        const map = new window.ymaps.Map(mapRef.current, {
          center: [45.0448, 41.9691], // Координаты Ставрополя
          zoom: 12,
          controls: ['zoomControl', 'fullscreenControl']
        });

        const placemark = new window.ymaps.Placemark(
          [45.0448, 41.9691],
          {
            balloonContent: 'Easy House<br>ул. Севрюкова, 94<br>Ставрополь',
            hintContent: 'Easy House - производство модульных домов'
          },
          {
            preset: 'islands#redDotIcon'
          }
        );

        map.geoObjects.add(placemark);
      });
    }
  }, []);

  return (
    <section className={styles.mapSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Как нас найти</h2>
        <div className={styles.mapContainer}>
          <div ref={mapRef} className={styles.map} id="map">
            <div className={styles.mapPlaceholder}>
              <div className={styles.placeholderContent}>
                <div className={styles.mapIcon}>📍</div>
                <h3>Наш адрес</h3>
                <p>г. Ставрополь, ул. Севрюкова, 94</p>
                <p>Производственная база Easy House</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.addressInfo}>
          <div className={styles.addressCard}>
            <h3>Как добраться</h3>
            <ul>
              <li>На автомобиле: GPS координаты 45.0448, 41.9691</li>
              <li>Общественным транспортом: автобусы №15, 22 до остановки "Севрюкова"</li>
              <li>Парковка: бесплатная парковка на территории</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}