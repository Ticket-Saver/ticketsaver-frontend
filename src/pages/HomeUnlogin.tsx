import Hero from '../components/Hero'
import FeaturedEvents from '../components/FeaturedEvents'
import { QueryClient, QueryClientProvider } from 'react-query';

export default function HomeUnlogin() {

  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Hero />
        <FeaturedEvents />
      </QueryClientProvider>
    </>
  )
}
