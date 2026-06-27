export default function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 left-1/3 w-72 h-72 bg-pink-400/8 rounded-full blur-3xl" />
    </div>
  );
}
