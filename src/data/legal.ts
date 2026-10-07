/**
 * Datos del titular de la web para los textos legales. ÚNICO sitio donde rellenarlos.
 * Mientras un campo esté vacío, la web muestra una marca [pendiente] en su lugar.
 * Umotion lo forman cuatro socios: si aún no hay sociedad constituida, la asesoría debe indicar
 * quién figura como titular (por ejemplo, uno de los socios como autónomo o una comunidad de bienes).
 */
export const titular = {
  /** Razón social (p. ej. «Umotion Zaragoza, S.L.») o nombre y apellidos del titular. */
  nombre: "Hugo Velilla Sánchez",
  /** NIF o CIF. */
  nif: "73159497Q",
  /** Calle, número y código postal (la ciudad se añade sola). */
  domicilio: "C/ García Arista, 19, 6.º C, 50015",
  /** Solo sociedades: «Registro Mercantil de Zaragoza, tomo …, folio …, hoja …». Vacío si no aplica. */
  registro: "",
  /** true si el titular es una sociedad inscrita (muestra la línea de datos registrales). */
  esSociedad: false,
};
