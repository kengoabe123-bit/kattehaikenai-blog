import Link from 'next/link';
import { articles, CATEGORIES } from '@/content/articles';
import type { CategoryKey } from '@/content/articles';

const validCategories: CategoryKey[] = ['entertainment', 'lifestyle', 'sports'];

export function generateStaticParams() {
  return validCategories.map((name) => ({ name }));
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const cat = CATEGORIES[name as CategoryKey];
  if (!cat) return { title: 'カテゴリが見つかりません' };
  return {
    title: `${cat.label}の記事一覧`,
    description: `${cat.label}に関する最新記事の一覧です。`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const catKey = name as CategoryKey;
  const cat = CATEGORIES[catKey];

  if (!cat) {
    return (
      <main className="main-content">
        <div className="content-wrapper">
          <div className="content-main">
            <h1>カテゴリが見つかりません</h1>
            <Link href="/">トップページに戻る</Link>
          </div>
        </div>
      </main>
    );
  }

  const catArticles = articles
    .filter((a) => a.category === catKey)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return (
    <main className="main-content">
      <div className="content-wrapper">
        <div className="content-main">
          <nav className="breadcrumb" aria-label="パンくずリスト">
            <Link href="/">ホーム</Link>
            <span className="breadcrumb-sep">›</span>
            <span>{cat.label}</span>
          </nav>

          <h1 className="category-page-title">
            <span className="section-title-dot" style={{ backgroundColor: cat.color }} />
            {cat.label}の記事一覧
          </h1>
          <p className="category-page-desc">
            {cat.label}に関する最新記事 ({catArticles.length}件)
          </p>

          {catArticles.length === 0 ? (
            <p className="no-articles">まだ記事がありません。</p>
          ) : (
            <div className="article-grid">
              {catArticles.map((article) => (
                <Link
                  href={`/blog/${article.slug}`}
                  key={article.id}
                  className="article-card"
                >
                  <div className="article-card-image">
                    <img src={article.heroImage} alt={article.heroImageAlt} loading="lazy" />
                    <span className="article-card-badge" style={{ backgroundColor: cat.color }}>
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
              ))}
            </div>
          )}
        </div>

        <aside className="sidebar">
          <div className="sidebar-block">
            <h3 className="sidebar-title">カテゴリ</h3>
            <ul className="sidebar-categories">
              {validCategories.map((ck) => {
                const c = CATEGORIES[ck];
                const count = articles.filter((a) => a.category === ck).length;
                return (
                  <li key={ck} className={ck === catKey ? 'active' : ''}>
                    <Link href={`/category/${ck}`}>
                      <span className="sidebar-cat-dot" style={{ backgroundColor: c.color }} />
                      {c.label}
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
