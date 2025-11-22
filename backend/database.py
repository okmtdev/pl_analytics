from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session

DATABASE_URL = "postgresql+psycopg2://postgres:password@127.0.0.1:5432/pl_analytics"

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = scoped_session(
    sessionmaker(autocommit=False, autoflush=False, bind=engine)
)

@contextmanager
def get_db() -> Generator[SessionLocal, None, None]:
    """
    データベースセッションを提供するコンテキストマネージャ
    with文を抜ける際にコミットまたはロールバックを行い、セッションを閉じます。
    """
    db = SessionLocal()
    try:
        yield db
        db.commit() # 成功時にコミット
    except Exception:
        db.rollback() # エラー時にロールバック
        raise
    finally:
        db.close()