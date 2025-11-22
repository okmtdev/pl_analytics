# logger_setup.py
import logging
import logging.config
from scrapings.log.logging_config import LOGGING_CONFIG

# 初期設定フラグ
_initialized = False


def setup_logging():
    """
    ロギング設定を一度だけロードする関数。
    """
    global _initialized
    if _initialized:
        return

    try:
        # dictConfigを使って設定を適用
        logging.config.dictConfig(LOGGING_CONFIG)
        _initialized = True
        print("Logging configuration loaded successfully.")
    except Exception as e:
        print(f"Error loading logging configuration: {e}")
        # 設定失敗時は標準のbasicConfigで最低限のログを設定
        logging.basicConfig(level=logging.WARNING)


def get_logger(name: str = "app_logger"):
    """
    設定済みのロガーインスタンスを取得する関数。
    """
    # ロギング設定がまだロードされていなければロードする
    if not _initialized:
        setup_logging()

    return logging.getLogger(name)


# --- 初期化をモジュールインポート時に自動実行することもできますが、
#     明示的な呼び出し（setup_logging()）を推奨します。
# setup_logging()
