import { MenuView } from "@/components/MenuView";
import { getDictionary, getLocale } from "@/lib/i18n/dictionary";

export default async function MenuPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  return <MenuView locale={locale} dict={dict} />;
}
