"use client";

import { Auth, Card, Typography, Space } from '@supabase/ui';
import { supabase } from '../lib/db';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type ViewType =
  | 'sign_in'
  | 'sign_up'
  | 'forgotten_password'
  | 'magic_link'
  | 'update_password'

const Index = (): JSX.Element => {
  const [authView, setAuthView] = useState<ViewType>('sign_in');
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: string, session: any) => {
        if (event === 'PASSWORD_RECOVERY'){
          setAuthView('update_password');
          return;
        }
        if (event === 'USER_UPDATED'){
          setTimeout(() => setAuthView('sign_in'), 1000);
          return;
        }
        if (event === 'SIGNED_IN'){
          localStorage.setItem("session", JSON.stringify(session));
          
          window.location.reload();
        }
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const View = (): JSX.Element => {
    return (
      <Space direction="vertical" size={8}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img className= "mb-2 rounded-md" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Kenya.svg/1200px-Flag_of_Kenya.svg.png" width="40" />
          <Typography.Title level={4}>Secure your Signature 🔒</Typography.Title>
          <Typography.Title level={5}>Safeguard your data with E2EE encryption</Typography.Title>
        </div>
        <Auth
          supabaseClient={supabase}
          // providers={['google', 'twitter']}
          view={authView}
          socialLayout="horizontal"
          socialButtonSize="xlarge"
          // onlyThirdPartyProviders
        />
      </Space>
    );
  };

  return (
    <div className='flex'>
      <div className='w-3/3 m-auto mt-10 px-10 align-middle'>
        <Card>
          <View />
        </Card>
      </div>
    </div>
  );
};

export default Index;