import { useEffect } from "react";
import { useRouter } from "next/router";

export function useTransition(callback: () => void) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = ()=>{
        callback();
    }
    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [callback]);
}
