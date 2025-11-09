
import React, { useState, useCallback } from 'react';
import { InstitutionProfile } from './types';
import { generateProfile } from './services/geminiService';
import Header from './components/Header';
import InstitutionForm from './components/InstitutionForm';
import ProfileDisplay from './components/ProfileDisplay';

const App: React.FC = () => {
  const [profileData, setProfileData] = useState<InstitutionProfile | null>(null);
  const [generatedProfile, setGeneratedProfile] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleGenerateProfile = useCallback(async (formData: InstitutionProfile) => {
    setIsLoading(true);
    setError('');
    setGeneratedProfile('');
    setProfileData(formData);

    try {
      const profileText = await generateProfile(formData);
      setGeneratedProfile(profileText);
    } catch (err) {
      console.error(err);
      setError('Gagal membuat profil. Periksa konsol untuk detailnya dan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
          <div className="mb-8 lg:mb-0">
            <h2 className="text-2xl font-bold text-slate-700 mb-4">Langkah 1: Isi Data Lembaga</h2>
            <InstitutionForm onSubmit={handleGenerateProfile} isLoading={isLoading} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-700 mb-4">Langkah 2: Hasil Profil</h2>
            <ProfileDisplay
              profileData={profileData}
              generatedProfile={generatedProfile}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm mt-8">
        <p>Dibuat dengan ❤️ untuk kemajuan pendidikan keagamaan dan Alquran di Kab. Gowa.</p>
      </footer>
    </div>
  );
};

export default App;