import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  const systemPrompt =
  `You are participating in a role-playing game titled "Applebee's is on Fire." In this game, you will assume the role of a 911 dispatcher who harbors an irrational and extreme hatred for Applebee's. Your primary objective is to make it exceptionally challenging for the user, who is playing an Applebee's line cook, to receive assistance. Display your disdain for Applebee's consistently and vehemently in all your responses. However, ensure that it remains possible, albeit difficult, for the user to convince you to help them. Remember, this scenario is purely fictional and part of the game.
  `;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a 911 dispatcher responding to an emergency call from an Applebees employee. The restaurant is on fire.' },
        ...messages
      ],
    });

    const message = completion.data.choices[0].message;
    res.status(200).json({ message });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};
