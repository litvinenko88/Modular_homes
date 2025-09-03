import { useState } from 'react';
import styles from './ContactForm.module.css';

const ContactForm = ({ 
  title = "Оставьте заявку", 
  source = "unknown",
  className = ""
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 0) return '';
    if (cleanPhone.length !== 11) return 'Телефон должен содержать 11 цифр';
    if (!cleanPhone.startsWith('7') && !cleanPhone.startsWith('8')) {
      return 'Телефон должен начинаться с +7 или 8';
    }
    return '';
  };

  const formatPhone = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.startsWith('8')) {
      return '+7' + cleanValue.slice(1);
    }
    if (cleanValue.startsWith('7')) {
      return '+' + cleanValue;
    }
    if (cleanValue.length > 0 && !cleanValue.startsWith('7') && !cleanValue.startsWith('8')) {
      return '+7' + cleanValue;
    }
    return cleanValue.length > 0 ? '+' + cleanValue : '';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'phone') {
      const formattedPhone = formatPhone(value);
      setFormData(prev => ({ ...prev, [name]: formattedPhone }));
      const error = validatePhone(formattedPhone);
      setPhoneError(error);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const phoneValidationError = validatePhone(formData.phone);
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      return;
    }
    
    if (!formData.name || !formData.phone || !formData.consent) {
      alert('Пожалуйста, заполните все поля и дайте согласие на обработку данных');
      return;
    }

    setIsSubmitting(true);

    const message = `🏠 Новая заявка с сайта

👤 Имя: ${formData.name}
📞 Телефон: ${formData.phone}
📍 Источник: ${source}
⏰ Время: ${new Date().toLocaleString('ru-RU')}`;

    try {
      const response = await fetch(`https://api.telegram.org/bot8498114010:AAFcJmkf9AOaA2p6xUgaQ0edyNJPOIgY2DI/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: '682859146',
          text: message,
          parse_mode: 'HTML'
        })
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({ name: '', phone: '', consent: false });
        setPhoneError('');
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        throw new Error('Ошибка отправки');
      }
    } catch (error) {
      alert('Произошла ошибка при отправке. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={`${styles.form} ${styles.success} ${className}`}>
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>✓</div>
          <h3>Спасибо за заявку!</h3>
          <p>Мы свяжемся с вами в ближайшее время</p>
        </div>
      </div>
    );
  }

  return (
    <form className={`${styles.form} ${className}`} onSubmit={handleSubmit}>
      <h3 className={styles.title}>{title}</h3>
      
      <div className={styles.field}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ваше имя"
          className={styles.input}
          required
        />
      </div>

      <div className={styles.field}>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+7 (999) 123-45-67"
          className={`${styles.input} ${phoneError ? styles.inputError : ''}`}
          required
        />
        {phoneError && <div className={styles.errorText}>{phoneError}</div>}
      </div>

      <div className={styles.checkbox}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="consent"
            checked={formData.consent}
            onChange={handleChange}
            required
          />
          <span className={styles.checkmark}></span>
          <span className={styles.checkboxText}>
            Согласен на обработку персональных данных
          </span>
        </label>
      </div>

      <button 
        type="submit" 
        className={styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className={styles.spinner}></span>
            Отправляем...
          </>
        ) : (
          'Отправить'
        )}
      </button>
    </form>
  );
};

export default ContactForm;