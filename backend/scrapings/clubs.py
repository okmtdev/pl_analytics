from io import StringIO
from typing import Iterable
from scrapings.club import Club
from scrapings.log.logger_setup import get_logger, setup_logging
from scrapings.utils.html_fetcher import HtmlFetcher
from scrapings.log.logger_setup import get_logger, setup_logging

import pandas as pd


setup_logging()
logger = get_logger("batch_logger")

CLUBS_25_26 = [
    {"Arsenal": "https://fbref.com/en/squads/18bb7c10/Arsenal-Stats"},
    # {"Manchester City": "https://fbref.com/en/squads/b8fd03ef/Manchester-City-Stats"},
    # {"Chelsea": "https://fbref.com/en/squads/cff3d9bb/Chelsea-Stats"},
    # {"Tottenham": "https://fbref.com/en/squads/361ca564/Tottenham-Hotspur-Stats"},
    # {"Aston Villa": "https://fbref.com/en/squads/8602292d/Aston-Villa-Stats"},
    # {"Manchester Utd": "https://fbref.com/en/squads/19538871/Manchester-United-Stats"},
    # {"Liverpool": "https://fbref.com/en/squads/822bd0ba/Liverpool-Stats"},
    # {"Crystal Palace": "https://fbref.com/en/squads/47c64c55/Crystal-Palace-Stats"},
    # {"Brighton": "https://fbref.com/en/squads/d07537b9/Brighton-and-Hove-Albion-Stats"},
    # {"Brentford": "https://fbref.com/en/squads/cd051869/Brentford-Stats"},
    # {"Leeds United": "https://fbref.com/en/squads/5bfb9659/Leeds-United-Stats"},
    # {"Burnley": "https://fbref.com/en/squads/943e8050/Burnley-Stats"},
    # {"West Ham": "https://fbref.com/en/squads/7c21e445/West-Ham-United-Stats"},
    # {"Nott'ham Forest": "https://fbref.com/en/squads/e4a775cb/Nottingham-Forest-Stats"},
    # {"Newcastle Utd": "https://fbref.com/en/squads/b2b47a98/Newcastle-United-Stats"},
    # {"Everton": "https://fbref.com/en/squads/d3fd31cc/Everton-Stats"},
    # {"Wolves": "https://fbref.com/en/squads/8cec06e1/Wolverhampton-Wanderers-Stats"},
    # {"Bournemouth": "https://fbref.com/en/squads/4ba7cbea/Bournemouth-Stats"},
    # {"Fulham": "https://fbref.com/en/squads/fd962109/Fulham-Stats"},
    # {"Sunderland": "https://fbref.com/en/squads/8ef52968/Sunderland-Stats"}
]


class Clubs(list):
    CLUBS_URL = "https://fbref.com/en/comps/9/Premier-League-Stats"
    RANKING_TABLE_ID = "results2025-202691_overall"

    def __init__(self, clubs: Iterable):
        super().__init__()

        for item in clubs:
            if isinstance(item, Club):
                self.append(item)
                continue

            if isinstance(item, dict):
                for name, url in item.items():
                    self.append(Club(name, url))
                continue

            raise TypeError(f"Unsupported club entry: {item!r}")

    def __repr__(self) -> str:
        names = ", ".join(repr(c.name) for c in self)
        return f"Clubs([{names}])"

    def find_by_name(self, name: str) -> Club | None:
        for club in self:
            if club.name == name:
                return club
        return None

    def to_dicts(self) -> dict[str, str]:
        return {c.name: c.url for c in self}

    def ranking(self) -> pd.DataFrame:
        soup = HtmlFetcher(url=self.CLUBS_URL).get_soup()
        table = soup.find("table", id=self.RANKING_TABLE_ID)

        if not table:
            raise ValueError(
                f"テーブル(id='{self.RANKING_TABLE_ID}')が見つかりませんでした"
            )

        df = pd.read_html(StringIO(str(table)))[0]
        return df

    def ranking_with_matchweek(self) -> (pd.DataFrame, int):
        soup = HtmlFetcher(url=self.CLUBS_URL).get_soup()
        table = soup.find("table", id=self.RANKING_TABLE_ID)

        if not table:
            raise ValueError(
                f"テーブル(id='{self.RANKING_TABLE_ID}')が見つかりませんでした"
            )

        df = pd.read_html(StringIO(str(table)))[0]
        return df, df['MP'].max()

    def all(self) -> None:
        for club in self:
            player_df, squad_df, matchweek = club.extract_standard_players()
            logger.info(f"Matchweek: {matchweek}")
            print(player_df.columns)

            print(f"\n--- stats_standard_9 テーブル ---")
            print(f"行数: {len(player_df)}, 列数: {len(player_df.columns)}")
            print("\n最初の5行:")
            print(player_df.head())
            logger.info(f"player_df 見ていきましょう。")
            for _, row in player_df.iterrows():
                logger.info(
                    f"Player:{row[('Unnamed: 0_level_0', 'Player')]}, "
                    f"Pos:{row[('Unnamed: 2_level_0', 'Pos')]}, "
                    f"Age:{row[('Unnamed: 3_level_0', 'Age')]}, "
                )
            logger.info(f"見てみました。")

            logger.info(f"squad_df 見ていきましょう。")
            for _, row in squad_df.iterrows():
                logger.info(
                    f"Player:{row[('Unnamed: 0_level_0', 'Player')]}, "
                    f"Pos:{row[('Unnamed: 2_level_0', 'Pos')]}, "
                    f"Age:{row[('Unnamed: 3_level_0', 'Age')]}, "
                )
            logger.info(f"見てみました。")

            #df = club.get_passing_stats()
            #print(f"\n--- div_stats_passing_9 テーブル ---")
            #print(f"行数: {len(df)}, 列数: {len(df.columns)}")
            #print("\n最初の5行:")
            #print(df.head())


logger.info(f"[Clubs] 開始")
clubs = Clubs(clubs=CLUBS_25_26)
#print(clubs.find_by_name("Fulham"))
#print(clubs.to_dicts())
#clubs.all()
ranking_df, matchweek = clubs.ranking_with_matchweek()
print(ranking_df)
logger.info(f"[Clubs] 完了")

