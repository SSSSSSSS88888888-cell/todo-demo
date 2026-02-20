# フロントエンド コンポーネント ドキュメント

## デザインシステム

### 基本方針
- **シンプル・クリーン**: Notion/Linear風のモノクロームデザイン
- **レスポンシブ**: モバイル→デスクトップの段階的レイアウト
- **一貫性**: 共通CSSクラスで統一感を維持

### 共通CSSクラス (`index.css`)

| クラス | 用途 |
|--------|------|
| `.card` | カードコンテナ (白背景・角丸・ボーダー) |
| `.btn-primary` | プライマリボタン (gray-900背景) |
| `.input-field` | 入力フィールド |
| `.section-title` | セクション見出し (sm, font-semibold) |
| `.section-subtitle` | サブテキスト (xs, gray-500) |
| `.stagger` | 子要素の順次アニメーション |

---

## レイアウト (`components/layout/`)

### Layout.tsx
- アプリ全体のシェルコンポーネント
- サイドバー (lg以上で固定表示) + ヘッダー + メインコンテンツ
- モバイルではオーバーレイ付きドロワーメニュー
- `max-w-6xl` でコンテンツ幅を制限

### Sidebar.tsx
- ナビゲーションメニュー (ダッシュボード, タスク, ガントチャート, テンプレート, 通知)
- `NavLink` の `isActive` でアクティブ状態を表示
- ログアウトボタン付き

### Header.tsx
- 固定高さ `h-14`
- モバイルでハンバーガーメニューボタンを表示
- ページタイトルとユーザー名を表示

---

## 認証 (`components/auth/`)

### LoginForm.tsx
- メール/パスワードでの認証フォーム
- `useLoginMutation` でGraphQL APIに送信
- 成功時にJWTトークンをlocalStorageに保存し `AuthContext` を更新
- 新規登録リンク付き

---

## ダッシュボード (`components/dashboard/`)

### Dashboard.tsx
- ダッシュボードのレイアウトコンポーネント
- グリッド構成: 2カラム (統計) → フル幅 (アクティビティ) → 3カラム (タスク/進捗)

### TaskCompletionSummary.tsx
- タスク完了統計 (全体, 完了, 進行中, 未着手)
- `useGetTasksQuery` から集計

### LevelProgress.tsx
- 学習レベル・経験値の進捗バー
- 完了タスク数から算出 (1タスク=20XP)

### StreakCard.tsx
- 連続達成日数の表示
- `useGetMyStreakQuery` から取得

### TodayTasks.tsx
- 今日のタスク一覧
- ステータス変更ボタン (開始/完了)
- `useGetTodayTasksQuery` から取得

### SubjectProgress.tsx
- 教科別の完了率をプログレスバーで表示
- 教科カラーを使用

### ActivityHeatmap.tsx
- GitHub風の年間アクティビティヒートマップ
- SVGで描画、グレーモノクロームカラー
- 日本語の曜日ラベル (月/水/金)

### RecentCompletedTasks.tsx
- 直近の完了タスク5件を表示
- 完了日付付き

---

## タスク管理 (`components/tasks/`)

### TaskList.tsx
- タスク一覧ページのメインコンポーネント
- フィルタリング機能 (教科・優先度・ステータス)
- 新規作成・編集・削除・ステータス変更
- `stagger` アニメーション付き

### TaskCard.tsx
- 個別タスクのカード表示
- Props: `task`, `onDelete`, `onStatusChange`, `onEdit`
- 教科カラーのインジケーター、優先度バッジ、期限超過警告
- レスポンシブ: モバイルで縦並び、デスクトップで横並び

### TaskForm.tsx
- タスク作成・編集のモーダルフォーム
- フィールド: タイトル, 説明, 教科, 単元, 優先度, 開始日, 期限
- 優先度はトグルボタン式 (高/中/低)
- 教科選択で関連する単元リストが動的に更新

### TaskFilter.tsx
- タスクフィルタリングのセレクトボックス群
- 教科・優先度・ステータスで絞り込み
- クリアボタン付き

---

## ガントチャート (`components/gantt/`)

### GanttChart.tsx
- 教科→単元の階層構造でタスクをタイムライン表示
- 左側: 固定ラベル列 (教科/単元名)
- 右側: 横スクロール可能なタイムライン
- 機能:
  - 教科フィルター
  - 「今日へ移動」ボタン
  - タスクバーホバーでツールチップ表示
  - 今日の線 (縦ライン)
  - 完了タスクは半透明、期限超過は赤色

---

## テンプレート (`components/templates/`)

### TemplateList.tsx
- テンプレート一覧 (2カラムグリッド)
- 各テンプレートに項目プレビュー・適用ボタン・削除ボタン

### TemplateForm.tsx
- テンプレート作成モーダル
- 動的にタスク項目を追加・削除
- 各項目: タスク名, 教科, 単元, 優先度, 開始日オフセット, 所要日数

### TemplateApplyDialog.tsx
- テンプレート適用時の開始日選択ダイアログ
- 開始日を基準にタスクが自動生成される

---

## 通知 (`components/notifications/`)

### NotificationSettings.tsx
- Web Notification APIの許可状態表示・リクエスト
- 締切リマインダーのON/OFFトグル
- 24時間以内の締切タスク一覧
