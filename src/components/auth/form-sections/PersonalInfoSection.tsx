import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dispatch, SetStateAction } from "react";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  birthdate: string;
}

interface PersonalInfoSectionProps {
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
}

const PersonalInfoSection = ({ formData, setFormData }: PersonalInfoSectionProps) => {
  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-base">First Name</Label>
          <Input 
            id="firstName" 
            value={formData.firstName}
            onChange={(e) => updateFormData('firstName', e.target.value)}
            required 
            className="h-12 text-base rounded-lg" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="middleName" className="text-base">Middle Name</Label>
          <Select value={formData.middleName} onValueChange={(value) => updateFormData('middleName', value)}>
            <SelectTrigger className="h-12 text-base rounded-lg">
              <SelectValue placeholder="Select middle name option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="na">N/A</SelectItem>
              <SelectItem value="custom">Enter Middle Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-base">Last Name</Label>
          <Input 
            id="lastName" 
            value={formData.lastName}
            onChange={(e) => updateFormData('lastName', e.target.value)}
            required 
            className="h-12 text-base rounded-lg" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="suffix" className="text-base">Suffix</Label>
          <Select value={formData.suffix} onValueChange={(value) => updateFormData('suffix', value)}>
            <SelectTrigger className="h-12 text-base rounded-lg">
              <SelectValue placeholder="Select suffix" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="na">N/A</SelectItem>
              <SelectItem value="jr">Jr.</SelectItem>
              <SelectItem value="sr">Sr.</SelectItem>
              <SelectItem value="ii">II</SelectItem>
              <SelectItem value="iii">III</SelectItem>
              <SelectItem value="iv">IV</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="birthdate" className="text-base">Birthdate</Label>
        <Input 
          id="birthdate" 
          type="date" 
          value={formData.birthdate}
          onChange={(e) => updateFormData('birthdate', e.target.value)}
          required 
          className="h-12 text-base rounded-lg" 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-base">Email</Label>
        <Input 
          id="email" 
          type="email" 
          value={formData.email}
          onChange={(e) => updateFormData('email', e.target.value)}
          required 
          className="h-12 text-base rounded-lg" 
        />
      </div>
    </>
  );
};

export default PersonalInfoSection;