// src/pages/Prediction/Form.jsx
import { useState } from "react";

const INITIAL_FORM = {
  machine_name: "",
  machine_type: "L",
  air_temperature: 298.1,
  process_temperature: 308.6,
  rotational_speed: 1551,
  torque: 42.8,
  tool_wear: 108,
};

function Form({ onSubmit, loading }) {
  const [form, setForm] = useState(INITIAL_FORM);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit({
      machine_name: form.machine_name || null,
      machine_type: form.machine_type,
      air_temperature: parseFloat(form.air_temperature),
      process_temperature: parseFloat(form.process_temperature),
      rotational_speed: parseFloat(form.rotational_speed),
      torque: parseFloat(form.torque),
      tool_wear: parseFloat(form.tool_wear),
    });
  };

  return (
 
    <div className="bg-[#10151D] border border-[#1E2733] rounded-xl p-5">
        
<div className="col-span-2">
  <label className="block text-slate-400 text-xs uppercase mb-1.5">
    Machine Name <span className="text-slate-500">(optional)</span>
  </label>
  <input
    type="text"
    placeholder="e.g. Lathe Machine 1"
    value={form.machine_name}
    onChange={(e) => handleChange("machine_name", e.target.value)}
    className="w-full bg-[#141A24] border border-[#1E2733] text-slate-100 px-3.5 py-2.5 rounded-lg text-sm"
  />
</div>
      <h3 className="text-slate-100 text-sm font-semibold mb-4">Machine Input</h3>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-slate-400 text-xs uppercase mb-1.5">Machine Type</label>
          <select
            value={form.machine_type}
            onChange={(e) => handleChange("machine_type", e.target.value)}
            className="w-full bg-[#141A24] border border-[#1E2733] text-slate-100 px-3.5 py-2.5 rounded-lg text-sm"
          >
            <option value="L">Type L</option>
            <option value="M">Type M</option>
            <option value="H">Type H</option>
          </select>
        </div>

        <NumberField label="Air Temperature (K)" value={form.air_temperature} onChange={(v) => handleChange("air_temperature", v)} />
        <NumberField label="Process Temperature (K)" value={form.process_temperature} onChange={(v) => handleChange("process_temperature", v)} />
        <NumberField label="Rotational Speed (rpm)" value={form.rotational_speed} onChange={(v) => handleChange("rotational_speed", v)} />
        <NumberField label="Torque (Nm)" value={form.torque} onChange={(v) => handleChange("torque", v)} />
        <NumberField label="Tool Wear (min)" value={form.tool_wear} onChange={(v) => handleChange("tool_wear", v)} />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-cyan-400 text-[#001016] font-semibold py-3 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed hover:bg-cyan-300 transition-colors"
      >
        {loading ? "Predicting..." : "Run Prediction"}
      </button>
    </div>
  );
}

function NumberField({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-slate-400 text-xs uppercase mb-1.5">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#141A24] border border-[#1E2733] text-slate-100 px-3.5 py-2.5 rounded-lg text-sm font-mono"
      />
    </div>
  );
}

export default Form;