export default function Input({ label, ...props }: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        {...props}
        className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}
