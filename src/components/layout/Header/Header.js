'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './Header.module.css';

const regions = [
  { full: 'Вся Россия', short: 'РФ' },
  { full: 'Ставропольский край', short: 'СК' },
  { full: 'Краснодарский край', short: 'КК' },
  { full: 'Республика КЧР', short: 'КЧР' },
  { full: 'Республика КБР', short: 'КБР' }
];

export default function Header() {
  const [selectedRegion, setSelectedRegion] = useState('СК');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right
      });
    }
  }, [isDropdownOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          Easy House
        </div>

        <nav className={styles.desktopNav}>
          {['Каталог', 'Конструктор', 'Для бизнеса', 'Технология', 'О компании', 'Контакты'].map((item) => (
            <a
              key={item}
              href={item === 'Конструктор' ? '/constructor' : '#'}
              className={styles.navLink}
            >
              {item}
            </a>
          ))}
        </nav>

        <button
          className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
        </button>

        <div className={styles.headerRight}>
          <button className={styles.requestButton}>
            Оставить заявку
          </button>

          <div ref={dropdownRef} className={styles.regionFilter}>
            <button
              ref={buttonRef}
              className={styles.regionButton}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className={styles.regionText}>{selectedRegion}</span>
              <span className={`${styles.regionArrow} ${isDropdownOpen ? styles.open : ''}`}>▼</span>
            </button>

            {isDropdownOpen && (
              <div 
                className={styles.regionDropdown}
                style={{
                  top: `${dropdownPosition.top}px`,
                  right: `${dropdownPosition.right}px`
                }}
              >
                {regions.map((region) => (
                  <button
                    key={region.short}
                    onClick={() => {
                      setSelectedRegion(region.short);
                      setIsDropdownOpen(false);
                    }}
                    className={`${styles.regionOption} ${selectedRegion === region.short ? styles.selected : ''}`}
                  >
                    {region.full}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
        <nav className={styles.mobileNav}>
          {['Каталог', 'Конструктор', 'Для бизнеса', 'Технология', 'О компании', 'Контакты'].map((item) => (
            <a
              key={item}
              href={item === 'Конструктор' ? '/constructor' : '#'}
              onClick={() => setIsMobileMenuOpen(false)}
              className={styles.mobileNavLink}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className={styles.mobileButtons}>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className={styles.mobileRequestButton}
          >
            Оставить заявку
          </button>
          
          <div className={styles.mobileRegionContainer}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={styles.mobileRegionButton}
            >
              <span>{regions.find(r => r.short === selectedRegion)?.full}</span>
              <span className={`${styles.regionArrow} ${isDropdownOpen ? styles.open : ''}`}>▼</span>
            </button>

            {isDropdownOpen && (
              <div className={styles.mobileRegionDropdown}>
                {regions.map((region) => (
                  <button
                    key={region.short}
                    onClick={() => {
                      setSelectedRegion(region.short);
                      setIsDropdownOpen(false);
                    }}
                    className={`${styles.mobileRegionOption} ${selectedRegion === region.short ? styles.selected : ''}`}
                  >
                    {region.full}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className={`${styles.overlay} ${isMobileMenuOpen ? styles.visible : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}