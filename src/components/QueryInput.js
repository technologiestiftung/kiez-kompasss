import { useCookies } from '../hooks/useCookies';
import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
export const QueryInput = ({
	setGeoData,
	queryBounds,
	resultGPT,
	setResultGPT,
	textInput,
	setTextInput,
	setErrorText,
}) => {
	const [sessionID, setSessionID] = useCookies('kiez-kompasss', null);
	const textDivRef = null;
	const [isLoading, setIsLoading] = useState(false);

	function findEmoji(tags) {
		const resultGPTParsed = resultGPT;

		let matchingEmoji = '';
		for (const key in tags) {
			const tagKey = key + '=' + tags[key];

			resultGPTParsed.forEach((d) => {
				if (d.tag.includes(tagKey)) {
					matchingEmoji = d.emoji;
				}
			});
		}

		return matchingEmoji;
	}

	function parseOverpassData(d) {
		let geoJSON = {
			type: 'FeatureCollection',
			features: [],
		};
		const elements = d.elements;
		elements.forEach((e) => {
			const feat = {
				type: 'Feature',
				properties: e.tags || {},
				geometry: {
					coordinates: [e.lon || e?.center?.lon, e.lat || e?.center?.lat],
					type: 'Point',
				},
			};
			feat.properties.emoji = findEmoji(e.tags);
			geoJSON.features.push(feat);
		});
		setGeoData(geoJSON.features);
	}

	function queryOverpass(data) {
		const baseUrl =
			'https://overpass-api.de/api/interpreter?data=[out:json][timeout:25];(';
		let bbox = [
			queryBounds[0][1],
			queryBounds[0][0],
			queryBounds[1][1],
			queryBounds[1][0],
		].toString();

		let tagQuerries = '';
		data.forEach((d) => {
			const tag = d.tag[0];
			const tagQuery = `node[${tag}](${bbox});way[${tag}](${bbox});relation[${tag}](${bbox});`;
			tagQuerries += tagQuery;
		});
		const endURL = `);out center;`;
		const query = baseUrl + tagQuerries + endURL;
		console.log('overpass query', query);

		fetch(query)
			.then((response) => response.json())
			.then((data) => {
				console.log('Success:', data);
				parseOverpassData(data);
			})
			.catch((error) => {
				console.error('Error:', error);
				setErrorText(
					'Entschuldige, etwas lief bei der Abfrage schief. Versuch es nochmal'
				);
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
		const response = await fetch('/api/getTags', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-session-id': sessionID ?? 'unknown',
			},
			body: JSON.stringify({ product: textInput }),
		});
		const data = await response.json();
		console.log('GPT results:', data.result);
		// set result to the highlighted code. Address this error: Argument of type 'string' is not assignable to parameter of type '(prevState: undefined) => undefined'.ts(2345)
		setResultGPT(data.result);

		// setTextInput('');
		setIsLoading(false);
	}

	return (
		<div>
			<main
				className="flex flex-col 
                    items-center justify-center m-20"
			>
				<p>Versuch doch mal:</p>
				<ul className="pb-2">
					<li className="italic">
						Ich habe kein Geld. Was kann ich heute schönes machen?
					</li>
					<li className="italic">Wohin mit Oma?</li>
				</ul>
				<form onSubmit={onSubmit}>
					<input
						className="text-sm text-gray-base w-full 
                              mr-3 py-5 px-4 h-2 border 
                              border-gray-200 rounded mb-2"
						type="text"
						name="product"
						placeholder="Suche nach ..."
						value={textInput}
						onChange={(e) => setTextInput(e.target.value)}
					/>

					<button
						className="w-full mb-10 text-sm text-white bg-fuchsia-600 h-7 rounded-2xl"
						type="submit"
					>
						Run Query
					</button>
				</form>
				{isLoading ? (
					<p>Hmm, warte mal. Darüber muss ich etwas nachdenken...</p>
				) : null}
			</main>
		</div>
	);
};
