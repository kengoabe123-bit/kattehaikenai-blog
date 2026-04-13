import Link from 'next/link';

export function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="header-logo" id="header-logo">
          イマドキ！
        </Link>
        <nav className="header-nav" id="header-nav">
          <Link href="/category/entertainment">エンタメ</Link>
          <Link href="/category/lifestyle">暮らし</Link>
          <Link href="/category/sports">スポーツ</Link>
          <Link href="/about">運営者情報</Link>
        </nav>
      </div>
    </header>
  );
}
