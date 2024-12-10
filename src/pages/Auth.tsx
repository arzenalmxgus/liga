import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userRole, setUserRole] = useState("attendee");
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Coming Soon",
        description: "Login functionality will be implemented soon.",
      });
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
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
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Coming Soon",
        description: `Registration as ${userRole} will be implemented soon.`,
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="md:ml-16 pb-16 md:pb-0 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="w-[70%] max-w-4xl mx-auto bg-white/5 backdrop-blur-sm">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-center">Login</CardTitle>
                  <CardDescription className="text-center">
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 px-8">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      required 
                      placeholder="Enter your email address"
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-base">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      required 
                      placeholder="Enter your password"
                      className="h-12 text-base"
                    />
                  </div>
                </CardContent>
                <CardFooter className="px-8 pb-8">
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base bg-primary hover:bg-primary/90" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Login"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            <TabsContent value="register">
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
                      onValueChange={setUserRole}
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
                      <Input id="firstName" required className="h-12 text-base" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="middleName" className="text-base">Middle Name</Label>
                      <Select>
                        <SelectTrigger className="h-12 text-base">
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
                      <Input id="lastName" required className="h-12 text-base" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="suffix" className="text-base">Suffix</Label>
                      <Select>
                        <SelectTrigger className="h-12 text-base">
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
                    <Input id="birthdate" type="date" required className="h-12 text-base" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profilePicture" className="text-base">Profile Picture (1x1)</Label>
                    <Input id="profilePicture" type="file" accept="image/*" required className="h-12 text-base" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base">Email</Label>
                    <Input id="email" type="email" required className="h-12 text-base" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-base">Username</Label>
                    <Input id="username" required className="h-12 text-base" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-base">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-base">Confirm Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      required 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12 text-base"
                    />
                  </div>
                </CardContent>
                <CardFooter className="px-8 pb-8">
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base bg-primary hover:bg-primary/90" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Register"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
};

export default Auth;