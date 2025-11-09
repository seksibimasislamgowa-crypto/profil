export enum InstitutionType {
  PONDOK_PESANTREN = "Pondok Pesantren",
  MDT = "Madrasah Diniyah Takmiliyah",
  TPQ_TPA = "TPQ/TPA",
  RUMAH_TAHFIDZ = "Rumah Tahfidz Al-Qur'an",
}

export interface AidDetails {
  year?: string;
  amount?: string;
}

export interface AidReceived {
  bos?: AidDetails;
  pip?: AidDetails;
  incubation?: { year?: string; amount?: string; name?: string; };
  incentive?: { year?: string; amount?: string; people?: string; };
  bop?: AidDetails;
}

export enum EducationUnitType {
  DIKNAS = "Pendidikan Umum (Diknas)",
  MADRASAH = "Madrasah (Kemenag)",
  PKPPS = "Pendidikan Kesetaraan Pondok Pesantren Salafiyah (PKPPS)",
  PDF = "Pendidikan Diniyah Formal (PDF)",
  PSM = "Pendidikan Salafiyah Mu'adalah (PSM)",
}

export enum EducationLevel {
  SD_IT = "SD IT",
  MI = "MI",
  ULA = "Ula",
  SMP_IT = "SMP IT",
  MTS = "MTs",
  WUSTHA = "Wustha",
  SMA_IT = "SMA IT",
  MA = "MA",
  ULYA = "Ulya",
}

export interface EducationalUnit {
  id: string; // Unique ID for React key
  unitType: EducationUnitType;
  level: EducationLevel;
  maleStudents: string;
  femaleStudents: string;
  maleTeachers: string;
  femaleTeachers: string;
  operators: string;
  otherStaff: string;
}

export interface InstitutionProfile {
  name: string;
  type: InstitutionType;
  address: string;
  foundedYear: string;
  leaderName: string;
  vision: string;
  mission: string;
  featuredPrograms: string;
  facilities: string;
  achievements: string;
  contact: string;
  images: {
    base64: string;
    mimeType: string;
  }[];

  extracurriculars?: string;
  aidReceived?: AidReceived;
  educationalUnits?: EducationalUnit[];

  // Pondok Pesantren specifics
  educationSystem?: string;
  formalEducationLevels?: string;
  mainBooks?: string;

  // MDT specifics
  gradeLevels?: string;
  curriculum?: string;

  // TPQ/TPA & Rumah Tahfidz specifics
  memorizationTarget?: string;
  teachingMethod?: string;
  studentAgeGroup?: string;
}
