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
          <Label htmlFor="firstName" className="text-base text-white">First Name</Label>
          <Input 
            id="firstName" 
            value={formData.firstName}
            onChange={(e) => updateFormData('firstName', e.target.value)}
            required 
            className="h-12 text-base rounded-lg bg-black/20 text-white" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="middleName" className="text-base text-white">Middle Name</Label>
          <Select value={formData.middleName === "" ? "na" : formData.middleName === "custom" ? "custom" : "na"} 
                 onValueChange={(value) => updateFormData('middleName', value)}>
            <SelectTrigger className="h-12 text-base rounded-lg bg-black/20 text-white border-gray-700">
              <SelectValue placeholder="Select middle name option" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-gray-700">
              <SelectItem value="na" className="text-white">N/A</SelectItem>
              <SelectItem value="custom" className="text-white">Enter Middle Name</SelectItem>
            </SelectContent>
          </Select>
          {formData.middleName === "custom" && (
            <Input
              id="middleNameInput"
              placeholder="Enter your middle name"
              value={formData.middleName === "custom" ? "" : formData.middleName}
              onChange={(e) => updateFormData('middleName', e.target.value)}
              className="h-12 text-base rounded-lg bg-black/20 text-white mt-2"
            />
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-base text-white">Last Name</Label>
          <Input 
            id="lastName" 
            value={formData.lastName}
            onChange={(e) => updateFormData('lastName', e.target.value)}
            required 
            className="h-12 text-base rounded-lg bg-black/20 text-white" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="suffix" className="text-base text-white">Suffix</Label>
          <Select value={formData.suffix} onValueChange={(value) => updateFormData('suffix', value)}>
            <SelectTrigger className="h-12 text-base rounded-lg bg-black/20 text-white border-gray-700">
              <SelectValue placeholder="Select suffix" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-gray-700">
              <SelectItem value="na" className="text-white">N/A</SelectItem>
              <SelectItem value="jr" className="text-white">Jr.</SelectItem>
              <SelectItem value="sr" className="text-white">Sr.</SelectItem>
              <SelectItem value="ii" className="text-white">II</SelectItem>
              <SelectItem value="iii" className="text-white">III</SelectItem>
              <SelectItem value="iv" className="text-white">IV</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="birthdate" className="text-base text-white">Birthdate</Label>
        <Input 
          id="birthdate" 
          type="date" 
          value={formData.birthdate}
          onChange={(e) => updateFormData('birthdate', e.target.value)}
          required 
          className="h-12 text-base rounded-lg bg-black/20 text-white" 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-base text-white">Email</Label>
        <Input 
          id="email" 
          type="email" 
          value={formData.email}
          onChange={(e) => updateFormData('email', e.target.value)}
          required 
          className="h-12 text-base rounded-lg bg-black/20 text-white" 
        />
      </div>
    </>
  );
};

export default PersonalInfoSection;