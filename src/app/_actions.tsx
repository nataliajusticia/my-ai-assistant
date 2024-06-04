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

      return (
        <div className="bg-white rounded-md p-2 border border-slate-200 shadow">
          {content}
        </div>
      );
    },
    tools: {
      helpdesk: {
        description:
          'Create a helpdesk ticket based on the user input. Normally used to report a problem or ask for help.',
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
            prompt: `Create a helpdesk ticket based on the user input and return it to the user.
              The request should be based on the following details:
              Title: [Automatically generated based on content]
              Content: ${content}
              Priority: ${priority ? priority : '[Automatically assigned]'}`,
          });

          return (
            <>
              <HelpdeskUI request={request.object} />

              <div className="text-sm text-gray-500 mt-4">
                The helpdesk ticket has been created. A support agent will
                contact you shortly.
              </div>
            </>
          );
        },
      },
      feature: {
        description:
          'Create a feature request based on the user input and return it to the user with an estimation of the cost and time to implement the feature. Normally used to request a new feature or improvement.',
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

          return (
            <>
              <FeatureUI request={request.object} />

              <div className="text-sm text-gray-500 mt-4">
                The feature request has been created. An agent will review the
                request and get back to you as soon as possible.
              </div>
            </>
          );
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
