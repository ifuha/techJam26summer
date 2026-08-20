"use client";

type HeaderProps = {
  menuOpen: boolean;
  onMenuToggle: () => void;
  onProfileClick?: () => void;
};

export default function Header({
  menuOpen,
  onMenuToggle,
  onProfileClick,
}: HeaderProps) {
  return (
    <header className="app-header">
      <button
        type="button"
        className="icon-button menu-button"
        aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
        aria-expanded={menuOpen}
        aria-controls="main-menu"
        onClick={onMenuToggle}
      >
        <span />
        <span />
        <span />
      </button>

      <a className="brand" href="/" aria-label="ホーム">
        Logo
      </a>

      <button
        type="button"
        className="avatar-button"
        aria-label="プロフィールを開く"
        onClick={onProfileClick}
      >
        <span>私</span>
      </button>
    </header>
  );
}
