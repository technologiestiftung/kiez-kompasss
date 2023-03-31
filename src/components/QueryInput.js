// @ts-check
import { useCookies } from "../hooks/useCookies";
import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
export const QueryInput = ({
	setGeoData,
	queryBounds,
	resultGPT,
	setResultGPT,
}) => {
	const [sessionID, setSessionID] = useCookies("kiez-kompasss", null);
	const textDivRef = null;
	const [productInput, setProductInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	function findEmoji(tags) {
		const resultGPTParsed = JSON.parse(resultGPT);

		let matchingEmoji = "";
		for (const key in tags) {
			const tagKey = key + "=" + tags[key];

			for (const keyy in resultGPTParsed) {
				if (resultGPTParsed[keyy].tag.includes(tagKey)) {
					matchingEmoji = resultGPTParsed[keyy].emoji;
				}
			}
		}

		return matchingEmoji;
	}

	function parseOverpassData(d) {
		let geoJSON = {
			type: "FeatureCollection",
			features: [],
		};
		const elements = d.elements;
		elements.forEach((e) => {
			const feat = {
				type: "Feature",
				properties: e.tags || {},
				geometry: {
					coordinates: [e.lon || e?.center?.lon, e.lat || e?.center?.lat],
					type: "Point",
				},
			};
			feat.properties.emoji = findEmoji(e.tags);
			geoJSON.features.push(feat);
		});
		setGeoData(geoJSON.features);
	}

	function queryOverpass(d) {
		console.log("query overpass", d);
		let data;
		try {
			data = JSON.parse(d);
		} catch (e) {
			console.log("error parsing GPT result", e);
			return;
		}
		const baseUrl =
			"https://overpass-api.de/api/interpreter?data=[out:json][timeout:25];(";
		let bbox = [
			queryBounds[0][1],
			queryBounds[0][0],
			queryBounds[1][1],
			queryBounds[1][0],
		].toString();

		let tagQuerries = "";
		for (const property in data) {
			const tag = data[property].tag;
			const tagQuery = `node[${tag}](${bbox});way[${tag}](${bbox});relation[${tag}](${bbox});`;
			tagQuerries += tagQuery;
		}
		const endURL = `);out center;`;
		const query = baseUrl + tagQuerries + endURL;
		console.log("overpass query", query);

		fetch(query)
			.then((response) => response.json())
			.then((data) => {
				console.log("Success:", data);
				parseOverpassData(data);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}

	useEffect(() => {
		if (resultGPT) {
			queryOverpass(resultGPT);
		}
	}, [resultGPT]);
	useEffect(() => {
		if (!sessionID) {
			const newSessionID = uuidv4(); // Generate a new UUID
			setSessionID(newSessionID);
		}
	}, [sessionID, setSessionID]);

	async function onSubmit(event) {
		event.preventDefault();

		setIsLoading(true);
		const response = await fetch("/api/gpt", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-session-id": sessionID ?? "unknown",
			},
			body: JSON.stringify({ product: productInput }),
		});
		const data = await response.json();
		console.log("GPT results:", data.result);
		// set result to the highlighted code. Address this error: Argument of type 'string' is not assignable to parameter of type '(prevState: undefined) => undefined'.ts(2345)
		setResultGPT(data.result);

		setProductInput("");
		setIsLoading(false);
	}

	return (
		<div>
			<main className="flex flex-col items-center justify-center m-20">
				<h3 className="mb-3 text-xl text-slate-900">Kiez Kompass 🧭</h3>
				<form onSubmit={onSubmit}>
					<input
						className="w-full h-2 px-4 py-5 mb-2 mr-3 text-sm border border-gray-200 rounded text-gray-base"
						type="text"
						name="product"
						placeholder="Suche nach ..."
						value={productInput}
						onChange={(e) => setProductInput(e.target.value)}
					/>

					<button
						className="w-full mb-10 text-sm text-white bg-fuchsia-600 h-7 rounded-2xl"
						type="submit"
					>
						Run Query
					</button>
				</form>
				{isLoading ? (
					<p>Loading... be patient.. may take 30s+</p>
				) : resultGPT ? (
					<div className="relative w-2/4 ">
						{/* <div
              ref={textDivRef}
              className="overflow-x-auto break-words rounded-md border-spacing-2 border-slate-900 bg-slate-100 max-w-500 "
            >
              <pre className="">
                <code
                  className=""
                  dangerouslySetInnerHTML={{
                    __html: resultGPT,
                  }}
                />
              </pre>
            </div>
            <div className="absolute top-0 right-0 mt-2 mr-2 cursor-pointer copy-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-copy"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <rect x="8" y="8" width="12" height="12" rx="2"></rect>
                <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"></path>
              </svg>
            </div> */}
					</div>
				) : null}
			</main>
		</div>
	);
};
