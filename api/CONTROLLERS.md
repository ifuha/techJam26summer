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
| GET | `/api/Users` | 不要 | ユーザー一覧(公開情報のみ: Name/Avatar/JobOrCommonMan/ProductName/Prefecture/Tags/CreateAt) |
| GET | `/api/User/{id}` | 不要 | ユーザー単体取得(公開情報のみ) |
| GET | `/api/User/account/{id}` | 必須 | アカウント詳細(Email/Address/Prefecture/Tagsを含む) |
| PATCH | `/api/User/Patch` | 必須 | 自分の情報を編集(Name/Avatar/Address/Prefecture/ProductNameのみ、idはJWTから解決) |
| DELETE | `/api/User/delete` | 必須 | 自分のアカウントを削除(自分が絡むFollowも合わせて削除、UserTagはCascadeで自動削除) |

`ProductName`はそのユーザーが何をやっているか/何のプロダクトの人かを表す任意項目。

`Prefecture`は地図にピンを立てるための都道府県(47都道府県のいずれかにバリデーション、`Helpers/Prefectures.cs`)。`Address`は市区町村以降の自由記述で、地図表示には使わない想定。register/patch時に不正な値は400になる。

`CraftId`はそのユーザーが後継者として名乗っている`Craft`(伝統工芸)への紐付け。Job系ユーザーのみ`PATCH /api/User/Patch`で設定可能(詳細は下記Craftセクション)。

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

## UserTag (`UserTagController`)

ユーザーのプロフィールに「何をやっている人か」を表すTagを付けられる機能。`Tag`テーブルはPostTagと共用。**JobOrCommonMan == trueのユーザー(Job系)のみ**付与可能で、一般ユーザーへの付与は400エラーになる。対象は常に自分自身(JWTから解決)。

| Method | Path | 認証 | 説明 |
|---|---|---|---|
| GET | `/api/userTag/{userId}` | 不要 | そのユーザーに付いているTag一覧 |
| POST | `/api/userTag` | 必須 | 自分にTagを付与(ボディに`tagId`)。一般ユーザーは400 |
| DELETE | `/api/userTag/{tagId}` | 必須 | 自分からTagを外す |

## Admin (`AdminController`)

`User`とは別テーブルの管理者アカウント。`Craft`のCRUDに必要な権限(`AdminOnly`ポリシー、JWTに`role: Admin`クレーム)を持つ。

| Method | Path | 認証 | 説明 |
|---|---|---|---|
| POST | `/api/admin/register` | 不要 | 管理者登録。メール重複時は409。成功時JWT(role=Admin)を返す |
| POST | `/api/admin/login` | 不要 | 管理者ログイン |

## Craft (`CraftController`)

「地域の伝統工芸」を表すテーブル。地図をズームした際にピンの代わりに出すカード用データで、`ProductName`/`Address`/`Prefecture`/`Image`/`Description`を持つ。作成・編集時に`Prefecture`+`Address`から自動ジオコーディング(`GeocodingService`、Userと同じ仕組み)。作成・編集・削除は`AdminOnly`、閲覧は誰でも可能。

| Method | Path | 認証 | 説明 |
|---|---|---|---|
| GET | `/api/crafts` | 不要 | Craft一覧(地図表示用の要約: ProductName/Address/Prefecture/Lat/Lng/Image) |
| GET | `/api/craft/{id}` | 不要 | Craft詳細(Descriptionと、紐付いている後継者一覧`successors`・`successorCount`を含む) |
| POST | `/api/craft` | Admin | Craft作成 |
| PATCH | `/api/craft/Patch/{id}` | Admin | Craft編集 |
| DELETE | `/api/craft/Delete/{id}` | Admin | Craft削除(紐付くUserは`CraftId`がnullになるだけ、Userは削除されない) |

**後継者(successor)の登録**: CraftControllerではなく`User`側で行う。Job系ユーザー(`JobOrCommonMan == true`)が`PATCH /api/User/Patch`で`craftId`を指定すると、そのCraftの後継者として登録される(一般ユーザーは400)。指定したCraftが存在しない場合も400。

**自動リンク**: ユーザーは`craftId`を意識する必要はない。`register`時、および`craftId`を明示指定しない`PATCH /api/User/Patch`時に、`ProductName`と`Prefecture`が完全一致する`Craft`があれば自動で`CraftId`をセットする(`AuthController.Register`/`UserController.PatchUser`)。表記ゆれ(例:「美濃焼」と「美濃焼き」)は別物として扱われ、自動リンクされない。

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
