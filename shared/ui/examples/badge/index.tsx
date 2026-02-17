import { Badge } from '../../index.ts';
import { registerExamples } from '../registry.ts';

function BadgeExamples() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">Variants</h3>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">In context</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Order #1234</span>
            <Badge variant="success">Completed</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Order #1235</span>
            <Badge variant="warning">Pending</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Order #1236</span>
            <Badge variant="danger">Cancelled</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

registerExamples({
  id: 'badge',
  title: 'Badge',
  description: '5 color variants for status labels and tags',
  component: BadgeExamples,
});
