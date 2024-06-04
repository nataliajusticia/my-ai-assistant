'use server';

import { openai } from '@ai-sdk/openai';

import { ReactNode } from 'react';
import { createAI, getMutableAIState, streamUI } from 'ai/rsc';
import { z } from 'zod';
import { generateObject, nanoid } from 'ai';

import { helpdeskSchema } from '@/components/helpdesk/schema';
import { HelpdeskUI } from '@/components/helpdesk/heldesk-ui';
import { featureSchema } from '@/components/feature/schema';
import { FeatureUI } from '@/components/feature/feature-ui';

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
              'Create a helpdesk ticket with the following title, content and priority:' +
              title +
              content +
              priority,
          });

          return <HelpdeskUI request={request.object} />;
        },
      },
      feature: {
        description:
          'Create a feature request based on the user input and return it to the user with an estimation of the cost and time to implement the feature.',
        parameters: z.object({
          title: z.string().describe('the title of the feature request'),
          content: z
            .string()
            .describe('the information of the feature request'),
          priority: z
            .enum(['low', 'medium', 'high'])
            .optional()
            .describe('the priority of the feature request'),
          type: z
            .enum(['bug', 'feature'])
            .optional()
            .describe('the type of the feature request'),
          date: z
            .string()
            .optional()
            .describe('the date of the feature request'),
          estimation: z.object({
            cost: z
              .number()
              .optional()
              .describe('the cost of the feature request'),
            time: z
              .number()
              .optional()
              .describe('the time of the feature request'),
          }),
        }),
        generate: async function* ({
          title,
          content,
          priority,
          type,
          date,
          estimation,
        }) {
          yield <div>loading...</div>;
          const request = await generateObject({
            model: openai('gpt-4o'),
            schema: featureSchema,
            prompt: `Create a feature request based on the user input and return it to the user with an estimation of the cost and time to implement the feature. 
            The request should be based on the following details:
            Title: [Automatically generated based on content]
            Content: ${content}
            Priority: ${priority ? priority : '[Automatically assigned]'}
            Type: ${type ? type : '[Automatically assigned]'}
            Date: ${date ? date : '[Automatically assigned]'}
            Please ensure that the title is relevant to the content and the priority and date are appropriate.

            Estimation of the cost and time to implement the feature request is as follows:
            We cost 175CHF per hour. The time to implement the feature request is estimated based on the complexity of the request.
            Cost: ${
              estimation.cost
                ? estimation.cost + ' CHF'
                : '[Automatically assigned]'
            }
            Time: ${
              estimation.time
                ? estimation.time + ' hours'
                : '[Automatically assigned]'
            }
            `,
          });

          return <FeatureUI request={request.object} />;
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
