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
		<div className="w-1/3">
			{/* <p>Versuch doch mal:</p>
			<ul className="py-2">
				<li className="italic">
					* "Ich habe kein Geld. Was kann ich heute schönes machen?""
				</li>
				<li className="italic">* "Wohin mit Oma?"</li>
			</ul> */}
			<form onSubmit={onSubmit}>
				<input
					className="text-md placeholder-lightblue w-full 
                              mr-3 py-5 px-4 h-2 border-2 
                              border-black rounded-3xl mb-2"
					type="text"
					name="product"
					placeholder="Was möchtest du machen?"
					value={textInput}
					onChange={(e) => setTextInput(e.target.value)}
				/>
				<button
					className="w-1/5 ml-12 mt-6 text-sm text-white bg-magenta font-national h-10 rounded-sm float-left"
					type="submit"
				>
					FRAGEN
				</button>
				<button
					className="w-1/5 mr-12 mt-6 text-sm text-white bg-magenta font-national h-10 rounded-sm float-right"
					type="reset"
				>
					ZUFALLSFRAGE
				</button>
			</form>
			<div class= 'mt-24 h-10'>
			{isLoading ? (
				<p>Hmm, warte mal. Darüber muss ich etwas nachdenken...</p>
			) : <p>{textInput}</p>}
			</div>
		</div>
	);
};
