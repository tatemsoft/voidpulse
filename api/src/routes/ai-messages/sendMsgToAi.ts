import { z } from "zod";
import { MsgRole } from "../../app-router-type";
import { protectedProcedure } from "../../trpc";
import { openai } from "./openai";

function approxNumTokensFromString(message: string) {
  // doing 3 instead of 4 to be safe
  return Math.ceil(message.length / 3);
}
const tokenLimit = 4096;

export const sendMsgToAi = protectedProcedure
  .input(
    z.object({
      data: z.string(),
      prevMsgs: z.array(
        z.object({
          role: z.nativeEnum(MsgRole),
          text: z.string(),
        })
      ),
      text: z.string(),
    })
  )
  .mutation(async ({ input: { prevMsgs, text, data }, ctx: { userId } }) => {
    if (process.env.CHATGPT_API_SECRET === "optional") {
      return {
        message:
          "ChatGPT API secret not set. Please set the CHATGPT_API_SECRET environment variable on the api to use this feature.",
      };
    }

    const systemMsg = data.length
      ? `You are a data analyst assistant. Try to provide an insight. Here is the data in question: ${data}`
      : `You are a data analyst assistant. You are waiting for the user to create a report so you can analyze the data with them.`;

    const dataTokenLength = approxNumTokensFromString(systemMsg);
    const textTokenLength = approxNumTokensFromString(text);
    let currTokensLength = dataTokenLength + textTokenLength;
    if (currTokensLength > tokenLimit) {
      return {
        message: `Chart has too much data that it doesn't fit into the AI context limit. Do less breakdowns, shrink the date range, or use less data.`,
      };
    }

    const allowedPrevMsgs: typeof prevMsgs = [];
    for (let i = prevMsgs.length - 1; i >= 0; i--) {
      const tokenLength = approxNumTokensFromString(prevMsgs[i].text);
      if (currTokensLength + tokenLength > tokenLimit) {
        break;
      }
      currTokensLength += tokenLength;
      allowedPrevMsgs.push(prevMsgs[i]);
    }
    allowedPrevMsgs.reverse();

    const chatCompletion = await openai.chat.completions.create({
      user: userId,
      messages: [
        {
          role: "system",
          content: systemMsg,
        },
        ...allowedPrevMsgs.map((msg) => ({
          role: (msg.role === MsgRole.user ? "user" : "assistant") as
            | "user"
            | "assistant",
          content: msg.text,
        })),
        { role: "user", content: text },
      ],
      model: "gpt-3.5-turbo",
    });

    return {
      message: chatCompletion.choices[0].message.content,
    };
  });