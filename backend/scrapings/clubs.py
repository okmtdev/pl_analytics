from typing import Iterable
from scrapings.club import Club
from scrapings.log.logger_setup import get_logger, setup_logging
from scrapings.utils.html_fetcher import HtmlFetcher


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
    def __init__(self, clubs: Iterable):
        super().__init__()

        for item in clubs:
            if isinstance(item, Club):
                self.append(item)
                continue

            if isinstance(item, dict):
                # dict may contain one or more name->url entries
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

    def all(self) -> None:
        for club in self:
            df, _ = club.extract_players()
            print(df.columns)

            print(f"\n--- stats_standard_9 テーブル ---")
            print(f"行数: {len(df)}, 列数: {len(df.columns)}")
            print("\n最初の5行:")
            print(df.head())

            df = club.get_passing_stats()
            print(f"\n--- div_stats_passing_9 テーブル ---")
            print(f"行数: {len(df)}, 列数: {len(df.columns)}")
            print("\n最初の5行:")
            print(df.head())


logger.info(f"[Clubs] 開始")
clubs = Clubs(clubs=CLUBS_25_26)
print(clubs.find_by_name("Fulham"))
print(clubs.to_dicts())
clubs.all()
logger.info(f"[Clubs] 完了")

