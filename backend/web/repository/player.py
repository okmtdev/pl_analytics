import pandas as pd
from typing import Dict, List
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from datetime import datetime

# models.py と get_db() 関数をインポート
from models import Player, PlayerStandardPlayingTime 
from database import get_db
# from your_scraper_module import YourScraperClass # 外部モジュールからスクレイパーをインポート

def save_playing_stats_to_db(player_id: int, stats_df: pd.DataFrame) -> None:
    """
    DataFrameのデータを PlayerStandardPlayingTime テーブルに保存する。

    Args:
        player_id: 関連付ける Player の id。
        stats_df: get_passing_stats() から返された DataFrame。
    """
    
    # データをDBに適した形に加工
    # 例として、DataFrameの最初の行のみを使用し、カラム名をDBモデルに合わせて変換
    # 実際のデータフレーム構造に合わせて適切に処理してください
    data_row = stats_df.iloc[0].to_dict()
    
    # DBカラム名に対応するキーから値を取得
    try:
        # DBのカラム名: player_id, season, mp, starts, min, matchweek
        
        # タイムスタンプはDB側で自動設定されるが、Python側で指定しても良い
        current_time = datetime.now() 
        
        # 保存するデータの辞書
        db_data = {
            "player_id": player_id,
            "season": data_row.get("Season"),  # DataFrameのカラム名に合わせて修正
            "mp": int(data_row.get("MP", 0)),
            "starts": int(data_row.get("Starts", 0)),
            "min": int(data_row.get("Min", 0)),
            "matchweek": int(data_row.get("Matchweek", 0)),
            # created_at, updated_at はモデル定義の func.now() で自動設定
        }

    except KeyError as e:
        print(f"データフレームに必要なキーが見つかりません: {e}")
        return
    except ValueError as e:
        print(f"データの型変換に失敗しました: {e}")
        return

    # データベースセッションを開始
    with get_db() as db:
        try:
            # 既存のレコードの確認 (複合ユニークキー: player_id と season)
            existing_record = db.query(PlayerStandardPlayingTime).filter(
                PlayerStandardPlayingTime.player_id == player_id,
                PlayerStandardPlayingTime.season == db_data["season"]
            ).first()

            if existing_record:
                # レコードが存在する場合: 更新 (UPSERT処理)
                print(f"既存レコードを更新中: Player ID {player_id}, Season {db_data['season']}")
                for key, value in db_data.items():
                    setattr(existing_record, key, value)
            else:
                # レコードが存在しない場合: 新規作成
                new_record = PlayerStandardPlayingTime(**db_data)
                db.add(new_record)
                print(f"新規レコードを追加: Player ID {player_id}, Season {db_data['season']}")

        except IntegrityError:
            # ユニーク制約違反など (通常、上の check/update で防げる)
            db.rollback()
            print(f"エラー: データ保存中に整合性エラーが発生しました。Player ID: {player_id}")
        except Exception as e:
            db.rollback()
            print(f"予期せぬエラーが発生しました: {e}")


# --- 実行例 ---
if __name__ == "__main__":
    
    # 実際のスクレイピング処理をシミュレート
    class MockScraper:
        def get_passing_stats(self) -> pd.DataFrame:
            # DBカラムと対応するデータを作成（実際はスクレイパーの結果）
            data = {
                "Season": ["25/26"],
                "MP": [11],
                "Starts": [10],
                "Min": [850],
                "Matchweek": [11]
            }
            return pd.DataFrame(data)

    mock_scraper = MockScraper()
    
    # データを取得
    passing_df = mock_scraper.get_passing_stats()
    
    # データベースに保存
    # 注意: ここで使用する player_id は、事前に Player テーブルに存在する必要があります
    target_player_id = 100 
    
    # Player レコードが DB に存在することを確認する処理を挟むのが理想
    
    save_playing_stats_to_db(target_player_id, passing_df)