'use client';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  onClick, 
  className = '',
  ...props 
}) {
  const baseStyles = {
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none'
  };

  const variants = {
    primary: {
      background: 'var(--accent-orange)',
      color: 'var(--white)',
      boxShadow: '0 2px 8px rgba(223, 104, 43, 0.3)'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--text-dark)',
      border: '1px solid var(--border-gray)'
    }
  };

  const sizes = {
    small: { padding: '0.5rem 1rem', fontSize: '0.85rem' },
    medium: { padding: '0.7rem 1.5rem', fontSize: '0.9rem' },
    large: { padding: '1rem 2rem', fontSize: '1rem' }
  };

  return (
    <button
      style={{
        ...baseStyles,
        ...variants[variant],
        ...sizes[size]
      }}
      className={className}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (variant === 'primary') {
          e.target.style.transform = 'translateY(-1px)';
          e.target.style.boxShadow = '0 4px 12px rgba(223, 104, 43, 0.4)';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 8px rgba(223, 104, 43, 0.3)';
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}