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
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          flexShrink: 0
        }}>
          Easy House
        </div>

        {/* Навигация - десктоп */}
        <nav className="desktop-nav" style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center'
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

        {/* Гамбургер меню - мобильная версия */}
        <button
          className="hamburger"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            display: 'none',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '32px',
            height: '32px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            zIndex: 1001,
            position: 'relative',
            flexShrink: 0
          }}
        >
          <span style={{
            display: 'block',
            width: '20px',
            height: '2px',
            background: 'var(--text-dark)',
            transition: 'all 0.3s ease',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: isMobileMenuOpen 
              ? 'translate(-50%, -50%) rotate(45deg)' 
              : 'translate(-50%, -50%) translateY(-6px)'
          }} />
          <span style={{
            display: 'block',
            width: '20px',
            height: '2px',
            background: 'var(--text-dark)',
            transition: 'all 0.3s ease',
            position: 'absolute',
            top: '50%',
            left: '50%',
            opacity: isMobileMenuOpen ? '0' : '1',
            transform: 'translate(-50%, -50%)'
          }} />
          <span style={{
            display: 'block',
            width: '20px',
            height: '2px',
            background: 'var(--text-dark)',
            transition: 'all 0.3s ease',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: isMobileMenuOpen 
              ? 'translate(-50%, -50%) rotate(-45deg)' 
              : 'translate(-50%, -50%) translateY(6px)'
          }} />
        </button>

        {/* Правая часть - десктоп */}
        <div className="header-right" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          flexShrink: 0
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
              boxShadow: '0 2px 8px rgba(223, 104, 43, 0.3)',
              whiteSpace: 'nowrap'
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
          <div ref={dropdownRef} style={{ position: 'relative', zIndex: 1 }}>
            <button
              ref={buttonRef}
              className="region-filter"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-gray)',
                padding: '0.4rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                color: 'var(--text-dark)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease',
                minWidth: '80px',
                width: '80px',
                justifyContent: 'space-between',
                flexShrink: 0
              }}
              onMouseEnter={(e) => e.target.style.borderColor = 'var(--accent-orange)'}
              onMouseLeave={(e) => e.target.style.borderColor = 'var(--border-gray)'}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedRegion}</span>
              <span style={{
                transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
                fontSize: '0.7rem',
                flexShrink: 0
              }}>▼</span>
            </button>

            {/* Выпадающий список */}
            {isDropdownOpen && (
              <div className="region-dropdown" style={{
                position: 'fixed',
                top: `${dropdownPosition.top}px`,
                right: `${dropdownPosition.right}px`,
                minWidth: '200px',
                maxWidth: '250px',
                zIndex: 10000
              }}>
                {regions.map((region, index) => (
                  <button
                    key={region.short}
                    onClick={() => {
                      setSelectedRegion(region.short);
                      setIsDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: 'none',
                      background: selectedRegion === region.short ? 'var(--light-purple)' : 'transparent',
                      color: 'var(--text-dark)',
                      fontSize: '0.85rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease',
                      borderBottom: index < regions.length - 1 ? '1px solid var(--border-gray)' : 'none',
                      display: 'block'
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

      {/* Мобильное меню */}
      <div className="mobile-menu" style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '300px',
        maxWidth: '85vw',
        height: '100vh',
        background: 'var(--white)',
        zIndex: 1000,
        transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        padding: '90px 2rem 2rem 2rem',
        boxShadow: '-5px 0 25px rgba(0,0,0,0.15)',
        overflowY: 'auto'
      }}>
        {/* Мобильная навигация */}
        <nav style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginBottom: '2rem'
        }}>
          {['Каталог', 'Конструктор', 'Для бизнеса', 'Технология', 'О компании', 'Контакты'].map((item, index) => (
            <a
              key={item}
              href={item === 'Конструктор' ? '/constructor' : '#'}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                color: 'var(--text-dark)',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: '500',
                padding: '1rem 1rem',
                borderRadius: '8px',
                borderBottom: '1px solid var(--border-gray)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                minHeight: '48px',
                display: 'flex',
                alignItems: 'center',
                animation: isMobileMenuOpen ? `menuItemFadeIn 0.4s ease ${index * 0.08}s both` : 'none'
              }}
              onTouchStart={(e) => {
                e.target.style.color = 'var(--accent-orange)';
                e.target.style.backgroundColor = 'rgba(223, 104, 43, 0.1)';
              }}
              onTouchEnd={(e) => {
                e.target.style.color = 'var(--text-dark)';
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Мобильные кнопки */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              background: 'var(--accent-orange)',
              color: 'var(--white)',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Оставить заявку
          </button>
          
          {/* Мобильный фильтр регионов */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-gray)',
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                fontSize: '1rem',
                color: 'var(--text-dark)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%'
              }}
            >
              <span>{regions.find(r => r.short === selectedRegion)?.full}</span>
              <span style={{
                transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}>▼</span>
            </button>

            {isDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'var(--white)',
                border: '1px solid var(--border-gray)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                zIndex: 10000,
                marginTop: '0.5rem'
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
                      padding: '1rem',
                      border: 'none',
                      background: selectedRegion === region.short ? 'var(--light-purple)' : 'transparent',
                      color: 'var(--text-dark)',
                      fontSize: '1rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease'
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

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999,
            opacity: isMobileMenuOpen ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Стили и адаптация */}
      <style jsx>{`
        @keyframes menuItemFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 1200px) {
          .desktop-nav {
            gap: 1.8rem !important;
          }
        }

        @media (max-width: 1024px) {
          .desktop-nav {
            gap: 1.2rem !important;
          }
          .desktop-nav a {
            font-size: 0.9rem !important;
            white-space: nowrap;
          }
          .request-button {
            padding: 0.6rem 1rem !important;
            font-size: 0.85rem !important;
            white-space: nowrap;
          }
        }

        @media (max-width: 900px) {
          .desktop-nav {
            gap: 1rem !important;
          }
          .desktop-nav a {
            font-size: 0.85rem !important;
          }
          .request-button {
            padding: 0.5rem 0.8rem !important;
            font-size: 0.8rem !important;
          }
          .region-filter {
            min-width: 70px !important;
            width: 70px !important;
            font-size: 0.7rem !important;
          }
        }

        @media (max-width: 768px) {
          header {
            padding: 0 1rem !important;
          }
          .desktop-nav {
            display: none !important;
          }
          .hamburger {
            display: flex !important;
            min-height: 44px !important;
            min-width: 44px !important;
            z-index: 1001 !important;
          }
          .header-right {
            display: none !important;
          }
          .logo {
            font-size: 1.3rem !important;
          }
          .mobile-menu {
            z-index: 1000 !important;
          }
        }

        @media (max-width: 480px) {
          .mobile-menu {
            width: 90vw !important;
            max-width: 320px !important;
            padding: 80px 1.5rem 2rem 1.5rem !important;
          }
          .logo {
            font-size: 1.2rem !important;
          }
        }

        @media (max-width: 360px) {
          .mobile-menu {
            width: 95vw !important;
            padding: 75px 1rem 2rem 1rem !important;
          }
          .logo {
            font-size: 1.1rem !important;
          }
        }

        @media (max-width: 320px) {
          .mobile-menu {
            width: 100vw !important;
            padding: 70px 1rem 2rem 1rem !important;
          }
          .logo {
            font-size: 1rem !important;
          }
        }

        @media (max-width: 480px) {
          .logo {
            font-size: 1.2rem !important;
          }
          header > div {
            height: 60px !important;
          }
        }

        @media (max-width: 320px) {
          .logo {
            font-size: 1.1rem !important;
          }
        }
      `}</style>
    </header>
  );
}