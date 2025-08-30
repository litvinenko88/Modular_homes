'use client';

import { useState, useEffect } from 'react';

export default function ContactForm({ 
  title = "Получить консультацию",
  subtitle = "Оставьте заявку и наш менеджер свяжется с вами в течение 15 минут",
  buttonText = "Получить консультацию"
}) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    agreement: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1400);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Имитация отправки формы
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
      setFormData({ name: '', phone: '', agreement: false });
    }, 1000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: '25px',
      padding: '2.5rem',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      maxWidth: windowWidth <= 1200 ? 'none' : '420px',
      width: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Декоративный фон */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-50%',
        width: '200px',
        height: '200px',
        background: 'linear-gradient(135deg, var(--accent-orange), #ff8c42)',
        borderRadius: '50%',
        opacity: 0.05,
        filter: 'blur(40px)'
      }} />
      
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Иконка */}
        <div style={{
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, var(--accent-orange), #ff8c42)',
          borderRadius: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          💬
        </div>
        
        <h3 style={{
          fontSize: '1.6rem',
          fontWeight: '800',
          color: 'var(--text-dark)',
          marginBottom: '0.5rem',
          fontFamily: 'var(--font-primary)',
          background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {title}
        </h3>
      
      <p style={{
        fontSize: '0.9rem',
        color: 'var(--text-light)',
        marginBottom: '1.5rem',
        lineHeight: '1.4'
      }}>
        {subtitle}
      </p>

      <form onSubmit={handleSubmit}>
        {/* Поле имени */}
        <div style={{ marginBottom: '1.2rem' }}>
          <input
            type="text"
            name="name"
            placeholder="Ваше имя"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '1rem 1.2rem',
              border: '2px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '15px',
              fontSize: '1rem',
              fontFamily: 'var(--font-primary)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent-orange)';
              e.target.style.transform = 'translateY(-3px) scale(1.02)';
              e.target.style.boxShadow = '0 8px 25px rgba(223, 104, 43, 0.2)';
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(0, 0, 0, 0.1)';
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = 'none';
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            }}
          />
        </div>

        {/* Поле телефона */}
        <div style={{ marginBottom: '1.2rem' }}>
          <input
            type="tel"
            name="phone"
            placeholder="+7 (___) ___-__-__"
            value={formData.phone}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '1rem 1.2rem',
              border: '2px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '15px',
              fontSize: '1rem',
              fontFamily: 'var(--font-primary)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent-orange)';
              e.target.style.transform = 'translateY(-3px) scale(1.02)';
              e.target.style.boxShadow = '0 8px 25px rgba(223, 104, 43, 0.2)';
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(0, 0, 0, 0.1)';
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = 'none';
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            }}
          />
        </div>

        {/* Чекбокс согласия */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          <input
            type="checkbox"
            name="agreement"
            id="agreement"
            checked={formData.agreement}
            onChange={handleChange}
            required
            style={{
              width: '18px',
              height: '18px',
              marginTop: '2px',
              accentColor: 'var(--accent-orange)',
              cursor: 'pointer'
            }}
          />
          <label 
            htmlFor="agreement"
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-light)',
              lineHeight: '1.3',
              cursor: 'pointer'
            }}
          >
            Согласен на обработку персональных данных в соответствии с{' '}
            <span style={{ color: 'var(--accent-orange)', textDecoration: 'underline' }}>
              политикой конфиденциальности
            </span>
          </label>
        </div>

        {/* Кнопка отправки */}
        <button
          type="submit"
          disabled={!formData.agreement || isSubmitting}
          style={{
            width: '100%',
            padding: '1.2rem 1.5rem',
            background: formData.agreement && !isSubmitting 
              ? 'linear-gradient(135deg, var(--accent-orange) 0%, #ff6b35 100%)' 
              : 'linear-gradient(135deg, #ccc 0%, #bbb 100%)',
            color: 'var(--white)',
            border: 'none',
            borderRadius: '15px',
            fontSize: '1.1rem',
            fontWeight: '700',
            fontFamily: 'var(--font-primary)',
            cursor: formData.agreement && !isSubmitting ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: formData.agreement && !isSubmitting 
              ? '0 8px 25px rgba(223, 104, 43, 0.3)' 
              : '0 4px 15px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            if (formData.agreement && !isSubmitting) {
              e.target.style.transform = 'translateY(-3px) scale(1.02)';
              e.target.style.boxShadow = '0 12px 35px rgba(223, 104, 43, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (formData.agreement && !isSubmitting) {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 8px 25px rgba(223, 104, 43, 0.3)';
            }
          }}
        >
          {isSubmitting ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Отправка...
            </div>
          ) : (
            buttonText
          )}
        </button>
      </form>
      </div>
    </div>
  );
}