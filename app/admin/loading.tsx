export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="grid min-h-dvh place-items-center">
      <div className="size-8 animate-spin rounded-full border-2 border-primary-container/20 border-t-primary-container" />
    </div>
  );
}
