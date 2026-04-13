/**
 * アフィリエイトリンク設定（A8.net）
 * カテゴリごとに表示するアフィリエイトをリッチカードUIで定義
 */

export interface A8Affiliate {
  id: string;
  serviceName: string;
  icon: string;
  catchcopy: string;
  description: string;
  features: string[];
  buttonLabel: string;
  brandGradient: string;
  buttonGradient: string;
  url: string;
  trackingPixel: string;
}

// ── 登録済みアフィリエイトリンク ──
export const AFFILIATES: Record<string, A8Affiliate> = {
  'u-next': {
    id: 'u-next',
    serviceName: 'U-NEXT',
    icon: '🎬',
    catchcopy: '見放題作品数 No.1',
    description: '映画・ドラマ・アニメが31日間無料で見放題',
    features: [
      '31日間の無料トライアル',
      '見放題作品数 32万本以上',
      '毎月1,200円分のポイント付与',
    ],
    buttonLabel: '▶ 無料トライアルを始める',
    brandGradient: 'linear-gradient(135deg, #0d0d2b 0%, #1a1a4e 100%)',
    buttonGradient: 'linear-gradient(135deg, #00b4d8, #0077b6)',
    url: 'https://px.a8.net/svt/ejp?a8mat=3BT1PN+C8LBQ2+3250+6MC8Y',
    trackingPixel: 'https://www12.a8.net/0.gif?a8mat=3BT1PN+C8LBQ2+3250+6MC8Y',
  },
  'dmm-dazn': {
    id: 'dmm-dazn',
    serviceName: 'DMM × DAZNホーダイ',
    icon: '⚽',
    catchcopy: 'スポーツもエンタメも、これ1つ',
    description: 'DMMプレミアムとDAZN Standardがセットでお得',
    features: [
      'Jリーグ・プロ野球・海外サッカー見放題',
      'DMMプレミアムの映画・アニメも楽しめる',
      '2つのサービスがセットで月額3,480円',
    ],
    buttonLabel: '▶ セットプランを詳しく見る',
    brandGradient: 'linear-gradient(135deg, #1b1b1b 0%, #2d2d2d 100%)',
    buttonGradient: 'linear-gradient(135deg, #e63946, #d62828)',
    url: 'https://px.a8.net/svt/ejp?a8mat=3TLLIG+4CLK62+59RE+60WN6',
    trackingPixel: 'https://www14.a8.net/0.gif?a8mat=3TLLIG+4CLK62+59RE+60WN6',
  },
  'rakuten': {
    id: 'rakuten',
    serviceName: '楽天市場',
    icon: '🛒',
    catchcopy: 'ポイントも貯まってお得にお買い物',
    description: '話題のアイテムを楽天ポイントでお得にゲット',
    features: [
      '楽天ポイントが貯まる・使える',
      'セール・クーポンで更にお得',
      '送料無料商品も多数',
    ],
    buttonLabel: '▶ 楽天市場で探す',
    brandGradient: 'linear-gradient(135deg, #bf0000 0%, #8b0000 100%)',
    buttonGradient: 'linear-gradient(135deg, #ff4444, #cc0000)',
    url: 'https://rpx.a8.net/svt/ejp?a8mat=3BSJRH+E691I2+2HOM+6C1VM&rakuten=y&a8ejpredirect=http%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2F0ea62065.34400275.0ea62066.204f04c0%2Fa20120616688_3BSJRH_E691I2_2HOM_6C1VM%3Fpc%3Dhttp%253A%252F%252Fwww.rakuten.co.jp%252F%26m%3Dhttp%253A%252F%252Fm.rakuten.co.jp%252F',
    trackingPixel: 'https://www10.a8.net/0.gif?a8mat=3BSJRH+E691I2+2HOM+6C1VM',
  },
  'rakuten-travel': {
    id: 'rakuten-travel',
    serviceName: '楽天トラベル',
    icon: '✈️',
    catchcopy: '国内・海外旅行をお得に予約',
    description: 'ホテル・航空券・ツアーがポイントでお得に。楽天ポイントも貯まる！',
    features: [
      '国内ホテル数 No.1 クラス',
      '楽天ポイントが貯まる・使える',
      'クーポン配布でさらにお得',
    ],
    buttonLabel: '▶ 楽天トラベルで探す',
    brandGradient: 'linear-gradient(135deg, #00508f 0%, #003d6b 100%)',
    buttonGradient: 'linear-gradient(135deg, #0088cc, #006699)',
    url: 'https://rpx.a8.net/svt/ejp?a8mat=3BSJRH+E691I2+2HOM+6KMIQ&rakuten=y&a8ejpredirect=http%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2F0eb4779e.5d30c5ba.0eb4779f.b871e4e3%2Fa20120616688_3BSJRH_E691I2_2HOM_6KMIQ%3Fpc%3Dhttp%253A%252F%252Ftravel.rakuten.co.jp%252F%26m%3Dhttp%253A%252F%252Ftravel.rakuten.co.jp%252F',
    trackingPixel: 'https://www18.a8.net/0.gif?a8mat=3BSJRH+E691I2+2HOM+6KMIQ',
  },
};

// ── カテゴリ別の表示ルール ──
export const CATEGORY_AFFILIATES: Record<string, string[]> = {
  entertainment: ['u-next', 'dmm-dazn'],
  lifestyle: ['rakuten', 'rakuten-travel'],
  sports: ['dmm-dazn', 'rakuten'],
};

/**
 * カテゴリに応じたアフィリエイトリストを取得
 */
export function getAffiliatesForCategory(category: string): A8Affiliate[] {
  const ids = CATEGORY_AFFILIATES[category] || ['u-next', 'rakuten'];
  return ids.map((id) => AFFILIATES[id]).filter(Boolean);
}
