import { useState, useEffect, useRef } from "react";
import styles from "./Header.module.css";

const Header = ({ onConstructorOpen }) => {
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("Вся Россия");
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    right: 0,
  });
  const regionButtonRef = useRef(null);

  const regions = [
    { name: "Вся Россия", short: "РФ" },
    { name: "Ставропольский край", short: "СК" },
    { name: "Краснодарский край", short: "КК" },
    { name: "Республика КЧР", short: "КЧР" },
    { name: "Республика КБР", short: "КБР" },
  ];

  const navItems = [
    "Каталог",
    "Конструктор",
    "Для бизнеса",
    "Отзывы",
    "О компании",
    "Контакты",
  ];

  const handleRegionSelect = (region) => {
    setSelectedRegion(region.name);
    setIsRegionOpen(false);
  };

  const updateDropdownPosition = () => {
    if (regionButtonRef.current) {
      const rect = regionButtonRef.current.getBoundingClientRect();
      const dropdownWidth = 220;
      const rightPosition = Math.max(10, window.innerWidth - rect.right);

      // Проверяем, не выходит ли список за левый край экрана
      const adjustedRight =
        rightPosition + dropdownWidth > window.innerWidth - 10
          ? window.innerWidth - dropdownWidth - 10
          : rightPosition;

      setDropdownPosition({
        top: rect.bottom + 8,
        right: Math.max(10, adjustedRight),
      });
    }
  };

  // Инициализация позиции при монтировании компонента
  useEffect(() => {
    const initPosition = () => {
      if (regionButtonRef.current) {
        updateDropdownPosition();
      }
    };

    // Небольшая задержка для корректного расчета позиции
    const timer = setTimeout(initPosition, 100);

    return () => clearTimeout(timer);
  }, []);

  const toggleRegionDropdown = () => {
    if (!isRegionOpen) {
      updateDropdownPosition();
    }
    setIsRegionOpen(!isRegionOpen);
  };

  const getSelectedRegionShort = () => {
    const region = regions.find((r) => r.name === selectedRegion);
    return region ? region.short : "РФ";
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isRegionOpen &&
        !event.target.closest(`.${styles.regionSelector}`) &&
        !event.target.closest(`.${styles.mobileRegionSelector}`)
      ) {
        setIsRegionOpen(false);
      }
    };

    const handleResize = () => {
      if (isRegionOpen) {
        updateDropdownPosition();
      }
    };

    document.addEventListener("click", handleClickOutside);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize);
    };
  }, [isRegionOpen]);

  return (
    <>
      <header className={styles.header} role="banner">
        <div className={styles.container}>
          <div className={styles.logo}>
            <a
              href="/"
              className={styles.logoText}
              aria-label="Easy House - главная страница"
              title="Easy House - модульные дома">
              Easy House
            </a>
          </div>

          <nav
            className={styles.nav}
            role="navigation"
            aria-label="Основное меню">
            {navItems.map((item, index) => {
              let href = '#';
              if (item === 'Каталог') href = '/catalog';
              if (item === 'Конструктор') href = '/konstruktor';
              if (item === 'Для бизнеса') href = '/dlya-biznesa';
              if (item === 'Отзывы') href = '/otzyvy';
              if (item === 'О компании') href = '/o-kompanii';
              if (item === 'Контакты') href = '/kontakty';
              
              if (item === 'Конструктор') {
                return (
                  <button
                    key={index}
                    onClick={onConstructorOpen}
                    className={styles.navLink}
                    title={`Открыть конструктор`}>
                    {item}
                  </button>
                );
              }
              
              return (
                <a
                  key={index}
                  href={href}
                  className={styles.navLink}
                  title={`Перейти к разделу: ${item}`}>
                  {item}
                </a>
              );
            })}
          </nav>

          <div className={styles.rightSection}>
            <button
              className={`${styles.contactBtn} ${styles.desktopOnly}`}
              type="button"
              aria-label="Открыть форму обратной связи">
              Обратная связь
            </button>

            <div
              className={`${styles.regionSelector} ${styles.desktopOnly}`}
              role="combobox"
              aria-label="Выбор региона">
              <button
                ref={regionButtonRef}
                className={styles.regionButton}
                onClick={toggleRegionDropdown}
                type="button"
                aria-expanded={isRegionOpen}
                aria-haspopup="listbox"
                aria-label={`Текущий регион: ${selectedRegion}. Нажмите для выбора другого региона`}>
                <span className={styles.regionText}>
                  {getSelectedRegionShort()}
                </span>
                <div
                  className={`${styles.arrow} ${
                    isRegionOpen ? styles.open : ""
                  }`}></div>
              </button>
            </div>

            <button
              className={styles.mobileMenuBtn}
              onClick={toggleMobileMenu}
              aria-label="Меню">
              <span
                className={`${styles.hamburger} ${
                  isMobileMenuOpen ? styles.open : ""
                }`}></span>
              <span
                className={`${styles.hamburger} ${
                  isMobileMenuOpen ? styles.open : ""
                }`}></span>
              <span
                className={`${styles.hamburger} ${
                  isMobileMenuOpen ? styles.open : ""
                }`}></span>
            </button>
          </div>
        </div>
      </header>

      {/* Выпадающий список регионов для десктопа */}
      <div
        className={`${styles.dropdown} ${isRegionOpen ? styles.open : ""}`}
        role="listbox"
        aria-label="Список регионов"
        style={{
          top: `${dropdownPosition.top}px`,
          right: `${dropdownPosition.right}px`,
        }}>
        {regions.map((region, index) => (
          <button
            key={index}
            className={`${styles.dropdownItem} ${
              selectedRegion === region.name ? styles.selected : ""
            }`}
            onClick={() => handleRegionSelect(region)}
            type="button"
            role="option"
            aria-selected={selectedRegion === region.name}
            title={`Выбрать регион: ${region.name}`}>
            {region.name}
          </button>
        ))}
      </div>

      <div
        className={`${styles.mobileOverlay} ${
          isMobileMenuOpen ? styles.open : ""
        }`}
        onClick={closeMobileMenu}></div>

      <nav
        className={`${styles.mobileNav} ${
          isMobileMenuOpen ? styles.open : ""
        }`}>
        <div className={styles.mobileHeader}>
          <div className={styles.mobileRegionSelector}>
            <button
              className={styles.mobileRegionButton}
              onClick={() => setIsRegionOpen(!isRegionOpen)}>
              <span>{getSelectedRegionShort()}</span>
              <div
                className={`${styles.arrow} ${
                  isRegionOpen ? styles.open : ""
                }`}></div>
            </button>

            <div
              className={`${styles.mobileDropdown} ${
                isRegionOpen ? styles.open : ""
              }`}>
              {regions.map((region, index) => (
                <button
                  key={index}
                  className={`${styles.mobileDropdownItem} ${
                    selectedRegion === region.name ? styles.selected : ""
                  }`}
                  onClick={() => handleRegionSelect(region)}>
                  {region.name}
                </button>
              ))}
            </div>
          </div>

          <button
            className={styles.mobileCloseText}
            onClick={closeMobileMenu}
            aria-label="Закрыть меню">
            <span role="text">Закрыть</span>
          </button>
        </div>
        <div className={styles.mobileNavContent}>
          <div className={styles.mobileNavItems}>
            {navItems.map((item, index) => {
              let href = '#';
              if (item === 'Каталог') href = '/catalog';
              if (item === 'Конструктор') href = '/konstruktor';
              if (item === 'Для бизнеса') href = '/dlya-biznesa';
              if (item === 'Отзывы') href = '/otzyvy';
              if (item === 'О компании') href = '/o-kompanii';
              if (item === 'Контакты') href = '/kontakty';
              
              if (item === 'Конструктор') {
                return (
                  <button
                    key={index}
                    onClick={() => {
                      onConstructorOpen();
                      closeMobileMenu();
                    }}
                    className={styles.mobileNavLink}
                    style={{ animationDelay: `${index * 0.1}s`, textAlign: 'left', width: '100%' }}>
                    {item}
                  </button>
                );
              }
              
              return (
                <a
                  key={index}
                  href={href}
                  className={styles.mobileNavLink}
                  onClick={closeMobileMenu}
                  style={{ animationDelay: `${index * 0.1}s` }}>
                  {item}
                </a>
              );
            })}
          </div>

          <div className={styles.mobileActions}>
            <button
              className={styles.mobileContactBtn}
              onClick={closeMobileMenu}>
              Обратная связь
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
