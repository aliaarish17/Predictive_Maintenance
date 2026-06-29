function MachineCard({ title, children }) {
  return (
    <div className="bg-[#10151D] border border-[#1E2733] rounded-xl p-5">
      <h3 className="text-slate-100 text-sm font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

export default MachineCard;