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

const L = (es: string, en: string, fr: string): Localized => ({ es, en, fr });
/** Mismo texto en los tres idiomas (nombres propios). */
const same = (text: string): Localized => L(text, text, text);

export const menu: MenuCategory[] = [
  {
    id: "entradas",
    name: L("Entradas", "Starters", "Entrées"),
    items: [
      {
        id: "ceviche-chicharron",
        price: 25000,
        name: L("Ceviche de Chicharrón", "Pork Rind Ceviche", "Ceviche de Couenne Croustillante"),
      },
      {
        id: "chorizo-arepa-hogao",
        price: 15000,
        name: L(
          "Chorizo con Arepa y Hogao",
          "Sausage with Arepa and Hogao",
          "Saucisse avec Arepa et Hogao",
        ),
      },
      {
        id: "ceviche-camaron",
        price: 27000,
        name: L("Ceviche de Camarón", "Shrimp Ceviche", "Ceviche de Crevettes"),
      },
      {
        id: "patacon-guacamole",
        price: 15000,
        name: L(
          "Patacón con Guacamole",
          "Patacón (Fried Plantain) with Guacamole",
          "Patacón (Banane Plantain Frite) au Guacamole",
        ),
      },
      {
        id: "morcilla-arepa-hogao",
        price: 17000,
        name: L(
          "Morcilla con Arepa y Hogao",
          "Blood Sausage with Arepa and Hogao",
          "Boudin Noir avec Arepa et Hogao",
        ),
      },
    ],
  },
  {
    id: "desayunos",
    name: L("Desayunos", "Breakfast", "Petits-déjeuners"),
    items: [
      {
        id: "calentao",
        price: 20000,
        name: same("Calentao"),
        details: L(
          "Res, Cerdo, Chorizo o Chicharrón (mismo precio)",
          "Beef, Pork, Sausage or Pork Rind (same price)",
          "Bœuf, Porc, Saucisse ou Couenne Croustillante (même prix)",
        ),
      },
      {
        id: "desayuno-americano",
        price: 15000,
        name: L("Desayuno Americano", "American Breakfast", "Petit-déjeuner Américain"),
        details: L(
          "Huevos al gusto, Salchicha, Jugo de Naranja, Arepa, Quesito",
          "Eggs any style, Sausage, Orange Juice, Arepa, Quesito (fresh cheese)",
          "Œufs au choix, Saucisse, Jus d'Orange, Arepa, Quesito (fromage frais)",
        ),
      },
      {
        id: "arepa-quesito-chocolate",
        price: 12000,
        name: L(
          "Arepa, Quesito, Chocolate",
          "Arepa, Cheese and Hot Chocolate",
          "Arepa, Fromage Frais et Chocolat Chaud",
        ),
      },
    ],
  },
  {
    id: "tipicos",
    name: L("Típicos", "Traditional Dishes", "Plats Typiques"),
    image: {
      src: bandejaPaisaImg,
      alt: L(
        "Bandeja paisa servida sobre mesa de madera",
        "Bandeja paisa served on a wooden table",
        "Bandeja paisa servie sur une table en bois",
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
          "Haricots, Riz, Salade, Œuf, Arepa, Saucisse, Tranche de Banane Plantain Mûre, Couenne Croustillante, Bœuf Haché, Avocat",
        ),
      },
      {
        id: "cazuela-frijoles",
        price: 38000,
        name: L("Cazuela de Frijoles", "Bean Casserole", "Cassolette de Haricots"),
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
          "Bœuf, Porc, Poulet, Couenne Croustillante, Saucisse, Frites",
        ),
      },
      {
        id: "picada-dos",
        price: 75000,
        name: L("Picada para Dos", "Sharing Platter for Two", "Plateau à Partager pour Deux"),
      },
      {
        id: "picada-cuatro",
        price: 135000,
        name: L("Picada para Cuatro", "Sharing Platter for Four", "Plateau à Partager pour Quatre"),
      },
    ],
  },
  {
    id: "sancochos",
    name: L("Sancochos", "Hearty Soups", "Soupes et Sancochos"),
    items: [
      {
        id: "mondongo",
        price: 33000,
        name: L("Mondongo", "Mondongo (Tripe Soup)", "Mondongo (Soupe de Tripes)"),
      },
      {
        id: "sancocho-gallina",
        price: 33000,
        name: L("Sancocho de Gallina", "Hen Sancocho Stew", "Sancocho de Poule"),
      },
      {
        id: "ajiaco",
        price: 35000,
        name: L(
          "Ajiaco",
          "Ajiaco (Chicken and Potato Soup)",
          "Ajiaco (Soupe de Poulet et Pommes de Terre)",
        ),
      },
    ],
  },
  {
    id: "parrilla",
    name: L("Parrilla", "Grill", "Grillades"),
    image: {
      src: babyBeefImg,
      alt: L(
        "Corte de res a las brasas sobre la parrilla",
        "Beef cut over hot coals on the grill",
        "Pièce de bœuf sur la braise du gril",
      ),
    },
    note: L(
      "Acompañados de Papas a la Francesa, Chimichurri, Aguacate y Arepa con Mozzarella",
      "Served with French Fries, Chimichurri, Avocado and Arepa with Mozzarella",
      "Servis avec Frites, Chimichurri, Avocat et Arepa à la Mozzarella",
    ),
    items: [
      { id: "filet-mignon", price: 68000, name: same("Filet Mignon") },
      {
        id: "punta-de-anca",
        price: 58000,
        name: L("Punta de Anca", "Punta de Anca (Tri-Tip)", "Punta de Anca (Aiguillette de Rumsteck)"),
      },
      { id: "churrasco", price: 58000, name: same("Churrasco") },
      { id: "baby-beef", price: 65000, name: same("Baby Beef") },
      {
        id: "costillas-bbq",
        price: 63000,
        name: L("Costillas BBQ", "BBQ Ribs", "Travers de Porc BBQ"),
      },
    ],
  },
  {
    id: "pescados",
    name: L("Pescados", "Fish", "Poissons"),
    items: [
      {
        id: "trucha-guatapense",
        price: 60000,
        name: L("Trucha Guatapense", "Guatapé-style Trout", "Truite à la Mode de Guatapé"),
      },
      {
        id: "trucha-frita",
        price: 38000,
        name: L("Trucha Frita", "Fried Trout", "Truite Frite"),
      },
      {
        id: "trucha-ajillo",
        price: 38000,
        name: L("Trucha al Ajillo", "Garlic Trout", "Truite à l'Ail"),
      },
      {
        id: "salmon-guatapense",
        price: 70000,
        name: L("Salmón Guatapense", "Guatapé-style Salmon", "Saumon à la Mode de Guatapé"),
      },
      {
        id: "salmon-parrilla",
        price: 60000,
        name: L("Salmón a la Parrilla", "Grilled Salmon", "Saumon Grillé"),
      },
      {
        id: "salmon-ajillo",
        price: 60000,
        name: L("Salmón al Ajillo", "Garlic Salmon", "Saumon à l'Ail"),
      },
    ],
  },
  {
    id: "pollo",
    name: L("Pollo", "Chicken", "Poulet"),
    note: L(
      "Acompañados de Papas a la Francesa, Ensalada y Patacón",
      "Served with French Fries, Salad and Patacón (Fried Plantain)",
      "Servis avec Frites, Salade et Patacón (Banane Plantain Frite)",
    ),
    items: [
      {
        id: "pechuga-champinones",
        price: 55000,
        name: L(
          "Pechuga en Salsa de Champiñones",
          "Chicken Breast in Mushroom Sauce",
          "Blanc de Poulet Sauce aux Champignons",
        ),
      },
      {
        id: "pechuga-gratinada",
        price: 55000,
        name: L("Pechuga Gratinada", "Chicken Breast au Gratin", "Blanc de Poulet Gratiné"),
      },
      {
        id: "pechuga-milanesa",
        price: 38000,
        name: L("Pechuga a la Milanesa", "Breaded Chicken Breast", "Blanc de Poulet Pané"),
      },
      {
        id: "pechuga-plancha",
        price: 38000,
        name: L("Pechuga a la Plancha", "Grilled Chicken Breast", "Blanc de Poulet à la Plancha"),
      },
      {
        id: "pechuga-camarones",
        price: 58000,
        name: L(
          "Pechuga en Camarones",
          "Chicken Breast with Shrimp",
          "Blanc de Poulet aux Crevettes",
        ),
      },
    ],
  },
];
