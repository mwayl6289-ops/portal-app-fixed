'use client';

import { useEffect, useState } from 'react';

type Course = {
  id: number;
  title: string;
  category: string;
  status: string;
};

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/portal/data');
        const payload = await response.json();

        setCourses(payload.data || []);
        setStatus(payload.message || 'Connected');
      } catch (error) {
        setStatus('Failed to load portal data');
      }
    }

    loadData();
  }, []);

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', padding: '40px', maxWidth: 980, margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>Portal Learning</h1>
      <p style={{ color: '#555', marginBottom: '28px' }}>
        A safe education platform starter with Vercel + Neon PostgreSQL.
      </p>

      <div
        style={{
          background: '#f5f7ff',
          border: '1px solid #dfe7ff',
          borderRadius: 12,
          padding: '18px 20px',
          marginBottom: 30,
        }}
      >
        <strong>Status:</strong> {status}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        {courses.map((course) => (
          <div
            key={course.id}
            style={{
              background: '#fff',
              borderRadius: 12,
              border: '1px solid #e6eaf2',
              padding: 18,
              boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
            }}
          >
            <small style={{ color: '#6b7280' }}>{course.category}</small>
            <h3 style={{ margin: '8px 0' }}>{course.title}</h3>
            <span
              style={{
                display: 'inline-block',
                background: course.status === 'active' ? '#d9fbe8' : '#fff4d6',
                color: course.status === 'active' ? '#0d7a46' : '#9a6a00',
                borderRadius: 999,
                padding: '6px 10px',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {course.status}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
