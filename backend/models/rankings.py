from datetime import datetime

from sqlalchemy import Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.orm import declarative_base, Mapped, mapped_column, relationship
from sqlalchemy.sql import func

Base = declarative_base()

class Ranking(Base):
    __tablename__ = "rankings"

    rank: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True, info={"description:": "Ranking (e.g., 1)"}
    )
    name: Mapped[str] = mapped_column(
        String, nullable=False, info={"description:": "Club Name (e.g., Liverpool)"}
    )
    season: Mapped[str] = mapped_column(
        String(5), nullable=False, info={"description:": "Season (e.g., 25/26)"}
    )
    matchweek: Mapped[int] = mapped_column(
        Integer, nullable=True, info={"description:": "Matchweek (e.g., 12)"}
    )
    mp: Mapped[int] = mapped_column(
        Integer, nullable=True, info={"description:": "Matches Played (e.g., 12)"}
    )
    wins: Mapped[int] = mapped_column(
        Integer, nullable=True, info={"description:": "Wins (e.g., 12)"}
    )
    draws: Mapped[int] = mapped_column(
        Integer, nullable=True, info={"description:": "Draws (e.g., 2)"}
    )
    losees: Mapped[int] = mapped_column(
        Integer, nullable=True, info={"description:": "Losses (e.g., 11)"}
    )
    gf: Mapped[int] = mapped_column(
        Integer, nullable=True, info={"description:": "Goals For (e.g., 22)"}
    )
    ga: Mapped[int] = mapped_column(
        Integer, nullable=True, info={"description:": "Goals Against (e.g., 27)"}
    )
    gd: Mapped[int] = mapped_column(
        Integer, nullable=True, info={"description:": "Goal Difference (e.g., -5)"}
    )
    pts: Mapped[int] = mapped_column(
        Integer, nullable=True, info={"description:": "Points (e.g., 22)"}
    )
    pts_per_mp: Mapped[float] = mapped_column(
        Float, nullable=True, info={"description:": "Points per Match Played (e.g., 2.2)"}
    )
    xg: Mapped[float] = mapped_column(
        Float, nullable=True, info={"description:": "Expected Goals (e.g., 18.8)"}
    )
    xga: Mapped[float] = mapped_column(
        Float, nullable=True, info={"description:": "Expected Goals Against (e.g., 6.0)"}
    )
    xgd: Mapped[float] = mapped_column(
        Float, nullable=True, info={"description:": "Expected Goal Difference (e.g., -4.1)"}
    )
    xgd_per_90: Mapped[float] = mapped_column(
        Float, nullable=True, info={"description:": "Expected Goal Difference per 90 (e.g., -0.49)"}
    )
    last_five_matches: Mapped[int] = mapped_column(
        Integer, nullable=True, info={"description:": "Last Five Matches (e.g., W W L W D)"}
    )
    attendance: Mapped[int] = mapped_column(
        Integer, nullable=True, info={"description:": "Attendance per game during this season (e.g., 51,978)"}
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=func.now(), onupdate=func.now()
    )

    __table_args__ = (
        UniqueConstraint("season", "matchweek", "name", name="uq_ranking_season_matchweek"),
    )