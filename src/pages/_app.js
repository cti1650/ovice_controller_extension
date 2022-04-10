import '@styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <div className='bg-gray-800 p-4'>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
