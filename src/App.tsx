import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthContext";
import Auth from "./pages/Auth";
import EventsAssigned from "./pages/EventsAssigned";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
import Search from "./pages/Search";
import { useAuth } from "./contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./lib/firebase";
import Navigation from "./components/Navigation";

const ProtectedCoachRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  const { data: profile } = useQuery({
    queryKey: ['user-profile', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;
      const docRef = doc(db, 'profiles', user.uid);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    },
    enabled: !!user,
  });

  if (!user || profile?.role !== 'coach') {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <AuthProvider>
          <TooltipProvider>
            <div className="relative min-h-screen font-['Poppins'] dark">
              <div className="absolute inset-0 bg-gradient-overlay" />
              <div className="relative z-10">
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Navigation />
                  <Routes>
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/events-assigned" element={
                      <ProtectedCoachRoute>
                        <EventsAssigned />
                      </ProtectedCoachRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="/search" element={
                      <ProtectedRoute>
                        <Search />
                      </ProtectedRoute>
                    } />
                    <Route path="/events" element={
                      <ProtectedRoute>
                        <Events />
                      </ProtectedRoute>
                    } />
                    <Route path="/" element={
                      <ProtectedRoute>
                        <Events />
                      </ProtectedRoute>
                    } />
                    <Route path="*" element={<Navigate to="/auth" replace />} />
                  </Routes>
                </BrowserRouter>
              </div>
            </div>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;