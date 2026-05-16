import React from "react";

export default function useIsMobile(query: string = "(max-width: 767px)") {
	const [isMobile, setIsMobile] = React.useState(false);

	React.useEffect(() => {
		const mediaQuery = window.matchMedia(query);

		const handleMediaQueryChange = (event: MediaQueryListEvent) => {
			setIsMobile(event.matches);
		};

		mediaQuery.addEventListener("change", handleMediaQueryChange);

		setIsMobile(mediaQuery.matches);

		return () => {
			mediaQuery.removeEventListener("change", handleMediaQueryChange);
		};
	}, [query]);

	return isMobile;
}
