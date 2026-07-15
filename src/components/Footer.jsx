import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner container">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true">
            ا
          </span>
          <span className="brand__name">اورینت</span>
        </div>

        <p className="site-footer__tagline">
          کالکشن اقیانوس · جنگل · آتشفشان
        </p>

        <p className="site-footer__copy">
          © {new Date().getFullYear()} اورینت. تمامی حقوق محفوظ است.
        </p>
      </div>
    </footer>
  );
}
