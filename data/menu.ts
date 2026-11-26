import type { StaticImageData } from "next/image";
import type { Locale } from "@/lib/i18n/config";
import babyBeefImg from "@/public/images/baby-beef.png";
import bandejaPaisaImg from "@/public/images/bandeja-paisa.png";

export type Localized = Record<Locale, string>;

export interface MenuItem {
  id: string;
  /** Precio en COP, sin formato. */
  price: number;
  name: Localized;
  /** Ingredientes u opciones del plato. */
  details?: Localized;
}

export interface MenuCategory {
  id: string;
  name: Localized;
  /** Nota común a toda la categoría (ej. acompañamientos). */
  note?: Localized;
  /** Foto de portada de la sección (solo si muestra un plato real de la carta). */
  image?: { src: StaticImageData; alt: Localized };
  items: MenuItem[];
}

const L = (es: string, en: string, pt: string): Localized => ({ es, en, pt });
/** Mismo texto en los tres idiomas (nombres propios). */
const same = (text: string): Localized => L(text, text, text);

export const menu: MenuCategory[] = [
  {
    id: "entradas",
    name: L("Entradas", "Starters", "Entradas"),
    items: [
      {
        id: "ceviche-chicharron",
        price: 25000,
        name: L("Ceviche de Chicharrón", "Pork Rind Ceviche", "Ceviche de Torresmo"),
      },
      {
        id: "chorizo-arepa-hogao",
        price: 15000,
        name: L(
          "Chorizo con Arepa y Hogao",
          "Sausage with Arepa and Hogao",
          "Linguiça com Arepa e Hogao",
        ),
      },
      {
        id: "ceviche-camaron",
        price: 27000,
        name: L("Ceviche de Camarón", "Shrimp Ceviche", "Ceviche de Camarão"),
      },
      {
        id: "patacon-guacamole",
        price: 15000,
        name: L(
          "Patacón con Guacamole",
          "Patacón (Fried Plantain) with Guacamole",
          "Patacón (Banana-da-terra Frita) com Guacamole",
        ),
      },
      {
        id: "morcilla-arepa-hogao",
        price: 17000,
        name: L(
          "Morcilla con Arepa y Hogao",
          "Blood Sausage with Arepa and Hogao",
          "Morcela com Arepa e Hogao",
        ),
      },
    ],
  },
  {
    id: "desayunos",
    name: L("Desayunos", "Breakfast", "Café da Manhã"),
    items: [
      {
        id: "calentao",
        price: 20000,
        name: same("Calentao"),
        details: L(
          "Res, Cerdo, Chorizo o Chicharrón (mismo precio)",
          "Beef, Pork, Sausage or Pork Rind (same price)",
          "Carne Bovina, Porco, Linguiça ou Torresmo (mesmo preço)",
        ),
      },
      {
        id: "desayuno-americano",
        price: 15000,
        name: L("Desayuno Americano", "American Breakfast", "Café da Manhã Americano"),
        details: L(
          "Huevos al gusto, Salchicha, Jugo de Naranja, Arepa, Quesito",
          "Eggs any style, Sausage, Orange Juice, Arepa, Quesito (fresh cheese)",
          "Ovos ao gosto, Salsicha, Suco de Laranja, Arepa, Quesito (queijo fresco)",
        ),
      },
      {
        id: "arepa-quesito-chocolate",
        price: 12000,
        name: L(
          "Arepa, Quesito, Chocolate",
          "Arepa, Cheese and Hot Chocolate",
          "Arepa, Queijo e Chocolate Quente",
        ),
      },
    ],
  },
  {
    id: "tipicos",
    name: L("Típicos", "Traditional Dishes", "Pratos Típicos"),
    image: {
      src: bandejaPaisaImg,
      alt: L(
        "Bandeja paisa servida sobre mesa de madera",
        "Bandeja paisa served on a wooden table",
        "Bandeja paisa servida em mesa de madeira",
      ),
    },
    items: [
      {
        id: "bandeja-paisa",
        price: 38000,
        name: same("Bandeja Paisa"),
        details: L(
          "Frijoles, Arroz, Ensalada, Huevo, Arepa, Chorizo, Tajada de Maduro, Chicharrón, Carne Molida, Aguacate",
          "Beans, Rice, Salad, Egg, Arepa, Sausage, Sweet Plantain Slice, Pork Rind, Ground Beef, Avocado",
          "Feijão, Arroz, Salada, Ovo, Arepa, Linguiça, Fatia de Banana-da-terra Madura, Torresmo, Carne Moída, Abacate",
        ),
      },
      {
        id: "cazuela-frijoles",
        price: 38000,
        name: L("Cazuela de Frijoles", "Bean Casserole", "Cazuela de Feijão"),
      },
    ],
  },
  {
    id: "premium",
    name: same("Premium"),
    items: [
      {
        id: "parrilla-el-toro",
        price: 60000,
        name: same("Parrilla El Toro"),
        details: L(
          "Res, Cerdo, Pollo, Chicharrón, Chorizo, Papas Fritas",
          "Beef, Pork, Chicken, Pork Rind, Sausage, French Fries",
          "Carne Bovina, Porco, Frango, Torresmo, Linguiça, Batata Frita",
        ),
      },
      {
        id: "picada-dos",
        price: 75000,
        name: L("Picada para Dos", "Sharing Platter for Two", "Picada para Dois"),
      },
      {
        id: "picada-cuatro",
        price: 135000,
        name: L("Picada para Cuatro", "Sharing Platter for Four", "Picada para Quatro"),
      },
    ],
  },
  {
    id: "sancochos",
    name: L("Sancochos", "Hearty Soups", "Sopas e Sancochos"),
    items: [
      {
        id: "mondongo",
        price: 33000,
        name: L("Mondongo", "Mondongo (Tripe Soup)", "Mondongo (Sopa de Dobradinha)"),
      },
      {
        id: "sancocho-gallina",
        price: 33000,
        name: L("Sancocho de Gallina", "Hen Sancocho Stew", "Sancocho de Galinha"),
      },
      {
        id: "ajiaco",
        price: 35000,
        name: L(
          "Ajiaco",
          "Ajiaco (Chicken and Potato Soup)",
          "Ajiaco (Sopa de Frango e Batata)",
        ),
      },
    ],
  },
  {
    id: "parrilla",
    name: L("Parrilla", "Grill", "Grelhados"),
    image: {
      src: babyBeefImg,
      alt: L(
        "Corte de res a las brasas sobre la parrilla",
        "Beef cut over hot coals on the grill",
        "Corte bovino na brasa sobre a grelha",
      ),
    },
    note: L(
      "Acompañados de Papas a la Francesa, Chimichurri, Aguacate y Arepa con Mozzarella",
      "Served with French Fries, Chimichurri, Avocado and Arepa with Mozzarella",
      "Acompanhados de Batata Frita, Chimichurri, Abacate e Arepa com Mussarela",
    ),
    items: [
      { id: "filet-mignon", price: 68000, name: same("Filet Mignon") },
      {
        id: "punta-de-anca",
        price: 58000,
        name: L("Punta de Anca", "Punta de Anca (Tri-Tip)", "Ponta de Anca (Maminha)"),
      },
      { id: "churrasco", price: 58000, name: same("Churrasco") },
      { id: "baby-beef", price: 65000, name: same("Baby Beef") },
      {
        id: "costillas-bbq",
        price: 63000,
        name: L("Costillas BBQ", "BBQ Ribs", "Costelas BBQ"),
      },
    ],
  },
];
