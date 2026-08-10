import { Suspense } from 'react';
import SearchPageContent from './SearchClient';

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center bg-slate-950 text-sm text-slate-500">
          Loading…
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}