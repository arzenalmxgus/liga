import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

// Define the UserRole type to match the database schema
type UserRole = "attendee" | "host";

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("attendee");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("na");
  const [birthdate, setBirthdate] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);

    try {
      // Register the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            suffix: suffix === "na" ? null : suffix,
            birthdate,
            user_role: userRole,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            suffix: suffix === "na" ? null : suffix,
            birthdate,
            user_role: userRole,
          });

        if (profileError) throw profileError;

        toast({
          title: "Success",
          description: "Registration successful! Please check your email for verification.",
        });
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handler to safely set userRole
  const handleUserRoleChange = (value: string) => {
    // Only set the state if the value is a valid UserRole
    if (value === "attendee" || value === "host") {
      setUserRole(value);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">Register</CardTitle>
        <CardDescription className="text-center">
          Create a new account to get started
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-8">
        <div className="space-y-2">
          <Label className="text-base">Account Type</Label>
          <RadioGroup 
            defaultValue="attendee" 
            onValueChange={handleUserRoleChange}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="attendee" id="attendee" />
              <Label htmlFor="attendee" className="text-base">Attendee - Join and participate in events</Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="host" id="host" />
              <Label htmlFor="host" className="text-base">Host - Create and manage events</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-base">First Name</Label>
            <Input 
              id="firstName" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required 
              className="h-12 text-base rounded-lg" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="middleName" className="text-base">Middle Name</Label>
            <Select value={middleName} onValueChange={setMiddleName}>
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
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required 
              className="h-12 text-base rounded-lg" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="suffix" className="text-base">Suffix</Label>
            <Select value={suffix} onValueChange={setSuffix}>
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
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            required 
            className="h-12 text-base rounded-lg" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-base">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            className="h-12 text-base rounded-lg" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-base">Password</Label>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"}
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 text-base pr-10 rounded-lg"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-8 pb-8">
        <Button 
          type="submit" 
          className="w-full h-12 text-base bg-primary hover:bg-primary/90 rounded-lg" 
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Register"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default RegisterForm;