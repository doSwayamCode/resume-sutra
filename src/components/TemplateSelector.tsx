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
        <option value="dtu-placement">DTU Placement Style</option>
        <option value="nsut-placement">NSUT Placement Style</option>
        <option value="iit-placement">IIT Placement Style</option>
        <option value="nit-placement">NIT Placement Style</option>
        <option value="iiit-placement">IIIT Placement Style</option>
        <option value="iisc-academic">IISc Academic Style</option>
        <option value="igdtuw-placement">IGDTUW Placement Style</option>
        <option value="bits-placement">BITS Placement Style</option>
        <option value="iim-management">IIM Management Style</option>
        <option value="ggsipu-placement">GGSIPU Placement Style</option>
        <option value="ca-professional">CA Professional Style</option>
      </select>
      <p className="mt-2 text-xs text-slate-600">ATS-first templates, including institute-inspired Indian campus placement styles.</p>
    </div>
  );
}

export default TemplateSelector;
