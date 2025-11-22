from clubs.club import Club


def main():
    # 使用例
    name = "Newcastle United"
    url = "https://fbref.com/en/squads/b2b47a98/Newcastle-United-Stats"

    print("HTMLを取得中...")
    club = Club(name=name, url=url)
    print(club)
    print("✓ HTML取得完了")

    # 方法1: 特定のテーブルのみ取得(PlayerのURLも取得)
    try:
        df, player_urls = club.extract_players()

        print(f"\n--- stats_standard_9 テーブル ---")
        print(f"行数: {len(df)}, 列数: {len(df.columns)}")
        print("\n最初の5行:")
        print(df.head())

        print("\n\nPlayerのURL (最初の5件):")
        for i, url in enumerate(player_urls[:5]):
            if url:
                print(f"  {i + 1}. {url}")

        # CSVとして保存する場合
        # df.to_csv('stats_standard_9.csv', index=False, encoding='utf-8-sig')

    except ValueError as e:
        print(f"エラー: {e}")
    except Exception as e:
        print(f"予期しないエラー: {e}")

    # 方法2: 全テーブルを取得して確認


# print("\n\n全テーブルを取得中...")
# tables = Club.extract_all_tables(html)

# print(f"\n取得したテーブル一覧 (合計 {len(tables)} 個):")
# for table_id in tables.keys():
#    print(f"  - {table_id}")


if __name__ == "__main__":
    main()
