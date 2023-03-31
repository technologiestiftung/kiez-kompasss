import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
	apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function (req, res) {
	const completion = await openai.createCompletion({
		model: 'text-davinci-003',
		prompt: reviewPrompt(req.body.szenarioText, req.body.data),
		max_tokens: 2000,
		temperature: 0.6,
	});
	res.status(200).json({ result: completion.data.choices[0].text });
}

function reviewPrompt(text, data) {
	return `
  
  Suche aus den folgenden Daten und dem Szenario "${text}" das Beste Resultat und sage warum du dich dafür entschieden hast. 
  
  ${JSON.stringify(data)}
  
  `;
}
