import { Metadata } from "next";
import { SidebarProvider, SidebarInset } from "@/app/components/ui/sidebar";
import { AdminSidebar } from "@/app/components/ui/admin-sidebar";

export const metadata: Metadata = {
  title: "Admin Dashboard | Dr. Hogr",
  description: "Admin panel to manage website content.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div dir="ltr" className="min-h-screen w-full bg-[#111111]">
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset className="bg-transparent text-[#F0EBD8] overflow-hidden">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
