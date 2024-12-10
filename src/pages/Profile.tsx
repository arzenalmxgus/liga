import Navigation from "@/components/Navigation";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="md:ml-16 pb-16 md:pb-0">
        <header className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-gray-400 mt-1">Manage your account</p>
        </header>
        {/* Profile content will be added here */}
      </main>
    </div>
  );
};

export default Profile;