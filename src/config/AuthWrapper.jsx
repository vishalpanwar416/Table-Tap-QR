// AuthWrapper.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from './AuthContext';

export default function AuthWrapper({ children, publicOnly = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const checkAuthAndProfile = async () => {
      if (authLoading) return;

      // Public-only route handling
      if (publicOnly) {
        if (user) {
          navigate('/home');
        } else {
          setChecking(false);
        }
        return;
      }

      // Protected route handling
      if (!user) {
        navigate('/login', { state: { from: location.pathname } });
        return;
      }

      // Profile completion check
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('mobile_number, date_of_birth')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        const needsCompletion = !profile?.mobile_number || !profile?.date_of_birth;

        if (needsCompletion && !location.pathname.startsWith('/complete-profile')) {
          navigate('/complete-profile', { state: { from: location.pathname } });
        } else if (!needsCompletion && location.pathname === '/complete-profile') {
          navigate(location.state?.from || '/home');
        }
      } catch (error) {
        console.error("Profile check error:", error);
        if (error.code === 'PGRST116') {
          navigate('/complete-profile', { state: { from: location.pathname } });
        }
      } finally {
        setChecking(false);
      }
    };

    checkAuthAndProfile();
  }, [navigate, location, publicOnly, user, authLoading]);

  if (checking || authLoading) {
    return <div className="text-center p-8">Checking authentication...</div>;
  }

  return children;
}