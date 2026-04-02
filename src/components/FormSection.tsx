import { ReactNode } from "react";


type FormSectionProps = {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  onRemove?: (() => void) | null;
};

function FormSection({ title, children, actions, onRemove }: FormSectionProps) {
  return (
    <section className="app-glass rounded-xl border border-blue-100/80 p-4 shadow-md shadow-blue-100/40">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">{title}</h3>
          {onRemove && (
            <button
              type="button"
              aria-label="Hide section"
              className="ml-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600 hover:bg-red-200"
              onClick={onRemove}
            >
              ×
            </button>
          )}
        </div>
        {actions}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export default FormSection;
