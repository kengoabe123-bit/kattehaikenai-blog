import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description: 'イマドキ！へのお問い合わせはこちらから。',
};

export default function ContactPage() {
  return (
    <main className="legal-page">
      <article className="legal-content">
        <h1>お問い合わせ</h1>
        <p className="legal-updated">最終更新日：2026年4月13日</p>

        <section className="legal-section">
          <h2>お問い合わせ方法</h2>
          <p>当サイトへのお問い合わせは、下記メールアドレスまでお願いいたします。</p>
          <div className="contact-email-box">
            <p className="contact-email">📧 info@imadoki-media.com</p>
          </div>
          <p>通常、2〜3営業日以内にご返信させていただきます。</p>
        </section>

        <section className="legal-section">
          <h2>お問い合わせの前に</h2>
          <ul>
            <li>記事の内容に関するご指摘やご質問</li>
            <li>広告掲載に関するお問い合わせ</li>
            <li>その他サイトに関するご連絡</li>
          </ul>
          <p>上記の内容でお気軽にお問い合わせください。</p>
        </section>
      </article>
    </main>
  );
}
