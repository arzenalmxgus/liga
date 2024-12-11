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
        <Card className="w-[90%] max-w-[1200px] mx-auto bg-black/40 backdrop-blur-md rounded-xl overflow-y-auto max-h-[85vh] border-gray-700">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/20">
              <TabsTrigger value="login" className="text-white data-[state=active]:bg-primary">Login</TabsTrigger>
              <TabsTrigger value="register" className="text-white data-[state=active]:bg-primary">Register</TabsTrigger>
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