"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  PENDING_SELECT,
  toPendingRequests,
  type PendingRequest,
} from "@/lib/admin/requests";
import { serviceTypeLabelEs } from "@/lib/service";

const POLL_MS = 30_000;

function elapsed(from: string, now: number) {
  const minutes = Math.max(0, Math.floor((now - new Date(from).getTime()) / 60_000));
  if (minutes < 1) return "ahora mismo";
  if (minutes < 60) return `hace ${minutes} min`;
  return `hace ${Math.floor(minutes / 60)} h ${minutes % 60} min`;
}

function beep(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = 880;
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.5);
}

export function LiveRequests({ initial }: { initial: PendingRequest[] }) {
  const supabase = useMemo(() => createClient(), []);
  const [requests, setRequests] = useState(initial);
  const [now, setNow] = useState(() => Date.now());
  const [live, setLive] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);
  const soundRef = useRef(false);

  const refetch = useCallback(async () => {
    const { data } = await supabase
      .from("service_requests")
      .select(PENDING_SELECT)
      .eq("status", "pending")
      .order("created_at", { ascending: true });
    if (data) setRequests(toPendingRequests(data));
    setNow(Date.now());
  }, [supabase]);

  useEffect(() => {
    const channel = supabase
      .channel("service-requests")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "service_requests" },
        (payload) => {
          if (payload.eventType === "INSERT" && soundRef.current && audioRef.current) {
            beep(audioRef.current);
          }
          void refetch();
        },
      )
      .subscribe((status) => setLive(status === "SUBSCRIBED"));

    // Respaldo por si se pierde la conexión en tiempo real; también actualiza "hace X min".
    const poll = setInterval(() => void refetch(), POLL_MS);
    return () => {
      clearInterval(poll);
      void supabase.removeChannel(channel);
    };
  }, [supabase, refetch]);

  function toggleSound() {
    // El navegador exige un gesto del usuario para reproducir audio.
    if (!audioRef.current) audioRef.current = new AudioContext();
    const next = !soundOn;
    soundRef.current = next;
    setSoundOn(next);
    if (next) beep(audioRef.current);
  }

  async function attend(id: string) {
    setRequests((prev) => prev.filter((r) => r.id !== id)); // optimista
    const { error } = await supabase
      .from("service_requests")
      .update({ status: "done", attended_at: new Date().toISOString() })
      .eq("id", id);
    if (error) void refetch();
  }

  return (
    <section aria-labelledby="live-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 id="live-title" className="font-serif text-3xl font-semibold text-primary">
            Solicitudes
          </h1>
          <span
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              live ? "bg-primary-fixed text-primary-container" : "bg-error-container text-error"
            }`}
          >
            <span className={`size-2 rounded-full ${live ? "bg-primary-container" : "bg-error"}`} />
            {live ? "En vivo" : "Reconectando…"}
          </span>
        </div>
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={soundOn}
          className={`h-10 rounded-lg px-4 text-sm font-semibold transition-colors ${
            soundOn
              ? "bg-primary-container text-surface"
              : "border-[1.5px] border-primary-container text-primary-container hover:bg-surface-container"
          }`}
        >
          {soundOn ? "Sonido activado" : "Activar sonido"}
        </button>
      </div>

      {requests.length === 0 ? (
        <p className="mt-10 rounded-lg bg-surface-container-lowest p-10 text-center text-on-surface-variant">
          Sin solicitudes pendientes. Todo atendido ✓
        </p>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map((r) => {
            const urgent = r.type === "bill" || r.type === "waiter";
            return (
              <li
                key={r.id}
                className="flex items-center justify-between gap-3 rounded-lg bg-surface-container-lowest p-4 shadow-[0_2px_16px_rgba(28,67,47,0.06)]"
              >
                <div className="min-w-0">
                  <p className="font-serif text-2xl font-semibold text-primary">
                    {r.table.label || `Mesa ${r.table.number}`}
                  </p>
                  <p className={`text-sm font-semibold ${urgent ? "text-secondary" : "text-on-surface"}`}>
                    {serviceTypeLabelEs[r.type]}
                  </p>
                  <p className="text-xs text-on-surface-variant">{elapsed(r.created_at, now)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => void attend(r.id)}
                  className="h-12 shrink-0 rounded-lg bg-primary-container px-4 text-sm font-semibold text-surface hover:bg-primary"
                >
                  Atender
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
