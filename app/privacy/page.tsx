import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: 'イマドキ！のプライバシーポリシーです。',
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <article className="legal-content">
        <h1>プライバシーポリシー</h1>
        <p className="legal-updated">最終更新日：2026年4月13日</p>

        <section className="legal-section">
          <h2>個人情報の取り扱いについて</h2>
          <p>当サイトでは、お問い合わせの際にお名前やメールアドレスなどの個人情報をお伺いする場合があります。取得した個人情報は、お問い合わせへの対応にのみ利用し、第三者への開示は行いません。</p>
        </section>

        <section className="legal-section">
          <h2>広告について</h2>
          <p>当サイトでは、第三者配信の広告サービス（Google AdSense）を利用しています。広告配信事業者は、ユーザーの興味に応じた広告を表示するためにCookieを使用することがあります。</p>
          <p>Cookieを無効にする設定やGoogleアドセンスに関する詳細は、<a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">広告 – ポリシーと規約 – Google</a>をご覧ください。</p>
        </section>

        <section className="legal-section">
          <h2>アフィリエイトプログラムについて</h2>
          <p>当サイトは、楽天アフィリエイト、Amazonアソシエイト、バリューコマースなどのアフィリエイトプログラムに参加しています。記事内のリンクを経由して商品を購入された場合、当サイトが報酬を受け取ることがあります。</p>
        </section>

        <section className="legal-section">
          <h2>アクセス解析ツールについて</h2>
          <p>当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。このGoogleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。</p>
        </section>

        <section className="legal-section">
          <h2>著作権について</h2>
          <p>当サイトに掲載されている文章や画像等のコンテンツの著作権は、当サイト運営者に帰属します。無断転載はご遠慮ください。</p>
        </section>

        <section className="legal-section">
          <h2>免責事項</h2>
          <p>当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねます。情報の正確性には万全を期していますが、利用者ご自身の責任と判断でご利用ください。</p>
        </section>
      </article>
    </main>
  );
}
