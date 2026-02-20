# セットアップガイド

## 前提条件

- Node.js 18+
- PostgreSQL 15+
- npm 9+

## 手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd todo-demo
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. PostgreSQLの起動

Docker Composeを使用する場合:
```bash
docker-compose up -d
```

ローカルのPostgreSQLを使用する場合:
- データベースを作成しておく

### 4. 環境変数の設定

```bash
cp backend/.env.example backend/.env
```

`backend/.env` を編集:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/todo_demo?schema=public"
JWT_SECRET="your-secret-key"
```

### 5. データベースのセットアップ

```bash
# Prismaクライアント生成
cd backend && npx prisma generate

# マイグレーション実行
npx prisma db push

# 初期データ投入
npx prisma db seed
```

### 6. GraphQL型の生成

```bash
# バックエンドを先に起動 (スキーマ取得のため)
cd backend && npm run start:dev &

# フロントエンドの型生成
cd frontend && npm run codegen
```

### 7. 開発サーバーの起動

```bash
# ルートから両方同時起動
npm run dev
```

- フロントエンド: http://localhost:5173
- バックエンド: http://localhost:3000/graphql (GraphQL Playground)

## トラブルシューティング

### Prisma client エラー
```bash
cd backend && npx prisma generate
```

### マイグレーションエラー (SQLite構文)
既存のマイグレーションがSQLite構文の場合:
```bash
npx prisma db push --force-reset
npx prisma db seed
```

### ポート競合
```bash
# Windows
taskkill /F /IM node.exe

# Mac/Linux
lsof -ti:3000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### 型生成が失敗する
バックエンドが起動していることを確認:
```bash
curl http://localhost:3000/graphql
```
