// export async function POST(req: Request) {
//   const body = await req.json();
//   const messages: UIMessage[] = body.messages;

//   if (!messages || !Array.isArray(messages)) {
//     return new Response(JSON.stringify({ error: "messages array is required" }), { status: 400 });
//   }

//   const result = streamText({
//     // model: openai('gpt-4o'),
//     messages: convertToModelMessages(messages),
//   });

//   return result.toUIMessageStreamResponse();
// }
