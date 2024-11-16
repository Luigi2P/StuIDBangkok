// components/Layout.js
import Sidebar from './sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-grow p-4 md:p-24">
        {children}
      </main>
    </div>
  );
}
