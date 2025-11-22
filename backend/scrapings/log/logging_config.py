LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    # --- 1. フォーマッターの定義 ---
    "formatters": {
        "detailed": {
            "format": "%(asctime)s - %(levelname)s - [%(name)s] - %(filename)s:%(lineno)d - %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
        "simple": {
            "format": "%(levelname)s: %(message)s",
        },
    },
    # --- 2. ハンドラーの定義 ---
    "handlers": {
        # コンソール出力用ハンドラー
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "simple",
            "level": "DEBUG",
        },
        # ファイル出力用ハンドラー（ローテーションあり）
        "file_handler": {
            "class": "logging.handlers.RotatingFileHandler",
            "filename": "application.log",
            "maxBytes": 1024 * 1024 * 10,  # 10MB
            "backupCount": 3,
            "formatter": "detailed",
            "level": "DEBUG",  # DEBUG以上のログをファイルに出力
            "encoding": "utf-8",
        },
    },
    # --- 3. ロガーの定義 ---
    "loggers": {
        # アプリケーション全体で使用するメインロガー
        "batch_logger": {
            "handlers": ["console", "file_handler"],
            "level": "DEBUG",  # ロガー全体はDEBUGレベルでメッセージを受け付ける
            "propagate": False,  # 親ロガーに伝播させない
        },
        "web_logger": {
            "handlers": ["console", "file_handler"],
            "level": "DEBUG",  # ロガー全体はDEBUGレベルでメッセージを受け付ける
            "propagate": False,  # 親ロガーに伝播させない
        },
        # 外部ライブラリのログを制御（例：requestsライブラリ）
        "requests": {
            "handlers": ["file_handler"],
            "level": "WARNING",  # requestsのログはWARNING以上のみ記録
            "propagate": False,
        },
    },
    # ルートロガー（設定がない場合のデフォルト）
    "root": {
        "handlers": ["console"],
        "level": "WARNING",
    },
}
