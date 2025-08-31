'use client';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  onClick, 
  disabled = false,
  style = {},
  ...props 
}) {
  const baseStyles = {
    border: 'none',
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    fontFamily: 'inherit',
    opacity: disabled ? 0.6 : 1,
    ...style
  };

  const variants = {
    primary: {
      background: 'var(--accent-orange)',
      color: 'var(--white)',
      boxShadow: '0 2px 8px rgba(223, 104, 43, 0.3)'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--accent-orange)',
      border: '2px solid var(--accent-orange)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--text-dark)',
      border: '1px solid var(--border-gray)'
    }
  };

  const sizes = {
    small: {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem'
    },
    medium: {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem'
    },
    large: {
      padding: '1rem 2rem',
      fontSize: '1.125rem'
    }
  };

  const buttonStyles = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size]
  };

  return (
    <button
      style={buttonStyles}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}