import { notFound } from "next/navigation";
import { MenuView } from "@/components/MenuView";
import { ServiceBar } from "@/components/ServiceBar";
import { getDictionary, getLocale } from "@/lib/i18n/dictionary";
import { createAnonClient } from "@/utils/supabase/anon";

export default async function TablePage({ params }: PageProps<"/[lang]/mesa/[code]">) {
  const { code } = await params;
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  const { data } = await createAnonClient().rpc("get_table_public", { p_code: code });
  const table = (data as { number: number; label: string | null }[] | null)?.[0];
  if (!table) notFound();

  return (
    <MenuView
      locale={locale}
      dict={dict}
      path={`/mesa/${encodeURIComponent(code)}`}
      tableLabel={table.label || dict.table.replace("{number}", String(table.number))}
      footer={<ServiceBar code={code} labels={dict.service} />}
    />
  );
}
