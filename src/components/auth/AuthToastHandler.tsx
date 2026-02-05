'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToastStore } from '@/hooks/useToast';

const errorMessages: Record<string, string> = {
  oauth_error: 'Error al autenticar con Kick',
  missing_params: 'Parámetros faltantes en la autenticación',
  invalid_state: 'Estado de autenticación inválido',
  missing_verifier: 'Verificador de código faltante',
  auth_failed: 'Falló la autenticación',
};

export function AuthToastHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const addToast = useToastStore((state) => state.addToast);
  const hasShown = useRef(false);

  useEffect(() => {
    // Prevent showing toast multiple times
    if (hasShown.current) return;

    const authStatus = searchParams.get('auth');
    const message = searchParams.get('message');

    if (authStatus === 'success') {
      hasShown.current = true;
      addToast({ type: 'success', message: '¡Inicio de sesión exitoso! Bienvenido' });
      // Clean URL
      router.replace('/');
    } else if (authStatus === 'error') {
      hasShown.current = true;
      const errorMessage = message ? errorMessages[message] || 'Error al iniciar sesión' : 'Error al iniciar sesión';
      addToast({ type: 'error', message: errorMessage });
      // Clean URL
      router.replace('/');
    }
  }, [searchParams, router, addToast]);

  return null;
}
