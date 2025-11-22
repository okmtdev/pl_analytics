from io import StringIO
from typing import Dict, List, Optional, Tuple

from scrapings.player import Player
from scrapings.utils.html_fetcher import HtmlFetcher
from scrapings.log.logger_setup import get_logger, setup_logging


import pandas as pd
from playwright.sync_api import sync_playwright

setup_logging()
logger = get_logger("batch_logger")


class Club:
    name: str
    url: str
    player_standard_table_id: str = "stats_standard_9"
    player_passing_table_id: str = "stats_passing_9"
    player_tables: list[str] = [
        "stats_standard_9",
        "stats_shooting_9",
        "stats_passing_9"
    ]
    player_base_url: str = "https://fbref.com"
    html: str
    players: [Player]

    def __init__(self, name: str, url: str):
        logger.debug(f"initialize club...,club: {name}, {url}")
        self.name = name
        self.url = url
        self.soup = HtmlFetcher(url=self.url).get_soup()

    def extract_players(self) -> Tuple[pd.DataFrame, List[Optional[str]]]:
        """指定されたIDのテーブルとPlayerのURLを取得"""
        table = self.soup.find("table", id=self.player_standard_table_id)

        if not table:
            raise ValueError(
                f"テーブル(id='{self.player_standard_table_id}')が見つかりませんでした"
            )

        # pandasでテーブルを読み込み
        df = pd.read_html(StringIO(str(table)))[0]

        # PlayerのURLを抽出
        player_urls = []
        tbody = table.find("tbody")
        if tbody:
            for row in tbody.find_all("tr"):
                if "thead" in row.get("class", []):
                    continue

                link = row.select_one('th[data-stat="player"] a')
                if link and link.get("href"):
                    player_urls.append(self.player_base_url + link["href"])
                else:
                    player_urls.append(None)

        # DataFrameの行数とURLリストの長さを合わせる
        if len(player_urls) != len(df):
            player_urls = (player_urls + [None] * len(df))[: len(df)]

        df.insert(0, "player_url", player_urls)
        return df, player_urls

    def get_passing_stats(self) -> List[Dict]:
        """passingテーブルの情報を抽出してlist[dict]で返す"""
        soup = HtmlFetcher(url=self.url).get_soup()
        table = soup.find("table", id=self.player_passing_table_id)

        if not table:
            raise ValueError(
                f"テーブル(id='{self.player_passing_table_id}')が見つかりませんでした"
            )

        # pandasでテーブルを読み込み
        df = pd.read_html(StringIO(str(table)))[0]
        return df
