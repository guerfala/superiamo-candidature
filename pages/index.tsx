// pages/index.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to another page
    router.push('/signin');
  }, []);

  return null; // Render nothing, because we're redirecting
};

export default HomePage;
