"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Header from "./header";

const ArtisanMap = dynamic(() => import("./artisan-map"), { ssr: false });

const categories = ["すべて", ...Array<string>(8).fill("陶磁器")];
const artisans = [
  { id: 1, name: "名前 名前", area: "美濃焼｜岐阜県 多治見市" },
  { id: 2, name: "名前 名前", area: "美濃焼｜岐阜県 土岐市" },
  { id: 3, name: "名前 名前", area: "美濃焼｜岐阜県 瑞浪市" },
];

function ArtisanCard({ artisan, compact = false }: { artisan: (typeof artisans)[number]; compact?: boolean }) {
  return (
    <article className={compact ? "artisan-card compact" : "artisan-card"}>
      <div className="artisan-heading"><div className="artisan-avatar" /><div><span className="artisan-tag">陶磁器</span><h2>{artisan.name}</h2><p>{artisan.area}</p></div></div>
      <div className="artisan-meta"><span>♢ 修行歴　3年2ヶ月</span><span>♡ 応援数　120</span></div>
      <div className="artisan-summary"><p>テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。</p><div className="artisan-image" aria-label="作品画像の仮領域" /></div>
      <div className="artisan-actions"><button type="button">詳細を見る <span>›</span></button><button type="button" className="support-button">♡　応援する <span>›</span></button></div>
    </article>
  );
}

export default function HeaderPreview() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <main className="preview-page">
      <Header menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((open) => !open)} />
      <nav className="category-scroll" aria-label="作品カテゴリー"><div className="category-list">{categories.map((category, index) => <button key={`${category}-${index}`} type="button" className={selectedCategory === index ? "category-chip active" : "category-chip"} aria-pressed={selectedCategory === index} onClick={() => setSelectedCategory(index)}>{category}</button>)}</div></nav>

      <section className="map-stage" aria-label="職人マップ">
        <ArtisanMap />
      </section>

      <section className={panelOpen ? "artisan-panel open" : "artisan-panel"}>
        <button className="panel-handle" type="button" aria-label={panelOpen ? "カードを閉じる" : "カードを開く"} onClick={() => setPanelOpen((open) => !open)}><span /></button>
        <ArtisanCard artisan={artisans[0]} />
        {panelOpen && <div className="similar-list"><h3>似た技を受け継ぐ人</h3>{artisans.slice(1).map((artisan) => <ArtisanCard key={artisan.id} artisan={artisan} compact />)}</div>}
      </section>

      {menuOpen && <><button className="drawer-backdrop" type="button" aria-label="メニューを閉じる" onClick={() => setMenuOpen(false)} /><aside id="main-menu" className="side-drawer"><div className="drawer-user"><div className="drawer-avatar" /><div><strong>ユーザー名</strong><span>@username</span></div></div><button className="profile-link" type="button">プロフィールを表示</button><nav aria-label="ドロワーメニュー"><a href="#home">ホーム</a><a href="#search">探す</a><a href="#find">探す</a></nav></aside></>}
    </main>
  );
}
