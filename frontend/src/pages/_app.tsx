import '@root/faust.config';
import React from 'react';
import { useRouter } from 'next/router';
import { WordPressBlocksProvider, fromThemeJson } from '@faustwp/blocks';
import { FaustProvider } from '@faustwp/core';
import blocks from '@/wp-blocks';
// import '@root/src/styles/blocks.scss';
import '@/styles/globalStylesheet.css';
import { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {  
  const router = useRouter();

  return (
    <FaustProvider pageProps={pageProps}>
      <WordPressBlocksProvider
        config={{
          blocks,
          theme: undefined,
        }}>
        <Component {...pageProps} key={router.asPath} />
      </WordPressBlocksProvider>
    </FaustProvider>
  );
}