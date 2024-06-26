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
    <div className="w-full overflow-auto mb-48 max-container">
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

        {conversation.length === 0 && (
          <>
            <div className="bg-white rounded-md p-4 border border-slate-200 shadow mt-4">
              <div className="text-center text-lg font-bold">
                Welcome your AI assistant!
              </div>
              <div className="text-center">
                Start by typing something in the input below.
              </div>
            </div>
          </>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 w-full">
        <div className="max-container my-4">
          <p className="font-bold text-sm">Quick Start</p>
          <p className="text-slate-500 text-xs mb-2">
            Click on one of the following helper promp buttons to quickly start
            a conversation with the AI assistant.
          </p>
          <ul className="grid grid-cols-2 gap-4">
            <li>
              <button
                className="btn-primary w-full"
                onClick={async () => {
                  setInput('');
                  setConversation((currentConversation: ClientMessage[]) => [
                    ...currentConversation,
                    {
                      id: nanoid(),
                      role: 'user',
                      display:
                        'Our website www.netnode.ch is currently down and inaccessible to all users. When attempting to access the site, users are met with a "500 Internal Server Error" message. This is severely impacting our business operations as clients are unable to access critical services. Immediate assistance is required to identify and resolve the issue. Please investigate and restore the website as soon as possible.',
                    },
                  ]);

                  const message = await continueConversation(
                    'Our website is currently down and inaccessible to all users. When attempting to access the site, users are met with a "500 Internal Server Error" message. This is severely impacting our business operations as clients are unable to access critical services. Immediate assistance is required to identify and resolve the issue. Please investigate and restore the website as soon as possible.'
                  );

                  setConversation((currentConversation: ClientMessage[]) => [
                    ...currentConversation,
                    message,
                  ]);
                }}
              >
                🐞 My site is down
              </button>
            </li>
            <li>
              <button
                className="btn-primary w-full"
                onClick={async () => {
                  setInput('');
                  setConversation((currentConversation: ClientMessage[]) => [
                    ...currentConversation,
                    {
                      id: nanoid(),
                      role: 'user',
                      display:
                        'I need a new feature. We need to develop a new slider component for the homepage of our website. The slider should be responsive, support multiple images, and include navigation controls. Additionally, it should have autoplay functionality with adjustable speed settings. The design should align with our current website theme and be easy to update with new images and content. The slider should also be optimized for performance to ensure quick loading times and smooth transitions.',
                    },
                  ]);

                  const message = await continueConversation(
                    'I need a new feature. We need to develop a new slider component for the homepage of our website. The slider should be responsive, support multiple images, and include navigation controls. Additionally, it should have autoplay functionality with adjustable speed settings. The design should align with our current website theme and be easy to update with new images and content. The slider should also be optimized for performance to ensure quick loading times and smooth transitions.'
                  );

                  setConversation((currentConversation: ClientMessage[]) => [
                    ...currentConversation,
                    message,
                  ]);
                }}
              >
                ✨ Slider Feature Request
              </button>
            </li>
          </ul>
        </div>

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
