import type { AppProps } from 'next/app';
import { GlobalStyle } from '../styles/global-style';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyle />
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default MyApp;
