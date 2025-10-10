'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Immediate redirect to /dashboard to prevent sidebar flickering
    router.replace('/dashboard');
  }, [router]);

  // Return null to prevent any rendering before redirect
  return null;
}
       