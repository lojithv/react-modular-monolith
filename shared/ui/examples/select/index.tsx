import { Select } from '../../index.ts';
import { registerExamples } from '../registry.ts';

function SelectExamples() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Select
        label="Category"
        placeholder="Choose a category..."
        options={[
          { value: 'electronics', label: 'Electronics' },
          { value: 'furniture', label: 'Furniture' },
          { value: 'clothing', label: 'Clothing' },
        ]}
      />
      <Select
        label="With Error"
        error="Selection is required"
        options={[
          { value: 'opt1', label: 'Option 1' },
          { value: 'opt2', label: 'Option 2' },
        ]}
      />
    </div>
  );
}

registerExamples({
  id: 'select',
  title: 'Select',
  description: 'Dropdown with placeholder, options array & error state',
  component: SelectExamples,
});
