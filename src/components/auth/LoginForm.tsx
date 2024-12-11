import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Attempting to sign in with email:', email);
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign in successful');
      
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle specific Firebase auth errors
      let errorMessage = "Failed to log in. Please try again.";
      if (error.code === "auth/invalid-login-credentials") {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your internet connection.";
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

  return (
    <form onSubmit={handleLogin}>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-white">Login</CardTitle>
        <CardDescription className="text-center text-gray-300">
          Welcome back! Please log in to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-8">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-black/20 text-white placeholder:text-gray-400"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-black/20 text-white placeholder:text-gray-400"
            disabled={isLoading}
          />
        </div>
      </CardContent>
      <CardFooter className="px-8 pb-8">
        <Button 
          type="submit" 
          className="w-full h-12 text-base bg-primary hover:bg-primary/90 rounded-lg text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </CardFooter>
    </form>
  );
};

export default LoginForm;