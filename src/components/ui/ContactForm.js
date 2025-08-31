'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      width: '300px'
    }}>
      <h3 style={{
        color: 'var(--white)',
        marginBottom: '1rem',
        fontSize: '1.2rem'
      }}>
        Получить расчет
      </h3>
      
      <input
        type="text"
        name="name"
        placeholder="Ваше имя"
        value={formData.name}
        onChange={handleChange}
        style={{
          padding: '0.8rem',
          borderRadius: '8px',
          border: 'none',
          fontSize: '1rem'
        }}
        required
      />
      
      <input
        type="tel"
        name="phone"
        placeholder="Телефон"
        value={formData.phone}
        onChange={handleChange}
        style={{
          padding: '0.8rem',
          borderRadius: '8px',
          border: 'none',
          fontSize: '1rem'
        }}
        required
      />
      
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        style={{
          padding: '0.8rem',
          borderRadius: '8px',
          border: 'none',
          fontSize: '1rem'
        }}
      />
      
      <button
        type="submit"
        style={{
          background: 'var(--accent-orange)',
          color: 'var(--white)',
          border: 'none',
          padding: '1rem',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        Получить расчет
      </button>
    </form>
  );
}