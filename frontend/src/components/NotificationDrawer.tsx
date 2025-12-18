import { X, Bell } from "lucide-react";
import { getNotificationMessage } from "../utils/helper";
import { useAuthContext } from "../context/AuthContext";
import { useNotification } from "../context/SocketContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NotificationDrawer({ open, onClose }: Props) {
  const notifications = useNotification();
  const { user } = useAuthContext();

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-96 z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="h-16 bg-white m-2 rounded-2xl flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-700" />
            <h2 className="font-semibold text-gray-800">
              Notifications
            </h2>
          </div>

          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 bg-white rounded-2xl m-2 space-y-3 overflow-y-auto h-[calc(100%-4rem)]">
          {notifications.length === 0 && (
            <p className="text-sm text-gray-500 text-center mt-10">
              No notifications yet
            </p>
          )}

          {notifications
            .slice()
            .reverse()
            .map((n) => (
              <div
                key={n.id}
                className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition"
              >
                <p className="text-sm text-gray-800">
                  {getNotificationMessage(n, user?._id)}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {new Date(n.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
        </div>
      </aside>
    </>
  );
}
