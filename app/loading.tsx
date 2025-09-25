import { LoadingSpinner } from '@/components/common/loading-spinner';

export default function Loading() {
  return (
    <div className="container py-16">
      <LoadingSpinner fullHeight />
    </div>
  );
}
