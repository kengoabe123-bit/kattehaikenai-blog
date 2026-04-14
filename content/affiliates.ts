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
  bannerHtml?: string;  // A8.net画像バナーHTMLコード（300×250px推奨）
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
    bannerHtml: '<a href="https://px.a8.net/svt/ejp?a8mat=3BT1PN+C8LBQ2+3250+68MF5" rel="nofollow"><img border="0" width="300" height="250" alt="" src="https://www24.a8.net/svt/bgt?aid=201229547740&wid=026&eno=01&mid=s00000014274001048000&mc=1" style="max-width:100%;height:auto"></a><img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=3BT1PN+C8LBQ2+3250+68MF5" alt="">',
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
    bannerHtml: '<a href="https://px.a8.net/svt/ejp?a8mat=3TLLIG+4CLK62+59RE+5ZEMP" rel="nofollow"><img border="0" width="300" height="250" alt="" src="https://www22.a8.net/svt/bgt?aid=231115048263&wid=026&eno=01&mid=s00000024593001005000&mc=1" style="max-width:100%;height:auto"></a><img border="0" width="1" height="1" src="https://www16.a8.net/0.gif?a8mat=3TLLIG+4CLK62+59RE+5ZEMP" alt="">',
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
    bannerHtml: '<a href="https://rpx.a8.net/svt/ejp?a8mat=3BSJRH+E691I2+2HOM+62U35&rakuten=y&a8ejpredirect=http%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2F0ea62065.34400275.0ea62066.204f04c0%2Fa20120616688_3BSJRH_E691I2_2HOM_62U35%3Fpc%3Dhttp%253A%252F%252Fwww.rakuten.co.jp%252F%26m%3Dhttp%253A%252F%252Fm.rakuten.co.jp%252F" rel="nofollow"><img src="http://hbb.afl.rakuten.co.jp/hsb/0eb4bbdb.d3e5aa19.0eb4bbaa.95151395/" border="0" style="max-width:100%;height:auto"></a><img border="0" width="1" height="1" src="https://www11.a8.net/0.gif?a8mat=3BSJRH+E691I2+2HOM+62U35" alt="">',
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
    bannerHtml: '<a href="https://rpx.a8.net/svt/ejp?a8mat=3BSJRH+E691I2+2HOM+6JRNL&rakuten=y&a8ejpredirect=http%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2F0eb4779e.5d30c5ba.0eb4779f.b871e4e3%2Fa20120616688_3BSJRH_E691I2_2HOM_6JRNL%3Fpc%3Dhttp%253A%252F%252Ftravel.rakuten.co.jp%252F%26m%3Dhttp%253A%252F%252Ftravel.rakuten.co.jp%252F" rel="nofollow"><img src="http://hbb.afl.rakuten.co.jp/hsb/0ea7f9af.0570e4b9.0ea7f99d.1ac92fca/153145/" border="0" style="max-width:100%;height:auto"></a><img border="0" width="1" height="1" src="https://www13.a8.net/0.gif?a8mat=3BSJRH+E691I2+2HOM+6JRNL" alt="">',
  },
};

// ── カテゴリ別の表示ルール ──
export const CATEGORY_AFFILIATES: Record<string, string[]> = {
  lifestyle: ['rakuten', 'u-next'],
  seasonal: ['rakuten-travel', 'rakuten'],
  money: ['rakuten', 'u-next'],
};

/**
 * カテゴリに応じたアフィリエイトリストを取得
 */
export function getAffiliatesForCategory(category: string): A8Affiliate[] {
  const ids = CATEGORY_AFFILIATES[category] || ['u-next', 'rakuten'];
  return ids.map((id) => AFFILIATES[id]).filter(Boolean);
}
