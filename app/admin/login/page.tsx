import Image from "next/image";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="mx-auto grid min-h-dvh max-w-sm content-center px-4 py-10">
      <div className="rounded-lg bg-surface-container-lowest p-6 shadow-[0_2px_16px_rgba(28,67,47,0.06)]">
        <Image src="/logotipo.svg" alt="" width={48} height={42} priority className="h-10 w-auto" />
        <h1 className="mt-4 font-serif text-3xl font-semibold text-primary">Panel de administración</h1>
        <LoginForm />
      </div>
    </main>
  );
}
