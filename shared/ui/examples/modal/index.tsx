import { useState } from 'react';
import { Button, Input, Modal } from '../../index.ts';
import { registerExamples } from '../registry.ts';

function ModalExamples() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setBasicOpen(true)}>Basic Modal</Button>
        <Button variant="secondary" onClick={() => setFormOpen(true)}>Modal with Form</Button>
      </div>

      <Modal
        open={basicOpen}
        onClose={() => setBasicOpen(false)}
        title="Basic Modal"
        footer={
          <>
            <Button variant="ghost" onClick={() => setBasicOpen(false)}>Cancel</Button>
            <Button onClick={() => setBasicOpen(false)}>Confirm</Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          This is a basic modal dialog using the native &lt;dialog&gt; element.
          Click the backdrop, press Escape, or use the buttons below to close.
        </p>
      </Modal>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="Create Item"
        footer={
          <>
            <Button variant="ghost" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={() => setFormOpen(false)}>Create</Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <Input label="Name" placeholder="Item name..." />
          <Input label="Description" placeholder="Describe the item..." />
          <Input label="Price" type="number" placeholder="0.00" />
        </form>
      </Modal>
    </div>
  );
}

registerExamples({
  id: 'modal',
  title: 'Modal',
  description: 'Native dialog with backdrop, keyboard dismiss & footer slots',
  component: ModalExamples,
});
