import { Noto_Sans_Mono } from "next/font/google";
import SearchBox from "@/components/SearchBox";
import { useCallback, useEffect, useRef, useState } from "react";
import { Episode, SeasonsWithEpisodes, Series } from "@/types";
import { useTransition } from "@/utils/useTransition";
import Tabs, { Tab } from "@/components/Tabs";
import Episodes from "@/components/Episodes";

const notoSansMono = Noto_Sans_Mono({ subsets: ["latin"] });

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [series, setSeries] = useState<Series>();
  const [initDone, setInitDone] = useState(false);
  const [tabs, setTabs] = useState<Tab[]>();

  const handlePageTransition = useCallback(() => {
    series && saveStateToSessionStorage();
  }, [series]);

  useTransition(handlePageTransition);

  useEffect(() => {
    // On first render we check if there is a series in session storage and if so we restore it.
    // When series has been restored (and triggers this useEffect), we also check if there is a scroll top value in session storage and if so we restore it.
    // We also set initDone to true so we don't do this again if the series changes.
    if (!initDone && series) {
      updateScrollTopFromSessionStorage();
      setInitDone(true);
    }
  }, [series]);

  useEffect(updateSeriesFromSessionStorage, []);

  function updateScrollTopFromSessionStorage() {
    if (sessionStorage) {
      const scrollTop = sessionStorage.getItem("scroll-top");
      if (scrollTop) {
        scrollContainerRef!.current!.scrollTop = parseInt(scrollTop);
        sessionStorage.removeItem("scroll-top");
      }
    }
  }

  function updateSeriesFromSessionStorage() {
    if (sessionStorage) {
      const seriesFromSessionStorage = sessionStorage.getItem("series");
      if (seriesFromSessionStorage) {
        setSeries(JSON.parse(seriesFromSessionStorage));
        updateTabs(JSON.parse(seriesFromSessionStorage));
        sessionStorage.removeItem("series");
      }
    }
  }

  function saveStateToSessionStorage() {
    if (sessionStorage) {
      sessionStorage.setItem("series", JSON.stringify(series));
      sessionStorage.setItem(
        "scroll-top",
        scrollContainerRef!.current!.scrollTop.toString()
      );
    }
  }

  async function search(value: string) {
    try {
      const response = await fetch(
        `https://api.tvmaze.com/singlesearch/shows?q=${value}&embed=episodes`
      );

      if (response.status === 200) {
        const data = await response.json();
        setSeries(data);
        updateTabs(data);
      } else if (response.status === 404) {
        return "No series found :|";
      }
    } catch (e) {
      console.log(e);
      return "Something went wrong :(";
    }

    return null;
  }

  function updateTabs(series: Series) {
    const seasonsWithEpisodes: SeasonsWithEpisodes = {};

    (series._embedded.episodes as Episode[]).forEach((episode) => {
      if (!seasonsWithEpisodes[episode.season]) {
        seasonsWithEpisodes[episode.season] = [episode];
      } else {
        seasonsWithEpisodes[episode.season].push(episode);
      }
    });

    setTabs(
      Object.entries(seasonsWithEpisodes).map((tab) => ({
        name: tab[0],
        content: <Episodes episodes={tab[1]} />,
      }))
    );
  }

  return (
    <div ref={scrollContainerRef} className="grow overflow-auto">
      <main
        className={
          "flex flex-col items-center gap-8 px-4 pt-12 w-full md:w-3/4 lg:w-1/2 mx-auto " +
          notoSansMono.className
        }
      >
        <SearchBox searchFn={search} placeholder="Series name..." />

        {series && (
          <section className="hidden md:block">
            <h2 className="text-xl font-bold">{`${series.name} ${
              series.premiered
                ? `(${new Date(series.premiered).getFullYear()})`
                : null
            }`}</h2>
            <ul className="flex flex-row gap-2">
              {series.genres.map((g) => (
                <li key={g} className="li-comma">
                  {g}
                </li>
              ))}
            </ul>
          </section>
        )}

        <Tabs tabs={tabs || []} />
      </main>
    </div>
  );
}
