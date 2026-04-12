# kattehaikenai.com - トレンドブログ設計書
日付: 2026-04-13
ステータス: 設計完了 → 実装待ち

---

## 1. サイト概要

| 項目 | 内容 |
|:---|:---|
| **ドメイン** | kattehaikenai.com |
| **コンセプト** | 暮らしの雑学＆エンタメ情報メディア |
| **技術スタック** | Next.js 16 + TypeScript（既存テンプレベース） |
| **ホスティング** | Cloudflare Pages |
| **収益モデル** | AdSense + 楽天/Amazonアフィリ + VODアフィリ |
| **更新方法** | auto_post.py 自動投稿（GitHub Actions 毎朝7:00 JST） |

---

## 2. カテゴリ構成

```
kattehaikenai.com/
├── /                           # トップページ（最新記事一覧）
├── /category/entertainment/    # エンタメ（ドラマ・映画・芸能）
├── /category/lifestyle/        # 暮らし（季節イベント・グルメ・トレンド商品）
├── /category/sports/           # スポーツ（話題の選手・大会情報）
├── /blog/[slug]/               # 記事ページ（個別記事）
├── /about/                     # 運営者情報
├── /privacy/                   # プライバシーポリシー
├── /contact/                   # お問い合わせ
└── /sitemap.xml                # サイトマップ
```

---

## 3. ページ別デザイン仕様

### 3-1. トップページ（/）

**レイアウト**: 2カラム（メインコンテンツ + サイドバー）

#### メインコンテンツ
- **ヒーローセクション**: サイト名 + キャッチコピー + 検索バー
- **最新記事カード**: 3カラムグリッド（サムネイル + タイトル + カテゴリバッジ + 日付 + 要約）
- **カテゴリ別セクション**: 各カテゴリの最新3記事
- **ページネーション**: 10記事/ページ

#### サイドバー
- **検索ボックス**
- **カテゴリ一覧**（記事数表示）
- **人気記事ランキング**（TOP5）
- **プロフィールボックス**（アイコン + 運営者名 + 一言）
- **SNSフォローボタン**

### 3-2. 記事ページ（/blog/[slug]）

**レイアウト**: 2カラム（記事 + サイドバー）

#### 記事構成（上から順に）
```
┌─────────────────────────────────────┐
│ パンくずリスト                        │
│ HOME > カテゴリ名 > 記事タイトル       │
├─────────────────────────────────────┤
│ 記事タイトル（H1）                    │
│ 投稿日 | 更新日 | カテゴリバッジ       │
├─────────────────────────────────────┤
│ アイキャッチ画像（16:9, 高画質）       │
├─────────────────────────────────────┤
│ 目次（自動生成、H2/H3ベース）          │
├─────────────────────────────────────┤
│ 導入文（200〜300文字）                 │
├─────────────────────────────────────┤
│ H2: セクション1                       │
│  テキスト + 画像（Unsplash）           │
│  ┌──────────────────────────┐        │
│  │ 関連商品ボックス（楽天/Amazon）│     │
│  └──────────────────────────┘        │
├─────────────────────────────────────┤
│ H2: セクション2                       │
│  テキスト + 比較表                    │
│  画像                                │
├─────────────────────────────────────┤
│ H2: セクション3                       │
│  テキスト                            │
├─────────────────────────────────────┤
│ H2: まとめ                           │
│  要点3つ箇条書き                      │
│  ┌──────────────────────────┐        │
│  │ CTA: 関連サービスリンク     │       │
│  └──────────────────────────┘        │
├─────────────────────────────────────┤
│ SNSシェアボタン（X/LINE/はてブ）       │
├─────────────────────────────────────┤
│ 著者プロフィールボックス               │
├─────────────────────────────────────┤
│ 関連記事（同カテゴリ3記事）             │
└─────────────────────────────────────┘
```

### 3-3. カテゴリページ（/category/[name]）
- カテゴリ名 + 説明文
- 記事カード一覧（グリッド表示）
- ページネーション

---

## 4. デザイン仕様（競合を上回るポイント）

### カラーパレット
```css
:root {
  --primary: #1a1a2e;        /* ダークネイビー（ヘッダー/フッター）*/
  --secondary: #16213e;      /* サブダーク */
  --accent: #e94560;         /* アクセントレッド（CTA/バッジ）*/
  --accent-hover: #c23152;   /* ホバー時 */
  --bg-main: #f8f9fa;        /* 背景グレー */
  --bg-white: #ffffff;       /* カード背景 */
  --text-primary: #2d3436;   /* メインテキスト */
  --text-secondary: #636e72; /* サブテキスト */
  --border: #e0e0e0;         /* ボーダー */
  --gradient-hero: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}
```

### タイポグラフィ
```css
/* Google Fonts: Noto Sans JP + Inter */
--font-heading: 'Noto Sans JP', sans-serif;  /* 見出し */
--font-body: 'Noto Sans JP', sans-serif;     /* 本文 */
--font-accent: 'Inter', sans-serif;          /* 英字・数字 */
```

### 記事カードデザイン
- 角丸 12px + box-shadow（ホバーで浮き上がり）
- サムネイル上にカテゴリバッジ（半透明背景）
- ホバー時に画像がわずかにズーム（scale(1.03)、transition 0.3s）

### 競合に勝つ差別化ポイント
1. **ダークヘッダー + アクセントカラー** → あれきるの白基調と差別化
2. **カード型グリッドレイアウト** → あれきるのリスト型と差別化
3. **目次の自動生成** → 読者の利便性向上
4. **表・ボックスの積極活用** → テキスト壁を回避
5. **爆速ページロード** → 静的サイトの圧倒的な優位性

---

## 5. 記事データ構造（articles.ts）

```typescript
export interface Article {
  id: string;
  slug: string;
  title: string;
  description: string;           // meta description
  category: 'entertainment' | 'lifestyle' | 'sports';
  tags: string[];                // 例: ['ドラマ', 'GIFT', '有村架純']
  publishedAt: string;           // ISO 8601
  updatedAt: string;
  heroImage: string;             // Unsplash URL
  heroImageAlt: string;
  content: {
    intro: string;               // 導入文
    sections: Section[];         // 各セクション
    conclusion: string;          // まとめ
  };
  affiliateLinks?: AffiliateLink[];
  relatedArticles?: string[];    // 関連記事のslug
}

interface Section {
  heading: string;               // H2見出し
  body: string;                  // HTML文字列
  image?: string;                // セクション画像
  imageAlt?: string;
  table?: TableData;             // 比較表（あれば）
}

interface AffiliateLink {
  title: string;
  rakutenUrl?: string;
  amazonUrl?: string;
  yahooUrl?: string;
  description?: string;
}

interface TableData {
  headers: string[];
  rows: string[][];
}
```

---

## 6. コンポーネント一覧

| コンポーネント | ファイル | 説明 |
|:---|:---|:---|
| Header | `components/Header.tsx` | ロゴ + ナビ + 検索 + ハンバーガー |
| Footer | `components/Footer.tsx` | ナビリンク + SNS + コピーライト |
| ArticleCard | `components/ArticleCard.tsx` | 記事カード（グリッド用） |
| Sidebar | `components/Sidebar.tsx` | 検索 + カテゴリ + 人気記事 + プロフィール |
| Breadcrumb | `components/Breadcrumb.tsx` | パンくずリスト |
| TOC | `components/TOC.tsx` | 目次（自動生成） |
| ShareButtons | `components/ShareButtons.tsx` | SNSシェアボタン |
| AuthorBox | `components/AuthorBox.tsx` | 著者プロフィール |
| AffiliateBox | `components/AffiliateBox.tsx` | 楽天/Amazon/Yahoo!ボタン |
| RelatedArticles | `components/RelatedArticles.tsx` | 関連記事3件 |
| CategoryBadge | `components/CategoryBadge.tsx` | カテゴリバッジ |

---

## 7. auto_post.py 改造設計

### 7-1. トレンドキーワード自動取得（新機能）

```python
# 新規追加: trend_fetcher.py
from pytrends.request import TrendReq

def fetch_trending_keywords(category_filter=['エンタメ', '暮らし']):
    """Google Trendsから急上昇キーワードを取得"""
    pytrends = TrendReq(hl='ja-JP', tz=540)
    
    # 1. 日本の急上昇キーワード取得
    trending = pytrends.trending_searches(pn='japan')
    
    # 2. ライジングクエリ（上昇率が高いもの）
    # → けんごの「仕込み型」戦略
    rising = get_rising_queries(category_filter)
    
    return {
        'trending': trending[:10],  # 今日のトレンド
        'rising': rising[:5]        # 上昇中キーワード
    }

def get_rising_queries(categories):
    """過去30日で検索量が急上昇しているキーワードを取得"""
    pytrends = TrendReq(hl='ja-JP', tz=540)
    
    # カテゴリごとにシードキーワードで検索
    seeds = {
        'entertainment': ['ドラマ', '映画', '芸能人'],
        'lifestyle': ['レシピ', 'イベント', '100均'],
        'sports': ['野球', 'サッカー', 'オリンピック']
    }
    
    rising_keywords = []
    for cat, keywords in seeds.items():
        for kw in keywords:
            pytrends.build_payload([kw], timeframe='today 3-m', geo='JP')
            related = pytrends.related_queries()
            if kw in related and related[kw]['rising'] is not None:
                rising_keywords.extend(
                    related[kw]['rising'].head(5)['query'].tolist()
                )
    
    return rising_keywords
```

### 7-2. config.json への追加

```json
{
  "site_id": "trend-blog",
  "repo_name": "kattehaikenai-blog",
  "site_name": "kattehaikenai.com",
  "site_url": "https://kattehaikenai.com",
  "articles_per_run": 5,
  "use_trend_keywords": true,
  "keyword_strategy": {
    "trending_count": 3,
    "rising_count": 2
  },
  "categories": ["entertainment", "lifestyle", "sports"],
  "article_template": "trend_article",
  "gemini_prompt_template": "trend_blog_prompt",
  "affiliate": {
    "rakuten_id": "",
    "amazon_tag": "",
    "yahoo_sid": ""
  }
}
```

### 7-3. Gemini プロンプトテンプレート

```
あなたはトレンド情報ブロガーです。
以下のキーワードについて、SEOに最適化された記事を書いてください。

【キーワード】{keyword}
【カテゴリ】{category}
【記事の型】{article_type}

### 出力フォーマット（JSON）
{
  "title": "【2026最新】〇〇とは？分かりやすく解説",
  "description": "meta descriptionを120文字以内で",
  "intro": "導入文（200〜300文字、読者の悩み → 解決の約束）",
  "sections": [
    {
      "heading": "H2見出し",
      "body": "HTML形式の本文（<p>, <ul>, <strong>を使用）",
      "image_query": "Unsplash検索用の英語キーワード"
    }
  ],
  "conclusion": "まとめ（3つの要点を箇条書き）",
  "tags": ["タグ1", "タグ2", "タグ3"],
  "affiliate_keywords": ["関連商品の検索キーワード"]
}

### ルール
- 1文1行（改行多め）
- 専門用語は必ず説明する
- 比較表を1つ以上含める
- 読者が「次に知りたいこと」を先回りして書く
- 文字数: 3000〜5000文字
```

---

## 8. デプロイ手順（明日の実装順序）

### Phase 1: テンプレート作成（60分）
1. `trend-blog/` ディレクトリにNext.jsプロジェクト初期化
2. 既存診断サイトからAbout/Privacy/Contact/Layout移植
3. globals.css にトレンドブログ用デザインシステム適用
4. コンポーネント一式作成

### Phase 2: サンプル記事作成（30分）
1. 手動で3〜5記事のサンプルデータ作成
2. ローカルでビルド確認
3. デザイン微調整

### Phase 3: GitHubリポジトリ & Cloudflare Pages（30分）
1. GitHub に `kattehaikenai-blog` リポジトリ作成
2. Cloudflare Pagesプロジェクト作成
3. カスタムドメイン `kattehaikenai.com` を設定
4. VALUE-DOMAIN で DNS をCloudflareに向ける

### Phase 4: auto_post.py 改造（30分）
1. `trend_fetcher.py` 追加
2. config.json にサイト追加
3. Geminiプロンプトテンプレート追加
4. テスト実行

### Phase 5: AdSense申請準備（15分）
1. 最低20記事を投稿（手動 + AI生成混在）
2. Google Search Console に登録
3. AdSense申請

---

## 9. SEO構造化データ

```json
// Article Schema（各記事に自動挿入）
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "記事タイトル",
  "description": "meta description",
  "image": "アイキャッチ画像URL",
  "author": {
    "@type": "Person",
    "name": "運営者名"
  },
  "publisher": {
    "@type": "Organization",
    "name": "kattehaikenai.com"
  },
  "datePublished": "2026-04-13",
  "dateModified": "2026-04-13"
}

// BreadcrumbList Schema（パンくずリストに自動挿入）
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [...]
}
```

---

## 10. 成功指標（KPI）

| 期間 | 記事数 | PV目標 | 収益目標 |
|:---|:---:|:---:|:---:|
| 1ヶ月 | 150記事 | 5,000PV | ¥0（審査中） |
| 3ヶ月 | 450記事 | 30,000PV | ¥10,000 |
| 6ヶ月 | 900記事 | 150,000PV | ¥50,000 |
| 12ヶ月 | 1,800記事 | 500,000PV | ¥200,000+ |
