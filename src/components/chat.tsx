'use client';

import { ClientMessage } from '@/app/_actions';
import { BotIcon, UserIcon } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { nanoid } from 'ai';
import { useActions, useUIState } from 'ai/rsc';
import { useState } from 'react';

// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export default function Chat() {
  const [input, setInput] = useState<string>('');
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();

  return (
    <div className="w-full overflow-auto mb-20 max-container">
      <div>
        {conversation.map((m: ClientMessage) => (
          <div
            key={m.id}
            className={cn(
              'flex flex-col border-t first:border-t-0 border-slate-200 py-4',
              m.role === 'user' ? ' items-end' : 'items-start'
            )}
          >
            <div
              className={cn(
                'font-bold text-sm flex gap-2 items-center text-black mb-2',
                m.role === 'user' ? 'text-right' : 'text-left'
              )}
            >
              {m.role === 'user' ? <UserIcon /> : <BotIcon />}
              {m.role}
            </div>

            {m.role === 'user' ? (
              <div className="bg-white rounded-md p-2 border border-slate-200 shadow">
                {m.display}
              </div>
            ) : (
              m.display
            )}
          </div>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 w-full">
        <div className="max-container">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setInput('');
              setConversation((currentConversation: ClientMessage[]) => [
                ...currentConversation,
                { id: nanoid(), role: 'user', display: input },
              ]);

              const message = await continueConversation(input);

              setConversation((currentConversation: ClientMessage[]) => [
                ...currentConversation,
                message,
              ]);
            }}
            className="flex gap-4 w-full p-4 bg-white border-t border-l border-r rounded-t-md border-slate-200"
          >
            <input
              type="text"
              value={input}
              placeholder="Say something..."
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 py-2 px-2 rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-200 focus:border-slate-200"
              required
            />

            <button type="submit" className="btn-primary">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
