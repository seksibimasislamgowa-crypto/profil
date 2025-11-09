
import React from 'react';
import KemenagLogo from './icons/KemenagLogo';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 md:px-8 flex items-center gap-4">
        <KemenagLogo className="w-12 h-12" />
        <div>
          <h1 className="text-2xl font-bold text-emerald-700">
            Profil lembaga Pendidikan Keagamaan dan Alquran Kab. Gowa
          </h1>
          <p className="text-slate-500">Buat profil profesional untuk lembaga Anda dengan bantuan AI.</p>
        </div>
      </div>
    </header>
  );
};

export default Header;