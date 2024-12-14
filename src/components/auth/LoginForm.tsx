import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateInputs = () => {
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return false;
    }

    if (!password.trim()) {
      toast({
        title: "Error",
        description: "Please enter your password",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    console.log('Attempting login with email:', email);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      console.log('Login successful for user:', userCredential.user.uid);
      
      // Check if user profile exists in Firestore
      const userProfileRef = doc(db, 'profiles', userCredential.user.uid);
      const userProfileSnap = await getDoc(userProfileRef);
      
      if (!userProfileSnap.exists()) {
        toast({
          title: "Error",
          description: "User profile not found. Please register first.",
          variant: "destructive",
        });
        await auth.signOut();
        return;
      }

      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
      let errorMessage = "Failed to log in. Please try again.";
      
      switch (error.code) {
        case "auth/invalid-login-credentials":
          errorMessage = "Invalid email or password. Please check your credentials and try again. If you haven't registered yet, please create an account first.";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address.";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled. Please contact support.";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email. Please register first.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password. Please try again.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your internet connection.";
          break;
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
    <form onSubmit={handleLogin} className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-3">
        <CardTitle className="text-3xl font-bold text-center text-white">Welcome To Liga!</CardTitle>
        <CardDescription className="text-center text-gray-300 text-lg">
          Welcome back! Please log in to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-8">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-300">Email address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 bg-[#282828] border-0 text-white focus:ring-2 focus:ring-[#1DB954] placeholder:text-gray-500"
            disabled={isLoading}
            placeholder="name@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-300">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-12 bg-[#282828] border-0 text-white focus:ring-2 focus:ring-[#1DB954] placeholder:text-gray-500"
            disabled={isLoading}
            placeholder="••••••••"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 px-8 pb-8">
        <Button 
          type="submit" 
          className="w-full h-12 text-base font-semibold bg-[#1DB954] hover:bg-[#1ed760] transition-colors duration-300 rounded-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Log In"
          )}
        </Button>
        <p className="text-sm text-center text-gray-400">
          Don't have an account?{" "}
          <a href="#" className="text-white hover:text-[#1DB954] underline transition-colors duration-300">
            Sign up for Liga
          </a>
        </p>
      </CardFooter>
    </form>
  );
};

export default LoginForm;