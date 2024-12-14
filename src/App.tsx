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
import MyEvents from "./pages/MyEvents";
import JoinedEvents from "./pages/JoinedEvents";
import { useAuth } from "./contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./lib/firebase";
import Navigation from "./components/Navigation";

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
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

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(profile?.role)) {
    return <Navigate to="/" replace />;
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
                    <Route path="/events" element={
                      <ProtectedRoute allowedRoles={['host', 'attendee']}>
                        <Events />
                      </ProtectedRoute>
                    } />
                    <Route path="/my-events" element={
                      <ProtectedRoute allowedRoles={['host']}>
                        <MyEvents />
                      </ProtectedRoute>
                    } />
                    <Route path="/joined-events" element={
                      <ProtectedRoute allowedRoles={['attendee']}>
                        <JoinedEvents />
                      </ProtectedRoute>
                    } />
                    <Route path="/events-assigned" element={
                      <ProtectedRoute allowedRoles={['coach']}>
                        <EventsAssigned />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="/" element={
                      <ProtectedRoute>
                        <Events />
                      </ProtectedRoute>
                    } />
                    <Route path="*" element={<Navigate to="/" replace />} />
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