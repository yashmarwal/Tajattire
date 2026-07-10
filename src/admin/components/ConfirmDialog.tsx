interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open, title, message,
  confirmText = "Delete", danger = true, loading = false,
  onConfirm, onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-[#1A1A1A] border border-[rgba(201,168,76,0.2)] p-6 w-full max-w-sm shadow-2xl">
        <h3 className="text-[#F8F6F1] font-medium text-base mb-2">{title}</h3>
        <p className="text-[rgba(248,246,241,0.55)] text-sm leading-relaxed mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            id="confirm-cancel"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2 text-xs text-[rgba(248,246,241,0.6)] border border-[rgba(255,255,255,0.1)] hover:border-white hover:text-[#F8F6F1] transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            id="confirm-ok"
            onClick={onConfirm}
            disabled={loading}
            className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-40 ${
              danger
                ? "bg-red-600 text-white hover:bg-red-500"
                : "bg-[#C9A84C] text-[#0A0A0A] hover:bg-[#D4B55A]"
            }`}
          >
            {loading ? "…" : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
