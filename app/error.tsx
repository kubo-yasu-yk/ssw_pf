'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-6 py-20 text-center">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl font-bold text-red-600">
        !
      </span>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-secondary">エラーが発生しました</h1>
        <p className="text-sm text-slate-600">
          ページの読み込み中に問題が発生しました。再度お試しください。
        </p>
      </div>
      <Button variant="outline" onClick={reset}>
        再読み込み
      </Button>
    </div>
  );
}
