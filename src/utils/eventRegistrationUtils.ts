import { collection, query, where, getDocs, addDoc, updateDoc, doc, increment, getDoc } from "firebase/firestore";
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

export const checkExistingRegistration = async (registrationId: string) => {
  const registrationDoc = await getDoc(doc(db, "event_participants", registrationId));
  return registrationDoc.exists();
};

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

export const submitRegistration = async (
  formData: RegistrationFormData,
  uploadedFiles: Record<string, string>,
  eventId: string,
  userId: string,
  registrationId: string
) => {
  const registrationData = {
    ...formData,
    ...uploadedFiles,
    eventId,
    userId,
    status: 'pending',
    registrationDate: new Date().toISOString(),
  };

  // Use the provided registrationId when creating the document
  await addDoc(collection(db, "event_participants"), {
    ...registrationData,
    id: registrationId
  });
  
  // Update event participants count
  const eventRef = doc(db, "events", eventId);
  await updateDoc(eventRef, {
    currentParticipants: increment(1)
  });
};