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
    <div>
      <div className="uppercase font-bold bg-white pt-4 pb-8">
        🐞 Helpdesk Ticket
      </div>

      <div className="bg-slate-50 px-4 py-2 font-bold rounded-md">Details</div>
      <div className="p-4">
        <ul className="space-y-4">
          <li>
            <p className="font-bold">Priority:</p>
            <p>
              {priorityEmoji} {priority}
            </p>
          </li>
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
