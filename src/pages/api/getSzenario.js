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
	res.status(200).json({ result: JSON.parse(completion.data.choices[0].text) });
}

function reviewPrompt(text, data) {
	return `You are assistant: You can only answer in JSON.
  
  Choose from the data below (ignoring the property "coordinates") and the follwing scenario "${text}" the best result and explain your choice. Answer in german.

  ${JSON.stringify(data)}

  Return the results as a JSON with the following properties:
  "coordinates": the coordinates from the option
  "explanation": Your explanation
  `;
}
