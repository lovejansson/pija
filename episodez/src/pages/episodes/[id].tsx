import { Episode } from "@/types";
import { isValidNumericParam } from "@/utils/validation";
import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import { IoMdStar } from "react-icons/io";
import { Noto_Sans_Mono } from "next/font/google";
import { zeroPad } from "@/utils/format";

const notoSansMono = Noto_Sans_Mono({ subsets: ["latin"] });

export default function EpisodeDetailsPage(props: { episode: Episode }) {
  return (
    <div className="grow overflow-auto">
      <main
        className={
          notoSansMono.className +
          " w-full md:w-1/2 mx-auto flex flex-col gap-8 px-4 pt-12 "
        }
      >
        <header className="flex flex-row gap-4 items-start justify-between">
          <h2 className="text-xl font-bold">{`${props.episode.name} S${zeroPad(
            props.episode.season,
            2
          )}E${zeroPad(props.episode.number, 2)}`}</h2>
          <div className="flex flex-row gap-2 items-center">
            <IoMdStar />
            <p>{props.episode.rating.average || "NA"}</p>
          </div>
        </header>

        {props.episode.image && (
          <Image
            alt=""
            width={1266}
            height={712}
            src={props.episode.image.original}
            className=" border-2 border-double border-color-main w-full"
          />
        )}
        <section className="pb-12">
          <h3 className="mb-2">Airdate</h3>
          <p className="mb-8">{props.episode.airdate || "NA"}</p>

          <h3 className="mb-2">Summary</h3>
          <p>{props.episode.summary?.slice(3, -4) || "NA"}</p>
        </section>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (!isValidNumericParam(context.params?.id)) {
    return {
      notFound: true,
    };
  }

  try {
    const response = await fetch(
      `https://api.tvmaze.com/episodes/${context.params?.id}`
    );

    if (response.status === 200) {
      const episode = await response.json();
      return {
        props: {
          episode,
        },
      };
    } else if (response.status === 404) {
      return {
        notFound: true,
      };
    } else {
      console.error(response);
      throw new Error("Server error");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Server error");
  }
}
