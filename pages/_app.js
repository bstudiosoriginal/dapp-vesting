import App from 'next/app'
import '../app/globals.css'
import { MyContextProvider } from '../context/applicationtotalstate';

function MyApp({ Component, pageProps }) {
  return (
  <MyContextProvider>
    <Component {...pageProps} />
  </MyContextProvider>
);
  }

export default MyApp
