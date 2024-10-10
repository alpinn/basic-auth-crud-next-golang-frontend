'use client';
import React from 'react';
import useForm from '@/hooks/useForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/authContext';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { formData, handleInputChange } = useForm({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert('Please fill in all fields!');
      return;
    }

    try {
      await login(formData.email, formData.password);
      alert('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed, please try again.');
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  placeholder="Masukkan email anda..."
                  value={formData.email}
                  onChange={handleInputChange}
                  name="email"
                  id="email"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  placeholder="Masukkan password anda..."
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  name="password"
                  id="password"
                />
              </div>
            </div>
            <Button className="w-full mt-5 font-bold" type="submit">
              Sign In
            </Button>
            <div className="flex flex-row justify-center mt-3">
              <p>Punya akun?&nbsp;</p>
              <Link href="/register" className="font-bold">
                Sign Up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
