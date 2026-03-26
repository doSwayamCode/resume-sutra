import { ReactNode } from "react";

type FormSectionProps = {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
};

function FormSection({ title, children, actions }: FormSectionProps) {
  return (
    <section className="app-glass rounded-xl border border-blue-100/80 p-4 shadow-md shadow-blue-100/40">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">{title}</h3>
        {actions}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export default FormSection;
