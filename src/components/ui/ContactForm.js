'use client';

import { useState } from 'react';

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
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      maxWidth: '400px',
      width: '100%'
    }}>
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: '700',
        color: 'var(--text-dark)',
        marginBottom: '0.5rem',
        fontFamily: 'var(--font-primary)'
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
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            name="name"
            placeholder="Ваше имя"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.8rem 1rem',
              border: '2px solid var(--border-gray)',
              borderRadius: '8px',
              fontSize: '1rem',
              fontFamily: 'var(--font-primary)',
              transition: 'all 0.2s ease',
              backgroundColor: 'var(--white)',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent-orange)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(223, 104, 43, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-gray)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Поле телефона */}
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="tel"
            name="phone"
            placeholder="+7 (___) ___-__-__"
            value={formData.phone}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.8rem 1rem',
              border: '2px solid var(--border-gray)',
              borderRadius: '8px',
              fontSize: '1rem',
              fontFamily: 'var(--font-primary)',
              transition: 'all 0.2s ease',
              backgroundColor: 'var(--white)',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent-orange)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(223, 104, 43, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-gray)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
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
            padding: '0.8rem 1rem',
            background: formData.agreement && !isSubmitting ? 'var(--accent-orange)' : '#ccc',
            color: 'var(--white)',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            fontFamily: 'var(--font-primary)',
            cursor: formData.agreement && !isSubmitting ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            if (formData.agreement && !isSubmitting) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(223, 104, 43, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
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
  );
}