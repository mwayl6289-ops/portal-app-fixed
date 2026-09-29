'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

type Course = {
  id: number;
  title: string;
  category: string;
  status: string;
  description?: string;
};

type PortalResponse = {
  ok: boolean;
  source: string;
  data: Course[];
  message: string;
  timestamp?: string;
};

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [status, setStatus] = useState('Loading...');
  const [source, setSource] = useState('unknown');
  const [isLoading, setIsLoading] = useState(true);
  const [dbHealth, setDbHealth] = useState('checking...');

  useEffect(() => {
    async function loadData() {
      try {
        // Check database health
        const healthRes = await fetch('/api/health');
        const healthData = await healthRes.json();
        setDbHealth(healthData.status || 'unknown');

        // Load portal data
        const res = await fetch('/api/portal/data');
        const data: PortalResponse = await res.json();

        setCourses(data.data || []);
        setStatus(data.message || 'Loaded successfully');
        setSource(data.source || 'unknown');
      } catch (error) {
        setStatus('Failed to load data. Please try again.');
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>📚 Learning Portal</h1>
        <p>A complete, error-free learning platform with Vercel + Neon</p>
      </header>

      <section className={styles.statusSection}>
        <div className={styles.statusCard}>
          <div className={styles.statusItem}>
            <span className={styles.label}>Database Status:</span>
            <span
              className={`${styles.value} ${styles[`status-${dbHealth}`]}`}
            >
              {dbHealth.toUpperCase()}
            </span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.label}>Data Source:</span>
            <span className={styles.value}>{source}</span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.label}>Message:</span>
            <span className={styles.message}>{status}</span>
          </div>
        </div>
      </section>

      <section className={styles.coursesSection}>
        <h2>Available Courses</h2>
        {isLoading ? (
          <div className={styles.loading}>Loading courses...</div>
        ) : courses.length > 0 ? (
          <div className={styles.coursesGrid}>
            {courses.map((course) => (
              <div key={course.id} className={styles.courseCard}>
                <div className={styles.courseHeader}>
                  <h3>{course.title}</h3>
                  <span className={`${styles.status} ${styles[`status-${course.status}`]}`}>
                    {course.status}
                  </span>
                </div>
                <p className={styles.category}>📁 {course.category}</p>
                {course.description && (
                  <p className={styles.description}>{course.description}</p>
                )}
                <button className={styles.enrollBtn}>Enroll Now</button>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>No courses available</div>
        )}
      </section>

      <section className={styles.infoSection}>
        <h2>About This Platform</h2>
        <ul>
          <li>✅ Built with Next.js 14 and TypeScript</li>
          <li>✅ PostgreSQL database with Neon</li>
          <li>✅ Deployed on Vercel with automatic scaling</li>
          <li>✅ Safe fallback system - always works</li>
          <li>✅ Error handling at every step</li>
        </ul>
      </section>

      <footer className={styles.footer}>
        <p>© 2024 Learning Portal. Built with ❤️ on Vercel</p>
      </footer>
    </div>
  );
}
