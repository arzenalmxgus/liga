import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

const Auth = () => {
  return (
    <div className="min-h-screen text-white">
      <Navigation />
      <main className="md:ml-16 pb-16 md:pb-0 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="w-[90%] max-w-[450px] mx-auto bg-[#121212] backdrop-blur-md rounded-xl overflow-hidden border-[#282828]">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#282828] p-1">
              <TabsTrigger 
                value="login" 
                className="text-white data-[state=active]:bg-[#1DB954] data-[state=active]:text-black rounded-lg transition-all duration-300"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="text-white data-[state=active]:bg-[#1DB954] data-[state=active]:text-black rounded-lg transition-all duration-300"
              >
                Register
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
};

export default Auth;