import './globals.css';
import { AuthProvider } from '../components/AuthProvider';

export const metadata = {
  title: 'Admin Console — Affiliate Portal',
  description: 'Review affiliate applications and manage affiliate performance.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-ink font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
