'use client';

import { useState, useEffect, useRef } from 'react';
import { regions } from '../../data/regions';

export default function RegionFilter({ selectedRegion, onRegionChange, isMobile = false }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    if (isDropdownOpen && buttonRef.current && !isMobile) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right
      });
    }
  }, [isDropdownOpen, isMobile]);

  const currentRegion = regions.find(r => r.id === selectedRegion) || regions[0];

  if (isMobile) {
    return (
      <div ref={dropdownRef} style={{ position: 'relative' }}>
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
          <span>{currentRegion.full}</span>
          <span style={{
            transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}>▼</span>
        </button>

        {isDropdownOpen && (
          <div className="region-dropdown" style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '0.5rem',
            zIndex: 10000
          }}>
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => {
                  onRegionChange(region.id);
                  setIsDropdownOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: 'none',
                  background: selectedRegion === region.id ? 'var(--light-purple)' : 'transparent',
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
    );
  }

  return (
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
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {currentRegion.short}
        </span>
        <span style={{
          transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
          fontSize: '0.7rem',
          flexShrink: 0
        }}>▼</span>
      </button>

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
              key={region.id}
              onClick={() => {
                onRegionChange(region.id);
                setIsDropdownOpen(false);
              }}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: 'none',
                background: selectedRegion === region.id ? 'var(--light-purple)' : 'transparent',
                color: 'var(--text-dark)',
                fontSize: '0.85rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                borderBottom: index < regions.length - 1 ? '1px solid var(--border-gray)' : 'none',
                display: 'block'
              }}
              onMouseEnter={(e) => {
                if (selectedRegion !== region.id) {
                  e.target.style.background = 'var(--light-gray)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedRegion !== region.id) {
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
  );
}