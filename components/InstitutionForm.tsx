import React, { useState, FormEvent, ChangeEvent } from 'react';
import { InstitutionProfile, InstitutionType, AidReceived, EducationalUnit, EducationUnitType, EducationLevel } from '../types';
import ImageUploader from './ImageUploader';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface InstitutionFormProps {
  onSubmit: (formData: InstitutionProfile) => void;
  isLoading: boolean;
}

const initialFormData: InstitutionProfile = {
  name: '',
  type: InstitutionType.PONDOK_PESANTREN,
  address: '',
  foundedYear: '',
  leaderName: '',
  vision: '',
  mission: '',
  featuredPrograms: '',
  facilities: '',
  achievements: '',
  contact: '',
  images: [],
  extracurriculars: '',
  educationalUnits: [],
  aidReceived: {
    bos: { year: '', amount: '' },
    pip: { year: '', amount: '' },
    incubation: { year: '', amount: '', name: '' },
    incentive: { year: '', amount: '', people: '' },
    bop: { year: '', amount: '' },
  }
};

const FormInput: React.FC<{id: string, name?: string, label: string, value: string, onChange: (e: ChangeEvent<HTMLInputElement>) => void, required?: boolean}> = ({ id, name, label, value, onChange, required=true }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <input type="text" id={id} name={name || id} value={value} onChange={onChange} required={required} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 transition duration-150" />
    </div>
);

const FormInputNumber: React.FC<{id: string, name: string, label: string, value: string, onChange: (e: ChangeEvent<HTMLInputElement>) => void, required?: boolean, placeholder?: string}> = ({ id, name, label, value, onChange, required=true, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <input type="number" id={id} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 transition duration-150" min="0" />
    </div>
);


const FormTextArea: React.FC<{id: string, label: string, value: string, onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void, rows?: number, placeholder?: string}> = ({ id, label, value, onChange, rows=3, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <textarea id={id} name={id} value={value} onChange={onChange} rows={rows} placeholder={placeholder} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 transition duration-150" />
    </div>
);


const InstitutionForm: React.FC<InstitutionFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<InstitutionProfile>(initialFormData);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('unit-')) {
        const [_, id, field] = name.split('-');
        setFormData(prev => ({
            ...prev,
            educationalUnits: prev.educationalUnits?.map(unit => 
                unit.id === id ? { ...unit, [field]: value } : unit
            )
        }));
    } else if (name.includes('-')) {
        const [aidType, field] = name.split(/-(.*)/s); // Split only on the first hyphen
        setFormData(prev => {
            const aidData = prev.aidReceived || {};
            const specificAid = aidData[aidType as keyof AidReceived] || {};
            return {
                ...prev,
                aidReceived: {
                    ...aidData,
                    [aidType as string]: {
                        ...(specificAid as object),
                        [field]: value
                    }
                }
            };
        });
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleAddUnit = () => {
    const newUnit: EducationalUnit = {
        id: `unit_${Date.now()}`,
        unitType: EducationUnitType.MADRASAH,
        level: EducationLevel.MTS,
        maleStudents: '',
        femaleStudents: '',
        maleTeachers: '',
        femaleTeachers: '',
        operators: '',
        otherStaff: '',
    };
    setFormData(prev => ({
        ...prev,
        educationalUnits: [...(prev.educationalUnits || []), newUnit]
    }));
  };

  const handleRemoveUnit = (idToRemove: string) => {
    setFormData(prev => ({
        ...prev,
        educationalUnits: prev.educationalUnits?.filter(unit => unit.id !== idToRemove)
    }));
  };

  const handleImagesUpload = (images: { base64: string; mimeType: string; }[]) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderSpecificFields = () => {
    switch (formData.type) {
      case InstitutionType.PONDOK_PESANTREN:
        return (
          <>
            <FormInput id="educationSystem" label="Sistem Pendidikan (e.g., Salafiyah, Modern)" value={formData.educationSystem || ''} onChange={handleChange} />
            <FormInput id="formalEducationLevels" label="Jenjang Pendidikan Formal (e.g., SMP, SMA)" value={formData.formalEducationLevels || ''} onChange={handleChange} />
            <FormInput id="mainBooks" label="Kajian Kitab Utama (e.g., Fathul Qorib)" value={formData.mainBooks || ''} onChange={handleChange} />
          </>
        );
      case InstitutionType.MDT:
        return (
          <>
            <FormInput id="gradeLevels" label="Jenjang Kelas (e.g., Ula, Wustha, Ulya)" value={formData.gradeLevels || ''} onChange={handleChange} />
            <FormInput id="curriculum" label="Kurikulum (e.g., Kemenag, Lokal)" value={formData.curriculum || ''} onChange={handleChange} />
          </>
        );
      case InstitutionType.TPQ_TPA:
      case InstitutionType.RUMAH_TAHFIDZ:
        return (
          <>
            <FormInput id="memorizationTarget" label="Target Hafalan (e.g., Juz 30, 30 Juz)" value={formData.memorizationTarget || ''} onChange={handleChange} />
            <FormInput id="teachingMethod" label="Metode Pengajaran (e.g., Iqro', Ummi)" value={formData.teachingMethod || ''} onChange={handleChange} />
            <FormInput id="studentAgeGroup" label="Kelompok Usia Santri (e.g., 5-12 tahun)" value={formData.studentAgeGroup || ''} onChange={handleChange} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-6">
      <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Informasi Umum</h3>
      <div>
          <label htmlFor="type" className="block text-sm font-medium text-slate-600 mb-1">Jenis Lembaga</label>
          <select id="type" name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 transition duration-150">
              {Object.values(InstitutionType).map(type => (
                  <option key={type} value={type}>{type}</option>
              ))}
          </select>
      </div>
      <FormInput id="name" label="Nama Lembaga" value={formData.name} onChange={handleChange} />
      <FormInput id="leaderName" label="Nama Pimpinan" value={formData.leaderName} onChange={handleChange} />
      <FormInput id="foundedYear" label="Tahun Berdiri" value={formData.foundedYear} onChange={handleChange} />
      <FormTextArea id="address" label="Alamat Lengkap" value={formData.address} onChange={handleChange} />

      <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 pt-4">Visi, Misi, & Program</h3>
      <FormTextArea id="vision" label="Visi" value={formData.vision} onChange={handleChange} />
      <FormTextArea id="mission" label="Misi" value={formData.mission} onChange={handleChange} />
      <FormTextArea id="featuredPrograms" label="Program Unggulan (pisahkan dengan koma)" value={formData.featuredPrograms} onChange={handleChange} />
      
      <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 pt-4">Informasi Pendidikan</h3>
        <div className="space-y-6">
            {formData.educationalUnits?.map((unit, index) => (
                <fieldset key={unit.id} className="border border-slate-200 p-4 rounded-md relative group">
                    <legend className="px-2 text-sm font-medium text-slate-600">Satuan Pendidikan #{index + 1}</legend>
                    <button
                        type="button"
                        onClick={() => handleRemoveUnit(unit.id)}
                        className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 leading-none hover:bg-red-200 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                        aria-label={`Hapus Satuan Pendidikan ${index + 1}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                            <label htmlFor={`unit-${unit.id}-unitType`} className="block text-sm font-medium text-slate-600 mb-1">Satuan Pendidikan</label>
                            <select id={`unit-${unit.id}-unitType`} name={`unit-${unit.id}-unitType`} value={unit.unitType} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 transition duration-150">
                                {Object.values(EducationUnitType).map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor={`unit-${unit.id}-level`} className="block text-sm font-medium text-slate-600 mb-1">Jenjang Pendidikan</label>
                            <select id={`unit-${unit.id}-level`} name={`unit-${unit.id}-level`} value={unit.level} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 transition duration-150">
                                {Object.values(EducationLevel).map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-2"><p className="text-sm font-medium text-slate-600 mt-2 border-t pt-3">Jumlah Santri</p></div>
                        <FormInputNumber id={`unit-${unit.id}-maleStudents`} name={`unit-${unit.id}-maleStudents`} label="Laki-laki" value={unit.maleStudents} onChange={handleChange} required={false} placeholder="0" />
                        <FormInputNumber id={`unit-${unit.id}-femaleStudents`} name={`unit-${unit.id}-femaleStudents`} label="Perempuan" value={unit.femaleStudents} onChange={handleChange} required={false} placeholder="0" />
                        
                        <div className="md:col-span-2"><p className="text-sm font-medium text-slate-600 mt-2 border-t pt-3">Jumlah Guru/Ustadz</p></div>
                        <FormInputNumber id={`unit-${unit.id}-maleTeachers`} name={`unit-${unit.id}-maleTeachers`} label="Laki-laki" value={unit.maleTeachers} onChange={handleChange} required={false} placeholder="0" />
                        <FormInputNumber id={`unit-${unit.id}-femaleTeachers`} name={`unit-${unit.id}-femaleTeachers`} label="Perempuan" value={unit.femaleTeachers} onChange={handleChange} required={false} placeholder="0" />

                        <div className="md:col-span-2"><p className="text-sm font-medium text-slate-600 mt-2 border-t pt-3">Jumlah Tenaga Kependidikan</p></div>
                        <FormInputNumber id={`unit-${unit.id}-operators`} name={`unit-${unit.id}-operators`} label="Operator" value={unit.operators} onChange={handleChange} required={false} placeholder="0" />
                        <FormInputNumber id={`unit-${unit.id}-otherStaff`} name={`unit-${unit.id}-otherStaff`} label="Lainnya" value={unit.otherStaff} onChange={handleChange} required={false} placeholder="0" />
                    </div>
                </fieldset>
            ))}
        </div>
        <div className="mt-4">
            <button
                type="button"
                onClick={handleAddUnit}
                className="w-full flex justify-center items-center gap-2 bg-slate-100 text-slate-700 font-medium py-2 px-4 rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                Tambah Satuan Pendidikan
            </button>
        </div>


      {renderSpecificFields() && (
        <>
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 pt-4">Detail Spesifik</h3>
          {renderSpecificFields()}
        </>
      )}

      <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 pt-4">Lain-lain</h3>
      <FormTextArea id="facilities" label="Fasilitas / Sarana Prasarana (pisahkan dengan koma)" value={formData.facilities} onChange={handleChange} placeholder="Contoh: Masjid, Ruang Kelas, Perpustakaan, Lapangan Olahraga" />
      <FormTextArea id="achievements" label="Prestasi (opsional, pisahkan dengan koma)" value={formData.achievements} onChange={handleChange} />
      <FormTextArea id="extracurriculars" label="Kegiatan Ekstrakurikuler (opsional, pisahkan dengan koma)" value={formData.extracurriculars || ''} onChange={handleChange} />
      <FormInput id="contact" label="Informasi Kontak (Telepon/Email/Website)" value={formData.contact} onChange={handleChange} />
      <ImageUploader onImagesUpload={handleImagesUpload} />

      <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 pt-4">Bantuan Yang Pernah Diterima (Opsional)</h3>
        <div className="space-y-4">
            <fieldset className="border border-slate-200 p-4 rounded-md">
                <legend className="px-2 text-sm font-medium text-slate-600">Bantuan BOS</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput id="bos-year" label="Tahun Diterima" value={formData.aidReceived?.bos?.year || ''} onChange={handleChange} required={false} />
                    <FormInput id="bos-amount" label="Jumlah Diterima (Rp)" value={formData.aidReceived?.bos?.amount || ''} onChange={handleChange} required={false} />
                </div>
            </fieldset>
            <fieldset className="border border-slate-200 p-4 rounded-md">
                <legend className="px-2 text-sm font-medium text-slate-600">Bantuan PIP</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput id="pip-year" label="Tahun Diterima" value={formData.aidReceived?.pip?.year || ''} onChange={handleChange} required={false} />
                    <FormInput id="pip-amount" label="Jumlah Diterima (Rp)" value={formData.aidReceived?.pip?.amount || ''} onChange={handleChange} required={false} />
                </div>
            </fieldset>
            <fieldset className="border border-slate-200 p-4 rounded-md">
                <legend className="px-2 text-sm font-medium text-slate-600">Bantuan Inkubasi</legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput id="incubation-name" label="Nama Jenis Bantuan" value={formData.aidReceived?.incubation?.name || ''} onChange={handleChange} required={false} />
                    <FormInput id="incubation-year" label="Tahun Diterima" value={formData.aidReceived?.incubation?.year || ''} onChange={handleChange} required={false} />
                    <FormInput id="incubation-amount" label="Jumlah Diterima (Rp)" value={formData.aidReceived?.incubation?.amount || ''} onChange={handleChange} required={false} />
                </div>
            </fieldset>
            <fieldset className="border border-slate-200 p-4 rounded-md">
                <legend className="px-2 text-sm font-medium text-slate-600">Bantuan Insentif</legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput id="incentive-people" label="Berapa Orang" value={formData.aidReceived?.incentive?.people || ''} onChange={handleChange} required={false} />
                    <FormInput id="incentive-year" label="Tahun Diterima" value={formData.aidReceived?.incentive?.year || ''} onChange={handleChange} required={false} />
                    <FormInput id="incentive-amount" label="Jumlah Diterima (Rp)" value={formData.aidReceived?.incentive?.amount || ''} onChange={handleChange} required={false} />
                </div>
            </fieldset>
            <fieldset className="border border-slate-200 p-4 rounded-md">
                <legend className="px-2 text-sm font-medium text-slate-600">Bantuan BOP</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput id="bop-year" label="Tahun Diterima" value={formData.aidReceived?.bop?.year || ''} onChange={handleChange} required={false} />
                    <FormInput id="bop-amount" label="Jumlah Diterima (Rp)" value={formData.aidReceived?.bop?.amount || ''} onChange={handleChange} required={false} />
                </div>
            </fieldset>
        </div>


      <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 bg-emerald-600 text-white font-bold py-3 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200">
        {isLoading ? <><SpinnerIcon className="animate-spin h-5 w-5" /> Sedang Memproses...</> : 'Buat Profil Sekarang'}
      </button>
    </form>
  );
};

export default InstitutionForm;