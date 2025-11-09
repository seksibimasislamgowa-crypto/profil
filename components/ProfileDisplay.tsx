import React from 'react';
import { InstitutionProfile } from '../types';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface ProfileDisplayProps {
  profileData: InstitutionProfile | null;
  generatedProfile: string;
  isLoading: boolean;
  error: string;
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ profileData, generatedProfile, isLoading, error }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center h-full min-h-[300px]">
          <SpinnerIcon className="animate-spin h-12 w-12 text-emerald-600 mb-4" />
          <p className="text-slate-600 font-semibold">AI sedang merangkai kata...</p>
          <p className="text-slate-500 text-sm">Mohon tunggu sejenak.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center text-center h-full min-h-[300px] bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      );
    }

    if (!generatedProfile && !profileData) {
        return (
            <div className="flex flex-col items-center justify-center text-center h-full min-h-[300px] border-2 border-dashed border-slate-300 rounded-lg p-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-slate-600 font-semibold">Profil Anda Akan Tampil di Sini</h3>
                <p className="text-slate-500 text-sm mt-1">Isi formulir di sebelah kiri dan klik "Buat Profil" untuk memulai.</p>
            </div>
        );
    }

    return (
      <>
        {profileData?.images && profileData.images.length > 0 && (
            <div className={`mb-6 grid gap-4 ${profileData.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {profileData.images.map((image, index) => (
                    <img 
                        key={index}
                        src={`data:${image.mimeType};base64,${image.base64}`} 
                        alt={`${profileData.name} - Foto ${index + 1}`} 
                        className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                ))}
            </div>
        )}
        {profileData && (
            <div className="mb-6">
                <h3 className="text-3xl font-extrabold text-slate-800">{profileData.name}</h3>
                <p className="text-md text-slate-500 mt-1">Pimpinan: {profileData.leaderName}</p>
            </div>
        )}
        <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-justify">
          {generatedProfile}
        </div>
      </>
    );
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg min-h-[400px]">
      {renderContent()}
    </div>
  );
};

export default ProfileDisplay;
