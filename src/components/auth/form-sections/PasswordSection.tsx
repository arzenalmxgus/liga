import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

interface PasswordSectionProps {
  formData: {
    password: string;
    confirmPassword: string;
  };
  setFormData: (data: any) => void;
}

const PasswordSection = ({ formData, setFormData }: PasswordSectionProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (field === 'password' || field === 'confirmPassword') {
      setPasswordTouched(true);
    }
  };

  useEffect(() => {
    if (passwordTouched && formData.confirmPassword) {
      setPasswordsMatch(formData.password === formData.confirmPassword);
    }
  }, [formData.password, formData.confirmPassword, passwordTouched]);

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-base">Password</Label>
        <div className="relative">
          <Input 
            id="password" 
            type={showPassword ? "text" : "password"}
            required 
            value={formData.password}
            onChange={(e) => updateFormData('password', e.target.value)}
            className="h-12 text-base pr-10 rounded-lg"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-base">Confirm Password</Label>
        <div className="relative">
          <Input 
            id="confirmPassword" 
            type={showConfirmPassword ? "text" : "password"}
            required 
            value={formData.confirmPassword}
            onChange={(e) => updateFormData('confirmPassword', e.target.value)}
            className={`h-12 text-base pr-10 rounded-lg ${
              !passwordsMatch && passwordTouched ? 'border-red-500 focus-visible:ring-red-500' : ''
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {passwordTouched && formData.confirmPassword && (
          <p className={`text-sm mt-1 ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
            {passwordsMatch ? 'The passwords match!' : 'Passwords do not match'}
          </p>
        )}
      </div>
    </>
  );
};

export default PasswordSection;