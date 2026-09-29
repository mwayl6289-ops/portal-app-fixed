export const metadata = {
  title: 'Portal Learning',
  description: 'A simple learning platform demo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#f8fafc', color: '#111827' }}>{children}</body>
    </html>
  );
}
