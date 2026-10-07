import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Icono de la pantalla de inicio en iPhone: la U del logotipo sobre tinta. */
export default async function AppleIcon() {
  const simbolo = `data:image/png;base64,${(await readFile(join(process.cwd(), "src/assets/marca/simbolo.png"))).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: "#080a14" }}>
        <img src={simbolo} width={120} height={110} alt="" />
      </div>
    ),
    size,
  );
}
