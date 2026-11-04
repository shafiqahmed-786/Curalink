// MainLayout — root shell: sidebar + header + main content
import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useIsMobile } from '../../hooks/useIsMobile';
import styles from './MainLayout.module.css';

export default function MainLayout({ children, onNewChat }) {
  const isMobile = useIsMobile();

  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const handleSidebarClose = () => { if (isMobile) setSidebarOpen(false); };

  return (
    <div className={styles.shell}>
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        onNavigate={handleSidebarClose}
        onNewChat={onNewChat}
      />
      <div className={styles.main}>
        <Header onMenuClick={toggleSidebar} />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
