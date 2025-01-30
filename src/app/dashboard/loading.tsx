export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
      <div className="relative flex h-16 w-16">
        <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></div>
        <div className="relative inline-flex rounded-full h-16 w-16 bg-emerald-500"></div>
      </div>
    </div>
  );
}