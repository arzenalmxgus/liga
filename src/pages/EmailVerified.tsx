import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EmailVerified = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      toast({
        title: "Welcome!",
        description: "You have successfully logged in.",
      });
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
        <h1 className="text-3xl font-bold text-foreground">Email Verified Successfully!</h1>
        <p className="text-muted-foreground">
          Redirecting you to the homepage in a few seconds...
        </p>
      </div>
    </div>
  );
};

export default EmailVerified;