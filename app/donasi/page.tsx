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
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);
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

  const extractVideoId = (youtubeUrl: string) => {
    const urlPattern = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = youtubeUrl.match(urlPattern);
    return match ? match[1] : null;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputUrl = e.target.value;
    setUrl(inputUrl);
    const videoId = extractVideoId(inputUrl);
    setVideoId(videoId);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      nominal: parseInt(nominal.replace(/\./g, ''), 10),
      pesan,
      url,
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
        setNominal('');
        setPesan('');
        setUrl('');
        setVideoId(null);
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

  const formatCurrency = (amount: string) => {
    const num = parseInt(amount.replace(/\./g, ''), 10);
    if (isNaN(num)) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <div className="flex flex-col min-h-screen py-8">
      <div className="absolute top-4 right-12 lg:right-14">
        <Button color="redish" variant="default" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <div className="flex flex-row mt-20 gap-10 items-center  ml-0 lg:ml-[320px]">
        <div>
          <CgProfile size={100} />
        </div>
        <div>
          <h1 className="text-3xl font-semibold">{user?.name || 'Nama'}</h1>
          <p className="text-xl font-base mt-5">Makasih abangkuu..</p>
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <Card className="w-full lg:w-[600px]">
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
                  <div className='bg-[#ff8787] w-[100px] inline-flex items-center text-text justify-center whitespace-nowrap rounded-lg h-10 px-4 py-2 border-2 border-border dark:border-darkBorder shadow-light dark:shadow-dark hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:hover:shadow-none ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'>
                  <p
                    className="text-center"
                  >
                    {user?.name || 'User'}
                  </p>

                  </div>
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
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="url">YouTube URL</Label>
                  <Input
                    placeholder="Paste the YouTube video URL here..."
                    value={url}
                    onChange={handleUrlChange}
                    name="url"
                    id="url"
                  />
                  {videoId && (
                    <div className="mt-4">
                      <iframe
                        className="mt-4"
                        width="560"
                        height="315"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-row justify-between mt-10">
                <div className='text-2xl font-semibold'>
                  <h1>Total: Rp.&nbsp;{formatCurrency(nominal)}</h1>
                </div>
                <div>
                  <Button className="w-[100px] font-bold" type="submit">
                    Kirim
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
