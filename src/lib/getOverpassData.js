function findMatchingTagInfo(tags, tagData) {
	let matchingEmoji = '';
	let matchingDescription = '';
	for (const key in tags) {
		const tagKey = key + '=' + tags[key];

		tagData.forEach((d) => {
			if (d.tag.includes(tagKey)) {
				matchingEmoji = d.emoji;
			}
		});
	}

	return { tagDescription: matchingDescription, tagEmoji: matchingEmoji };
}

function parseOverpassData(elements, tagData) {
	console.log(elements, tagData);
	let features = [];
	elements.forEach((e) => {
		const feat = {
			type: 'Feature',
			properties: e.tags || {},
			geometry: {
				coordinates: [e.lon || e?.center?.lon, e.lat || e?.center?.lat],
				type: 'Point',
			},
		};
		const tagInfo = findMatchingTagInfo(e.tags, tagData);
		feat.properties.tagEmoji = tagInfo.tagEmoji;
		feat.properties.tagDescription = tagInfo.tagDescription;
		features.push(feat);
	});
	return features;
}

export default async function (tagData, queryBounds) {
	console.log('HUHUHUHU');
	const baseUrl =
		'https://overpass-api.de/api/interpreter?data=[out:json][timeout:25];(';
	let bbox = [
		queryBounds[0][1],
		queryBounds[0][0],
		queryBounds[1][1],
		queryBounds[1][0],
	].toString();

	let tagQuerries = '';
	tagData.forEach((d) => {
		const tag = d.tag[0];
		const tagQuery = `node[${tag}](${bbox});way[${tag}](${bbox});relation[${tag}](${bbox});`;
		tagQuerries += tagQuery;
	});
	const endURL = `);out center;`;
	const query = baseUrl + tagQuerries + endURL;
	console.log('overpass query: ', query);

	const response = await fetch(query);
	if (response.error) {
		return { data: null, error: 'overpass query:' + response.error };
	}

	const overpassData = await response.json();
	console.log('overpassData: ', overpassData);
	const parsedOverpassData = parseOverpassData(overpassData?.elements, tagData);

	return { data: parsedOverpassData, error: null };
}
