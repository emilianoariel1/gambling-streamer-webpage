'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AuthCompletePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const completeAuth = async () => {
      try {
        const token = searchParams.get('token');
        if (!token) {
          throw new Error('No access token provided');
        }

        console.log('🔄 Fetching user data from client...');

        // Try to fetch user data from the browser (less CORS restrictions)
        const endpoints = [
          'https://api.kick.com/public/v1/users', // Official public API endpoint
          'https://kick.com/api/v2/user',
          'https://kick.com/api/v1/user',
          'https://kick.com/oauth/userinfo',
          'https://id.kick.com/oauth/userinfo',
        ];

        let userData = null;

        for (const endpoint of endpoints) {
          try {
            console.log(`🔄 Trying endpoint: ${endpoint}`);
            const response = await fetch(endpoint, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
              },
              mode: 'cors',
            });

            console.log(`📊 Response status: ${response.status}`);

            if (response.ok) {
              const contentType = response.headers.get('content-type');
              console.log(`📄 Content-Type: ${contentType}`);

              if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                console.log(`✅ Got user data:`, JSON.stringify(data, null, 2));

                // Check if data is in the format { data: [...] }
                if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
                  userData = data.data[0]; // Use first item from array
                  console.log(`✅ Using user data from array:`, userData);
                  break;
                } else if (data && (data.id || data.user_id || data.user?.id || data.sub)) {
                  userData = data.user || data;
                  console.log(`✅ Using user data:`, userData);
                  break;
                } else {
                  console.log(`⚠️ No valid user data in response`);
                }
              } else {
                const text = await response.text();
                console.log(`⚠️ Non-JSON response:`, text.substring(0, 200));
              }
            } else {
              const errorText = await response.text();
              console.log(`❌ Error response:`, errorText.substring(0, 200));
            }
          } catch (err) {
            console.log(`❌ Endpoint ${endpoint} failed:`, err);
          }
        }

        if (!userData) {
          console.log('⚠️ Could not fetch user data from any endpoint');
          // Still try to complete auth without user data
        }

        // Send user data to server to complete authentication
        const completeResponse = await fetch('/api/auth/kick/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            userData,
          }),
        });

        if (!completeResponse.ok) {
          throw new Error('Failed to complete authentication');
        }

        setStatus('success');
        console.log('✅ Authentication completed successfully');

        // Force a full page reload to update auth state
        setTimeout(() => {
          window.location.href = '/?auth=success';
        }, 500);

      } catch (error) {
        console.error('❌ Authentication completion error:', error);
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error');

        // Redirect to home with error after 2 seconds
        setTimeout(() => {
          router.push('/?auth=error&message=auth_failed');
        }, 2000);
      }
    };

    completeAuth();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Completando autenticación...</h2>
            <p className="text-gray-400">Obteniendo tu información de perfil</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">¡Éxito!</h2>
            <p className="text-gray-400">Redirigiendo...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
            <p className="text-gray-400">{errorMessage}</p>
          </>
        )}
      </div>
    </div>
  );
}
