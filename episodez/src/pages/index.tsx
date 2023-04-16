import { Noto_Sans_Mono } from "next/font/google";
import SearchBox from "@/components/SearchBox";
import { useCallback, useEffect, useRef, useState } from "react";
import { Episode, SeasonsWithEpisodes, Series } from "@/types";
import { useTransition } from "@/utils/useTransition";
import Tabs, { Tab } from "@/components/Tabs";
import Episodes from "@/components/Episodes";
import Header from "@/components/Header";

const notoSansMono = Noto_Sans_Mono({ subsets: ["latin"] });

const defaultSearch = "Buffy the vampire slayer";

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [series, setSeries] = useState<Series>();
  const [initDone, setInitDone] = useState(false);
  const [tabs, setTabs] = useState<Tab[]>();

  useEffect(() => {
    // On first render we check if there is a series in session storage and if so we restore it.
    // When series has been restored (and triggers this useEffect), we also check if there is a scroll top value in session storage and if so we restore it.
    // We also set initDone to true so we don't do this again if the series changes.
    if (!initDone && series) {
      updateScrollTopFromSessionStorage();
      setInitDone(true);
    }
  }, [series]);

  useEffect(() => {
    initSeries();
  }, []);

  async function initSeries() {
    const hasSavedSeriesInSessionStorage = updateSeriesFromSessionStorage();

    if (!hasSavedSeriesInSessionStorage) {
      await search(defaultSearch);
    }
  }

  const handlePageTransition = useCallback(() => {
    series && saveStateToSessionStorage();
  }, [series]);

  useTransition(handlePageTransition);

  function updateScrollTopFromSessionStorage() {
    if (sessionStorage) {
      const scrollTop = sessionStorage.getItem("scroll-top");
      if (scrollTop) {
        scrollContainerRef!.current!.scrollTop = parseInt(scrollTop);
        sessionStorage.removeItem("scroll-top");
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

  function updateSeriesFromSessionStorage() {
    if (sessionStorage) {
      const seriesFromSessionStorage = sessionStorage.getItem("series");
      if (seriesFromSessionStorage) {
        setSeries(JSON.parse(seriesFromSessionStorage));
        updateTabs(JSON.parse(seriesFromSessionStorage));
        sessionStorage.removeItem("series");
        return true;
      }
    }
    return false;
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
      } else {
        console.log(response);
        return "Something went wrong :(";
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
    <div
      ref={scrollContainerRef}
      className={"grow overflow-auto p-4 " + notoSansMono.className}
    >
      <Header />

      <main className="flex flex-col items-center gap-8  w-full xl:w-1/2 2xl:w-1/3 mx-auto ">
        <SearchBox
          searchFn={search}
          placeholder="Series name..."
          defaultValue={defaultSearch}
        />

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
