import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '運営者情報',
  description: 'イマドキ！の運営者情報です。サイトの目的と運営方針をご確認ください。',
};

export default function AboutPage() {
  return (
    <main className="legal-page">
      <article className="legal-content">
        <h1>運営者情報</h1>
        <p className="legal-updated">最終更新日：2026年4月13日</p>

        <section className="legal-section">
          <h2>サイト名</h2>
          <p>イマドキ！</p>
        </section>

        <section className="legal-section">
          <h2>サイトの目的</h2>
          <p>イマドキ！は、暮らしの雑学＆エンタメ情報を毎日お届けする情報メディアです。ドラマ・映画の最新情報から、季節のイベント、スポーツの話題まで、幅広いトレンド情報を分かりやすくお届けします。</p>
        </section>

        <section className="legal-section">
          <h2>運営方針</h2>
          <ul>
            <li>読者の知りたい情報を、正確かつ迅速にお届けします</li>
            <li>記事内で紹介する商品やサービスは、実績・評判・安全性を確認した上で掲載しています</li>
            <li>当サイトはアフィリエイトプログラムに参加しています。報酬額ではなく読者にとっての有用性を基準にサービスを紹介します</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>広告について</h2>
          <p>当サイトは、Google AdSense及び各種アフィリエイトプログラムにより収益を得ています。広告の掲載により読者の皆様に最適な商品やサービスの情報をお届けしています。</p>
        </section>

        <section className="legal-section">
          <h2>お問い合わせ</h2>
          <p>サイトに関するお問い合わせは<a href="/contact">こちら</a>からお願いいたします。</p>
        </section>
      </article>
    </main>
  );
}
