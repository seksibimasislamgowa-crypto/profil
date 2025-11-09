import React, { useState } from 'react';
import { InstitutionProfile } from '../types';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';

interface ProfileDisplayProps {
  profileData: InstitutionProfile | null;
  generatedProfile: string;
  isLoading: boolean;
  error: string;
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ profileData, generatedProfile, isLoading, error }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(generatedProfile).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center h-full min-h-[300px]">
          <SpinnerIcon className="animate-spin h-12 w-12 text-emerald-500 mb-4" />
          <p className="text-slate-600 font-medium">Sedang membuat profil...</p>
          <p className="text-slate-500 text-sm mt-1">Mohon tunggu sebentar, AI sedang bekerja.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <h4 className="font-bold">Terjadi Kesalahan</h4>
          <p>{error}</p>
        </div>
      );
    }

    if (generatedProfile && profileData) {
      return (
        <div>
          {profileData.images && profileData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {profileData.images.map((image, index) => (
                <img
                  key={index}
                  src={`data:${image.mimeType};base64,${image.base64}`}
                  alt={`${profileData.name} - Foto ${index + 1}`}
                  className="w-full h-24 object-cover rounded-md shadow-md"
                />
              ))}
            </div>
          )}
          <div className="relative">
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 bg-slate-200 text-slate-800 hover:bg-slate-300 text-xs font-medium py-1 px-2 rounded-md transition-colors disabled:opacity-50"
            >
                {copied ? 'Tersalin!' : 'Salin'}
            </button>
            <div className="whitespace-pre-wrap p-4 bg-slate-50 border border-slate-200 rounded-md text-slate-800 text-sm leading-relaxed">
              {generatedProfile}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center text-center h-full min-h-[300px] bg-slate-100/50 rounded-lg border-2 border-dashed border-slate-300">
        <BookOpenIcon className="h-16 w-16 text-slate-400 mb-4" />
        <h3 className="text-lg font-semibold text-slate-700">Hasil Profil Akan Tampil di Sini</h3>
        <p className="text-slate-500 mt-1 max-w-sm">Isi formulir di sebelah kiri dan klik "Buat Profil Sekarang" untuk melihat hasilnya.</p>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg min-h-[400px]">
      {renderContent()}
    </div>
  );
};

export default ProfileDisplay;
