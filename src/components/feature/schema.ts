import { DeepPartial } from 'ai';
import { z } from 'zod';

export const featureSchema = z.object({
  title: z.string().describe('the title of the feature request'),
  content: z.string().describe('the information of the feature request'),
  priority: z
    .enum(['low', 'medium', 'high'])
    .optional()
    .describe('the priority of the feature request'),
  type: z
    .enum(['bug', 'feature'])
    .optional()
    .describe('the type of the feature request'),
  date: z.string().optional().describe('the date of the feature request'),
  estimation: z.object({
    cost: z.number().optional().describe('the cost of the feature request'),
    time: z.number().optional().describe('the time of the feature request'),
  }),
});

export type Feature = DeepPartial<typeof featureSchema>;
