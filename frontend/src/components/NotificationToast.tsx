export default function NotificationToast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-6 right-6 bg-white shadow-lg p-4 rounded-lg border-l-4 border-blue-600 animate-slide-in">
      <p className="text-gray-900 font-medium">{message}</p>
    </div>
  );
}
