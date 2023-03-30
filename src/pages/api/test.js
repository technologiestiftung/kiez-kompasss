import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
});

console.log("ÖöÖÖÖÖÖÖÖÖÖc  ", process.env.OPEN_AI_KEY);

const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: reviewPrompt(req.body.product),
    max_tokens: 2000,
    temperature: 0.6,
  });
  res.status(200).json({ result: completion.data.choices[0].text });
}

function reviewPrompt(text) {
  return `Give me 3 osm tags in Berlin that are related to the following scenario: "${text}". At least 2 tags should be an unexpected answer.

  Return the results as a JSON. 
  Use the tags as keys. 
  Each entry has following properties: 
  - “tag”: the keys and values of the osm tag as one string seperated by a "="
  - “description”: this describes the key 
  - “emoji”: one emoji that describes the tag.
  - “help”: this explains why this helps me with my scenario. 
  Write the help text so that it relates to the scenario and not the osm tag. 
  Make it sound non technical.`;
}
