export default function Home() {
  const webAppUrl = "https://3000-viec-thien.web.app/";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" className="text-base font-semibold">
            3000 Việc Thiện
          </a>
          <nav aria-label="Điều hướng chính" className="hidden gap-6 text-sm md:flex">
            <a href="#y-nghia-du-an" className="hover:text-emerald-700">
              Ý nghĩa dự án
            </a>
            <a href="#cach-hoat-dong" className="hover:text-emerald-700">
              Cách hoạt động
            </a>
            <a href="#faq" className="hover:text-emerald-700">
              FAQ
            </a>
          </nav>
          <a
            className="inline-flex min-h-11 items-center rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700"
            href={webAppUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Mở web app
          </a>
        </div>
      </header>

      <main id="top">
        <section className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
          <h1 className="max-w-4xl text-3xl leading-tight font-bold md:text-5xl">
            3000 Việc Thiện - Theo dõi việc tốt mỗi ngày, miễn phí vĩnh viễn
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-slate-700 md:text-lg">
            Landing page này giúp bạn hiểu rõ ý nghĩa dự án, cách hoạt động và cách bắt
            đầu ngay trên điện thoại hoặc máy tính. Toàn bộ nền tảng được định hướng
            miễn phí vĩnh viễn cho cộng đồng.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              className="inline-flex min-h-11 items-center rounded-full bg-emerald-600 px-6 text-sm font-semibold text-white hover:bg-emerald-700"
              href={webAppUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Bắt đầu dùng miễn phí
            </a>
            <a
              className="inline-flex min-h-11 items-center rounded-full border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-900 hover:border-slate-400"
              href={webAppUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Mở webapp chính
            </a>
          </div>
        </section>

        <section id="y-nghia-du-an" className="border-t border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-6xl px-6 py-14">
            <h2 className="text-2xl font-bold md:text-3xl">
              Vì sao dự án 3000 Việc Thiện ra đời?
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
              Mục tiêu của dự án là biến việc tốt thành một thói quen bền vững, bắt đầu
              từ những hành động nhỏ mỗi ngày. Người dùng có thể theo dõi hành trình, duy
              trì động lực và lan tỏa ảnh hưởng tích cực.
            </p>
          </div>
        </section>

        <section id="cach-hoat-dong" className="mx-auto w-full max-w-6xl px-6 py-14">
          <h2 className="text-2xl font-bold md:text-3xl">Cách bắt đầu trong 3 bước</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold">1. Mở web app</h3>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                Truy cập nền tảng từ trình duyệt trên điện thoại hoặc máy tính.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold">2. Ghi nhận việc tốt</h3>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                Lưu lại các hành động tích cực trong ngày để theo dõi tiến trình.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold">3. Duy trì đều đặn</h3>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                Xây dựng chuỗi thói quen và lan tỏa tinh thần thiện nguyện đến cộng đồng.
              </p>
            </article>
          </div>
        </section>

        <section id="faq" className="border-t border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-6xl px-6 py-14">
            <h2 className="text-2xl font-bold md:text-3xl">Câu hỏi thường gặp</h2>
            <div className="mt-6 space-y-6">
              <article>
                <h3 className="text-lg font-semibold">
                  3000 Việc Thiện có mất phí không?
                </h3>
                <p className="mt-2 text-base leading-7 text-slate-700">
                  Không. Dự án được định hướng miễn phí vĩnh viễn cho người dùng.
                </p>
              </article>
              <article>
                <h3 className="text-lg font-semibold">
                  Tôi có thể dùng trên điện thoại không?
                </h3>
                <p className="mt-2 text-base leading-7 text-slate-700">
                  Có. Bạn có thể mở trực tiếp bằng trình duyệt và lưu ra màn hình chính
                  như một web app.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-16">
          <a
            className="inline-flex min-h-11 items-center rounded-full bg-emerald-600 px-8 text-base font-semibold text-white hover:bg-emerald-700"
            href={webAppUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Mở web app 3000 Việc Thiện
          </a>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-8 text-sm text-slate-600">
          © 3000 Việc Thiện
        </div>
      </footer>
    </div>
  );
}
