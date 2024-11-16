// pages/_app.js
import '../app/globals.css';
import Sidebar from '@/components/Sidebar';

function MyApp({ Component, pageProps }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow">
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;
