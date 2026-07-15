import "./ContactSection.css";

export default function ContactSection() {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-section__inner container">
        <div className="contact-section__intro">
          <span className="section-label">IV — تماس</span>
          <h2 className="contact-section__title">
            گفت‌وگو را
            <br />
            آغاز کنید.
          </h2>
          <p className="contact-section__text">
            برای مشاوره، سفارش یا بازدید حضوری از نمایشگاه اورینت، از راه‌های
            زیر با ما در ارتباط باشید.
          </p>

          <dl className="contact-info">
            <div className="contact-info__row">
              <dt>آدرس</dt>
              <dd>[آدرس فروشگاه/نمایشگاه]</dd>
            </div>
            <div className="contact-info__row">
              <dt>تلفن</dt>
              <dd dir="ltr">[شماره تماس]</dd>
            </div>
            <div className="contact-info__row">
              <dt>ایمیل</dt>
              <dd dir="ltr">[آدرس ایمیل]</dd>
            </div>
            <div className="contact-info__row">
              <dt>شبکه‌های اجتماعی</dt>
              <dd>[اینستاگرام / تلگرام]</dd>
            </div>
          </dl>
        </div>

        <form
          className="contact-form"
          onSubmit={(e) => e.preventDefault()}
          noValidate
        >
          <div className="contact-form__field">
            <label htmlFor="name">نام و نام‌خانوادگی</label>
            <input id="name" name="name" type="text" autoComplete="name" />
          </div>

          <div className="contact-form__field">
            <label htmlFor="email">ایمیل</label>
            <input id="email" name="email" type="email" autoComplete="email" />
          </div>

          <div className="contact-form__field">
            <label htmlFor="message">پیام شما</label>
            <textarea id="message" name="message" rows={5} />
          </div>

          <button type="submit" className="contact-form__submit">
            ارسال پیام
          </button>
        </form>
      </div>
    </section>
  );
}
