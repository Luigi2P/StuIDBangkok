// components/Layout.js
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex flex-col flex-grow p-24 gap-y-3">
        {children}
      </main>
    </div>
  );
}
