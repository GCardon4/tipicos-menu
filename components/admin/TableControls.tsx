"use client";

import { useActionState, useRef } from "react";
import {
  createTable,
  deleteTable,
  type TableFormState,
} from "@/app/admin/(panel)/mesas/actions";

const input =
  "h-11 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20";

export function NewTableForm({ nextNumber }: { nextNumber: number }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState<TableFormState, FormData>(
    async (prev, formData) => {
      const result = await createTable(prev, formData);
      if (result?.ok) formRef.current?.reset();
      return result;
    },
    undefined,
  );

  return (
    <form ref={formRef} action={action} className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Número
        <input
          key={nextNumber}
          name="number"
          type="number"
          min={1}
          max={9999}
          required
          defaultValue={nextNumber}
          className={`${input} w-24`}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Nombre (opcional)
        <input name="label" maxLength={40} placeholder="Terraza 1" className={`${input} w-48`} />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="h-11 rounded-lg bg-primary-container px-5 font-semibold text-surface hover:bg-primary disabled:opacity-60"
      >
        {pending ? "Creando…" : "Crear mesa"}
      </button>
      <p role="alert" className="w-full text-sm text-error">
        {state?.error}
      </p>
    </form>
  );
}

export function DeleteTableButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteTable.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm(`¿Eliminar ${name}? Su QR dejará de funcionar y se borrará su historial.`)) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="h-9 rounded-lg px-3 text-sm font-semibold text-error hover:bg-error-container">
        Eliminar
      </button>
    </form>
  );
}

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="h-11 rounded-lg border-[1.5px] border-primary-container px-5 font-semibold text-primary-container hover:bg-surface-container print:hidden"
    >
      Imprimir QR
    </button>
  );
}
