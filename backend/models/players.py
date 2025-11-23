from datetime import datetime

from sqlalchemy import Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.orm import declarative_base, Mapped, mapped_column, relationship
from sqlalchemy.sql import func

# declarative_base() を使ってBaseクラスを定義
Base = declarative_base()


class Player(Base):
    """
    Playersテーブル
    """

    __tablename__ = "players"

    # Mapped を使用した SQLAlchemy 2.0 スタイルの型ヒント付き定義
    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True, info={"description:": "Player ID"}
    )
    url: Mapped[str] = mapped_column(
        String, unique=True, nullable=False, info={"description:": "Player URL"}
    )
    name: Mapped[str] = mapped_column(
        String, nullable=False, info={"description:": "Player Name"}
    )
    nation: Mapped[str] = mapped_column(
        String(3), nullable=True, info={"description:": "Player Nation"}
    )  # 3文字の国コードを想定
    position: Mapped[str] = mapped_column(
        String, nullable=True, info={"description:": "Player Position"}
    )  # コンマ区切りで複数ポジションを格納
    age: Mapped[str] = mapped_column(
        String, nullable=True, info={"description:": "Player Age"}
    )  # 例: '27-338'
    matchweek: Mapped[int] = mapped_column(
        Integer, nullable=True, info={"description:": "Player Matchweek"}
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=func.now(), onupdate=func.now()
    )

    playing_times: Mapped[list["PlayerStandardPlayingTime"]] = relationship(
        back_populates="player"
    )
    performances: Mapped[list["PlayerStandardPerformance"]] = relationship(
        back_populates="player"
    )


class PlayerStandardPlayingTime(Base):
    """
    Players Standard Playing time のテーブル
    """

    __tablename__ = "players_standard_playing_time"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    player_id: Mapped[int] = mapped_column(
        ForeignKey("players.id"),
        index=True,
        nullable=False,
        info={"description:": "Player ID"},
    )
    season: Mapped[str] = mapped_column(
        String(5), nullable=False, info={"description:": "Season"}
    )  # 例: '25/26'
    mp: Mapped[int] = mapped_column(
        Integer, nullable=True, info={"description:": "Matches Played"}
    )  # 今期出場試合数 (Matches Played)
    starts: Mapped[int] = mapped_column(
        Integer, nullable=True, info={"description:": "Starts"}
    )  # 今期スタメン出場試合数
    min: Mapped[int] = mapped_column(
        Integer, nullable=True, info={"description:": "Minutes"}
    )  # 出場時間（分）
    matchweek: Mapped[int] = mapped_column(
        Integer, nullable=True, info={"description:": "Matchweek"}
    )

    # タイムスタンプ
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=func.now(), onupdate=func.now()
    )

    # リレーションシップ
    player: Mapped["Player"] = relationship(back_populates="playing_times")

    # 複合ユニーク制約: プレイヤーとシーズンが一意
    __table_args__ = (
        UniqueConstraint("player_id", "season", name="uq_playing_time_player_season"),
    )


class PlayerStandardPerformance(Base):
    """
    Players Standard Performance のテーブル
    """

    __tablename__ = "players_standard_performance"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    player_id: Mapped[int] = mapped_column(
        ForeignKey("players.id"),
        index=True,
        nullable=False,
        info={"description:": "Player ID"},
    )
    season: Mapped[str] = mapped_column(
        String(5), nullable=False, info={"description:": "Season"}
    )  # 例: '25/26'
    gls: Mapped[int] = mapped_column(
        Integer, nullable=True, info={"description:": "Goals"}
    )  # ゴール数 (Goals)
    ast: Mapped[int] = mapped_column(
        Integer, nullable=True, info={"description:": "Assists"}
    )  # アシスト数 (Assists)
    gls_plus_ast: Mapped[int] = mapped_column(
        Integer, nullable=True, info={"description:": "Goals + Assists"}
    )  # ゴールとアシストの合計数
    goal_minus_pk: Mapped[int] = mapped_column(
        Integer, nullable=True, info={"description:": "Goals - PK"}
    )  # PK以外のゴール数
    pk: Mapped[int] = mapped_column(
        Integer, nullable=True, info={"description:": "Penalties Won/Awarded"}
    )  # PK機会獲得数 (Penalties Won/Awarded)
    pkatt: Mapped[int] = mapped_column(
        Integer, nullable=True, info={"description:": "Penalty Kicks Attempted"}
    )  # PKキッカー回数 (Penalty Kicks Attempted)
    crdy: Mapped[int] = mapped_column(
        Integer, nullable=True, info={"description:": "Yellow Cards"}
    )  # イエローカード獲得数 (Yellow Cards)
    crdr: Mapped[int] = mapped_column(
        Integer, nullable=True, info={"description:": "Red Cards"}
    )  # レッドカード獲得数 (Red Cards)
    matchweek: Mapped[int] = mapped_column(
        Integer, nullable=True, info={"description:": "Matchweek"}
    )

    # タイムスタンプ
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=func.now(), onupdate=func.now()
    )

    # リレーションシップ
    player: Mapped["Player"] = relationship(back_populates="performances")

    # 複合ユニーク制約: プレイヤーとシーズンが一意
    __table_args__ = (
        UniqueConstraint("player_id", "season", name="uq_performance_player_season"),
    )
