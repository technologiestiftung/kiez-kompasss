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
		const { error: supabaseError } = await supabase
			.from('requests')
			.insert(data);
		if (supabaseError) {
			console.error('error while writing to the database', supabaseError);
		}

		res.status(200).json({ result: data });
	} catch (e) {
		console.error('error', e);
		res.status(500).json({ error: e });
	}
}

function reviewPrompt(text: string) {
	return `You are assistant: A smart OSM query builder JSON api. You can only answer in JSON.

	Give me 3 osm tags in Berlin that are related to the following scenario: ${text}. At least 2 tags should be an unexpected answer. The texts will be in german.

  Return the results as a JSON array.
  Each entry has following properties:
  - “tag”: the keys and values of the osm tag as an array the strings key values are seperated inside a by a "="
  - “description”: this describes the key and is always written in German.
  - “emoji”: one emoji that describes the tag.
  - “help”: this explains why this helps me with my scenario and is always wirtten in German.
  Write the help texts so that it relates to the scenario and not the osm tag.
  Make it sound non technical.`;
}
