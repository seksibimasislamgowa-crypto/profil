import { GoogleGenAI } from "@google/genai";
import { InstitutionProfile, AidReceived, EducationalUnit } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

function formatAidReceived(aid?: AidReceived): string {
  if (!aid) return '';
  let aidText = '';
  
  if (aid.bos?.year && aid.bos?.amount) {
      aidText += `- Bantuan Operasional Sekolah (BOS): Diterima tahun ${aid.bos.year}, sejumlah Rp ${aid.bos.amount}\n`;
  }
  if (aid.pip?.year && aid.pip?.amount) {
      aidText += `- Program Indonesia Pintar (PIP): Diterima tahun ${aid.pip.year}, sejumlah Rp ${aid.pip.amount}\n`;
  }
  if (aid.incubation?.name && aid.incubation?.year && aid.incubation?.amount) {
      aidText += `- Bantuan Inkubasi (${aid.incubation.name}): Diterima tahun ${aid.incubation.year}, sejumlah Rp ${aid.incubation.amount}\n`;
  }
  if (aid.incentive?.people && aid.incentive?.year && aid.incentive?.amount) {
      aidText += `- Bantuan Insentif: Diterima untuk ${aid.incentive.people} orang pada tahun ${aid.incentive.year}, sejumlah Rp ${aid.incentive.amount}\n`;
  }
  if (aid.bop?.year && aid.bop?.amount) {
      aidText += `- Bantuan Operasional Pendidikan (BOP): Diterima tahun ${aid.bop.year}, sejumlah Rp ${aid.bop.amount}\n`;
  }

  if (aidText) {
      return `
**Bantuan yang Pernah Diterima:**
${aidText}`;
  }
  return '';
}

function formatEducationalUnits(units?: EducationalUnit[]): string {
    if (!units || units.length === 0) return '';
  
    const unitDetails = units.map((unit, index) => {
      const totalStudents = (parseInt(unit.maleStudents, 10) || 0) + (parseInt(unit.femaleStudents, 10) || 0);
      const totalTeachers = (parseInt(unit.maleTeachers, 10) || 0) + (parseInt(unit.femaleTeachers, 10) || 0);
      const totalStaff = (parseInt(unit.operators, 10) || 0) + (parseInt(unit.otherStaff, 10) || 0);
  
      return `
  **Satuan Pendidikan ${index + 1}: ${unit.unitType} - ${unit.level}**
  - Jumlah Santri: ${totalStudents} (Laki-laki: ${unit.maleStudents || 0}, Perempuan: ${unit.femaleStudents || 0})
  - Jumlah Guru/Ustadz: ${totalTeachers} (Laki-laki: ${unit.maleTeachers || 0}, Perempuan: ${unit.femaleTeachers || 0})
  - Jumlah Tenaga Kependidikan Lainnya: ${totalStaff} (Operator: ${unit.operators || 0}, Lainnya: ${unit.otherStaff || 0})
      `;
    }).join('');
  
    return `
**Detail Satuan Pendidikan:**
${unitDetails}`;
}

function buildPrompt(data: InstitutionProfile): string {
  let specificDetails = '';
  switch (data.type) {
    case 'Pondok Pesantren':
      specificDetails = `
- Sistem Pendidikan: ${data.educationSystem || 'Tidak disebutkan'}
- Jenjang Pendidikan Formal: ${data.formalEducationLevels || 'Tidak disebutkan'}
- Kajian Kitab Utama: ${data.mainBooks || 'Tidak disebutkan'}
      `;
      break;
    case 'Madrasah Diniyah Takmiliyah':
      specificDetails = `
- Jenjang Kelas: ${data.gradeLevels || 'Tidak disebutkan'}
- Kurikulum: ${data.curriculum || 'Tidak disebutkan'}
      `;
      break;
    case 'TPQ/TPA':
    case "Rumah Tahfidz Al-Qur'an":
      specificDetails = `
- Target Hafalan: ${data.memorizationTarget || 'Tidak disebutkan'}
- Metode Pengajaran: ${data.teachingMethod || 'Tidak disebutkan'}
- Kelompok Usia Santri: ${data.studentAgeGroup || 'Tidak disebutkan'}
      `;
      break;
  }
  
  const aidDetails = formatAidReceived(data.aidReceived);
  const educationDetails = formatEducationalUnits(data.educationalUnits);


  return `
Anda adalah seorang penulis ahli yang bertugas membuat profil lembaga pendidikan Islam di Indonesia. Buatkan sebuah profil naratif yang menarik, profesional, dan informatif berdasarkan data di bawah ini.

Gunakan gaya bahasa yang formal namun hangat dan mengundang. Susun profil dalam beberapa bagian yang jelas: Pendahuluan, Visi & Misi, Program Pendidikan & Ekstrakurikuler, Detail Satuan Pendidikan (jika ada), Fasilitas & Sarana Prasarana, Prestasi, Bantuan Pemerintah (jika ada), dan Penutup (termasuk informasi kontak dan ajakan bergabung).

Pastikan untuk mengintegrasikan data "Detail Satuan Pendidikan" ke dalam bagian Program Pendidikan secara naratif. Sebutkan jenjang yang tersedia dan berikan gambaran tentang skala lembaga berdasarkan jumlah santri dan guru.

**Data Lembaga:**
- Nama Lembaga: ${data.name}
- Jenis Lembaga: ${data.type}
- Nama Pimpinan: ${data.leaderName}
- Tahun Berdiri: ${data.foundedYear}
- Alamat: ${data.address}
- Visi: ${data.vision}
- Misi: ${data.mission}
- Program Unggulan: ${data.featuredPrograms}
- Kegiatan Ekstrakurikuler: ${data.extracurriculars || 'Tidak disebutkan'}
- Fasilitas / Sarana Prasarana: ${data.facilities}
- Prestasi: ${data.achievements}
- Kontak: ${data.contact}
${specificDetails}
${educationDetails}
${aidDetails}
---
Buatlah profilnya sekarang.
  `;
}

export async function generateProfile(data: InstitutionProfile): Promise<string> {
  const prompt = buildPrompt(data);
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating profile with Gemini:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
}
