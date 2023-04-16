import { useTransition } from "@/utils/useTransition";
import { useCallback, useEffect, useState } from "react";

export interface Tab {
  name: string;
  content: React.ReactNode;
}
interface TabsProps {
  tabs: Tab[];
}

export default function Tabs(props: TabsProps) {
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    if (props.tabs.length) {
      const hasSavedTabInSessionStorage = updateSelectedTabFromSessionStorage();

      if (!hasSavedTabInSessionStorage) {
        setSelectedTab(0);
      }
    }
  }, [props.tabs]);

  function updateSelectedTabFromSessionStorage() {
    if (sessionStorage) {
      const selectedTab = sessionStorage.getItem("selected-tab");

      if (selectedTab) {
        setSelectedTab(parseInt(selectedTab));
        sessionStorage.removeItem("selected-tab");
        return true;
      }
      return false;
    }
  }

  const handlePageTransition = useCallback(() => {
    saveStateToSessionStorage();
  }, [selectedTab]);

  useTransition(handlePageTransition);

  function saveStateToSessionStorage() {
    if (sessionStorage) {
      sessionStorage.setItem("selected-tab", selectedTab.toString());
    }
  }

  return (
    <section className="flex flex-col w-full">
      <ul className="flex flex-row gap-8 overflow-x-auto py-2">
        {props.tabs.map((tab, idx) => (
          <li
            key={tab.name}
            className={
              "text-xl px-4 " +
              (idx === selectedTab ? "border-b-4 border-color-main" : "")
            }
          >
            <button onClick={() => setSelectedTab(idx)}>{tab.name}</button>
          </li>
        ))}
      </ul>
      {props.tabs[selectedTab]?.content}
    </section>
  );
}
