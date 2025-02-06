import { Skeleton } from "@components/ui/skeleton";

export function HabitListSkeleton() {
  return (
    <div className="grid items-start gap-x-10 gap-y-14 p-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col p-4">
          <Skeleton className="mb-4 h-5 w-full rounded-xl" />
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-2 w-3/4" />
            <Skeleton className="h-2 w-2/3" />
            <Skeleton className="h-2 w-1/3" />
            <Skeleton className="h-2 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
