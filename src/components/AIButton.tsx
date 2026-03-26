type AIButtonProps = {
  label?: string;
  loading?: boolean;
  onClick: () => void;
  disabled?: boolean;
};

function AIButton({ label = "Improve with AI", loading = false, onClick, disabled }: AIButtonProps) {
  return (
    <button
      type="button"
      disabled={loading || disabled}
      onClick={onClick}
      className="rounded-md border border-blue-300 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Thinking..." : `✨ ${label}`}
    </button>
  );
}

export default AIButton;
