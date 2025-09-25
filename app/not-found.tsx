import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-6 py-20 text-center">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
        404
      </span>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-secondary">ページが見つかりません</h1>
        <p className="text-sm text-slate-600">
          指定されたページは存在しないか、移動された可能性があります。
        </p>
      </div>
      <Link href="/" className="text-sm font-semibold text-primary hover:text-primary-dark">
        トップページへ戻る
      </Link>
    </div>
  );
}
