import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DocumentsSectionProps {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
}

const DocumentsSection = ({ handleFileChange }: DocumentsSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white mb-4">Required Documents</h3>
      <div>
        <Label htmlFor="photo" className="text-white font-medium mb-2 block">Photo</Label>
        <Input
          id="photo"
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, 'photo')}
          className="bg-white/10 text-white border-white/20"
          required
        />
      </div>
      <div>
        <Label htmlFor="registrarCert" className="text-white font-medium mb-2 block">Registrar's Certification</Label>
        <Input
          id="registrarCert"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => handleFileChange(e, 'registrarCert')}
          className="bg-white/10 text-white border-white/20"
          required
        />
      </div>
      <div>
        <Label htmlFor="psaCopy" className="text-white font-medium mb-2 block">PSA Copy</Label>
        <Input
          id="psaCopy"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => handleFileChange(e, 'psaCopy')}
          className="bg-white/10 text-white border-white/20"
          required
        />
      </div>
    </div>
  );
};

export default DocumentsSection;