import { useState } from 'react';
import { Button } from '../../index.ts';
import { registerExamples } from '../registry.ts';

function ButtonExamples() {
  const [loading, setLoading] = useState(false);

  function handleLoadingDemo() {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">Variants</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">Sizes</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">States</h3>
        <div className="flex flex-wrap gap-3">
          <Button disabled>Disabled</Button>
          <Button loading={loading} onClick={handleLoadingDemo}>
            {loading ? 'Loading...' : 'Click to load'}
          </Button>
        </div>
      </div>
    </div>
  );
}

registerExamples({
  id: 'button',
  title: 'Button',
  description: '4 variants, 3 sizes, loading & disabled states',
  component: ButtonExamples,
});
