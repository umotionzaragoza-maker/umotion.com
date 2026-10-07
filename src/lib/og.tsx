import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";

export const tamanoOG = { width: 1200, height: 630 };

const raiz = process.cwd();
const fuente = (f: string) => readFile(join(raiz, "src/assets/fuentes", f));
const marca = async (f: string) => `data:image/png;base64,${(await readFile(join(raiz, "src/assets/marca", f))).toString("base64")}`;

/** Ilustración local reducida a JPEG ligero en data URL (se ejecuta en build). */
async function fotoDataUrl(archivo: string) {
  const buf = await sharp(join(raiz, "src/assets/fotos", archivo)).resize(560, 630, { fit: "cover", position: "right" }).jpeg({ quality: 80 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

/**
 * Tarjeta de compartir (WhatsApp, redes, buscadores): tinta, logotipo, titular con remate en cursiva
 * y una ilustración de la marca a la derecha.
 */
export async function imagenOG({ titulo, remate, antetitulo, pie, foto = "heroe.jpg" }: { titulo: string; remate?: string; antetitulo: string; pie?: string; foto?: string }) {
  const [italica, sans, logo, img] = await Promise.all([
    fuente("fraunces-italica.ttf"),
    fuente("instrument-sans-600.ttf"),
    marca("logo-claro.png"),
    fotoDataUrl(foto),
  ]);
  const largo = (titulo + (remate ?? "")).length > 34;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#080a14", color: "#eef1f7" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "60px 56px", width: 640 }}>
          <img src={logo} height={44} width={177} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "Instrument", fontSize: 20, letterSpacing: 4, textTransform: "uppercase", color: "#35c8ff" }}>{antetitulo}</span>
            <div style={{ display: "flex", flexWrap: "wrap", marginTop: 20, fontSize: largo ? 56 : 70, lineHeight: 1.02, letterSpacing: -2 }}>
              <span style={{ fontFamily: "Instrument" }}>{titulo}</span>
              {remate && <span style={{ fontFamily: "Fraunces Italica", fontStyle: "italic", color: "#35c8ff", marginLeft: 14 }}>{remate}</span>}
            </div>
          </div>
          <span style={{ fontFamily: "Instrument", fontSize: 22, color: "#a3acc4" }}>{pie ?? "Zaragoza · En tu negocio o por videollamada"}</span>
        </div>
        <img src={img} width={560} height={630} alt="" style={{ objectFit: "cover" }} />
      </div>
    ),
    {
      ...tamanoOG,
      fonts: [
        { name: "Fraunces Italica", data: italica, style: "italic", weight: 400 },
        { name: "Instrument", data: sans, style: "normal", weight: 600 },
      ],
    },
  );
}
