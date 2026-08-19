# Controller / API 一覧

`api/Controllers/` 配下の各Controllerが提供するエンドポイントの一覧です。実装の元になった仕様は `Agent/api.md` を参照してください。

## 共通事項

- ベースURL: `http://localhost:5257`(devサーバー既定ポート)
- 認証: JWT Bearer。`Authorization: Bearer <token>` ヘッダーで送る。`[Authorize]`がついているエンドポイントは必須
- 認証必須のエンドポイントでは、ボディの`userId`ではなく**JWTのクレームから取得したユーザーID**が「自分」として使われる(`Helpers/ClaimsPrincipalExtensions.GetUserId()`)
- レスポンスはDTO(`Dtos/`配下)経由で返るため、`Password`など内部専用フィールドは含まれない
- Swagger UI: `http://localhost:5257/swagger`(開発環境のみ)。右上のAuthorizeボタンにBearerトークンを入力すると認証付きエンドポイントも試せる

## Auth (`AuthController`)

| Method | Path | 認証 | 説明 |
|---|---|---|---|
| POST | `/api/register` | 不要 | 新規登録。メール重複時は409。成功時JWTを返す |
| POST | `/api/login` | 不要 | ログイン。成功時JWTを返す |

## User (`UserController`)

| Method | Path | 認証 | 説明 |
|---|---|---|---|
| GET | `/api/Users` | 不要 | ユーザー一覧(公開情報のみ: Name/Avatar/JobOrCommonMan/CreateAt) |
| GET | `/api/User/{id}` | 不要 | ユーザー単体取得(公開情報のみ) |
| GET | `/api/User/account/{id}` | 必須 | アカウント詳細(Email/Addressを含む) |
| PATCH | `/api/User/Patch` | 必須 | 自分の情報を編集(Name/Avatar/Addressのみ、idはJWTから解決) |
| DELETE | `/api/User/delete` | 必須 | 自分のアカウントを削除(自分が絡むFollowも合わせて削除) |

## Post (`PostController`)

| Method | Path | 認証 | 説明 |
|---|---|---|---|
| GET | `/api/Posts` | 不要 | 投稿一覧(新しい順)。LikeCount・タグ名・`media`を含む |
| GET | `/api/Post/{id}` | 不要 | 投稿単体取得 |
| POST | `/api/Post` | 必須 | 投稿作成。`SupportId`は存在するSupportである必要あり。`Subscription`と`Media`は任意 |
| PATCH | `/api/Post/Patch/{id}` | 必須 | 投稿編集(投稿者本人のみ、403 Forbidden)。`Media`を渡すと既存メディアを全置き換え |
| DELETE | `/api/Post/Delete/{id}` | 必須 | 投稿削除(投稿者本人のみ、`PostMedia`もCascadeで削除) |

**メディア(画像/動画)は1投稿に複数持てる**(`PostMedia`テーブル、`Post 1 - * PostMedia`)。`media`は`[{ "url": "...", "type": "Image" | "Movie" }]`の配列で、`UploadController`が返すURLをそのまま`url`にセットする想定。順序は配列の並び順が`SortOrder`として保存される。PATCHで`media`を送ると既存の全メディアが置き換わる(差分更新ではない)。

## Support (`SupportController`)

「支援プラン」を表すテーブル。`IsMonthly`でそのプランが月額か単発かを表す(単一のテーブルで両方をカバーする設計)。

| Method | Path | 認証 | 説明 |
|---|---|---|---|
| POST | `/api/support` | 必須 | 支援プランを作成(作成者=自分) |
| GET | `/api/support/{id}/status` | 不要 | プラン情報取得 |
| DELETE | `/api/support/{id}` | 必須 | プラン削除(作成者本人のみ) |

## Subscription (`SubscriptionController`)

ユーザーが特定のSupportプランに加入した記録。`{id}`は**SubscriptionIdではなくSupportId**(加入対象のプランID)を指す点に注意。

| Method | Path | 認証 | 説明 |
|---|---|---|---|
| POST | `/api/SubScription` | 必須 | プランに加入。既に加入済みなら409 |
| DELETE | `/api/SubScription/{id}` | 必須 | 加入解除(idはSupportId) |
| GET | `/api/SubScription/{id}/status` | 必須 | 加入状態と`ExpiresAt`(加入日+1ヶ月)を返す |

**自動失効**: `Services/SubscriptionExpirationService.cs`(BackgroundService、1時間おき+起動時)が、対応する`Support.IsMonthly == true`かつ`CreateAt`から1ヶ月経過したSubscriptionを自動削除する。`IsMonthly == false`(単発プラン)は対象外で、自動解除されない。

## Like (`LikeController`)

`{id}`はLikeIdではなく**PostId**を指す(Follow/Subscriptionと同じ「対象ID」方式)。

| Method | Path | 認証 | 説明 |
|---|---|---|---|
| POST | `/api/Like` | 必須 | いいね(ボディに`postId`) |
| DELETE | `/api/Like/{id}` | 必須 | いいね解除(idはPostId) |
| GET | `/api/like/{id}/status` | 必須 | 自分がいいね済みか(idはPostId) |

## Tag (`TagController`)

| Method | Path | 認証 | 説明 |
|---|---|---|---|
| POST | `/api/tag` | 必須 | タグ作成(作成者=自分) |
| GET | `/api/tags` | 不要 | タグ一覧 |

## PostTag (`PostTagController`)

api.md原案のルートは他エンドポイントと衝突する形だったため、`/api/postTag/...`に統一。

| Method | Path | 認証 | 説明 |
|---|---|---|---|
| GET | `/api/postTag/{postId}` | 不要 | 投稿に紐づくタグ一覧 |
| POST | `/api/postTag` | 必須 | 投稿にタグを紐付け(投稿者本人のみ、403 Forbidden) |
| DELETE | `/api/postTag/{postId}/{tagId}` | 必須 | 紐付け解除(投稿者本人のみ) |

## Follow (`FollowController`)

| Method | Path | 認証 | 説明 |
|---|---|---|---|
| POST | `/api/follow/{targetId}` | 必須 | フォローする(自分自身は不可) |
| DELETE | `/api/follow/{targetId}` | 必須 | フォロー解除 |
| GET | `/api/follow/{userId}/followers` | 不要 | フォロワー数 |
| GET | `/api/follow/{targetId}/status` | 必須 | 自分がフォロー中か |

## Upload (`UploadController`)

Cloudflare R2(`R2.NET`)へのアップロード。バケット名は`appsettings.json`の`R2:ImageBucket`/`R2:MovieBucket`(`.env`の`R2__ImageBucket`/`R2__MovieBucket`で上書き)。

| Method | Path | 認証 | 制限 | 説明 |
|---|---|---|---|---|
| POST | `/api/upload/image` | 必須 | jpeg/png/gif/webp、20MBまで | 画像アップロード、`{ "url": "..." }`を返す |
| POST | `/api/upload/movie` | 必須 | mp4/quicktime/webm、500MBまで | 動画アップロード、`{ "url": "..." }`を返す |

返ってきた`url`を`Post`作成/編集時の`image`/`movie`にそのままセットする。

## 認証・CORS設定

- JWT: `appsettings.json`の`Jwt`セクション(`Key`/`Issuer`/`Audience`/`ExpiresMinutes`)
- CORS: `Program.cs`で`http://localhost:3000`(Next.js dev)からのアクセスのみ許可
- R2/DBの接続情報は`.env`で上書き(`.env.example`参照、`.gitignore`済み)
