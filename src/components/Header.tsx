import { Link } from "react-router-dom";
import { ROUTES } from "../routes/paths";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header
      role="banner"
      className="site-header"
      aria-label="사이트 헤더"
    >
      <div className="header-inner">
        {/* 좌측: 로고 */}
        <Link to={ROUTES.HOME} className="logo-wrap" aria-label="Cubing Club Korea 메인으로 이동">
          <img
            src="/images/cck_logo.png"
            alt="Cubing Club Korea 로고"
            className="logo-img"
            loading="eager"
            decoding="async"
          />
          <span className="logo-text">Cubing Club Korea</span>
        </Link>

        {/* 우측: 테마 토글 + 프로필(로그인) */}
        <nav aria-label="사용자 메뉴" className="header-right">
          <ThemeToggle />
          <Link to={ROUTES.LOGIN} className="profile-btn" aria-label="로그인">
            <img
              src="/images/person_icon.png"
              alt=""
              width="32"
              height="32"
              className="profile-icon"
            />
            <span className="login-text">로그인</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
