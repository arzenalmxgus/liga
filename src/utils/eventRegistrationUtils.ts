import { collection, doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadImageToSupabase } from "./uploadUtils";

export interface RegistrationFormData {
  name: string;
  dateOfBirth: string;
  age: string;
  nationality: string;
  year: string;
  course: string;
  academicLoadUnits: string;
  yearsOfParticipation: string;
  highSchoolGradYear: string;
  eventType: string;
  school: string;
}

export interface RegistrationFiles {
  photo: File | null;
  registrarCert: File | null;
  psaCopy: File | null;
}

export const uploadRegistrationFiles = async (files: RegistrationFiles, eventId: string) => {
  const uploadPromises = [];
  for (const [key, file] of Object.entries(files)) {
    if (file) {
      uploadPromises.push(
        uploadImageToSupabase(file, `registrations/${eventId}`).then(url => [key, url])
      );
    }
  }
  return Object.fromEntries(await Promise.all(uploadPromises));
};