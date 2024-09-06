import { Program } from "./program";

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'student' | 'teacher';  // Öğrenciler ve öğretmenler için roller
    schedule?: Program[];  // Kullanıcının ders programları
  }