import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import AIChatbot from "../components/AIChatbot";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}> <Head> <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes" /> </Head> <Component {...pageProps} /> <AIChatbot /> </SessionProvider>
  );
}

export default MyApp;
