'use client';

import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import RegionFilter from '../ui/RegionFilter';

const navigationItems = [
  { name: 'Каталог', href: '#' },
  { name: 'Конструктор', href: '/constructor' },
  { name: 'Для бизнеса', href: '#' },
  { name: 'Технология', href: '#' },
  { name: 'О компании', href: '#' },
  { name: 'Контакты', href: '#' }
];

export default function Header({ selectedRegion, onRegionChange }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  return (
    <header style={{
      background: 'var(--white)',
      borderBottom: '1px solid var(--border-gray)',
      padding: '0 var(--container-padding)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
        padding: 0
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
          {navigationItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
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
              {item.name}
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
          <Button>Оставить заявку</Button>
          <RegionFilter 
            selectedRegion={selectedRegion}
            onRegionChange={onRegionChange}
          />
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
          {navigationItems.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
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
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Мобильные кнопки */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <Button onClick={() => setIsMobileMenuOpen(false)}>
            Оставить заявку
          </Button>
          
          <RegionFilter 
            selectedRegion={selectedRegion}
            onRegionChange={onRegionChange}
            isMobile={true}
          />
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

      {/* Стили */}
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

        @media (max-width: 1080px) {
          .desktop-nav {
            display: none !important;
          }
          .hamburger {
            display: flex !important;
          }
          .header-right {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}