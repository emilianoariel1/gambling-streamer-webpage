'use client';

import { useToastStore } from '@/hooks/useToast';
import { Toast, ToastContainer } from './Toast';

export function ToastProvider() {
  const { toasts, removeToast } = useToastStore();

  return (
    <ToastContainer>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          onClose={removeToast}
        />
      ))}
    </ToastContainer>
  );
}
