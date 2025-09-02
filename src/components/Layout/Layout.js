import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import styles from "./Layout.module.css";

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main} role="main" id="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
