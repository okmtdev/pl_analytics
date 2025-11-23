from io import StringIO

from scrapings.utils.html_fetcher import HtmlFetcher
from scrapings.log.logger_setup import get_logger, setup_logging


import pandas as pd
from playwright.sync_api import sync_playwright

setup_logging()
logger = get_logger("batch_logger")


class Club:
    player_standard_table_id: str = "stats_standard_9"
    player_passing_table_id: str = "stats_passing_9"
    player_shooting_table_id: str = "stats_shooting_9"
    PLAYER_BASE_URL: str = "https://fbref.com"

    def __init__(self, name: str, url: str):
        logger.debug(f"[Club] クラブ情報初期化: {name}, {url}")
        self.name = name
        self.url = url
        self._soup = HtmlFetcher(url=self.url).get_soup()

    def extract_standard_players(self) -> (pd.DataFrame, pd.DataFrame, int):
        """指定されたIDのテーブルとPlayerのURLを取得"""
        table = self._soup.find("table", id=self.player_standard_table_id)

        if not table:
            raise ValueError(
                f"テーブル(id='{self.player_standard_table_id}')が見つかりませんでした"
            )

        df = pd.read_html(StringIO(str(table)))[0]

        player_urls = []
        tbody = table.find("tbody")
        if tbody:
            for row in tbody.find_all("tr"):
                if "thead" in row.get("class", []):
                    continue

                link = row.select_one('th[data-stat="player"] a')
                if link and link.get("href"):
                    player_urls.append(self.PLAYER_BASE_URL + link["href"])
                else:
                    player_urls.append(None)

        squad_df = df[df[('Unnamed: 0_level_0', 'Player')] == 'Squad Total']
        matchweek = int(squad_df.iloc[0][('Unnamed: 4_level_0', 'MP')])
        df = df[df[('Unnamed: 0_level_0', 'Player')] != 'Squad Total']
        player_df = df[df[('Unnamed: 0_level_0', 'Player')] != 'Opponent Total']
        player_df.insert(0, "player_url", player_urls)
        return player_df, squad_df, matchweek

