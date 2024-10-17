import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css"; // Include any global styles if you have
import Link from "next/link";
import Script from "next/script";

import '../public/assets/vendor/bootstrap/css/bootstrap.min.css';
import '../public/assets/vendor/bootstrap-icons/bootstrap-icons.css';
import '../public/assets/vendor/aos/aos.css';
import '../public/assets/vendor/glightbox/css/glightbox.min.css';
import '../public/assets/vendor/swiper/swiper-bundle.min.css';
import '../public/assets/css/main.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Mentor Template</title>
      </Head>

      <header id="header" className="header d-flex align-items-center sticky-top">
        <div className="container-fluid container-xl position-relative d-flex align-items-center">
        <Link href="/" className="logo d-flex align-items-center me-auto">
            <h1 className="sitename">Supriamo</h1>
        </Link>
          
        </div>
      </header>

      <main className="main">
        <Component {...pageProps} />
      </main>

      {/* Include your JS files */}
      <Script src="/assets/vendor/bootstrap/js/bootstrap.bundle.min.js" strategy="lazyOnload"/>
      <Script src="/assets/vendor/aos/aos.js" strategy="lazyOnload"/>
      <Script src="/assets/vendor/glightbox/js/glightbox.min.js" strategy="lazyOnload"/>
      <Script src="/assets/vendor/swiper/swiper-bundle.min.js" strategy="lazyOnload"/>
      <Script src="/assets/js/main.js" strategy="lazyOnload"/>
    </SessionProvider>
  );
}

export default MyApp;
