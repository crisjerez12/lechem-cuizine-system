import { Loader2 } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
      <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
    </div>
  );
}
