import { Episode } from "@/types";
import EpisodeCard from "./EpisodeCard";

interface EpisodesProps {
  episodes: Episode[];
}
export default function Episodes(props: EpisodesProps) {
  return (
    <ul key={props.episodes[0].id} className="flex flex-col gap-12 pt-4 pb-12">
      {props.episodes.map((episode) => (
        <li key={episode.id}>
          <EpisodeCard episode={episode} />
        </li>
      ))}
    </ul>
  );
}
