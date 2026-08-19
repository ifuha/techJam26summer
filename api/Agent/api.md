## User

- [/api/Users] getUsers一覧取得
- [/api/User/{id}] getUser単体取得
- [/api/User/account/{id}] UserAccount取得 [Authorize]
- [/api/User/Patch] User編集
- [/api/User/delete] User削除

## Post

- [/api/Posts] getPosts一覧取得 “GET”
- [/api/Post/{id}] getPost単体取得 “GET”
- [/api/Post] CreatePost作成 “POST”
- [/api/Post/Patch/{id}] PostPatch投稿編集 “PATCH”
- [/api/Post/Delete] Post削除 “DELETE”

### Auth

- [/api/register] Register 新規登録 “POST”
- [/api/login] Login ログイン “POST”

### Support

- [/api/support] Support サポートする “POST”
- [/api/support/{id}/status] SupportStatus サポート状態 “GET”
- [/api/support/{id}] UnSupport サポート解除 “DELETE”

### SubScription

- [/api/SubScription] SubScription サブスクに入る “POST”
- [/api/SubScription/{id}] UnSubScription サブスク解除 “DELETE”
- [/api/SubScription/{id}/status] SubscriptionStatus サブスク状態 “GET”

### Like

- [/api/Like] Like いいねする”POST”
- [/api/Like/${id}] UnLike いいね解除 “DELETE”
- [/api/like/${id}/status] IsLike いいね状態 “GET”

### Tag

- [/api/tag] Tagを作成 “POST”
- [/api/tags] タグ一覧取得 “GET”

#### PostTag

- [/api/{postId}] PostTag紐付き確認 “GET”
- [/api/postTag] PostTag作成 “POST”
- [/api/{postId}/{tagId}] PostTag削除 “DELETE”

### Follow

- [/api/follow/{targetId}] Follow フォローする “POST”
- [/api/follow/{targetId}] UnFollow フォロー解除 “DELETE”
- [/api/follow/{userId}/followers] Follower フォロワー数 “GET”
- [/api/follow/{targetId}/status] IsFollowing フォロー状態 “GET”
