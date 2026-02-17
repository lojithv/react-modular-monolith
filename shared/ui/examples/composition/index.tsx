import { Button, Input, Select, Card, CardHeader, CardFooter, Badge } from '../../index.ts';
import { registerExamples } from '../registry.ts';

function CompositionExamples() {
  return (
    <Card>
      <CardHeader
        title="Create New Item"
        description="All fields are required"
        actions={<Badge variant="info">Draft</Badge>}
      />
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Input label="Name" placeholder="Enter item name" />
        <Select
          label="Type"
          placeholder="Select type..."
          options={[
            { value: 'product', label: 'Product' },
            { value: 'service', label: 'Service' },
            { value: 'subscription', label: 'Subscription' },
          ]}
        />
        <Input label="Price" type="number" placeholder="0.00" />
        <CardFooter>
          <div className="flex gap-2">
            <Button type="submit">Create Item</Button>
            <Button variant="secondary">Save as Draft</Button>
            <Button variant="ghost">Cancel</Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

registerExamples({
  id: 'composition',
  title: 'Composition',
  description: 'Multiple components combined into a real-world form',
  component: CompositionExamples,
});
