import '@styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <div className='bg-[#F8F8F8] p-[25px]'>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
