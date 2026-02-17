import { useState } from 'react';
import { Input } from '../../index.ts';
import { registerExamples } from '../registry.ts';

function InputExamples() {
  const [value, setValue] = useState('');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        label="Default Input"
        placeholder="Type something..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Input
        label="With Error"
        defaultValue="bad-email"
        error="Please enter a valid email address"
      />
      <Input label="Disabled" placeholder="Can't edit this" disabled />
      <Input label="Password" type="password" placeholder="Enter password" />
    </div>
  );
}

registerExamples({
  id: 'input',
  title: 'Input',
  description: 'Text input with label, error, disabled & password variants',
  component: InputExamples,
});
