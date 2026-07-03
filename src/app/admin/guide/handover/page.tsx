"use client"

const G = "#C9A84C"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32, pageBreakInside: "avoid" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, borderBottom: "2px solid #C9A84C20", paddingBottom: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 900, color: G }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

function InfoRow({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 16, padding: "9px 0", borderBottom: "1px solid #f0f0f0", alignItems: "flex-start" }}>
      <span style={{ flex: "0 0 180px", fontSize: 11, color: "#777", textAlign: "right" }}>{label}</span>
      <span style={{ flex: 1, fontSize: 11, color: "#222", fontFamily: mono ? "monospace" : "inherit", fontWeight: mono ? 600 : 400, wordBreak: "break-all" }}>{value}</span>
    </div>
  )
}

function CheckItem({ done, text }: { done?: boolean; text: string }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "5px 0" }}>
      <span style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${done ? "#27ae60" : "#ccc"}`, background: done ? "#27ae60" : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 10, color: "white", fontWeight: 700, marginTop: 1 }}>
        {done ? "✓" : ""}
      </span>
      <span style={{ fontSize: 11, color: "#444", lineHeight: 1.6 }}>{text}</span>
    </div>
  )
}

function Step({ num, title, desc }: { num: number; title: string; desc: string }) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
      <span style={{ width: 28, height: 28, borderRadius: "50%", background: G, color: "#0A0806", fontSize: 13, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {num}
      </span>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#222", marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 11, color: "#666", lineHeight: 1.7 }}>{desc}</div>
      </div>
    </div>
  )
}

const CSS = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #f4f4f2; font-family: Tajawal, sans-serif; direction: rtl; }

.print-bar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  background: #0A0806; border-bottom: 1px solid #C9A84C40;
  padding: 10px 24px; display: flex; align-items: center; gap: 16px;
}
.print-btn {
  padding: 8px 20px; border-radius: 8px;
  background: linear-gradient(135deg,#C9A84C,#F0D882);
  color: #0A0806; font-family: Tajawal, sans-serif; font-size: 13px; font-weight: 700;
  border: none; cursor: pointer;
}

.wrap { max-width: 860px; margin: 0 auto; padding: 80px 24px 60px; }

.paper {
  background: white; border-radius: 12px; box-shadow: 0 2px 24px rgba(0,0,0,0.08);
  padding: 48px 52px; margin-bottom: 24px;
}

.cover-logo { font-family: Cinzel, serif; font-size: 48px; font-weight: 700; color: #C9A84C; letter-spacing: 4px; margin-bottom: 4px; }
.cover-sub { font-family: Cinzel, serif; font-size: 14px; letter-spacing: 8px; color: #999; margin-bottom: 32px; }
.cover-title { font-size: 26px; font-weight: 900; color: #111; margin-bottom: 10px; }
.cover-desc { font-size: 13px; color: #777; line-height: 1.9; margin-bottom: 28px; }

.stamp {
  display: inline-flex; align-items: center; gap: 6px;
  background: #fff8f0; border: 2px solid #C9A84C; border-radius: 8px;
  padding: 8px 18px; font-size: 12px; font-weight: 700; color: #C9A84C;
}

.warn-box {
  background: #fff3f0; border: 1px solid #ff6b6b40; border-radius: 10px;
  padding: 14px 18px; margin-bottom: 14px; font-size: 11px; color: #c0392b; line-height: 1.8;
}

.note-box {
  background: #f0f8ff; border: 1px solid #3498db30; border-radius: 10px;
  padding: 12px 16px; font-size: 11px; color: #2980b9; line-height: 1.8;
}

.green-box {
  background: #f0fff4; border: 1px solid #27ae6030; border-radius: 10px;
  padding: 12px 16px; font-size: 11px; color: #27ae60; line-height: 1.8;
}

.contact-card {
  background: #0A0806; border-radius: 12px; padding: 20px 24px;
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;
}

@media print {
  .print-bar { display: none !important; }
  body { background: white; }
  .wrap { padding: 0; max-width: 100%; }
  .paper { box-shadow: none; padding: 32px 40px; border-radius: 0; margin: 0; page-break-after: always; }
  @page { margin: 14mm 16mm; size: A4; }
}
`

export default function HandoverPage() {
  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="print-bar">
        <span style={{ fontFamily: "Cinzel, serif", fontSize: 12, color: G, letterSpacing: 3 }}>ShahY Store · وثيقة نقل الملكية</span>
        <button className="print-btn" onClick={() => window.print()}>🖨️ &nbsp; طباعة / حفظ PDF</button>
        <a href="/admin/guide" style={{ fontFamily: "Tajawal, sans-serif", fontSize: 12, color: "rgba(245,239,224,0.4)", textDecoration: "none", marginRight: "auto" }}>
          ← الدليل
        </a>
      </div>

      <div className="wrap">

        {/* ── Cover ─────────────────────────────────────────────────────── */}
        <div className="paper" style={{ textAlign: "center", minHeight: 600, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div className="cover-logo">ShahY</div>
          <div className="cover-sub">STORE</div>
          <div style={{ width: 60, height: 2, background: `linear-gradient(to left,${G},#F0D882,${G})`, marginBottom: 32 }} />
          <h1 className="cover-title">وثيقة نقل ملكية المتجر</h1>
          <p className="cover-desc">
            هذه الوثيقة تُسلّم جميع حقوق ملكية وإدارة موقع شاهي ستور<br />
            للمالكة الجديدة بشكل رسمي وكامل — الموقع ملككِ ١٠٠٪
          </p>
          <div className="stamp">📋 وثيقة تسليم رسمية — يونيو ٢٠٢٦</div>

          <div style={{ marginTop: 40, padding: "20px 32px", background: "#fafafa", borderRadius: 12, border: "1px solid #eee", textAlign: "right", width: "100%", maxWidth: 480 }}>
            <div style={{ fontSize: 11, color: "#aaa", marginBottom: 12, textAlign: "center", fontFamily: "Cinzel, serif", letterSpacing: 2 }}>PARTIES OF TRANSFER</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: "#555" }}>المطوّر / المُسلِّم:</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#222" }}>Ahmed Darhous</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: "#555" }}>المالكة / المُستلِمة:</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: G }}>صاحبة شاهي ستور</span>
            </div>
          </div>
        </div>

        {/* ── Section 1: What you own ───────────────────────────────────── */}
        <div className="paper">
          <Section title="١. ما الذي تمتلكينه بالكامل">
            <div className="green-box" style={{ marginBottom: 20 }}>
              ✅ بمجرد تسليم هذه الوثيقة، أنتِ المالكة الوحيدة لكل ما يلي. المطوّر لا يحتفظ بأي حق أو وصول.
            </div>
            {[
              ["موقع الويب الكامل", "كود المصدر + قاعدة البيانات + الصور + المحتوى"],
              ["لوحة تحكم الأدمن", "صلاحية كاملة على جميع البيانات والإعدادات"],
              ["قاعدة البيانات (Supabase)", "كل الطلبات، العملاء، المنتجات، الأرباح"],
              ["الدومين والاستضافة (Vercel)", "تقدري تربطي دومين خاص متى شئتِ"],
              ["GitHub Repository", "الكود مرفوع على GitHub باسمك يمكنك الاحتفاظ به"],
              ["Google Analytics (GA4)", "بعد إضافة Measurement ID — البيانات بتاعتك"],
            ].map(([label, desc]) => (
              <InfoRow key={label} label={label} value={desc} />
            ))}
          </Section>

          <Section title="٢. الأصول الرقمية والحسابات">
            <div className="warn-box">
              ⚠️ تأكّدي من تغيير جميع كلمات المرور بعد الاستلام مباشرةً لضمان الأمان الكامل.
            </div>
            {[
              ["Vercel (الاستضافة)", "vercel.com · سجّلي بإيميلك وادعيه للمشروع أو استلمي الحساب"],
              ["Supabase (قاعدة البيانات)", "supabase.com · لوحة التحكم الكاملة بإيميلك"],
              ["GitHub (الكود)", "github.com/your-org/your-store · اطلبي نقل ownership"],
              ["Google Analytics", "analytics.google.com · افتحي حساب وأضيفي GA_ID للموقع"],
              ["WhatsApp للطلبات", "+201015835455 · خط الطلبات الرئيسي"],
              ["الإيميل الرسمي", "أنشئي إيميل business لاستقبال الإشعارات"],
            ].map(([label, value]) => (
              <InfoRow key={label} label={label} value={value} />
            ))}
          </Section>
        </div>

        {/* ── Section 2: Platform credentials guide ─────────────────────── */}
        <div className="paper">
          <Section title="٣. خطوات الاستلام الرسمي">
            <Step num={1} title="Vercel — الاستضافة"
              desc="ادخلي vercel.com وسجّلي حساب بإيميلك. اطلبي من المطوّر نقل المشروع إليكِ عبر زر Transfer في إعدادات المشروع. بعد النقل يصبح المشروع بالكامل تحت حسابك." />
            <Step num={2} title="Supabase — قاعدة البيانات"
              desc="ادخلي supabase.com وسجّلي حساب. اطلبي نقل Organization أو المشروع إليكِ. كل بيانات الطلبات والعملاء ستنتقل معاها تلقائياً." />
            <Step num={3} title="GitHub — كود الموقع"
              desc="سجّلي على github.com بأي اسم مستخدم. اطلبي من المطوّر Transfer Repository لحسابك. هكذا تصبحين مالكة الكود الكامل." />
            <Step num={4} title="Domain — ربط دومين خاص (اختياري لكن مهم)"
              desc="اشتري دومين من namecheap.com أو أي مزود (مثل shahy-store.com). اربطيه بـ Vercel من إعدادات المشروع > Domains > Add. عادةً يستغرق ساعة أو أقل." />
            <Step num={5} title="Google Analytics — التحليلات"
              desc="ادخلي analytics.google.com وأنشئي Property جديدة. انسخي Measurement ID (بيبدأ بـ G-). افتحي لوحة الأدمن > الإعدادات > أضيفي GA ID. دلوقتي بتشوفي كل زوار الموقع ومبيعاتك في وقت حقيقي." />
            <Step num={6} title="تغيير كلمات المرور"
              desc="غيّري كلمة مرور حساب الأدمن في الموقع من /admin (إيميل + كلمة مرور جديدة). غيّري كلمة مرور Vercel و Supabase و GitHub." />
          </Section>

          <Section title="٤. قائمة التحقق من الاستلام">
            <CheckItem done text="الموقع يعمل على اللايف: your-store.vercel.app" />
            <CheckItem done text="لوحة الأدمن تعمل: /admin/dashboard" />
            <CheckItem done text="إضافة منتج تعمل وتظهر على الموقع فوراً" />
            <CheckItem done text="استقبال الطلبات يعمل والإشعار يوصل على واتساب" />
            <CheckItem done text="نظام الأكواد الترويجية يعمل" />
            <CheckItem done text="الشحن يحسب تلقائياً حسب المحافظة" />
            <CheckItem done text="تسجيل العملاء وحساباتهم يعمل" />
            <CheckItem text="تم نقل حساب Vercel لاسمك (اطلبيه من المطوّر)" />
            <CheckItem text="تم نقل حساب Supabase لاسمك" />
            <CheckItem text="تم نقل GitHub Repository لاسمك" />
            <CheckItem text="تم ربط دومين خاص (اختياري)" />
            <CheckItem text="تم تفعيل Google Analytics" />
            <CheckItem text="تم تغيير كلمات المرور" />
          </Section>
        </div>

        {/* ── Section 3: Operation manual ───────────────────────────────── */}
        <div className="paper">
          <Section title="٥. دليل التشغيل اليومي">
            {[
              ["كل يوم", "افتحي /admin/orders وراجعي الطلبات الجديدة · حدّثي حالة كل طلب · تواصلي مع العميلة على واتساب"],
              ["كل أسبوع", "راجعي المخزون وعدّلي الأسعار · ابحثي عن منتجات جديدة تضيفينها · راجعي التقارير في الداشبورد"],
              ["كل شهر", "راجعي الإعلانات وحدّلي الميزانية · أضيفي عروض وكوبونات جديدة · حدّثي الفلاش ديلز"],
              ["عند توقف الموقع", "تواصلي مع Vercel Support أو مع المطوّر على واتساب"],
            ].map(([time, action]) => (
              <div key={time} style={{ display: "flex", gap: 16, marginBottom: 12, alignItems: "flex-start" }}>
                <span style={{ flex: "0 0 80px", fontSize: 10, fontWeight: 700, color: G, background: `${G}15`, padding: "4px 10px", borderRadius: 6, textAlign: "center" }}>{time}</span>
                <span style={{ fontSize: 11, color: "#555", lineHeight: 1.8 }}>{action}</span>
              </div>
            ))}
          </Section>

          <Section title="٦. روابط مهمة دايماً">
            {[
              ["الموقع (الزبائن)", "your-store.vercel.app"],
              ["لوحة الأدمن", "your-store.vercel.app/admin/dashboard"],
              ["تسجيل دخول الأدمن", "your-store.vercel.app/admin/login"],
              ["تسجيل دخول الزبائن", "your-store.vercel.app/signin"],
              ["دليل إدارة المتجر", "your-store.vercel.app/admin/guide/print"],
              ["Vercel Dashboard", "vercel.com/dashboard"],
              ["Supabase Dashboard", "supabase.com/dashboard"],
              ["GitHub Repository", "github.com/your-org/your-store"],
            ].map(([label, url]) => (
              <InfoRow key={label} label={label} value={url} mono />
            ))}
          </Section>

          <Section title="٧. ما يُحظر القيام به">
            <div className="warn-box">
              ⚠️ هذه الإجراءات قد تسبب فقدان البيانات أو توقف الموقع — تجنّبيها تماماً:
            </div>
            {[
              "حذف جداول قاعدة البيانات من Supabase مباشرةً",
              "تعديل ملفات .env.local أو المتغيرات في Vercel بدون معرفة كاملة",
              "حذف Git commits أو force push على فرع main",
              "تثبيت packages غير موثوقة على الكود",
              "مشاركة API Keys أو كلمات المرور عبر واتساب أو رسائل عادية",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                <span style={{ color: "#e74c3c", flexShrink: 0, fontSize: 13 }}>✗</span>
                <span style={{ fontSize: 11, color: "#444" }}>{item}</span>
              </div>
            ))}
          </Section>
        </div>

        {/* ── Section 4: Support & warranty ─────────────────────────────── */}
        <div className="paper">
          <Section title="٨. فترة الدعم والضمان">
            <div className="note-box" style={{ marginBottom: 20 }}>
              📌 المطوّر يقدّم دعماً فنياً لمدة ٣٠ يوماً من تاريخ التسليم لأي أعطال أو أسئلة تقنية.
            </div>
            {[
              ["فترة الدعم المجاني", "٣٠ يوماً من تاريخ تسليم الموقع"],
              ["ما يشمله الدعم", "إصلاح أي bugs، الإجابة على أسئلة التشغيل، تعديلات طارئة"],
              ["ما لا يشمله", "تطوير ميزات جديدة، تغيير التصميم الكامل، إعداد حملات إعلانية"],
              ["مدة الرد على التواصل", "خلال ٢٤ ساعة في أيام العمل"],
              ["تطوير إضافي مدفوع", "متاح عند الاتفاق على سعر منفصل"],
            ].map(([label, value]) => (
              <InfoRow key={label} label={label} value={value} />
            ))}
          </Section>

          <Section title="٩. التواصل مع المطوّر">
            <div className="contact-card">
              <div>
                <div style={{ fontFamily: "Cinzel, serif", fontSize: 11, color: "#999", letterSpacing: 2, marginBottom: 6 }}>DEVELOPER</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: G, fontFamily: "Cinzel, serif" }}>Ahmed Darhous</div>
                <div style={{ fontSize: 11, color: "rgba(245,239,224,0.4)", marginTop: 4 }}>Full-Stack Developer · Egypt</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <a href="https://wa.me/201030002331" target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 8, color: "#25D366", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
                  <span style={{ fontSize: 16 }}>📱</span> +201030002331 (WhatsApp)
                </a>
                <div style={{ color: "rgba(245,239,224,0.4)", fontSize: 11 }}>ahmeddarhous@gmail.com</div>
                <div style={{ color: "rgba(245,239,224,0.4)", fontSize: 11 }}>@darhous (Instagram / GitHub)</div>
              </div>
            </div>
          </Section>

          <Section title="١٠. إقرار الاستلام">
            <div style={{ background: "#fafafa", border: "1px solid #eee", borderRadius: 12, padding: "24px 28px" }}>
              <div style={{ fontSize: 11, color: "#555", lineHeight: 2, marginBottom: 24 }}>
                بموجب هذه الوثيقة، أُقرّ بأنني استلمت موقع شاهي ستور كاملاً بجميع ملحقاته ووظائفه، وأن المطوّر أحمد درهوس قد سلّمني الموقع بحالة عاملة وجاهزة للتشغيل، وأنني المالكة الوحيدة له من هذا التاريخ.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                <div>
                  <div style={{ fontSize: 10, color: "#aaa", marginBottom: 6 }}>توقيع المالكة</div>
                  <div style={{ height: 40, borderBottom: "1.5px solid #333" }} />
                  <div style={{ fontSize: 10, color: "#aaa", marginTop: 6 }}>الاسم · التاريخ</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#aaa", marginBottom: 6 }}>توقيع المطوّر</div>
                  <div style={{ height: 40, borderBottom: "1.5px solid #333" }} />
                  <div style={{ fontSize: 10, color: "#aaa", marginTop: 6 }}>Ahmed Darhous · ٢٠٢٦</div>
                </div>
              </div>
            </div>
          </Section>

          <div style={{ textAlign: "center", marginTop: 32, padding: "20px 0", borderTop: "1px solid #eee" }}>
            <div style={{ fontSize: 10, color: "#ccc", fontFamily: "Cinzel, serif", letterSpacing: 2 }}>
              SHAHY STORE · OWNERSHIP TRANSFER DOCUMENT · © 2026
            </div>
            <div style={{ fontSize: 10, color: "#C9A84C", marginTop: 6 }}>
              DESIGNED &amp; DEVELOPED BY AHMED DARHOUS · +201030002331
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
