import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Bell, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Notifications = () => {
  const { user } = useAuth();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      console.log("Fetching notifications for user:", user.uid);
      
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="text-white text-center">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="md:ml-16 pb-16 md:pb-0">
        <header className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-white" />
            <h1 className="text-2xl font-bold text-white">Notifications</h1>
          </div>
          <p className="text-gray-400 mt-1">Stay updated on your event registrations</p>
        </header>

        <div className="p-6 space-y-4">
          {notifications && notifications.length > 0 ? (
            notifications.map((notification: any) => (
              <Card key={notification.id} className="bg-black/20 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    {notification.status === 'approved' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    {notification.status === 'approved' ? 'Registration Approved' : 'Registration Rejected'}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {notification.createdAt ? format(new Date(notification.createdAt), 'PPp') : 'Recent'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{notification.message}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center text-gray-400 py-12">
              No notifications yet
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Notifications;