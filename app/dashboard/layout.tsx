import ProfileSidebar from "./component/Sidebar"; 

export default function Dashboard({
    children,
} : Readonly <{
    children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="relative w-full">
       
          <div className="absolute top-4 right-4">
            <ProfileSidebar />
          </div>
        </header>
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
