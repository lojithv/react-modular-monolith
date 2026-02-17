import { Button, Card, CardHeader, CardFooter } from '../../index.ts';
import { registerExamples } from '../registry.ts';

function CardExamples() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader title="Simple Card" description="With a subtitle" />
        <p className="text-sm text-gray-600">
          Card body content goes here. This is a basic card with header and body.
        </p>
      </Card>

      <Card>
        <CardHeader
          title="With Actions"
          actions={<Button size="sm" variant="secondary">Edit</Button>}
        />
        <p className="text-sm text-gray-600">This card has an action button in the header.</p>
        <CardFooter>
          <div className="flex gap-2">
            <Button size="sm">Save</Button>
            <Button size="sm" variant="ghost">Cancel</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

registerExamples({
  id: 'card',
  title: 'Card',
  description: 'Compound component with CardHeader & CardFooter',
  component: CardExamples,
});
