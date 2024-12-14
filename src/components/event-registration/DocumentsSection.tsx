import { useState } from "react";
import FileUploadField from "./FileUploadField";

interface DocumentsSectionProps {
  handleFileChange: (file: File | null, type: string) => void;
  isUploading: boolean;
}

const DocumentsSection = ({ handleFileChange, isUploading }: DocumentsSectionProps) => {
  const [uploadProgress] = useState({
    photo: 0,
    registrarCert: 0,
    psaCopy: 0,
  });

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white mb-4">Required Documents</h3>
      
      <FileUploadField
        label="Photo"
        id="photo"
        accept="image/*"
        onChange={(file) => handleFileChange(file, 'photo')}
        isUploading={isUploading}
        progress={uploadProgress.photo}
      />
      
      <FileUploadField
        label="Registrar's Certification"
        id="registrarCert"
        accept=".pdf,.doc,.docx"
        onChange={(file) => handleFileChange(file, 'registrarCert')}
        isUploading={isUploading}
        progress={uploadProgress.registrarCert}
      />
      
      <FileUploadField
        label="PSA Copy"
        id="psaCopy"
        accept=".pdf,.doc,.docx"
        onChange={(file) => handleFileChange(file, 'psaCopy')}
        isUploading={isUploading}
        progress={uploadProgress.psaCopy}
      />
    </div>
  );
};

export default DocumentsSection;