import Link from 'next/link';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <nav className="footer-nav">
          <Link href="/">ホーム</Link>
          <Link href="/about">運営者情報</Link>
          <Link href="/privacy">プライバシーポリシー</Link>
          <Link href="/contact">お問い合わせ</Link>
        </nav>
        <p className="footer-copy">
          © {new Date().getFullYear()} イマドキ！ All rights reserved.
        </p>
      </div>
    </footer>
  );
}
