import { DeepPartial } from 'ai';
import { z } from 'zod';

export const helpdeskSchema = z.object({
  title: z.string().describe('the title of the heldesk request'),
  content: z.string().describe('the information of the heldesk request'),
  priority: z
    .enum(['low', 'medium', 'high'])
    .optional()
    .describe('the priority of the heldesk request'),
});

export type Helpdesk = DeepPartial<typeof helpdeskSchema>;
