import type { Metadata } from "next";
import Link from "next/link";
import HistoryImage from "@/components/HistoryImage";
import TextTraditions from "@/components/TextTraditions";
import TranslationFamilyTree from "@/components/TranslationFamilyTree";
import { timeline, textPrimer, historyImages } from "@/lib/englishBibleHistory";

export const metadata: Metadata = {
  title: "How We Got the English Bible",
  description:
    "From the Wycliffe Bible and Tyndale's martyrdom to the King James Version and the modern translations — a short history of the English Bible, and a primer on the manuscripts behind the text.",
  alternates: { canonical: "/history" },
};

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-brand-900 sm:text-4xl">
        How we got the English Bible
      </h1>
      <p className="mt-3 leading-relaxed text-neutral-700">
        Every English translation on this site is part of a story that runs back more than six
        hundred years &mdash; and for most of that time, putting the Bible into English was illegal
        and dangerous. Knowing the outline makes the family resemblances between translations, and
        the arguments about them, a lot easier to follow.
      </p>

      {/* Timeline */}
      <div className="mt-10">
        <ol className="relative border-l-2 border-neutral-200">
          {timeline.map((entry) => {
            const single = entry.images?.length === 1;
            const gallery = entry.images && entry.images.length > 1;
            return (
              <li key={entry.year} className="ml-6 pb-8 last:pb-0">
                <span
                  className={`absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full border-2 ${
                    entry.major
                      ? "border-gild-600 bg-gild-500"
                      : "border-neutral-300 bg-paper"
                  }`}
                  aria-hidden="true"
                />
                <div
                  className={
                    single
                      ? "sm:grid sm:grid-cols-[minmax(0,1fr)_13rem] sm:items-start sm:gap-6"
                      : undefined
                  }
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gild-700">
                      {entry.year}
                    </p>
                    <h2 className="mt-0.5 font-display text-lg font-semibold text-brand-900">
                      {entry.title}
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-700">{entry.detail}</p>
                  </div>
                  {single && (
                    <HistoryImage
                      image={entry.images![0]}
                      className="mt-4 max-w-[15rem] sm:mt-0 sm:max-w-none"
                      sizes="(max-width: 639px) 15rem, 13rem"
                    />
                  )}
                </div>
                {gallery && (
                  <div className="mt-4 grid max-w-[15rem] grid-cols-1 gap-4 sm:max-w-md sm:grid-cols-2">
                    {entry.images!.map((img) => (
                      <HistoryImage
                        key={img.src}
                        image={img}
                        sizes="(max-width: 639px) 15rem, 13rem"
                      />
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Narrative */}
      <div className="mt-14 border-t border-neutral-200 pt-10">
        <h2 className="font-display text-2xl font-semibold text-brand-900">
          The through-line: Tyndale
        </h2>
        <div className="mt-3 gap-6 sm:grid sm:grid-cols-[minmax(0,1fr)_13rem] sm:items-start">
          <div className="space-y-4 leading-relaxed text-neutral-700">
            <p>
              The single most important figure is the one most people have never heard of. William
              Tyndale was a gifted linguist who believed an ordinary person should be able to read
              Scripture in their own language. In 1520s England that was a criminal position, so he
              left for Germany, learned enough Hebrew to be among the first Englishmen to use it,
              and printed a New Testament translated straight from Greek.
            </p>
            <p>
              Copies were smuggled home in cloth and grain shipments; the authorities burned the
              ones they caught, and eventually they caught Tyndale. He was strangled and burned in
              1536. Within four years the same king who had hunted him authorized an English Bible
              for every parish church &mdash; one built largely on Tyndale&rsquo;s own work.
            </p>
            <p>
              His phrasing carried straight through the Great Bible, the Geneva Bible, and the
              Bishops&rsquo; Bible into the{" "}
              <Link href="/translations/kjv" className="font-medium text-brand-700 hover:underline">
                King James Version
              </Link>
              , where studies estimate three-quarters or more of the New Testament is still his
              wording. &ldquo;Let there be light,&rdquo; &ldquo;the powers that be,&rdquo;
              &ldquo;my brother&rsquo;s keeper,&rdquo; &ldquo;the salt of the earth&rdquo; &mdash;
              all Tyndale. When the{" "}
              <Link href="/translations/esv" className="font-medium text-brand-700 hover:underline">
                ESV
              </Link>{" "}
              or{" "}
              <Link
                href="/translations/nrsvue"
                className="font-medium text-brand-700 hover:underline"
              >
                NRSVue
              </Link>{" "}
              calls itself part of a translation &ldquo;tradition,&rdquo; this is the tradition it
              means: the RSV revised the 1901 ASV, which revised the 1885 RV, which revised the
              KJV, which was mostly Tyndale.
            </p>
          </div>
          <HistoryImage
            image={historyImages.tyndalePortrait}
            className="mt-6 max-w-[13rem] sm:mt-0 sm:max-w-none"
            sizes="(max-width: 639px) 13rem, 13rem"
          />
        </div>
      </div>

      {/* Text primer */}
      <div className="mt-14 border-t border-neutral-200 pt-10">
        <h2 className="font-display text-2xl font-semibold text-brand-900">
          Where the text itself comes from
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          A translation is only as good as the source text behind it, and the source text is itself
          the product of careful reconstruction. This is the part that the{" "}
          <Link href="/differences" className="font-medium text-brand-700 hover:underline">
            translation differences
          </Link>{" "}
          page assumes you know.
        </p>

        {textPrimer.map((section) => (
          <div key={section.id} id={section.id} className="mt-8 scroll-mt-20">
            <div
              className={
                section.image
                  ? "gap-6 sm:grid sm:grid-cols-[minmax(0,1fr)_14rem] sm:items-start"
                  : undefined
              }
            >
              <div>
                <h3 className="font-display text-xl font-semibold text-brand-900">
                  {section.heading}
                </h3>
                <div className="mt-2 space-y-3 leading-relaxed text-neutral-700">
                  {section.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
              {section.image && (
                <HistoryImage
                  image={section.image}
                  className="mt-4 max-w-[16rem] sm:mt-1 sm:max-w-none"
                  sizes="(max-width: 639px) 16rem, 14rem"
                />
              )}
            </div>
          </div>
        ))}

        <div className="mt-10">
          <TextTraditions />
        </div>
      </div>

      {/* Family tree */}
      <div className="mt-14 border-t border-neutral-200 pt-10">
        <h2 className="font-display text-2xl font-semibold text-brand-900">
          Bible Translation Tree
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Many of the translations on this site are branches of the same tree, rooted in Tyndale and
          the King James Version; a handful are fresh work from the original languages.
        </p>
        <TranslationFamilyTree />
      </div>

      <div className="mt-14 rounded-lg border border-gild-200 bg-gild-50 px-5 py-4 text-sm leading-relaxed text-neutral-700">
        From here:{" "}
        <Link href="/differences" className="font-medium text-gild-700 hover:underline">
          the specific verses
        </Link>{" "}
        where the manuscript history becomes visible, the{" "}
        <Link href="/rankings" className="font-medium text-gild-700 hover:underline">
          rankings
        </Link>{" "}
        if you&rsquo;re choosing what to read, or{" "}
        <Link href="/blog" className="font-medium text-gild-700 hover:underline">
          videos
        </Link>{" "}
        on this history.
      </div>
    </div>
  );
}
