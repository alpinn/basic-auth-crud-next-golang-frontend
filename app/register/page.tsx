'use client';
import React from 'react';
import useForm from '@/hooks/useForm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/authContext';

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const { formData, handleInputChange } = useForm({
    name: '',
    email: '',
    password: '',
    retypePassword: '',
  });

  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.retypePassword
    ) {
      alert('Please fill in all fields!');
      return;
    }

    if (formData.password !== formData.retypePassword) {
      alert('Passwords do not match!');
      return;
    }

    console.log('Registering user with data:', {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      retypePassword: formData.password,
      role: 'penyawer',
    });

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        'penyawer',
      );
      alert('Registeration successful!');
      router.push('/');
    } catch (err) {
      console.error('Registration error:', err);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Sign Up</CardTitle>
          <CardDescription className="text-base">
            Masukin yang benar karena gak bisa diubah lagi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Nama</Label>
                <Input
                  placeholder="Masukkan nama anda..."
                  value={formData.name}
                  onChange={handleInputChange}
                  name="name"
                  id="name"
                />
              </div>
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
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="retypePassword">Re-type Password</Label>
                <Input
                  type="password"
                  placeholder="Masukkan ulang password anda..."
                  value={formData.retypePassword}
                  onChange={handleInputChange}
                  name="retypePassword"
                  id="retypePassword"
                />
              </div>
            </div>
            <Button className="w-full mt-5 font-bold" type="submit">
              Sign Up
            </Button>
            <div className="flex flex-row justify-center mt-3">
              <p>Punya akun?&nbsp;</p>
              <Link href="/login" className="font-bold">
                Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
