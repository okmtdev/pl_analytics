from clubs.club import Club
import pandas as pd


# Mock Club class to avoid network requests
class MockClub(Club):
    def __init__(self, html_content):
        self.name = "Test Club"
        self.url = "http://test.com"
        self.html = html_content


def test_get_passing_stats():
    html = """
    <html>
    <body>
        <!-- Comment out to simulate real scenario where tables are often commented -->
        <!--
        <div id="div_stats_passing_9">
            <table id="stats_passing_9">
                <thead>
                    <tr>
                        <th>Unnamed: 0_level_0</th>
                        <th>Passing</th>
                        <th>Passing</th>
                    </tr>
                    <tr>
                        <th>Player</th>
                        <th>Cmp</th>
                        <th>Att</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th data-stat="player"><a href="/en/players/p1/Player-One">Player One</a></th>
                        <td data-stat="passes_completed">50</td>
                        <td data-stat="passes">60</td>
                    </tr>
                    <tr>
                        <th data-stat="player"><a href="/en/players/p2/Player-Two">Player Two</a></th>
                        <td data-stat="passes_completed">30</td>
                        <td data-stat="passes">40</td>
                    </tr>
                </tbody>
            </table>
        </div>
        -->
    </body>
    </html>
    """

    club = MockClub(html)
    stats = club.get_passing_stats()

    print(f"Extracted {len(stats)} records.")
    for stat in stats:
        print(stat)

    # Assertions
    assert len(stats) == 2
    assert stats[0]["Player"] == "Player One"
    assert stats[0]["Cmp"] == 50
    assert stats[0]["player_url"] == "https://fbref.com/en/players/p1/Player-One"
    assert stats[1]["Player"] == "Player Two"

    print("Verification successful!")


if __name__ == "__main__":
    test_get_passing_stats()
