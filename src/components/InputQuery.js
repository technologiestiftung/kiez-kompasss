import { useCookies } from '../hooks/useCookies';
import { useState, useRef, useEffect } from 'react';
import getOverpassData from 'src/lib/getOverpassData';
import { v4 as uuidv4 } from 'uuid';

export const InputQuery = ({
	setGeoData,
	queryBounds,
	setResultGPT,
	textInput,
	setTextInput,
	setErrorText,
}) => {
	const [sessionID, setSessionID] = useCookies('kiez-kompasss', null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!sessionID) {
			const newSessionID = uuidv4(); // Generate a new UUID
			setSessionID(newSessionID);
		}
	}, [sessionID, setSessionID]);

	async function onSubmit(event) {
		if (isLoading) return;
		event.preventDefault();
		setResultGPT(null);
		setIsLoading(true);
		const response = await fetch('/api/getTags', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-session-id': sessionID ?? 'unknown',
			},
			body: JSON.stringify({ product: textInput }),
		});
		const tagData = await response.json();
		console.log('GPT results:', tagData?.result);

		if (tagData.error) {
			setErrorText(data.error);
			setIsLoading(false);
			return;
		}

		// now get the data from Overpass too
		const overpassData = await getOverpassData(tagData?.result, queryBounds);
		if (overpassData.error) {
			setErrorText(overpassData.error);
			return;
		}
		setGeoData(overpassData.data);

		// filter the tags that have no geodata
		const filteredTags = [];
		tagData?.result.forEach((tag) => {
			let tagExists = false;
			overpassData.data?.forEach((overData) => {
				if (tag.emoji === overData.properties.tagEmoji && !tagExists) {
					tagExists = tag;
					filteredTags.push(tag);
				}
			});
		});
		setResultGPT(filteredTags);
		setIsLoading(false);
	}

	return (
		<div>
			<p>Versuch doch mal:</p>
			<ul className="py-2">
				<li className="italic">
					* "Ich habe kein Geld. Was kann ich heute schönes machen?""
				</li>
				<li className="italic">* "Wohin mit Oma?"</li>
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
					Fragen
				</button>
			</form>
			{isLoading ? (
				<p>Hmm, warte mal. Darüber muss ich etwas nachdenken...</p>
			) : null}
		</div>
	);
};
