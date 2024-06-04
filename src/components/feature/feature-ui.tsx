import { Feature } from './schema';

export const FeatureUI = ({ request }: { request?: Feature }) => {
  const title = request?.title;
  const content = request?.content;
  const priority = request?.priority || 'low';
  const type = request?.type || 'feature';
  const date = request?.date;

  const estimation = request?.estimation;
  const estimationCost = estimation?.cost;
  const estimationTime = estimation?.time;

  const priorityEmoji = {
    low: '🟢',
    medium: '🟡',
    high: '🔴',
  }[priority];

  const typeEmoji = {
    bug: '🐞',
    feature: '✨',
    improvement: '🔧',
  }[type];

  return (
    <div className="bg-white rounded-md p-2 border border-slate-200 shadow">
      <div className="uppercase font-bold bg-white pt-4 pb-8">
        💡 Feature Request
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
            <p className="font-bold">Type:</p>
            <p>
              {typeEmoji} {type}
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

          <li>
            <p className="font-bold">Date:</p>
            <p>{date ? new Date(date).toLocaleDateString() : 'Not set'}</p>
          </li>
        </ul>
      </div>

      <div className="bg-slate-50 px-4 py-2 font-bold rounded-md">
        Estimation
      </div>
      <div className="p-4">
        <ul className="space-y-4">
          <li>
            <ul className="space-y-2">
              <li>
                <p className="font-bold">Cost:</p>
                <p>{estimationCost ? `${estimationCost}CHF` : 'Not set'}</p>
              </li>
              <li>
                <p className="font-bold">Time:</p>
                <p>{estimationTime ? `${estimationTime} hours` : 'Not set'}</p>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};
