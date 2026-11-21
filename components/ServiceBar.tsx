"use client";

import { useState, useTransition } from "react";
import { requestService } from "@/app/[lang]/mesa/[code]/actions";
import { serviceTypes, type ServiceType } from "@/lib/service";

interface Labels {
  title: string;
  sent: string;
  sentMessage: string;
  errorMessage: string;
  waiter: string;
  bill: string;
  water: string;
  napkins: string;
}

/** Tiempo que el botón queda en "Enviado" antes de poder repetir la solicitud. */
const COOLDOWN_MS = 60_000;

export function ServiceBar({ code, labels }: { code: string; labels: Labels }) {
  const [sent, setSent] = useState<Set<ServiceType>>(new Set());
  const [error, setError] = useState(false);
  const [pending, startTransition] = useTransition();

  function send(type: ServiceType) {
    setError(false);
    startTransition(async () => {
      const result = await requestService(code, type);
      if (result === "created" || result === "already_pending") {
        setSent((prev) => new Set(prev).add(type));
        setTimeout(() => {
          setSent((prev) => {
            const next = new Set(prev);
            next.delete(type);
            return next;
          });
        }, COOLDOWN_MS);
      } else {
        setError(true);
      }
    });
  }

  const primary = serviceTypes.slice(0, 2);
  const secondary = serviceTypes.slice(2);

  const button = (type: ServiceType, kind: "primary" | "secondary") => {
    const done = sent.has(type);
    return (
      <button
        key={type}
        type="button"
        disabled={done || pending}
        onClick={() => send(type)}
        className={`h-12 rounded-lg px-3 text-sm font-semibold transition-colors disabled:cursor-default ${
          done
            ? "bg-primary-fixed text-primary-container"
            : kind === "primary"
              ? "bg-primary-container text-surface hover:bg-primary active:bg-primary disabled:opacity-60"
              : "border-[1.5px] border-primary-container text-primary-container hover:bg-surface-container disabled:opacity-60"
        }`}
      >
        {done ? `✓ ${labels.sent}` : labels[type]}
      </button>
    );
  };

  return (
    <aside
      aria-label={labels.title}
      className="fixed inset-x-0 bottom-0 z-40 bg-surface/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_16px_rgba(28,67,47,0.08)] backdrop-blur-md"
    >
      <div className="mx-auto max-w-300 px-4 py-3 md:px-10">
        <p role="status" className="min-h-4 pb-1 text-center text-xs font-medium">
          {error ? (
            <span className="text-error">{labels.errorMessage}</span>
          ) : sent.size > 0 ? (
            <span className="text-primary-container">{labels.sentMessage}</span>
          ) : null}
        </p>
        <div className="grid grid-cols-2 gap-2 md:mx-auto md:max-w-xl">
          {primary.map((type) => button(type, "primary"))}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 md:mx-auto md:max-w-xl">
          {secondary.map((type) => button(type, "secondary"))}
        </div>
      </div>
    </aside>
  );
}
