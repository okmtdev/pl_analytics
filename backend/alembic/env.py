import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context

# このファイルのディレクトリをPythonパスに追加し、モデル定義ファイルをインポート
# Alembicがモデルのメタデータ（テーブル定義）を読み取るために必要です。
# 実行環境によっては、このパス設定が必要な場合があります。
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from ..models.players import (
    Base,
    Player,
    PlayerStandardPlayingTime,
    PlayerStandardPerformance,
)

# alembic.iniから設定を取得
config = context.config

# ロギングを設定（通常はそのまま）
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# カスタム設定値を定義するためのセクション
# config.get_main_option() などで ini ファイルから読み取ることができます
target_metadata = Base.metadata

# その他の設定を alembic.ini から読み込む
# 例如: 'alembic.ini' の 'version_table' や 'version_table_schema' など
# fileConfig の実行後、config.set_main_option() で上書きすることも可能


def run_migrations_offline() -> None:
    """
    オフラインモードでマイグレーションを実行します。
    （DB接続なしにSQLスクリプトをファイルに出力する場合）
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """
    オンラインモードでマイグレーションを実行します。
    （DBに接続して直接DDLを実行する場合）
    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
