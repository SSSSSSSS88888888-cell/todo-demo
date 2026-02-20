# バックエンド モジュール ドキュメント

## 概要
NestJS + GraphQL (Code-First) + PrismaによるAPIサーバー。
各機能はNestJSのモジュールとして分離されている。

---

## 認証モジュール (`auth/`)

### 責務
- ユーザー登録 (signup)
- ログイン (login)
- JWTトークン発行・検証

### ファイル構成
| ファイル | 役割 |
|---------|------|
| `auth.module.ts` | モジュール定義 (JwtModule, PassportModule登録) |
| `auth.service.ts` | 認証ロジック (パスワードハッシュ化, トークン生成) |
| `auth.resolver.ts` | GraphQLリゾルバ (signup, login mutation) |
| `jwt.strategy.ts` | JWT検証ストラテジー (Passport) |
| `gql-auth.guard.ts` | GraphQL用認証ガード |

### 主要なGraphQL操作
- `mutation signup(input: SignupInput!): AuthPayload!`
- `mutation login(input: LoginInput!): AuthPayload!`

### AuthPayload
```graphql
type AuthPayload {
  accessToken: String!
  user: User!
}
```

---

## ユーザーモジュール (`users/`)

### 責務
- ユーザーの取得・管理

### 主要なGraphQL操作
- `query me: User!` (認証必須)

---

## 教科モジュール (`subjects/`)

### 責務
- 教科のCRUD
- 初期データ: 算数, 国語, 理科, 社会

### 主要なGraphQL操作
- `query subjects: [Subject!]!`

### Subject型
```graphql
type Subject {
  id: ID!
  name: String!
  color: String!    # Hexカラーコード
  order: Int!
  units: [Unit!]!
}
```

---

## 単元モジュール (`units/`)

### 責務
- 教科に紐づく単元のCRUD

### 初期データ例
- 算数: 数と計算, 図形, 測定, データの活用, 文章題, 割合と比
- 国語: 漢字, 読解(物語文), 読解(説明文), 文法, 語彙, 作文

---

## タスクモジュール (`tasks/`)

### 責務
- タスクのCRUD
- フィルタリング (教科, 優先度, ステータス)
- 今日のタスク取得
- 完了時のStreak更新トリガー

### 主要なGraphQL操作
- `query tasks(filter: TaskFilterInput): [Task!]!`
- `query todayTasks: [Task!]!`
- `mutation createTask(input: CreateTaskInput!): Task!`
- `mutation updateTask(id: ID!, input: UpdateTaskInput!): Task!`
- `mutation deleteTask(id: ID!): Boolean!`

### Task型
```graphql
type Task {
  id: ID!
  title: String!
  description: String
  priority: Priority!     # HIGH, MEDIUM, LOW
  status: TaskStatus!     # TODO, IN_PROGRESS, DONE
  startDate: DateTime!
  dueDate: DateTime!
  completedAt: DateTime
  subject: Subject!
  unit: Unit
  createdAt: DateTime!
}
```

### TaskFilterInput
```graphql
input TaskFilterInput {
  subjectId: ID
  priority: Priority
  status: TaskStatus
}
```

---

## テンプレートモジュール (`templates/`)

### 責務
- 学習計画テンプレートのCRUD
- テンプレート適用 (一括タスク生成)

### 主要なGraphQL操作
- `query templates: [Template!]!`
- `mutation createTemplate(input: CreateTemplateInput!): Template!`
- `mutation deleteTemplate(id: ID!): Boolean!`
- `mutation applyTemplate(input: ApplyTemplateInput!): [Task!]!`

### 適用ロジック
1. テンプレートの各項目を取得
2. 指定された開始日 + `dayOffset` で各タスクの開始日を計算
3. `durationDays` で期限を計算
4. 教科名・単元名からIDを解決
5. タスクを一括作成

---

## ストリークモジュール (`streaks/`)

### 責務
- ユーザーの連続達成日数の管理
- タスク完了時に自動更新

### 主要なGraphQL操作
- `query myStreak: Streak!`

### 更新ロジック
1. タスク完了時にStreakをチェック
2. 最終完了日が昨日 → `currentStreak + 1`
3. 最終完了日が今日 → 変更なし
4. それ以外 → `currentStreak = 1` (リセット)
5. `longestStreak` は `max(longestStreak, currentStreak)` で更新

---

## 通知モジュール (`notifications/`)

### 責務
- フロントエンドでのWeb Notification API連携支援
- 締切間近のタスク情報提供

### 注意
- 通知の送信はフロントエンド側 (`useNotification` フック) で実行
- バックエンドは締切間近タスクのクエリを提供
