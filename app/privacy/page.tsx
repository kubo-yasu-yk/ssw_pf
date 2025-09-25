'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { resetPlatformStorage } from '@/lib/storage-service';

const PrivacyPage = () => {
  const [cleared, setCleared] = useState(false);

  const handleClear = () => {
    resetPlatformStorage();
    setCleared(true);
  };

  return (
    <div className="container space-y-8 py-12">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-foreground">プライバシーポリシー</h1>
        <p className="text-sm text-muted-foreground">
          当プラットフォームでは、求人情報と応募情報をブラウザの LocalStorage に保存します。保存されたデータは端末内にのみ保持され、サーバーには送信されません。
        </p>
      </header>

      <section className="space-y-4 rounded-xl border border-border bg-card p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">収集する情報</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>求人管理データ（企業が登録・更新した求人情報）</li>
          <li>応募フォームで入力された応募者情報</li>
          <li>検索条件などの操作履歴（使いやすさ向上のためのローカル保存）</li>
        </ul>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">データ保存と管理</h2>
        <p className="text-sm text-muted-foreground">
          すべてのデータはお使いのブラウザの LocalStorage に保存され、他の端末やサーバー環境とは共有されません。ブラウザを変更するとデータは引き継がれません。
        </p>
        <div className="space-y-3 rounded-lg bg-muted/40 p-6 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">データクリア機能</p>
          <p>
            下記のボタンから保存済みデータをすべて削除できます。削除されたデータは復元できませんのでご注意ください。
          </p>
          <Button variant="outline" onClick={handleClear}>
            LocalStorageをクリアする
          </Button>
          {cleared && <p className="text-xs text-emerald-600">LocalStorageのデータを削除しました。</p>}
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">お問い合わせ</h2>
        <p className="text-sm text-muted-foreground">
          プライバシーに関する質問がありましたら、企業向けサポート窓口までご連絡ください。
        </p>
        <p className="text-sm font-semibold text-primary">support@skilled-worker-platform.jp</p>
      </section>
    </div>
  );
};

export default PrivacyPage;
