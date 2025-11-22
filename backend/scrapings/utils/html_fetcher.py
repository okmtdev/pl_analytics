from playwright.sync_api import sync_playwright

from bs4 import BeautifulSoup, Comment


class HtmlFetcher:
    def __init__(self, url: str):
        self.url = url

    def get_soup(self) -> BeautifulSoup:
        """PlaywrightでHTMLを取得(スクレイピング対策回避), HTMLをパースし、コメントアウトされたテーブルを展開する"""
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page(
                user_agent=(
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/122.0.0.0 Safari/537.36"
                ),
                viewport={"width": 1200, "height": 800},
            )
            page.goto(self.url, wait_until="domcontentloaded", timeout=60_000)
            page.wait_for_timeout(3000)
            html = page.content()
            browser.close()

        soup = BeautifulSoup(html, "html.parser")
        for comment in soup.find_all(string=lambda text: isinstance(text, Comment)):
            try:
                soup.append(BeautifulSoup(comment, "html.parser"))
                comment.extract()
            except Exception:
                pass
        return soup
