export default function Button({ children, ...props }: any) {
  return (
    <button
      style={{backgroundColor: "#2563eb", color: "white", transitionDelay: 100}}
      {...props}
    >
      {children}
    </button>
  );
}
