import { Suspense } from "react";
import { api, HydrateClient } from "~/trpc/server";

// TODO: Import review components once implemented
// import { ReviewList } from "@components/review/ReviewList";
// import { ReviewListSkeleton } from "@components/review/ReviewListSkeleton";
// import { NewReviewSheet } from "@components/review/NewReviewSheet";

export default async function ReviewPage() {
  // TODO: Implement review data fetching
  // void api.review.getAll.prefetch();

  return (
    <div className="container mx-auto py-8">
      <HydrateClient>
        {/* TODO: Implement review components */}
        <div className="text-center text-gray-500">
          Review page components coming soon...
        </div>
        {/* 
        <Suspense fallback={<ReviewListSkeleton />}>
          <ReviewList />
        </Suspense>
        <NewReviewSheet />
        */}
      </HydrateClient>
    </div>
  );
}
