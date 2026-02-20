# 中学受験 Todo - 学習管理アプリ

中学受験の学習スケジュールを管理するためのTodoアプリケーションです。保護者が管理者として、子供の受験勉強計画を教科・単元ごとに管理できます。

## 主な機能

- **タスク管理**: 教科・単元ごとのタスク作成・編集・削除、優先度（高/中/低）設定
- **ガントチャート**: 教科→単元の階層構造でタイムライン表示
- **テンプレート**: 学習計画テンプレートの作成・適用（開始日指定で一括タスク生成）
- **ゲーミフィケーション**: タスク完了時の連続達成日数（ストリーク）表示
- **通知**: Web Notification APIによる締切リマインダー
- **レスポンシブデザイン**: モバイル・デスクトップ対応

## 技術スタック

| レイヤー | 技術 |
|---|---|
| Backend | NestJS, GraphQL (Code-First), Prisma ORM |
| Frontend | React, TypeScript, Vite, Apollo Client |
| DB | PostgreSQL |
| 型生成 | graphql-codegen |
| UI | Tailwind CSS |
| 認証 | JWT + Passport |

## セットアップ

### 前提条件

- Node.js v18以上
- PostgreSQL 16

### 1. 依存関係のインストール

```bash
npm install
```

### 2. PostgreSQLでデータベースを作成

```sql
CREATE DATABASE juken_todo;
```

### 3. 環境変数の設定

```bash
cp backend/.env.example backend/.env
```

`backend/.env` を編集してPostgreSQLの接続情報を設定：

```
DATABASE_URL="postgresql://postgres:あなたのパスワード@localhost:5432/juken_todo?schema=public"
JWT_SECRET="juken-todo-secret-key-change-in-production"
```

### 4. データベースのマイグレーションと初期データ投入

```bash
cd backend
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts
cd ..
```

### 5. アプリケーションの起動

```bash
npm run dev
```

- **フロントエンド**: http://localhost:5173
- **GraphQL Playground**: http://localhost:3000/graphql

### 6. 初回利用

ブラウザで http://localhost:5173 にアクセスし、「新規アカウント作成」からユーザー登録してください。

## 初期データ

Seedスクリプトにより、以下の教科・単元が登録されます：

| 教科 | 単元 |
|---|---|
| 算数 | 数と計算, 図形, 測定, データの活用, 文章題, 割合と比 |
| 国語 | 漢字, 読解(物語文), 読解(説明文), 文法, 語彙, 作文 |
| 理科 | 物質とエネルギー, 生命, 地球と宇宙, 実験・観察 |
| 社会 | 地理, 歴史, 公民, 時事問題 |

## ディレクトリ構成

```
├── backend/              # NestJS バックエンド
│   ├── prisma/           # Prismaスキーマ・マイグレーション・Seed
│   └── src/
│       ├── auth/         # JWT認証
│       ├── users/        # ユーザー管理
│       ├── subjects/     # 教科管理
│       ├── units/        # 単元管理
│       ├── tasks/        # タスクCRUD
│       ├── templates/    # テンプレート管理
│       ├── streaks/      # 連続達成日数
│       └── notifications/# 通知
├── frontend/             # React フロントエンド
│   └── src/
│       ├── components/   # UIコンポーネント
│       ├── contexts/     # 認証コンテキスト
│       ├── generated/    # graphql-codegen生成ファイル
│       ├── graphql/      # GraphQLクエリ・ミューテーション
│       ├── hooks/        # カスタムフック
│       └── lib/          # ユーティリティ
└── docker-compose.yml    # PostgreSQL (Docker利用時)
```

## 動作確認

<!-- 動作確認動画をここに貼ってください -->
