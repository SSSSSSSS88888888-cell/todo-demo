# データベーススキーマ ドキュメント

## ER図 (テキスト)

```
User ─────┬──── Task ────── Subject ──── Unit
          │                    │            │
          ├──── Template       └────────────┘
          │       └── TemplateItem
          └──── Streak
```

## テーブル一覧

### User
| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID (PK) | 自動生成 |
| email | String (UNIQUE) | メールアドレス |
| password | String | bcryptハッシュ |
| name | String | 表示名 |
| createdAt | DateTime | 作成日時 |

### Subject (教科)
| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID (PK) | 自動生成 |
| name | String (UNIQUE) | 教科名 (算数, 国語, 理科, 社会) |
| color | String | UIカラー (Hex) |
| order | Int | 表示順 |

### Unit (単元)
| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID (PK) | 自動生成 |
| name | String | 単元名 |
| order | Int | 表示順 |
| subjectId | UUID (FK) | 教科ID |

ユニーク制約: `(subjectId, name)`

### Task (タスク)
| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID (PK) | 自動生成 |
| title | String | タスク名 |
| description | String? | 説明 (任意) |
| priority | Enum | HIGH, MEDIUM, LOW |
| status | Enum | TODO, IN_PROGRESS, DONE |
| startDate | DateTime | 開始日 |
| dueDate | DateTime | 期限 |
| completedAt | DateTime? | 完了日時 |
| userId | UUID (FK) | ユーザーID |
| subjectId | UUID (FK) | 教科ID |
| unitId | UUID? (FK) | 単元ID (任意) |
| createdAt | DateTime | 作成日時 |
| updatedAt | DateTime | 更新日時 |

### Template (テンプレート)
| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID (PK) | 自動生成 |
| name | String | テンプレート名 |
| description | String? | 説明 |
| userId | UUID (FK) | 作成者 |
| createdAt | DateTime | 作成日時 |

### TemplateItem (テンプレート項目)
| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID (PK) | 自動生成 |
| title | String | タスク名 |
| description | String? | 説明 |
| subjectName | String | 教科名 (直接保持) |
| unitName | String? | 単元名 (直接保持) |
| priority | Enum | HIGH, MEDIUM, LOW |
| dayOffset | Int | 開始日からの相対日数 |
| durationDays | Int | 所要日数 (デフォルト: 1) |
| templateId | UUID (FK) | テンプレートID (CASCADE削除) |

### Streak (連続達成)
| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID (PK) | 自動生成 |
| userId | UUID (FK, UNIQUE) | ユーザーID (1:1) |
| currentStreak | Int | 現在の連続日数 |
| longestStreak | Int | 最長記録 |
| lastCompletionDate | DateTime? | 最終完了日 |
| updatedAt | DateTime | 更新日時 |

## Enum定義

### Priority
- `HIGH` - 高優先度
- `MEDIUM` - 中優先度
- `LOW` - 低優先度

### TaskStatus
- `TODO` - 未着手
- `IN_PROGRESS` - 進行中
- `DONE` - 完了
