import { useState, useEffect } from "react";
import Cookie from "js-cookie";

export const useCookies = (
	key: string,
	initialValue: string | null,
): [string | null, (value: string | null) => void] => {
	const [value, setValue] = useState<string | null>(() => {
		if (typeof window === "undefined") {
			return initialValue;
		}
		const existingCookie = Cookie.get(key);
		return existingCookie || initialValue;
	});

	useEffect(() => {
		if (value) {
			Cookie.set(key, value);
		} else {
			Cookie.remove(key);
		}
	}, [key, value]);

	return [value, setValue];
};
