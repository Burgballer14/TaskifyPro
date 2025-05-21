import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-theme(spacing.28))] w-full items-center justify-center p-6"> {/* Adjust height based on header */}
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
