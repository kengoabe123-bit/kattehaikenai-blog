import Link from 'next/link';
import { articles, CATEGORIES } from '@/content/articles';
import type { Article, CategoryKey } from '@/content/articles';

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: '記事が見つかりません' };
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      images: [{ url: article.heroImage, width: 1200, height: 630 }],
    },
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) {
    return (
      <main className="main-content">
        <div className="content-wrapper">
          <div className="content-main">
            <h1>記事が見つかりません</h1>
            <Link href="/">トップページに戻る</Link>
          </div>
        </div>
      </main>
    );
  }

  const cat = CATEGORIES[article.category as CategoryKey];

  // 構造化データ
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.heroImage,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { '@type': 'Organization', name: 'イマドキ！' },
    publisher: { '@type': 'Organization', name: 'イマドキ！' },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://kattehaikenai.com/' },
      { '@type': 'ListItem', position: 2, name: cat.label, item: `https://kattehaikenai.com/category/${article.category}` },
      { '@type': 'ListItem', position: 3, name: article.title },
    ],
  };

  // 関連記事
  const relatedArticles = articles
    .filter((a) => a.category === article.category && a.id !== article.id)
    .slice(0, 3);

  return (
    <main className="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="content-wrapper">
        <article className="content-main article-page">
          {/* パンくずリスト */}
          <nav className="breadcrumb" aria-label="パンくずリスト">
            <Link href="/">ホーム</Link>
            <span className="breadcrumb-sep">›</span>
            <Link href={`/category/${article.category}`}>{cat.label}</Link>
            <span className="breadcrumb-sep">›</span>
            <span>{article.title}</span>
          </nav>

          {/* 記事ヘッダー */}
          <header className="article-header">
            <span className="article-badge" style={{ backgroundColor: cat.color }}>
              {cat.label}
            </span>
            <h1 className="article-title">{article.title}</h1>
            <div className="article-meta">
              <time>
                📅 {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
              </time>
              {article.updatedAt !== article.publishedAt && (
                <time>
                  🔄 更新: {new Date(article.updatedAt).toLocaleDateString('ja-JP')}
                </time>
              )}
            </div>
            {article.tags && (
              <div className="article-tags">
                {article.tags.map((tag) => (
                  <span key={tag} className="article-tag">#{tag}</span>
                ))}
              </div>
            )}
          </header>

          {/* アイキャッチ画像 */}
          <div className="article-hero-image">
            <img src={article.heroImage} alt={article.heroImageAlt} />
          </div>

          {/* 目次 */}
          <nav className="toc">
            <h2 className="toc-title">📋 この記事の内容</h2>
            <ol className="toc-list">
              {article.content.sections.map((section, i) => (
                <li key={i}>
                  <a href={`#section-${i}`}>{section.heading}</a>
                </li>
              ))}
              <li><a href="#conclusion">まとめ</a></li>
            </ol>
          </nav>

          {/* 導入文 */}
          <div className="article-intro">
            <p>{article.content.intro}</p>
          </div>

          {/* 各セクション */}
          {article.content.sections.map((section, i) => (
            <section key={i} id={`section-${i}`} className="article-section">
              <h2>{section.heading}</h2>
              <div dangerouslySetInnerHTML={{ __html: section.body }} />
              {section.image && (
                <figure className="article-figure">
                  <img src={section.image} alt={section.imageAlt || ''} loading="lazy" />
                </figure>
              )}
            </section>
          ))}

          {/* アフィリエイトボックス */}
          {article.affiliateLinks && article.affiliateLinks.length > 0 && (
            <div className="affiliate-box">
              <h3 className="affiliate-box-title">🔗 関連リンク</h3>
              {article.affiliateLinks.map((link, i) => (
                <div key={i} className="affiliate-item">
                  <p className="affiliate-item-title">{link.title}</p>
                  {link.description && <p className="affiliate-item-desc">{link.description}</p>}
                  <div className="affiliate-buttons">
                    {link.rakutenUrl && (
                      <a href={link.rakutenUrl} target="_blank" rel="noopener noreferrer nofollow" className="btn-rakuten">楽天で見る</a>
                    )}
                    {link.amazonUrl && (
                      <a href={link.amazonUrl} target="_blank" rel="noopener noreferrer nofollow" className="btn-amazon">Amazonで見る</a>
                    )}
                    {link.yahooUrl && (
                      <a href={link.yahooUrl} target="_blank" rel="noopener noreferrer nofollow" className="btn-yahoo">Yahoo!で見る</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* まとめ */}
          <section id="conclusion" className="article-section article-conclusion">
            <h2>まとめ</h2>
            <p>{article.content.conclusion}</p>
          </section>

          {/* SNSシェアボタン */}
          <div className="share-buttons">
            <p className="share-title">この記事をシェア</p>
            <div className="share-links">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`https://kattehaikenai.com/blog/${article.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn share-x"
              >
                Xでシェア
              </a>
              <a
                href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(`https://kattehaikenai.com/blog/${article.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn share-line"
              >
                LINEで送る
              </a>
              <a
                href={`https://b.hatena.ne.jp/entry/${encodeURIComponent(`https://kattehaikenai.com/blog/${article.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn share-hatena"
              >
                はてブ
              </a>
            </div>
          </div>

          {/* 関連記事 */}
          {relatedArticles.length > 0 && (
            <section className="related-articles">
              <h2 className="related-title">関連記事</h2>
              <div className="article-grid">
                {relatedArticles.map((ra) => (
                  <Link href={`/blog/${ra.slug}`} key={ra.id} className="article-card">
                    <div className="article-card-image">
                      <img src={ra.heroImage} alt={ra.heroImageAlt} loading="lazy" />
                    </div>
                    <div className="article-card-body">
                      <h3 className="article-card-title">{ra.title}</h3>
                      <time className="article-card-date">
                        {new Date(ra.publishedAt).toLocaleDateString('ja-JP')}
                      </time>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>

        {/* サイドバー */}
        <aside className="sidebar">
          <div className="sidebar-block">
            <h3 className="sidebar-title">カテゴリ</h3>
            <ul className="sidebar-categories">
              {(Object.keys(CATEGORIES) as CategoryKey[]).map((catKey) => {
                const c = CATEGORIES[catKey];
                const count = articles.filter((a) => a.category === catKey).length;
                return (
                  <li key={catKey}>
                    <Link href={`/category/${catKey}`}>
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
