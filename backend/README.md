

```
export DATABASE_URL="postgresql://ユーザー名:パスワード@/データベース名?host=/cloudsql/プロジェクトID:リージョン:インスタンス名"
```

マイグレーションファイル作成

```bash
alembic revision --autogenerate -m "create initial tables"
```

マイグレーション実行

```bash
alembic upgrade head
```

```sh
uv run ruff format . --check
uv run ruff format .
```