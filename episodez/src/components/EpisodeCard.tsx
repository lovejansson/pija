import { Episode } from "@/types";
import { zeroPad } from "@/utils/format";
import Image from "next/image";
import Link from "next/link";

interface EpisodeCardProps {
  episode: Episode;
}

/**
 * Card that displayes an image, title, season and episode number of an episode
 */
export default function EpisodeCard(props: EpisodeCardProps) {
  return (
    <Link href={`/episodes/${props.episode.id}`}>
      <h3 className="mb-4">{`E${zeroPad(props.episode.number, 2)} ${props.episode.name}`}</h3>
      {props.episode.image && (
        <Image
          width={1266}
          height={712}
          alt=""
          src={props.episode.image.original}
          className="w-full"
        />
      )}
    </Link>
  );
}
