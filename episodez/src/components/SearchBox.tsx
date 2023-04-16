import { useTransition } from "@/utils/useTransition";
import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ImSearch, ImSpinner8 } from "react-icons/im";

interface SearchBoxProps {
  searchFn: (value: string) => Promise<string | null>;
  defaultValue?: string;
  placeholder?: string;
}

export default function SearchBox(props: SearchBoxProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchErrorMessage, setSearchErrorMessage] = useState<string>("nope");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    updateSearchValueFromSessionStorage();
  }, []);

  const handleOnSearch = async () => {
    const value = inputRef!.current!.value;
    if (value.length > 0) {
      setIsSearching(true);
      const errorMessage = await props.searchFn(value);

      if (errorMessage) {
        setSearchErrorMessage(errorMessage);
      }
      setIsSearching(false);
    }
  };

  const handleOnInput = () => {
    searchErrorMessage && setSearchErrorMessage("nope");
  };

  const handlePageTransition = useCallback(() => {
    inputRef && saveStateToSessionStorage();
  }, [inputRef]);

  useTransition(handlePageTransition);

  function saveStateToSessionStorage() {
    if (sessionStorage) {
      sessionStorage.setItem("search", JSON.stringify(inputRef.current!.value));
    }
  }

  function updateSearchValueFromSessionStorage(){
    if (sessionStorage) {
        const searchFromSessionStorage = sessionStorage.getItem("search");
        if (searchFromSessionStorage) {
          inputRef.current!.value = JSON.parse(searchFromSessionStorage);
          sessionStorage.removeItem("search");
        }
      }
  }

  return (
    <section>
      <form
        onSubmit={(event: SyntheticEvent) => event.preventDefault()}
        className="flex flex-row items-center gap-2"
      >
        <input
          className="bg-background border-2 border-color-main rounded-md p-2 w-full outline-color-main"
          ref={inputRef}
          id="search"
          type="text"
          placeholder={props.placeholder}
          onInput={handleOnInput}
          defaultValue={props.defaultValue}
        ></input>
        <button onClick={handleOnSearch}>
          {isSearching ? <ImSpinner8 className="animate-spin" /> : <ImSearch />}
        </button>
      </form>

      <p
        className={
          "text-color-error my-1 text-sm  " +
          (searchErrorMessage === "nope" ? "invisible" : "")
        }
      >
        {searchErrorMessage}
      </p>
    </section>
  );
}
