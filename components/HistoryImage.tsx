import Image from "next/image";
import type { HistoryImage as HistoryImageData } from "@/lib/englishBibleHistory";
import ImageZoom from "./ImageZoom";

/**
 * A captioned public-domain image for /history. The filter desaturates and warms
 * each image a little so sources from five centuries sit together and read as
 * archival rather than as stock photos. Click to see the scan full-size.
 * See lib/englishBibleHistory.ts for the image data and provenance.
 */
export default function HistoryImage({
  image,
  className,
  sizes = "(max-width: 639px) 90vw, 12rem",
  priority = false,
}: {
  image: HistoryImageData;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <figure className={className}>
      <ImageZoom image={image} className="block w-full">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          priority={priority}
          className="h-auto w-full rounded-sm border border-neutral-200 bg-paper [filter:sepia(0.24)_saturate(0.86)_contrast(1.03)]"
        />
      </ImageZoom>
      <figcaption className="mt-2 text-xs leading-snug text-neutral-500">
        {image.caption}
        <span className="mt-1 block text-[0.7rem] text-neutral-400">{image.credit}</span>
      </figcaption>
    </figure>
  );
}
