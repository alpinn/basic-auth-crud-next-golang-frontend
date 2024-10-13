'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/context/authContext';

interface Donasi {
  id: string;
  name: string;
  nominal: number;
  pesan: string;
  url: string;
  created_at: string;
}

const Page = () => {
  const [donasi, setDonasi] = useState<Donasi[]>([]);
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch('http://localhost:8080/donasi', {
          headers: {
            'Session-Key': localStorage.getItem('sessionKey') || '',
          },
        });

        if (response.ok) {
          const data: Donasi[] = await response.json();
          setDonasi(data);
        } else {
          console.error('Failed to fetch donations');
        }
      } catch (error) {
        console.error('Error fetching donations:', error);
      }
    };

    fetchDonations();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  const totalAmount = donasi.reduce((acc, donasi) => acc + donasi.nominal, 0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="absolute top-4 right-10">
        <Button color="redish" variant="default" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <Card className="w-full mt-24">
        <CardHeader>
          <CardTitle className="text-3xl text-center">
            Riwayat Dapat Uang
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">User</TableHead>
                  <TableHead>Pesan</TableHead>
                  <TableHead>Nominal</TableHead>
                  <TableHead>URL Youtube</TableHead>
                  <TableHead className="text-right">Tanggal Donasi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donasi.length > 0 ? (
                  donasi.map((donasi) => (
                    <TableRow key={donasi.id}>
                      <TableCell className="font-medium">
                        {donasi.name}
                      </TableCell>
                      <TableCell>{donasi.pesan}</TableCell>
                      <TableCell>{donasi.nominal}</TableCell>
                      <TableCell>{donasi.url}</TableCell>
                      <TableCell className="text-right">
                        {new Date(donasi.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No donations found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="flex flex-row text-2xl font-semibold">
              <div>
                <h1>Total: Rp.&nbsp;</h1>
              </div>
              <div>{formatNumber(totalAmount)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
