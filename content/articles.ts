export interface Article {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: 'entertainment' | 'lifestyle' | 'sports';
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  heroImage: string;
  heroImageAlt: string;
  content: {
    intro: string;
    sections: Section[];
    conclusion: string;
  };
  affiliateLinks?: AffiliateLink[];
  relatedSlugs?: string[];
}

export interface Section {
  heading: string;
  body: string;
  image?: string;
  imageAlt?: string;
}

export interface AffiliateLink {
  title: string;
  rakutenUrl?: string;
  amazonUrl?: string;
  yahooUrl?: string;
  description?: string;
}

export const CATEGORIES = {
  entertainment: { label: 'エンタメ', color: '#e94560' },
  lifestyle: { label: '暮らし', color: '#0f3460' },
  sports: { label: 'スポーツ', color: '#16a085' },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

// サンプル記事データ（auto_post.pyで自動追加される）
export const articles: Article[] = [
  {
    id: '1',
    slug: 'what-is-trending-2026-spring',
    title: '【2026年春】今話題のトレンドまとめ！知っておきたい最新ニュース',
    description: '2026年春に注目されているトレンドを徹底解説。エンタメ・暮らし・スポーツまで、今知っておくべき話題をまとめました。',
    category: 'entertainment',
    tags: ['トレンド', '2026年', '春'],
    publishedAt: '2026-04-13T00:00:00+09:00',
    updatedAt: '2026-04-13T00:00:00+09:00',
    heroImage: 'https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=1200&h=630&fit=crop',
    heroImageAlt: 'トレンドニュースのイメージ',
    content: {
      intro: '2026年の春、世間をにぎわせているトレンドを一挙にまとめました。ドラマの話題から季節の行事、スポーツの注目選手まで、今知っておきたい情報をわかりやすく解説します。',
      sections: [
        {
          heading: '春ドラマが豊作！注目の作品は？',
          body: '<p>2026年春クールは豊作と言われています。TBS日曜劇場「GIFT」をはじめ、話題作が目白押し。</p><p>特に注目は以下の3作品です。</p><ul><li><strong>GIFT（ギフト）</strong> - 堤真一×有村架純の日曜劇場</li><li><strong>月夜行路</strong> - 波瑠主演のヒューマンドラマ</li><li><strong>サバ缶、宇宙へ行く</strong> - 月9のSFコメディ</li></ul>',
          image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&h=450&fit=crop',
          imageAlt: 'テレビドラマのイメージ',
        },
        {
          heading: 'GWに行きたい！2026年の穴場スポット',
          body: '<p>ゴールデンウィークの予定はもう決まりましたか？</p><p>今年は例年より連休が長く、旅行需要が高まっています。</p><p>混雑を避けたい方には、以下のスポットがおすすめです。</p><ul><li>瀬戸内海の離島めぐり</li><li>北関東の温泉地</li><li>九州の自然体験ツアー</li></ul>',
          image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&h=450&fit=crop',
          imageAlt: '旅行スポットのイメージ',
        },
        {
          heading: 'スポーツ界の注目ニュース',
          body: '<p>2026年はスポーツイベントが盛りだくさん。</p><p>プロ野球は開幕から接戦が続き、サッカーW杯予選も佳境を迎えています。</p><p>特に注目の選手や話題をピックアップしました。</p>',
        },
      ],
      conclusion: '2026年春は話題が尽きません。このサイトでは毎日最新のトレンド情報をお届けしていきます。気になる話題があったら、ぜひブックマークしてチェックしてくださいね。',
    },
    relatedSlugs: [],
  },
];
