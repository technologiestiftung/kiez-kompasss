import { useState, useRef, useEffect } from 'react';

export const ListSuggestions = ({
	resultGPT,
	geoData,
	textInput,
	setBestPlace,
	setResultGPT,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [resultSzenarioText, setResultSzenarioText] = useState('');
	const [resultSzenarioJoke, setResultSzenarioJoke] = useState('');

	async function pickSzenario(item) {
		console.log(item, geoData);
		setIsLoading(true);
		const filteredgeoData = [];
		geoData.forEach((d) => {
			const entry = {};
			if (d.properties.tagEmoji == item.emoji) {
				entry.name = d.properties?.name;
				entry.description = d.properties?.description;
				// entry.wheelchair = d.properties?.wheelchair;
				entry.coordinates = d.geometry?.coordinates;
				filteredgeoData.push(entry);
			}
		});
		const response = await fetch('/api/getSzenario', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				szenarioText: textInput,
				data: filteredgeoData,
			}),
		});
		const data = await response.json();
		console.log('getSzenario response: ', data);
		if (!data) {
			setResultGPT('no szenario');
			return;
		}

		setIsLoading(false);
		setResultSzenarioText(data.result?.explanation || null);
		setResultSzenarioJoke(data.result?.joke);
		setBestPlace(data.result?.coordinates);
	}

	return (
		<div className="py-4 w-3/4">
			{resultGPT && (
				<>
					<h3 className="py-4 font-bold">
						Hier sind ein paar Sachen die du machen könntest. Such dir doch was
						aus:
					</h3>

					<ul>
						{Object.keys(resultGPT).map((item, i) => (
							<li
								className="flex py-2 hover:bg-black/30 cursor-pointer"
								key={`${'item-' + i}`}
								onClick={() => pickSzenario(resultGPT[item])}
							>
								<p className="mr-2 text-2xl p-2 w-10 h-10 border rounded-full justify-center items-center tex-center flex">
									{resultGPT[item].emoji}
								</p>

								<p className="content-center grid">
									{resultGPT[item].description} - {resultGPT[item].help}
								</p>
							</li>
						))}
					</ul>

					{isLoading ? <p>Suche dir den besten Ort. Moment...</p> : null}

					{resultSzenarioText && !isLoading ? (
						<>
							<p className="py-4">{resultSzenarioText}</p>
							<p>{resultSzenarioJoke}</p>
						</>
					) : null}
				</>
			)}
		</div>
	);
};
