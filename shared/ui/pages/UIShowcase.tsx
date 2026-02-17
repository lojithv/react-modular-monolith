import { useState } from 'react';
import { exampleRegistry, type UIExample } from '../examples/index.ts';

export function Component() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const visibleExamples = activeId
    ? exampleRegistry.filter((ex) => ex.id === activeId)
    : exampleRegistry;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">UI Component Library</h1>
        <p className="text-gray-500 mt-1">
          {exampleRegistry.length} components &mdash; shared/ui
        </p>
      </div>

      {/* Filter nav */}
      <nav className="flex flex-wrap gap-2">
        <FilterChip
          label="All"
          active={activeId === null}
          onClick={() => setActiveId(null)}
        />
        {exampleRegistry.map((ex) => (
          <FilterChip
            key={ex.id}
            label={ex.title}
            active={activeId === ex.id}
            onClick={() => setActiveId(activeId === ex.id ? null : ex.id)}
          />
        ))}
      </nav>

      {/* Examples */}
      <div className="space-y-10">
        {visibleExamples.map((example) => (
          <ExampleSection key={example.id} example={example} />
        ))}
      </div>
    </div>
  );
}

function ExampleSection({ example }: { example: UIExample }) {
  const Comp = example.component;

  return (
    <section id={example.id}>
      <div className="border-b border-gray-200 pb-2 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{example.title}</h2>
        <p className="text-sm text-gray-500">{example.description}</p>
      </div>
      <Comp />
    </section>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-full text-sm font-medium transition
        ${active
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }
      `.trim()}
    >
      {label}
    </button>
  );
}
