'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { useAuth } from '@/context/authContext';

const withAdmin = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const AdminProtected: React.FC<P> = (props) => {
    const { user, me } = useAuth();
    const router = useRouter();

    useEffect(() => {
      const checkAdmin = async () => {
        try {
          const currentUser = await me();
          if (!currentUser || currentUser.role !== 'admin') {
            router.push('/login');
          }
        } catch (error) {
          console.error('Error checking admin status', error);
          router.push('/login'); 
        }
      };
      checkAdmin();
    }, [me, router]);

    if (!user || user.role !== 'admin') {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return AdminProtected;
};

export default withAdmin;
