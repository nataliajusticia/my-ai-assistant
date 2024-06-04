import { Helpdesk } from './schema';

export const HelpdeskUI = ({ request }: { request?: Helpdesk }) => {
  const title = request?.title;
  const content = request?.content;
  const priority = request?.priority || 'low';

  const priorityEmoji = {
    low: '🟢',
    medium: '🟡',
    high: '🔴',
  }[priority];

  return (
    <div className="bg-white border border-slate-100 rounded-md my-4 max-w-prose">
      <div className="uppercase rounded-t-md text-xs font-bold bg-slate-200 p-2">
        {priorityEmoji}: Helpdesk Ticket
      </div>

      <div className="p-4">
        <ul className="space-y-4">
          <li>
            <p className="font-bold">Request Title:</p>
            <p>{title}</p>
          </li>
          <li>
            <p className="font-bold">Request Content:</p>
            <p>{content}</p>
          </li>
        </ul>
      </div>
    </div>
  );
};
