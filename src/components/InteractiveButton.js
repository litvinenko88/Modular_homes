'use client';

export default function InteractiveButton({ href, children, style }) {
  const handleMouseOver = (e) => {
    e.target.style.transform = 'translateY(-2px)';
    e.target.style.boxShadow = '0 6px 16px rgba(46, 103, 44, 0.4)';
  };

  const handleMouseOut = (e) => {
    e.target.style.transform = 'translateY(0)';
    e.target.style.boxShadow = '0 4px 12px rgba(46, 103, 44, 0.3)';
  };

  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={style}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {children}
    </a>
  );
}