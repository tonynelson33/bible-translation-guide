import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Videos",
  description:
    "A short, curated set of videos on how English Bible translations are made — translation philosophy, the Textus Receptus and Critical Text, gender language, and how to choose a Bible.",
  alternates: { canonical: "/blog" },
};

type Video = {
  id: string;
  title: string;
  creator: string;
  topic: string;
};

const startHere: Video[] = [
  {
    id: "Q-eBMfZuk3o",
    title:
      "Before the King James Version: The Rebellion, Risk & Revolution Behind the English Bible",
    creator: "Tim Wildsmith",
    topic: "History of the English Bible",
  },
  {
    id: "EwrxWIgNYZQ",
    title: "Can We Trust Bible Translations?",
    creator: "Bill Mounce · Seedbed",
    topic: "What goes into a translation",
  },
  {
    id: "MOiPhVLYq5c",
    title: "How the Bible Translation Spectrum Works",
    creator: "Tim Wildsmith",
    topic: "Word-for-word vs. thought-for-thought",
  },
  {
    id: "KQqCUB-AVhU",
    title: "Critical Text vs. Textus Receptus: Some Preliminary Conclusions",
    creator: "Matthew Everhard",
    topic: "Textus Receptus vs. Critical Text",
  },
  {
    id: "vLOxXzlj5ZE",
    title: "Majority Text or Critical Text: Which Is Better?",
    creator: "Ken Yates · Grace Evangelical Society",
    topic: "Textus Receptus vs. Critical Text — the other view",
  },
  {
    id: "Uy1lv9RE8wQ",
    title: "Gender Inclusive Bibles Explained",
    creator: "Tim Wildsmith",
    topic: "Gender language in translation",
  },
  {
    id: "89zGrjDskLA",
    title: "The Best Bible Translation for Beginners",
    creator: "Tim Wildsmith",
    topic: "Choosing a Bible",
  },
];

const goDeeper: Video[] = [
  {
    id: "13gzStbU9qs",
    title: "Why So Many Bible Translations? Which One Is Best?",
    creator: "Sean McDowell, with Mark Ward",
    topic: "Overview conversation",
  },
  {
    id: "O9DUWXorbI4",
    title: "Issues with English Bible Translations",
    creator: "Wes Huff, with Mark Ward",
    topic: "A fuller conversation",
  },
  {
    id: "fqovqAmoecg",
    title: "The Truth About the Bible and Early Christianity",
    creator: "Wes Huff, Michael Kruger & Daniel Wallace · Sola Media",
    topic: "Is the Bible we have reliable?",
  },
];

function VideoCard({ video }: { video: Video }) {
  return (
    <li className="flex flex-col">
      <div className="relative aspect-video overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.id}`}
          title={video.title}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <p className="mt-2 text-xs font-medium uppercase tracking-wide text-brand-600">
        {video.topic}
      </p>
      <a
        href={`https://www.youtube.com/watch?v=${video.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-0.5 font-medium text-brand-800 hover:underline"
      >
        {video.title}
      </a>
      <p className="text-sm text-neutral-500">{video.creator}</p>
    </li>
  );
}

export default function VideosPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold text-brand-900 sm:text-4xl">Videos</h1>
      <p className="mt-3 max-w-2xl text-neutral-600">
        A short set of videos on how English Bible translations are made and how to choose one.
        Each is hosted on YouTube by its creator &mdash; listing it here isn&rsquo;t an
        endorsement of everything that creator says.
      </p>

      <h2 className="mt-10 font-serif text-2xl font-semibold text-brand-900">Start here</h2>
      <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
        {startHere.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </ul>

      <h2 className="mt-14 font-serif text-2xl font-semibold text-brand-900">Go deeper</h2>
      <p className="mt-2 max-w-2xl text-sm text-neutral-500">
        Longer conversations &mdash; 45 minutes to over an hour.
      </p>
      <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
        {goDeeper.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </ul>
    </div>
  );
}
