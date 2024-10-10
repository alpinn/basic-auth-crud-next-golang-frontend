'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState, useEffect } from 'react';
import { CgProfile } from 'react-icons/cg';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';

const Page = () => {
  const { user, logout, me } = useAuth();
  const [nominal, setNominal] = useState('');
  const [pesan, setPesan] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      await me(); 
    };
    fetchData();
  }, [me]);
  
  const handleNominalClick = (value: string) => {
    setNominal(value);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
        nominal: parseInt(nominal), 
        pesan,
        user_id: user?.id,  
        name: user?.name,
    };

    try {
      const response = await fetch('http://localhost:8080/beri-donasi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Session-Key': localStorage.getItem('sessionKey') || '',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Donation created successfully!');
      } else {
        alert('Failed to create donation');
      }
    } catch (error) {
      console.error('Error submitting donation:', error);
    }
  };
  const handleLogout = async () => {
    await logout();
    router.push('/');
  };
  return (
    <div className="flex flex-col min-h-screen">
      <div className="absolute top-4 right-10">
        <Button color="redish" variant="default" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <div className="flex flex-row mt-20 gap-10 items-center">
        <div>
          <CgProfile size={100} />
        </div>
        <div>
        <h1 className="text-3xl font-semibold">{user?.name || 'Nama'}</h1>
          <p className="text-xl font-base mt-5">Makasih abangkuu..</p>
        </div>
      </div>
      <div className="mt-8">
        <Card className="w-full">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-5">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="nominal">Nominal</Label>
                  <Input
                    placeholder="Masukkan nominal anda..."
                    value={nominal}
                    onChange={(e) => setNominal(e.target.value)}
                    name="nominal"
                    id="nominal"
                  />
                  <div className="flex flex-row justify-between">
                    <Button
                      className="w-[100px]"
                      color="blue"
                      variant="noShadow"
                      onClick={() => handleNominalClick('5000')}
                      type="button"
                    >
                      5k
                    </Button>
                    <Button
                      className="w-[100px]"
                      color="cyan"
                      variant="noShadow"
                      onClick={() => handleNominalClick('10000')}
                      type="button"
                    >
                      10k
                    </Button>
                    <Button
                      className="w-[100px]"
                      color="cream"
                      variant="noShadow"
                      onClick={() => handleNominalClick('25000')}
                      type="button"
                    >
                      25k
                    </Button>
                    <Button
                      className="w-[100px]"
                      color="purple"
                      variant="noShadow"
                      onClick={() => handleNominalClick('50000')}
                      type="button"
                    >
                      50k
                    </Button>
                    <Button
                      className="w-[100px]"
                      color="green"
                      variant="noShadow"
                      onClick={() => handleNominalClick('100000')}
                      type="button"
                    >
                      100k
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Dari</Label>
                  <Button
                    color="redish"
                    variant="default"
                    className="w-[100px]"
                  >
                    {user?.name || 'User'}
                  </Button>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="pesan">Pesan</Label>
                  <Input
                    placeholder="Masukkan pesan anda..."
                    value={pesan}
                    onChange={(e) => setPesan(e.target.value)}
                    name="pesan"
                    id="pesan"
                  />
                </div>
              </div>
              <Button className="w-[100px] mt-5 font-bold" type="submit">
                Kirim
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
