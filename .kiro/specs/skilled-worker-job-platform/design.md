# 設計ドキュメント

## 概要

特定技能求人プラットフォームのPoCは、React/Next.jsベースのSPA（Single Page Application）として構築されます。バックエンドを使用せず、LocalStorageを活用したクライアントサイドデータ管理により、カスタマー（求職者）と企業（クライアント）の両方のニーズに対応します。

## アーキテクチャ

### 技術スタック
- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **状態管理**: React Context + useReducer
- **データ永続化**: LocalStorage
- **デプロイ**: Vercel (SPA設定)

### アーキテクチャパターン
```
┌─────────────────────────────────────────┐
│                 UI Layer                │
│  ┌─────────────┐  ┌─────────────────┐   │
│  │   Customer  │  │     Client      │   │
│  │    Pages    │  │     Pages       │   │
│  └─────────────┘  └─────────────────┘   │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│              Service Layer              │
│  ┌─────────────┐  ┌─────────────────┐   │
│  │ Job Service │  │ Application     │   │
│  │             │  │ Service         │   │
│  └─────────────┘  └─────────────────┘   │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│               Data Layer                │
│  ┌─────────────┐  ┌─────────────────┐   │
│  │ LocalStorage│  │  Static JSON    │   │
│  │   Manager   │  │     Data        │   │
│  └─────────────┘  └─────────────────┘   │
└─────────────────────────────────────────┘
```

## コンポーネントとインターフェース

### ページコンポーネント
```typescript
// Customer Pages
/jobs                    - JobListPage
/jobs/[id]              - JobDetailPage  
/apply/[id]             - ApplicationPage

// Client Pages
/client                 - ClientDashboard
/client/jobs            - ClientJobListPage
/client/jobs/new        - JobPostPage
/client/applicants      - ApplicantListPage

// Common Pages
/404                    - NotFoundPage
/_error                 - ErrorPage
```

### 共通コンポーネント
```typescript
// Layout Components
- Header: ナビゲーション
- Footer: フッター情報
- Layout: 共通レイアウト

// UI Components  
- JobCard: 求人カード表示
- SearchFilters: 検索フィルター
- LoadingSpinner: ローディング表示
- ErrorMessage: エラーメッセージ
- EmptyState: 空状態表示
- Modal: モーダルダイアログ
- Button: 共通ボタン
- Input: 共通入力フィールド
- Select: セレクトボックス
- Toggle: トグルスイッチ
```

### サービスインターフェース
```typescript
interface JobService {
  getJobs(filters?: JobFilters): Promise<Job[]>
  getJobById(id: string): Promise<Job | null>
  createJob(job: CreateJobRequest): Promise<Job>
  updateJob(id: string, updates: Partial<Job>): Promise<Job>
  toggleJobStatus(id: string): Promise<Job>
}

interface ApplicationService {
  submitApplication(application: CreateApplicationRequest): Promise<Application>
  getApplications(): Promise<Application[]>
  updateApplicationStatus(id: string, status: ApplicationStatus): Promise<Application>
  getApplicationsByJobId(jobId: string): Promise<Application[]>
}

interface StorageService {
  get<T>(key: string): T | null
  set<T>(key: string, value: T): void
  remove(key: string): void
  clear(): void
}
```

## データモデル

### Job（求人）
```typescript
interface Job {
  id: string
  title: string
  company: string
  industry: string
  location: string
  jlptRequirement: 'N1' | 'N2' | 'N3' | 'N4' | 'N5' | 'なし'
  salary: string
  description: string
  isPublished: boolean
  isClientPosted: boolean
  createdAt: string
  updatedAt: string
}

interface CreateJobRequest {
  title: string
  industry: string
  location: string
  jlptRequirement: string
  salary: string
  description: string
  isPublished: boolean
}

interface JobFilters {
  q?: string
  industry?: string
  pref?: string
  jlpt?: string
  sort?: 'newest' | 'oldest' | 'salary'
}
```

### Application（応募）
```typescript
interface Application {
  id: string
  jobId: string
  applicantName: string
  contact: string
  residenceStatus: string
  jlptLevel: string
  hasAgreed: boolean
  status: ApplicationStatus
  createdAt: string
  updatedAt: string
}

type ApplicationStatus = 'new' | 'screening' | 'interview' | 'offer' | 'rejected'

interface CreateApplicationRequest {
  jobId: string
  applicantName: string
  contact: string
  residenceStatus: string
  jlptLevel: string
  hasAgreed: boolean
}
```

### LocalStorage Keys
```typescript
const STORAGE_KEYS = {
  CLIENT_JOBS: 'cl_jobs',
  APPLICATIONS: 'applications'
} as const
```

## エラーハンドリング

### エラータイプ
```typescript
interface AppError {
  type: 'NOT_FOUND' | 'VALIDATION_ERROR' | 'STORAGE_ERROR' | 'NETWORK_ERROR'
  message: string
  details?: any
}
```

### エラーハンドリング戦略
1. **404エラー**: 存在しないページ・リソースへのアクセス
2. **バリデーションエラー**: フォーム入力値の検証失敗
3. **ストレージエラー**: LocalStorage操作の失敗
4. **ネットワークエラー**: 静的ファイル読み込み失敗

### エラー表示パターン
- ページレベル: ErrorBoundaryでキャッチし、エラーページ表示
- コンポーネントレベル: ErrorMessageコンポーネントでインライン表示
- フォームレベル: フィールド単位でのバリデーションメッセージ

## テスト戦略

### テストレベル
1. **単体テスト**: 
   - サービス層のロジック
   - ユーティリティ関数
   - カスタムフック

2. **統合テスト**:
   - ページコンポーネントの動作
   - LocalStorageとの連携
   - フォーム送信フロー

3. **E2Eテスト**:
   - ユーザージャーニー全体
   - 求人検索から応募まで
   - 企業の求人投稿から応募者管理まで

### テストツール
- **単体・統合テスト**: Jest + React Testing Library
- **E2Eテスト**: Playwright
- **型チェック**: TypeScript
- **リンティング**: ESLint + Prettier

## レスポンシブデザイン

### ブレークポイント
```css
/* Mobile First Approach */
sm: 640px   /* タブレット縦 */
md: 768px   /* タブレット横 */
lg: 1024px  /* デスクトップ小 */
xl: 1280px  /* デスクトップ大 */
```

### レイアウト戦略
- **モバイル**: 単一カラム、スタックレイアウト
- **タブレット**: 2カラム、カードグリッド
- **デスクトップ**: 3カラム、サイドバー付きレイアウト

### タッチ対応
- 最小タッチターゲット: 44px × 44px
- スワイプジェスチャー対応（カルーセル等）
- ホバー状態の適切な処理

## パフォーマンス最適化

### 初期読み込み最適化
- Next.js App Routerによる自動コード分割
- 画像最適化（next/image使用）
- 静的ファイルの適切なキャッシュ設定

### ランタイム最適化
- React.memoによる不要な再レンダリング防止
- useMemoとuseCallbackの適切な使用
- 仮想スクロール（大量データ表示時）

### LocalStorage最適化
- データの適切な正規化
- 不要データの定期クリーンアップ
- 容量制限の監視とアラート

## セキュリティ考慮事項

### データ保護
- 個人情報の外部送信禁止
- LocalStorageデータの暗号化（機密性が高い場合）
- XSS対策（入力値のサニタイズ）

### プライバシー
- データ保存期間の明示
- ユーザーによるデータ削除機能
- プライバシーポリシーの表示

## デプロイメント設定

### Vercel設定
```json
// vercel.json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache"
        }
      ]
    }
  ]
}
```

### 環境変数
```typescript
// 開発時のみ使用
NEXT_PUBLIC_MOCK_DATA_URL=/mock/jobs.json
NEXT_PUBLIC_APP_ENV=development
```

### ビルド最適化
- 静的エクスポート設定
- 不要なファイルの除外
- バンドルサイズの監視