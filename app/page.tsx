import Link from 'next/link';
import { articles, CATEGORIES } from '@/content/articles';
import type { CategoryKey } from '@/content/articles';

export default function Home() {
  const sortedArticles = [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const latestArticles = sortedArticles.slice(0, 9);

  return (
    <main className="main-content">
      {/* ヒーローセクション */}
      <section className="hero-blog">
        <div className="hero-blog-inner">
          <h1 className="hero-blog-title">kattehaikenai.com</h1>
          <p className="hero-blog-sub">暮らしの雑学＆エンタメ情報メディア</p>
          <p className="hero-blog-desc">毎日更新のトレンド情報をお届けします</p>
        </div>
      </section>

      <div className="content-wrapper">
        <div className="content-main">
          {/* 最新記事一覧 */}
          <section className="section-block">
            <h2 className="section-title">
              <span className="section-title-icon">🔥</span>
              最新記事
            </h2>
            <div className="article-grid">
              {latestArticles.map((article) => {
                const cat = CATEGORIES[article.category as CategoryKey];
                return (
                  <Link
                    href={`/blog/${article.slug}`}
                    key={article.id}
                    className="article-card"
                    id={`article-${article.slug}`}
                  >
                    <div className="article-card-image">
                      <img
                        src={article.heroImage}
                        alt={article.heroImageAlt}
                        loading="lazy"
                      />
                      <span
                        className="article-card-badge"
                        style={{ backgroundColor: cat.color }}
                      >
                        {cat.label}
                      </span>
                    </div>
                    <div className="article-card-body">
                      <h3 className="article-card-title">{article.title}</h3>
                      <p className="article-card-desc">{article.description}</p>
                      <time className="article-card-date">
                        {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
                      </time>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* カテゴリ別セクション */}
          {(Object.keys(CATEGORIES) as CategoryKey[]).map((catKey) => {
            const catArticles = sortedArticles
              .filter((a) => a.category === catKey)
              .slice(0, 3);
            if (catArticles.length === 0) return null;
            const cat = CATEGORIES[catKey];
            return (
              <section className="section-block" key={catKey}>
                <h2 className="section-title">
                  <span
                    className="section-title-dot"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.label}の記事
                </h2>
                <div className="article-grid">
                  {catArticles.map((article) => (
                    <Link
                      href={`/blog/${article.slug}`}
                      key={article.id}
                      className="article-card"
                    >
                      <div className="article-card-image">
                        <img
                          src={article.heroImage}
                          alt={article.heroImageAlt}
                          loading="lazy"
                        />
                      </div>
                      <div className="article-card-body">
                        <h3 className="article-card-title">{article.title}</h3>
                        <time className="article-card-date">
                          {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
                        </time>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/category/${catKey}`}
                  className="section-more"
                >
                  {cat.label}の記事をもっと見る →
                </Link>
              </section>
            );
          })}
        </div>

        {/* サイドバー */}
        <aside className="sidebar">
          <div className="sidebar-block">
            <h3 className="sidebar-title">プロフィール</h3>
            <div className="sidebar-profile">
              <div className="sidebar-profile-icon">📝</div>
              <p className="sidebar-profile-name">kattehaikenai.com</p>
              <p className="sidebar-profile-desc">暮らしに役立つ雑学やエンタメ情報を毎日お届けしています</p>
            </div>
          </div>

          <div className="sidebar-block">
            <h3 className="sidebar-title">カテゴリ</h3>
            <ul className="sidebar-categories">
              {(Object.keys(CATEGORIES) as CategoryKey[]).map((catKey) => {
                const cat = CATEGORIES[catKey];
                const count = articles.filter((a) => a.category === catKey).length;
                return (
                  <li key={catKey}>
                    <Link href={`/category/${catKey}`}>
                      <span
                        className="sidebar-cat-dot"
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.label}
                      <span className="sidebar-cat-count">({count})</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
