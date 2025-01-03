import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold">Configuration Not Found</h2>
        <p>Could not find the requested configuration.</p>
        <Button asChild>
          <Link href="/configurations">Return to Configurations</Link>
        </Button>
      </div>
    </div>
  );
}
