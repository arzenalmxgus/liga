import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import AttendeeDashboard from "@/components/dashboard/AttendeeDashboard";
import HostDashboard from "@/components/dashboard/HostDashboard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.uid],
    queryFn: async () => {
      if (!user) return null;
      const docRef = doc(db, 'profiles', user.uid);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen text-white">
        <Navigation />
        <main className="md:ml-16 pb-16 md:pb-0 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
          <h1 className="text-4xl font-bold mb-6 text-white">Welcome to Event Management</h1>
          <p className="text-lg text-gray-300 mb-8">Please log in or register to continue</p>
          <Button 
            onClick={() => navigate("/auth")} 
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Get Started
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <Navigation />
      <main className="md:ml-16 pb-16 md:pb-0">
        {profile?.user_role === "host" ? (
          <HostDashboard />
        ) : (
          <AttendeeDashboard />
        )}
      </main>
    </div>
  );
};

export default Index;