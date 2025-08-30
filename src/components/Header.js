'use client';

import { useState, useEffect, useRef } from 'react';

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
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header style={{
      background: 'var(--white)',
      borderBottom: '1px solid var(--border-gray)',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        {/* Логотип */}
        <div className="logo" style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: 'var(--primary-dark)',
          cursor: 'pointer'
        }}>
          Easy House
        </div>

        {/* Навигация */}
        <nav style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center'
        }}>
          {['Каталог', 'Конструктор', 'Для бизнеса', 'Технология', 'О компании', 'Контакты'].map((item) => (
            <a
              key={item}
              href={item === 'Конструктор' ? '/constructor' : '#'}
              style={{
                color: 'var(--text-dark)',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: '500',
                transition: 'color 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--accent-orange)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-dark)'}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Правая часть */}
        <div className="header-right" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem'
        }}>
          {/* Кнопка заявки */}
          <button
            className="request-button"
            style={{
              background: 'var(--accent-orange)',
              color: 'var(--white)',
              border: 'none',
              padding: '0.7rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(223, 104, 43, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(223, 104, 43, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(223, 104, 43, 0.3)';
            }}
          >
            Оставить заявку
          </button>

          {/* Фильтр регионов */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              className="region-filter"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-gray)',
                padding: '0.25rem 0.4rem',
                borderRadius: '4px',
                fontSize: '0.65rem',
                color: 'var(--text-light)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
                transition: 'all 0.2s ease',
                width: '50px',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => e.target.style.borderColor = 'var(--accent-orange)'}
              onMouseLeave={(e) => e.target.style.borderColor = 'var(--border-gray)'}
            >
              <span>{selectedRegion}</span>
              <span style={{
                transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
                fontSize: '0.6rem'
              }}>▼</span>
            </button>

            {/* Выпадающий список */}
            {isDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                background: 'var(--white)',
                border: '1px solid var(--border-gray)',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                minWidth: '80px',
                zIndex: 1000,
                marginTop: '0.25rem',
                animation: 'slideIn 0.2s ease'
              }}>
                {regions.map((region) => (
                  <button
                    key={region.short}
                    onClick={() => {
                      setSelectedRegion(region.short);
                      setIsDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.4rem 0.6rem',
                      border: 'none',
                      background: selectedRegion === region.short ? 'var(--light-purple)' : 'transparent',
                      color: 'var(--text-dark)',
                      fontSize: '0.7rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedRegion !== region.short) {
                        e.target.style.background = 'var(--light-gray)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedRegion !== region.short) {
                        e.target.style.background = 'transparent';
                      }
                    }}
                  >
                    {region.full}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Мобильная адаптация */}
      <style jsx>{`
        @media (max-width: 768px) {
          header {
            padding: 0 1rem !important;
          }
          nav {
            display: none !important;
          }
          .header-container {
            height: 60px !important;
          }
          .region-filter {
            font-size: 0.6rem !important;
            padding: 0.2rem 0.3rem !important;
            width: 40px !important;
          }
          .request-button {
            padding: 0.5rem 1rem !important;
            font-size: 0.8rem !important;
          }
        }
        @media (max-width: 480px) {
          .logo {
            font-size: 1.2rem !important;
          }
        }
      `}</style>
    </header>
  );
}