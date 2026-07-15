import ScrollFrameSequence from "./ScrollFrameSequence";
import "./CraftSection.css";

export default function CraftSection() {
  const introContent = (
    <div className="craft__intro">
      <span className="section-label">II — پیش از دیدن</span>
      <h2 className="craft__intro-title">
        هر ساعت،
        <br />
        پیش از آنکه ساعت شود، رؤیایی بود.
      </h2>
    </div>
  );

  const beats = [
    {
      key: "title",
      start: 0.22,
      end: 0.48,
      side: "right",
      content: (
        <div className="craft__beat">
          <span className="section-label">ساخته شده در سکوت</span>
          <h2 className="craft__title">
            هر قطعه،
            <br />
            دستِ یک استاد.
          </h2>
        </div>
      ),
    },
    {
      key: "text",
      start: 0.56,
      end: 0.82,
      side: "left",
      content: (
        <div className="craft__beat">
          <p className="craft__text">
            پیش از آنکه به مچ شما برسد، هر ساعت اورینت از میان ده‌ها قطعهٔ
            ظریف عبور می‌کند؛ چرخ‌دنده‌ای در کنار چرخ‌دنده‌ای دیگر، تا
            حرکتی بی‌وقفه و دقیق شکل بگیرد.
          </p>
        </div>
      ),
    },
  ];

  return (
    <ScrollFrameSequence
      id="craft"
      framesBase="/media/craft/frames/"
      frameCount={192}
      heightVh={360}
      bgColor="#0a0908"
      className="craft"
      introBlack={0.16}
      outroBlack={0.9}
      introContent={introContent}
      beats={beats}
    />
  );
}
