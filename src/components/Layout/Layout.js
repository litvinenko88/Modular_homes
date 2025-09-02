import { useState, createContext, useContext, cloneElement, Children } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import ModularConstructor from "../ConstructorApp/constructor/ModularConstructor";
import styles from "./Layout.module.css";

const ConstructorContext = createContext();

export const useConstructor = () => {
  const context = useContext(ConstructorContext);
  if (!context) {
    throw new Error('useConstructor must be used within a Layout');
  }
  return context;
};

const Layout = ({ children }) => {
  const [isConstructorOpen, setIsConstructorOpen] = useState(false);

  const openConstructor = () => setIsConstructorOpen(true);
  const closeConstructor = () => setIsConstructorOpen(false);

  const contextValue = {
    openConstructor,
    closeConstructor,
    isConstructorOpen
  };

  const enhanceChildren = (children) => {
    return Children.map(children, (child) => {
      if (child && child.type && child.type.name === 'ProjectConstructor') {
        return cloneElement(child, { onConstructorOpen: openConstructor });
      }
      return child;
    });
  };

  return (
    <ConstructorContext.Provider value={contextValue}>
      <div className={styles.layout}>
        <Header onConstructorOpen={openConstructor} />
        <main className={styles.main} role="main" id="main-content">
          {enhanceChildren(children)}
        </main>
        <Footer />
        
        {isConstructorOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            zIndex: 9999
          }}>
            <button 
              onClick={closeConstructor}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: 10000,
                padding: '10px 20px',
                backgroundColor: '#333',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Закрыть
            </button>
            <ModularConstructor />
          </div>
        )}
      </div>
    </ConstructorContext.Provider>
  );
};

export default Layout;
