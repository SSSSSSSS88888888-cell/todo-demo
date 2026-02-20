# アーキテクチャ概要

## 技術スタック

| レイヤー | 技術 | 役割 |
|---------|------|------|
| Frontend | React 18 + TypeScript | UI |
| Bundler | Vite | 開発サーバー・ビルド |
| Styling | Tailwind CSS | ユーティリティファーストCSS |
| API Client | Apollo Client | GraphQL通信・キャッシュ |
| 型生成 | graphql-codegen | バックエンドスキーマ→型+hooks自動生成 |
| Backend | NestJS + TypeScript | APIサーバー |
| API | GraphQL (Code-First) | Apollo Driver |
| ORM | Prisma | DB操作 |
| DB | PostgreSQL | データ永続化 |
| 認証 | JWT + Passport | メール/パスワード認証 |

## ディレクトリ構成

```
todo-demo/
├── package.json              # npm workspaces設定
├── docker-compose.yml        # PostgreSQL
├── docs/                     # ドキュメント
├── backend/
│   ├── prisma/               # スキーマ定義・seed
│   └── src/
│       ├── main.ts           # エントリーポイント
│       ├── app.module.ts     # ルートモジュール
│       ├── auth/             # 認証 (JWT)
│       ├── users/            # ユーザー管理
│       ├── subjects/         # 教科CRUD
│       ├── units/            # 単元CRUD
│       ├── tasks/            # タスクCRUD
│       ├── templates/        # テンプレートCRUD
│       ├── streaks/          # 連続達成日数
│       └── notifications/    # 通知
└── frontend/
    ├── codegen.ts            # graphql-codegen設定
    └── src/
        ├── generated/        # 自動生成された型・hooks
        ├── graphql/          # クエリ/ミューテーション定義
        ├── components/       # UIコンポーネント
        ├── hooks/            # カスタムフック
        ├── contexts/         # React Context
        └── lib/              # ユーティリティ
```

## データフロー

```
ブラウザ → Apollo Client → GraphQL API (NestJS) → Prisma → PostgreSQL
                ↑                    ↓
           graphql-codegen     Code-First Schema
```

1. フロントエンドは `graphql/` 配下の `.graphql` ファイルでクエリ/ミューテーションを定義
2. `graphql-codegen` がバックエンドのスキーマから型とApollo hooksを `generated/graphql.ts` に自動生成
3. コンポーネントは生成されたhooks (`useGetTasksQuery` 等) を使ってデータ取得・更新
4. Apollo Clientが自動的にキャッシュ管理を行う

## 認証フロー

1. ユーザーがメール/パスワードでログイン → `login` mutation
2. サーバーがJWTトークンを返却
3. フロントエンドがlocalStorageにトークン保存
4. Apollo Clientのリンクで全リクエストに `Authorization: Bearer <token>` ヘッダーを付与
5. バックエンドの `GqlAuthGuard` がトークンを検証
