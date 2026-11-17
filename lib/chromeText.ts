/**
 * Translations for the static site chrome (header + footer), whose English text
 * lives in lib/siteConfig.ts. Each dictionary is keyed by the English string, so
 * adding a language is one new map below, and any string without an entry simply
 * falls back to English. Brand and product names (MyBlock, Spruce, Emerald Card…)
 * are deliberately left out so they stay untranslated.
 *
 * CMS-authored page content is translated in the CMS, not here.
 */
import { localizePath } from './locales';

const ES: Record<string, string> = {
  // Header
  'Taxes': 'Impuestos',
  'Financial products': 'Productos financieros',
  'Business services': 'Servicios para empresas',
  'Tools and resources': 'Herramientas y recursos',
  'Find an office': 'Encuentre una oficina',
  'Search': 'Buscar',
  'Sign in to': 'Inicie sesión en',
  'Menu': 'Menú',

  // Footer: support row
  'Need support?': '¿Necesita ayuda?',
  'Customer help': 'Ayuda al cliente',

  // Footer: Tax Services
  'Tax Services': 'Servicios de impuestos',
  'Reschedule or manage appointment': 'Reprograme o administre su cita',
  'Online tax filing': 'Declaración de impuestos en línea',
  'File with a tax pro': 'Declare con un experto en impuestos',
  'Free online tax filing': 'Declaración de impuestos en línea gratis',
  'Tax software': 'Software de impuestos',
  'Second Look Review': 'Revisión Second Look',
  'Audit & Tax Notice Support': 'Apoyo con auditorías y avisos de impuestos',
  'Expat tax services': 'Servicios de impuestos para expatriados',

  // Footer: Small Business Services
  'Small Business Services': 'Servicios para pequeñas empresas',
  'Small business taxes': 'Impuestos para pequeñas empresas',
  'Small business bookkeeping': 'Contabilidad para pequeñas empresas',
  'Small business payroll': 'Nómina para pequeñas empresas',
  'Business formation services': 'Servicios de constitución de empresas',

  // Footer: Tax Tools
  'Tax Tools': 'Herramientas de impuestos',
  'Tax calculator': 'Calculadora de impuestos',
  'Tax prep checklist': 'Lista de verificación para preparar impuestos',
  'Appointment Prep Guide': 'Guía para preparar su cita',
  'Refund & payment options': 'Opciones de reembolso y pago',
  'Tax payment center': 'Centro de pago de impuestos',
  "Where's my refund?": '¿Dónde está mi reembolso?',
  'W-4 calculator': 'Calculadora del W-4',

  // Footer: Legal
  'Terms': 'Términos',
  'Privacy notice': 'Aviso de privacidad',
  'Manage Cookie Settings': 'Administrar configuración de cookies',
  'Pathward privacy notice': 'Aviso de privacidad de Pathward',

  // Footer: Financial Services
  'Financial Services': 'Servicios financieros',
  'Explore loans': 'Explore préstamos',
  'Refund Transfer': 'Transferencia de reembolso',
  'Refund Advance': 'Adelanto de reembolso',

  // Footer: Resources
  'Resources': 'Recursos',
  'Customer help & support': 'Ayuda y soporte al cliente',
  'Tax questions': 'Preguntas sobre impuestos',
  'Office locations': 'Ubicaciones de oficinas',
  'International locations': 'Ubicaciones internacionales',
  'Sitemap': 'Mapa del sitio',

  // Footer: About
  'About H&R Block': 'Acerca de H&R Block',
  'About us': 'Acerca de nosotros',
  'Careers': 'Empleos',
  'Buy or sell an office': 'Compre o venda una oficina',
  'Income tax course': 'Curso de impuestos',
  'News Center': 'Centro de noticias',
  'Investor relations': 'Relaciones con inversionistas',
  'Guarantees': 'Garantías',

  // Footer: bottom bar
  'Copyright © 2026 HRB Digital LLC. All Rights Reserved.':
    'Copyright © 2026 HRB Digital LLC. Todos los derechos reservados.',
  'Your Privacy Choices': 'Sus opciones de privacidad',
};

/** Dictionaries by base language ("es" also serves "es-MX"). */
const DICTIONARIES: Record<string, Record<string, string>> = { es: ES };

export type Translate = (text: string) => string;

/** Translator for a locale key; unknown locales and missing strings return the English text. */
export function getTranslator(locale?: string): Translate {
  const dict = locale ? DICTIONARIES[locale.split('-')[0]] : undefined;
  return dict ? (text) => dict[text] ?? text : (text) => text;
}

/** Keep internal links ("/…") inside the current locale; "#" and external links pass through. */
export function localizeHref(href: string, locale?: string): string {
  return locale && href.startsWith('/') ? localizePath(href, locale) : href;
}
