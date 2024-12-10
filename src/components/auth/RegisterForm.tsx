import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import AccountTypeSection from "./form-sections/AccountTypeSection";
import PersonalInfoSection from "./form-sections/PersonalInfoSection";
import PasswordSection from "./form-sections/PasswordSection";

export type UserRole = "attendee" | "host";

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("attendee");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "na",
    birthdate: "",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);

    try {
      console.log("Starting registration process...");
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            middle_name: formData.middleName || null,
            last_name: formData.lastName,
            suffix: formData.suffix === "na" ? null : formData.suffix,
            birthdate: formData.birthdate,
            user_role: userRole,
          },
        },
      });

      if (authError) {
        console.error("Auth Error:", authError);
        throw authError;
      }

      console.log("Auth successful, waiting for session...");
      
      // Wait for session to be established (500ms should be enough)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log("Checking session...");
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        console.log("No session found, but continuing with profile creation...");
      }

      console.log("Creating profile...");
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            first_name: formData.firstName,
            middle_name: formData.middleName || null,
            last_name: formData.lastName,
            suffix: formData.suffix === "na" ? null : formData.suffix,
            birthdate: formData.birthdate,
            user_role: userRole,
          });

        if (profileError) {
          console.error("Profile Error:", profileError);
          throw profileError;
        }

        console.log("Registration completed successfully!");
        setShowConfirmation(true);
        toast({
          title: "Registration Successful",
          description: "Please check your email to confirm your account before logging in.",
        });
        navigate("/auth");
      }
    } catch (error: any) {
      console.error("Full registration error:", error);
      let errorMessage = "An unexpected error occurred";
      
      if (error.message.includes("email_not_confirmed")) {
        errorMessage = "Please confirm your email before logging in. Check your inbox for the confirmation link.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className="text-center p-6 space-y-4">
        <h2 className="text-2xl font-semibold">Check Your Email</h2>
        <p className="text-muted-foreground">
          We've sent a confirmation link to your email address.
          Please click the link to activate your account.
        </p>
        <Button
          onClick={() => navigate("/auth")}
          className="mt-4"
        >
          Return to Login
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleRegister}>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">Register</CardTitle>
        <CardDescription className="text-center">
          Create a new account to get started
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-8">
        <AccountTypeSection userRole={userRole} setUserRole={setUserRole} />
        <PersonalInfoSection formData={formData} setFormData={setFormData} />
        <PasswordSection formData={formData} setFormData={setFormData} />
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