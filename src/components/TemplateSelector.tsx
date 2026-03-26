import { ResumeTemplate } from "../store/useResumeStore";

type TemplateSelectorProps = {
  value: ResumeTemplate;
  onChange: (template: ResumeTemplate) => void;
};

function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  return (
    <div className="app-glass rounded-xl border border-emerald-100 p-4 shadow-md shadow-emerald-100/40">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">Template</h3>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as ResumeTemplate)}
        className="field-focus w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      >
        <option value="jake">Jake Resume (Default)</option>
        <option value="classic-logo">Classic With Logo</option>
        <option value="table-edu">Table Education Format</option>
        <option value="modern-clean">Modern Minimal Format</option>
      </select>
      <p className="mt-2 text-xs text-slate-600">Single-column, ATS-first, compact text-only format.</p>
    </div>
  );
}

export default TemplateSelector;
