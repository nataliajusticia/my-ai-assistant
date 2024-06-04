'use server';

import { openai } from '@ai-sdk/openai';

import { ReactNode } from 'react';
import { createAI, getMutableAIState, streamUI } from 'ai/rsc';
import { z } from 'zod';
import { generateObject, nanoid } from 'ai';

import { helpdeskSchema } from '@/components/helpdesk/schema';
import { HelpdeskUI } from '@/components/helpdesk/heldesk-ui';

export interface ServerMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClientMessage {
  id: string;
  role: 'user' | 'assistant';
  display: ReactNode;
}

export async function continueConversation(
  input: string
): Promise<ClientMessage> {
  'use server';

  const history = getMutableAIState();

  const result = await streamUI({
    model: openai('gpt-4o'),
    messages: [...history.get(), { role: 'user', content: input }],
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: 'assistant', content },
        ]);
      }

      return <div className="prose">{content}</div>;
    },
    tools: {
      helpdesk: {
        description: 'Create a helpdesk ticket',
        parameters: z.object({
          title: z.string().describe('the title of the helpdesk request'),
          content: z
            .string()
            .describe('the information of the helpdesk request'),
          priority: z
            .enum(['low', 'medium', 'high'])
            .optional()
            .describe('the priority of the helpdesk request'),
        }),
        generate: async function* ({ title, content, priority }) {
          yield <div>loading...</div>;
          const request = await generateObject({
            model: openai('gpt-4o'),
            schema: helpdeskSchema,
            prompt:
              'Create a helpdesk ticket with the following title and content:' +
              title +
              content +
              priority,
          });

          return <HelpdeskUI request={request.object} />;
        },
      },
    },
  });

  return {
    id: nanoid(),
    role: 'assistant',
    display: result.value,
  };
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  initialAIState: [],
  initialUIState: [],
});
