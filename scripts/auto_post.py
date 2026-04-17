#!/usr/bin/env python3
"""
Trend Blog Auto-Poster: kattehaikenai.com 専用の自動記事投稿スクリプト
GitHub Actions から実行される想定。
"""
import json
import os
import re
import sys
import time
import urllib.request
import urllib.parse
from datetime import datetime
from pathlib import Path

# ================================================
# 設定
# ================================================
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
UNSPLASH_ACCESS_KEY = os.environ.get("UNSPLASH_ACCESS_KEY", "")
SCRIPT_DIR = Path(__file__).parent
SITE_DIR = SCRIPT_DIR.parent  # trend-blog のルート
CONFIG_PATH = SCRIPT_DIR / "config.json"
USED_KEYWORDS_PATH = SCRIPT_DIR / "used_keywords.json"

# Gemini モデル優先順位（上から順に試行）
GEMINI_MODELS = [
    "gemini-2.5-flash",
    "gemini-flash-latest",
    "gemini-2.5-pro",
]

def call_gemini(prompt: str, max_retries: int = 3) -> str:
    """Gemini APIを呼び出して記事テキストを生成（フォールバック対応）"""
    payload = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 16384,
        }
    })

    for model in GEMINI_MODELS:
        print(f"  🔄 Trying model: {model}")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={GEMINI_API_KEY}"

        for attempt in range(max_retries):
            try:
                req = urllib.request.Request(
                    url,
                    data=payload.encode("utf-8"),
                    headers={"Content-Type": "application/json"},
                    method="POST"
                )
                with urllib.request.urlopen(req, timeout=180) as resp:
                    data = json.loads(resp.read().decode("utf-8"))
                    text = data["candidates"][0]["content"]["parts"][0]["text"]
                    print(f"  ✅ Success with model: {model}")
                    return text
            except urllib.error.HTTPError as e:
                print(f"  ⚠️ {model} HTTP {e.code} (attempt {attempt+1}/{max_retries})")
                if e.code in (503, 429):
                    # サーバー障害 or レート制限 → リトライ
                    if attempt < max_retries - 1:
                        wait = 20 * (attempt + 1)
                        print(f"  ⏳ Waiting {wait}s before retry...")
                        time.sleep(wait)
                    else:
                        print(f"  ⏭️ Switching to next model...")
                        break  # 次のモデルへ
                elif e.code == 404:
                    print(f"  ⏭️ Model {model} not available, switching...")
                    break  # 次のモデルへ
                else:
                    if attempt < max_retries - 1:
                        wait = 15 * (attempt + 1)
                        print(f"  ⏳ Waiting {wait}s before retry...")
                        time.sleep(wait)
            except Exception as e:
                print(f"  ⚠️ {model} error (attempt {attempt+1}/{max_retries}): {e}")
                if attempt < max_retries - 1:
                    wait = 15 * (attempt + 1)
                    print(f"  ⏳ Waiting {wait}s before retry...")
                    time.sleep(wait)

    raise RuntimeError("Gemini API call failed with all models after all retries")


# ================================================
# Unsplash API
# ================================================
def fetch_unsplash_images(query: str, count: int = 8) -> list[dict]:
    """Unsplash APIから画像を取得"""
    if not UNSPLASH_ACCESS_KEY:
        print("  ⚠️ UNSPLASH_ACCESS_KEY not set, using placeholder images")
        return [{"url": f"https://placehold.co/800x500/e8f0fe/4a6fa5?text=Image+{i+1}", "alt": f"Image {i+1}"} for i in range(count)]

    encoded_query = urllib.parse.quote(query)
    url = f"https://api.unsplash.com/search/photos?query={encoded_query}&per_page={count}&orientation=landscape&client_id={UNSPLASH_ACCESS_KEY}"

    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            results = []
            for photo in data.get("results", [])[:count]:
                results.append({
                    "url": photo["urls"]["regular"],
                    "alt": photo.get("alt_description", query),
                })
            return results
    except Exception as e:
        print(f"  ⚠️ Unsplash API error: {e}")
        return [{"url": f"https://placehold.co/800x500/e8f0fe/4a6fa5?text=Image+{i+1}", "alt": f"Image {i+1}"} for i in range(count)]


# ================================================
# 楽天商品検索API
# ================================================
RAKUTEN_APP_ID = os.environ.get("RAKUTEN_APP_ID", "")
RAKUTEN_ACCESS_KEY = os.environ.get("RAKUTEN_ACCESS_KEY", "")
RAKUTEN_AFFILIATE_ID = os.environ.get("RAKUTEN_AFFILIATE_ID", "")

def clean_product_name(name: str) -> str:
    """Geminiの創作的な商品名からコア部分を抽出"""
    import re as _re
    # 装飾を除去: 「！」「！」「♪」「★」「◎」「●」「【】」
    name = _re.sub(r'[！!♪★◎●【】「」]', '', name)
    # 先頭の煽り文句を除去: 「ピタッと吸着」「鮮度爆上げ」等
    name = _re.sub(r'^[ぁ-ん\u30A0-\u30FFー]+[！!]?\s*', '', name)
    # 余分なスペースを整理
    name = _re.sub(r'\s+', ' ', name).strip()
    # 長すぎる場合は最初の30文字に切る
    if len(name) > 30:
        name = name[:30]
    return name

def _rakuten_search(keyword: str) -> dict | None:
    """楽天商品検索API呼び出し（内部関数）"""
    params = urllib.parse.urlencode({
        "format": "json",
        "keyword": keyword,
        "applicationId": RAKUTEN_APP_ID,
        "accessKey": RAKUTEN_ACCESS_KEY,
        "affiliateId": RAKUTEN_AFFILIATE_ID,
        "hits": 1,
        "sort": "-reviewCount",
    })
    url = f"https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260401?{params}"

    try:
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0",
            "Referer": "https://kattehaikenai.com/",
            "Origin": "https://kattehaikenai.com",
        })
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            items = data.get("Items", [])
            if not items:
                return None

            item = items[0]["Item"]
            image_urls = item.get("mediumImageUrls", [])
            image_url = image_urls[0]["imageUrl"] if image_urls else ""
            # 高解像度画像に変換
            image_url = image_url.replace("?_ex=128x128", "?_ex=256x256") if image_url else ""

            return {
                "imageUrl": image_url,
                "affiliateUrl": item.get("affiliateUrl", item.get("itemUrl", "")),
                "price": f"¥{int(item.get('itemPrice', 0)):,}",
            }
    except Exception as e:
        print(f"    ⚠️ API call failed: {e}")
        return None
    finally:
        time.sleep(1)  # レート制限対策

def search_rakuten_product(product_name: str) -> dict | None:
    """楽天商品検索（クリーンアップ + フォールバック）"""
    if not RAKUTEN_APP_ID:
        print(f"  ⚠️ RAKUTEN_APP_ID not set, skipping: {product_name}")
        return None

    # Step 1: クリーンアップした名前で検索
    cleaned = clean_product_name(product_name)
    print(f"  🔍 Searching: {cleaned}")
    result = _rakuten_search(cleaned)
    if result:
        print(f"  ✅ Found: {cleaned} → {result['price']}")
        return result

    # Step 2: さらに短くして検索（最初の2-3単語）
    short_name = ' '.join(cleaned.split()[:3])
    if short_name != cleaned:
        print(f"  🔍 Retry with: {short_name}")
        result = _rakuten_search(short_name)
        if result:
            print(f"  ✅ Found: {short_name} → {result['price']}")
            return result

    print(f"  ⚠️ No results for: {product_name}")
    return None

def enrich_ranking_with_rakuten(ranking_items: list[dict]) -> list[dict]:
    """ランキングの各商品に楽天APIの情報を付与する（フォールバック付き）"""
    if not RAKUTEN_APP_ID:
        print("  ⚠️ RAKUTEN_APP_ID not set, using fallback search URLs")
        for item in ranking_items:
            _add_fallback_urls(item)
        return ranking_items

    print("  🛒 Enriching ranking items with Rakuten product data...")
    for item in ranking_items:
        product_data = search_rakuten_product(item["name"])
        if product_data:
            item["imageUrl"] = product_data["imageUrl"]
            item["affiliateUrl"] = product_data["affiliateUrl"]
            item["price"] = product_data["price"]
        else:
            # フォールバック: 楽天検索URLとAmazon検索URLを自動生成
            print(f"    🔄 Fallback URLs for: {item['name']}")
            _add_fallback_urls(item)

    return ranking_items


def _add_fallback_urls(item: dict) -> None:
    """楽天API失敗時のフォールバック: 楽天検索URL + Amazon検索URLを生成"""
    product_name = clean_product_name(item.get("name", ""))
    encoded_name = urllib.parse.quote(product_name)

    # 楽天検索URL（アフィリエイトIDがあればリダイレクト経由）
    if RAKUTEN_AFFILIATE_ID:
        item["affiliateUrl"] = f"https://hb.afl.rakuten.co.jp/hgc/{RAKUTEN_AFFILIATE_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F{encoded_name}%2F"
    else:
        item["affiliateUrl"] = f"https://search.rakuten.co.jp/search/mall/{encoded_name}/"

    # Amazon検索URL
    item["amazonUrl"] = f"https://www.amazon.co.jp/s?k={encoded_name}"

    print(f"    ✅ Fallback: 楽天検索 + Amazon検索 URL generated")


# ================================================
# キーワードローテーション
# ================================================
def load_used_keywords() -> list[str]:
    """使用済みキーワードを読み込む"""
    if USED_KEYWORDS_PATH.exists():
        return json.loads(USED_KEYWORDS_PATH.read_text(encoding="utf-8"))
    return []


def save_used_keywords(used: list[str]):
    """使用済みキーワードを保存"""
    USED_KEYWORDS_PATH.write_text(json.dumps(used, ensure_ascii=False, indent=2), encoding="utf-8")


def get_unused_keywords(all_keywords: list[str], count: int) -> list[str]:
    """未使用のキーワードを取得。全て使い切ったらリセット"""
    used = load_used_keywords()
    unused = [kw for kw in all_keywords if kw not in used]

    if len(unused) < count:
        # 全て使い切ったらリセット
        print("  🔄 All keywords used, resetting rotation...")
        used = []
        unused = all_keywords.copy()

    selected = unused[:count]
    used.extend(selected)
    save_used_keywords(used)
    return selected


# ================================================
# 記事生成プロンプト
# ================================================
def build_trend_article_prompt(keyword: str, site_name: str) -> str:
    """トレンドブログ用のSEO記事生成プロンプト"""
    today = datetime.now().strftime("%Y-%m-%d")
    year = datetime.now().strftime("%Y")

    return f"""あなたは日本のトレンド情報に精通したプロのWebライターです。
以下のキーワードで、Google検索1位を狙う完全な記事を生成してください。

## ターゲットキーワード
{keyword}

## サイト情報
- サイト名: {site_name}（暮らしの雑学＆エンタメ情報メディア）
- 公開日: {today}

## 出力形式
以下のJSON形式で出力してください。JSONのみを出力し、他のテキストは一切含めないでください。
```json
{{
  "slug": "キーワードをローマ字ハイフン区切りで（例: haru-drama-2026-osusume）",
  "title": "SEOに最適化したタイトル（30〜40文字、キーワード含む、【{year}年最新】含む）",
  "description": "meta description（100〜120文字、キーワード含む、読者の悩みに寄り添う）",
  "category": "entertainment または lifestyle または sports のいずれか",
  "tags": ["関連タグ3〜5つ"],
  "ranking": [
    {{
      "rank": 1,
      "name": "1位の商品/サービス/作品名",
      "rating": 4.8,
      "comment": "おすすめポイントを1文で（30〜50文字）"
    }},
    {{
      "rank": 2,
      "name": "2位の名前",
      "rating": 4.5,
      "comment": "おすすめポイント"
    }},
    {{
      "rank": 3,
      "name": "3位の名前",
      "rating": 4.2,
      "comment": "おすすめポイント"
    }},
    {{
      "rank": 4,
      "name": "4位の名前",
      "rating": 4.0,
      "comment": "おすすめポイント"
    }},
    {{
      "rank": 5,
      "name": "5位の名前",
      "rating": 3.8,
      "comment": "おすすめポイント"
    }}
  ],
  "intro": "導入文（200〜300文字、読者の悩みや疑問に共感し、この記事で解決できることを明示）",
  "sections": [
    {{
      "heading": "H2見出し（キーワード含む、読者の疑問形式推奨）",
      "body": "本文（500〜800文字、HTML形式：<p>, <ul>, <li>, <strong>を使用）"
    }}
  ],
  "conclusion": "まとめ（200〜300文字、記事の要点を3つに絞って箇条書き、読者に次のアクションを促す）"
}}
```

## ★ ranking フィールドについて（必ず含めること）
- 記事のテーマに合った「おすすめランキングTOP5」を必ず作成すること
- ドラマなら人気作品、グッズならおすすめ商品、旅行なら人気スポットなど
- ratingは1.0〜5.0の範囲（0.5刻みで現実的な評価）
- 1位が最も高い評価にすること

## 記事の品質基準（厳守）

### 構造
- セクション数: 8〜10個（H2見出し8〜10個）
- 各セクションの本文: 500〜800文字
- 合計文字数: 5,000〜8,000文字
- FAQ: セクション内に1つ以上含める（Q: A: の形式で5問以上）

### 本文のHTML形式
- 段落: <p>タグで囲む
- 箇条書き: <ul><li>タグ
- 番号リスト: <ol><li>タグ
- 強調: <strong>タグ
- 比較表: HTMLの<table>タグで作成。比較表は必ず1つ以上入れる

### ★ 装飾BOX（必ず使うこと）
以下のclass付き<div>を本文中に積極的に使用して、読みやすさを向上させること。
各セクションに最低1つは装飾BOXを含めること。

- ポイントBOX（重要情報）: <div class="point-box">ここに重要なポイントを記載</div>
- 注意BOX（注意喚起）: <div class="warning-box">ここに注意事項を記載</div>
- チェックリスト: <div class="check-box"><ul><li>チェック項目1</li><li>チェック項目2</li></ul></div>
- メリットBOX: <div class="merit-box"><ul><li>メリット1</li><li>メリット2</li></ul></div>
- デメリットBOX: <div class="demerit-box"><ul><li>デメリット1</li><li>デメリット2</li></ul></div>
- Q&A: <div class="qa-item"><div class="qa-q">質問内容</div><div class="qa-a">回答内容</div></div>

### SEO要件
- タイトルにメインキーワードを含める
- H2見出しにキーワードまたは関連ワードを含める
- 導入文で読者の悩みに共感し、この記事で解決できることを明示
- 具体的な数字を多用する
- 読者に「次のアクション」を促す文で締める

### カテゴリ判定ルール
- 生活・季節イベント・グルメ・100均・便利グッズ・節約・引越し → lifestyle
- ドラマ・映画・芸能・音楽・ゲーム → entertainment
- 野球・サッカー・オリンピック・スポーツ選手 → sports

### 文体
- ですます調
- 専門用語は使った直後に（）で補足説明
- 1文は60文字以内を目安に短く
- 読者を「あなた」と呼ぶ
- カジュアルだが信頼感のあるトーン

重要: JSON形式のみ出力。```json と ``` で囲むこと。"""


# ================================================
# JSON パース
# ================================================
def parse_gemini_response(response: str) -> dict:
    """GeminiのレスポンスからJSON部分を抽出"""
    match = re.search(r'```json\s*\n(.*?)\n\s*```', response, re.DOTALL)
    json_str = match.group(1) if match else None

    if not json_str:
        first_brace = response.find('{')
        last_brace = response.rfind('}')
        if first_brace != -1 and last_brace != -1:
            json_str = response[first_brace:last_brace + 1]

    if not json_str:
        raise ValueError("Could not find JSON in Gemini response")

    # Step 1: そのままパース
    try:
        return json.loads(json_str)
    except json.JSONDecodeError:
        pass

    # Step 2: 制御文字をクリーン
    def clean_json_string(s: str) -> str:
        result = []
        in_string = False
        escape_next = False
        for char in s:
            if escape_next:
                result.append(char)
                escape_next = False
                continue
            if char == '\\' and in_string:
                result.append(char)
                escape_next = True
                continue
            if char == '"' and not escape_next:
                in_string = not in_string
            if in_string and ord(char) < 32:
                if char == '\n':
                    result.append('\\n')
                elif char == '\r':
                    result.append('\\r')
                elif char == '\t':
                    result.append('\\t')
                else:
                    result.append(' ')
            else:
                result.append(char)
        return ''.join(result)

    cleaned = clean_json_string(json_str)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        print(f"  ⚠️ JSON parse error after cleaning: {e}")

    # Step 3: 積極的な修復
    def aggressive_json_fix(s: str) -> str:
        s = re.sub(r'(?<=\w)="([^"]*)"(?=[\s>/])', r"='\1'", s)
        result = []
        in_string = False
        i = 0
        while i < len(s):
            char = s[i]
            if char == '\\' and in_string and i + 1 < len(s):
                result.append(char)
                result.append(s[i + 1])
                i += 2
                continue
            if char == '"':
                if not in_string:
                    in_string = True
                    result.append(char)
                else:
                    next_i = i + 1
                    while next_i < len(s) and s[next_i] in ' \t\r\n':
                        next_i += 1
                    if next_i >= len(s) or s[next_i] in ',}]:':
                        in_string = False
                        result.append(char)
                    else:
                        result.append('\\"')
            else:
                result.append(char)
            i += 1
        return ''.join(result)

    try:
        fixed = aggressive_json_fix(cleaned)
        return json.loads(fixed)
    except json.JSONDecodeError as e:
        print(f"  ⚠️ JSON parse error after aggressive fix: {e}")
        raise


# ================================================
# articles.ts 更新
# ================================================
def get_next_article_id(site_dir: Path) -> str:
    """articles.tsから次のIDを算出"""
    articles_path = site_dir / "content" / "articles.ts"
    if not articles_path.exists():
        return "1"
    content = articles_path.read_text(encoding="utf-8")
    ids = re.findall(r"id:\s*'(\d+)'", content)
    if not ids:
        return "1"
    return str(max(int(x) for x in ids) + 1)


def build_trend_article_ts_entry(article: dict, images: list[dict], today: str, article_id: str) -> str:
    """1記事分のTypeScriptオブジェクトを生成"""
    sections_ts = []

    for i, section in enumerate(article.get("sections", [])):
        heading = section["heading"].replace("'", "\\'").replace("`", "\\`")
        body = section.get("body", section.get("content", "")).replace("`", "\\`").replace("${", "\\${")

        image_part = ""
        if i < len(images) and i > 0:
            img = images[i]
            img_url = img.get("url", img.get("src", "")).replace("'", "\\'")
            img_alt = img["alt"].replace("'", "\\'") if img.get("alt") else heading
            image_part = f"""
          image: '{img_url}',
          imageAlt: '{img_alt}',"""

        sections_ts.append(f"""        {{
          heading: '{heading}',
          body: `{body}`,{image_part}
        }}""")

    sections_joined = ",\n".join(sections_ts)
    slug = article.get("slug", "untitled")
    title = article.get("title", "").replace("'", "\\'")
    description = article.get("description", "").replace("'", "\\'")
    category = article.get("category", "lifestyle").replace("'", "\\'")
    tags = article.get("tags", [])
    tags_str = ", ".join([f"'{t}'" for t in tags])
    intro = article.get("intro", "").replace("`", "\\`").replace("${", "\\${")
    conclusion = article.get("conclusion", "").replace("`", "\\`").replace("${", "\\${")

    hero_image = ""
    if images:
        img_url = images[0].get("url", images[0].get("src", "")).replace("'", "\\'")
        hero_image = img_url

    # ランキングデータの構築
    ranking_ts = ""
    ranking_items = article.get("ranking", [])
    if ranking_items:
        ranking_entries = []
        for r in ranking_items:
            r_name = str(r.get("name", "")).replace("'", "\\'")
            r_comment = str(r.get("comment", "")).replace("'", "\\'")
            r_rank = r.get("rank", 0)
            r_rating = r.get("rating", 0)
            r_image = str(r.get("imageUrl", "")).replace("'", "\\'")
            r_aff = str(r.get("affiliateUrl", "")).replace("'", "\\'")
            r_price = str(r.get("price", "")).replace("'", "\\'")
            r_amazon = str(r.get("amazonUrl", "")).replace("'", "\\'")
            entry = f"      {{ rank: {r_rank}, name: '{r_name}', rating: {r_rating}, comment: '{r_comment}'"
            if r_image:
                entry += f", imageUrl: '{r_image}'"
            if r_aff:
                entry += f", affiliateUrl: '{r_aff}'"
            if r_amazon:
                entry += f", amazonUrl: '{r_amazon}'"
            if r_price:
                entry += f", price: '{r_price}'"
            entry += " }"
            ranking_entries.append(entry)
        ranking_joined = ",\n".join(ranking_entries)
        ranking_ts = f"""
    ranking: [
{ranking_joined}
    ],"""

    return f"""  {{
    id: '{article_id}',
    slug: '{slug}',
    title: '{title}',
    description: '{description}',
    category: '{category}',
    tags: [{tags_str}],
    publishedAt: '{today}T00:00:00+09:00',
    updatedAt: '{today}T00:00:00+09:00',
    heroImage: '{hero_image}',
    heroImageAlt: '{title}',{ranking_ts}
    content: {{
      intro: `{intro}`,
      sections: [
{sections_joined}
      ],
      conclusion: `{conclusion}`,
    }},
    relatedSlugs: [],
  }}"""


def append_to_articles_ts(site_dir: Path, new_entry: str) -> bool:
    """articles.tsファイルに新しい記事を追加"""
    articles_path = site_dir / "content" / "articles.ts"

    if not articles_path.exists():
        print(f"  ❌ articles.ts not found: {articles_path}")
        return False

    content = articles_path.read_text(encoding="utf-8")

    last_bracket = content.rfind("];")
    if last_bracket == -1:
        print(f"  ❌ Could not find ]; in articles.ts")
        return False

    new_content = content[:last_bracket].rstrip()
    if not new_content.endswith(","):
        new_content += ","
    new_content += f"\n{new_entry}\n];\n"

    articles_path.write_text(new_content, encoding="utf-8")
    return True


# ================================================
# メイン処理
# ================================================
def main():
    """メインエントリポイント"""
    print("=" * 60)
    print("🤖 Trend Blog Auto-Poster v2.0")
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    if not GEMINI_API_KEY:
        print("❌ GEMINI_API_KEY environment variable is required")
        sys.exit(1)

    # 設定読み込み
    with open(CONFIG_PATH, encoding="utf-8") as f:
        config = json.load(f)

    site_name = config.get("site_name", "イマドキ！")
    all_keywords = config.get("keywords", [])
    image_queries = config.get("imageQueries", ["japan lifestyle"])
    articles_count = int(sys.argv[1]) if len(sys.argv) > 1 else config.get("articlesPerRun", 5)

    # 未使用キーワードを取得
    keywords = get_unused_keywords(all_keywords, articles_count)
    print(f"\n📝 Today's keywords ({len(keywords)}):")
    for kw in keywords:
        print(f"   - {kw}")

    today = datetime.now().strftime("%Y-%m-%d")
    generated = 0

    for i, keyword in enumerate(keywords):
        print(f"\n  [{i+1}/{len(keywords)}] KW: {keyword}")

        try:
            # 1. 記事テキスト生成
            print(f"  📝 Generating article text...")
            prompt = build_trend_article_prompt(keyword, site_name)
            response = call_gemini(prompt)
            article = parse_gemini_response(response)
            print(f"  ✅ Article generated: {article.get('title', 'N/A')[:50]}...")

            # 2. 画像取得（キーワードから動的クエリ生成）
            print(f"  🖼️  Fetching images...")
            # キーワードからUnsplash検索用の英語クエリを生成
            kw_to_en = {
                'ドラマ': 'drama', '映画': 'movie', '芸能': 'celebrity',
                '野球': 'baseball', 'サッカー': 'soccer', 'スポーツ': 'sports',
                '旅行': 'travel japan', '温泉': 'hot spring japan', 'キャンプ': 'camping',
                'グルメ': 'japanese food', '料理': 'cooking', 'スイーツ': 'sweets',
                '梅雨': 'rainy season', '花火': 'fireworks japan', '桜': 'cherry blossom',
                '夏': 'summer japan', '冬': 'winter japan', '春': 'spring japan', '秋': 'autumn japan',
                '節約': 'saving money', '一人暮らし': 'apartment living', '新生活': 'new life',
                '100均': 'daily goods', 'ダイソー': 'household items', 'コストコ': 'shopping',
                'ユニクロ': 'fashion casual', 'GU': 'fashion', 'ワークマン': 'outdoor wear',
                'iPhone': 'iphone', 'スマホ': 'smartphone', 'AI': 'artificial intelligence',
                'ディズニー': 'disneyland', 'USJ': 'theme park', '沖縄': 'okinawa',
                '北海道': 'hokkaido', '京都': 'kyoto', '台湾': 'taiwan travel',
                'ダイエット': 'fitness', '健康': 'health', '筋トレ': 'gym workout',
                '花粉症': 'allergy', '睡眠': 'sleep', '対策': 'solution',
                'おすすめ': 'recommendation', 'ランキング': 'ranking', 'グッズ': 'goods',
                'プレゼント': 'gift', '母の日': 'mothers day', '父の日': 'fathers day',
                'GW': 'golden week japan', 'お盆': 'obon japan', 'ハロウィン': 'halloween',
                'クリスマス': 'christmas', '福袋': 'lucky bag japan',
                'NISA': 'investment', '確定申告': 'tax return', 'ふるさと納税': 'hometown tax',
                '甲子園': 'high school baseball', '駅伝': 'marathon', '大相撲': 'sumo',
                'Netflix': 'streaming', 'Amazon': 'online shopping',
            }
            # キーワードの各語を英訳してクエリ作成
            en_parts = []
            for part in keyword.split():
                if part in kw_to_en:
                    en_parts.append(kw_to_en[part])
                elif part.isascii():
                    en_parts.append(part)
            image_query = ' '.join(en_parts[:3]) if en_parts else 'japan lifestyle'
            print(f"  🔍 Image query: {image_query}")
            images = fetch_unsplash_images(image_query, 8)
            print(f"  ✅ {len(images)} images fetched")

            # 2.5. ランキング商品に楽天APIデータを付与
            if article.get("ranking"):
                article["ranking"] = enrich_ranking_with_rakuten(article["ranking"])

            # 3. articles.ts更新
            print(f"  📄 Updating articles.ts...")
            article_id = get_next_article_id(SITE_DIR)
            entry = build_trend_article_ts_entry(article, images, today, article_id)
            if append_to_articles_ts(SITE_DIR, entry):
                print(f"  ✅ Article added to articles.ts (ID: {article_id})")
                generated += 1

            # API制限対策
            time.sleep(10)

        except Exception as e:
            print(f"  ❌ Error processing '{keyword}': {e}")
            import traceback
            traceback.print_exc()
            continue

    print(f"\n{'='*60}")
    print(f"✅ 完了: 合計 {generated} 記事を生成")
    print(f"{'='*60}")

    # 終了コードを返す（0記事生成でもエラーにはしない）
    sys.exit(0)


if __name__ == "__main__":
    main()
