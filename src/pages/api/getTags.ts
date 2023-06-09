import { supabase } from './_supabase';
import { Configuration, OpenAIApi } from 'openai';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { Database } from './_supabase/Database';

type Request = Database['public']['Tables']['requests']['Insert'];
const configuration = new Configuration({
	apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);
export default async function handler(req: VercelRequest, res: VercelResponse) {
	try {
		const sessionId = req.headers['x-session-id'];
		const completion = await openai.createCompletion({
			model: 'text-davinci-003',
			prompt: reviewPrompt(req.body.product),
			max_tokens: 2000,
			temperature: 0.6,
		});
		console.log('completion', completion.data.choices[0].text);
		if (!completion.data.choices[0] || !completion.data.choices[0].text) {
			return;
		}
		let data = JSON.parse(completion.data.choices[0].text) as Request[];
		data.forEach((d) => {
			d.session_id = sessionId as string;
			d.search_query = req.body.product;
		});
		console.log(data, 'data after parse');
		if (process.env.NODE_ENV !== 'development') {
			console.log('writing request to db');
			const { error: supabaseError } = await supabase
				.from('requests')
				.insert(data);
			if (supabaseError) {
				console.error('error while writing to the database', supabaseError);
			}
		}
		res.status(200).json({ result: data });
	} catch (e) {
		console.error('error', e);
		res.status(500).json({ error: e });
	}
}

function reviewPrompt(text: string) {
	return `You are assistant: A smart OSM query builder JSON api. You can only answer in JSON.

	Give me 5 osm tags that are related to the following scenario: ${text}. At least 3 tags should be an unexpected answer. Only use tags from openstreetmap.org. The texts will be in german. Take into account that you are in Berlin.

  Return the results as a JSON array.
  Each entry has following properties:
  - “tag”: the keys and values of the osm tag as an array the strings key values are seperated inside by a "="
  - “description”: this describes the value and is always written in German.
  - “emoji”: one emoji that describes the tag.
  - “help”: this explains why this helps me with my scenario and is always written in German.
  Write the help texts so that it relates to the scenario and not the osm tag.
  Make it sound non technical.`;
}
