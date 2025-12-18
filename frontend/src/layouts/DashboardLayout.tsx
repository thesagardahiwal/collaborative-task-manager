import { type ReactNode, useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useNotification } from "../context/SocketContext";
import NotificationDrawer from "../components/NotificationDrawer";


export default function DashboardLayout({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const notifications = useNotification();
    // Check if we're on mobile
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 1024); // lg breakpoint
        };

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);

        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);


    // Close sidebar when clicking on main content on mobile
    const handleContentClick = () => {
        if (isMobile && isSidebarOpen) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <div className="fixed lg:relative z-30">
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
            </div>

            <div
                className="flex-1 flex flex-col min-h-screen transition-all duration-300"
                onClick={handleContentClick}
            >
                <Navbar
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    onNotificationClick={() => setShowNotifications(true)}
                    notificationCount={notifications.length}
                />

                <main className="pt-16 flex-1 lg:pt-20 sm:px-4 lg:px-6 pb-6">
                    {children}
                </main>
            </div>

            {isSidebarOpen && isMobile && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <NotificationDrawer
                open={showNotifications}
                onClose={() => setShowNotifications(false)}
            />
        </div>
    );
}