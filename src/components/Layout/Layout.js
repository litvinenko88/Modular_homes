import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import FloatingContacts from "../FloatingContacts/FloatingContacts";
import styles from "./Layout.module.css";

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main} role="main" id="main-content">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
      <FloatingContacts />
    </div>
  );
};

export default Layout;
