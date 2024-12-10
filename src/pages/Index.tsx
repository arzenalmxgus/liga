import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Query to check user role
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
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main className="md:ml-16 pb-16 md:pb-0 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
          <h1 className="text-4xl font-bold mb-6">Welcome to Event Management</h1>
          <p className="text-lg text-gray-400 mb-8">Please log in or register to continue</p>
          <Button onClick={() => navigate("/auth")} size="lg">
            Get Started
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="md:ml-16 pb-16 md:pb-0">
        {profile?.user_role === "student" && <StudentDashboard />}
        {/* We'll implement other dashboards in subsequent updates */}
        {(profile?.user_role === "coach" || profile?.user_role === "coordinator" || profile?.user_role === "official") && (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
              {profile.user_role.charAt(0).toUpperCase() + profile.user_role.slice(1)} Dashboard
            </h1>
            <p className="text-gray-400">
              Additional features for {profile.user_role} will be implemented soon.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;