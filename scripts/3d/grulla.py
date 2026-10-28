# Grulla de Umotion para la web (Blender 5.2).
#
# Una sola hoja de papel (una malla) con «shape keys» que la llevan de plana a grulla:
#   base        hoja plana con los pliegues marcados
#   pliegue_1…4 pliegue rígido real de la base preliminar (cada triángulo conserva su forma)
#   grulla      grulla montada: las 4 esquinas son cabeza, cola y puntas de las alas
#   alas        grulla con las alas bajadas (se mezcla con «grulla» para el aleteo)
# Exporta public/3d/grulla.glb; con «preview», renders de comprobación de cada fase, y con «foto»,
# la imagen fija de respaldo.
#
# Uso:
#   blender -b -P scripts/3d/grulla.py -- public/3d/grulla.glb [preview=carpeta] [foto=ruta.png]
import math
import os
import sys

import bpy

N = 8  # subdivisiones por sector (8 sectores × 64 triángulos)

# Hoja en rombo, en coordenadas (x, z) de la hoja: esquinas a distancia 1 del centro.
ESQUINAS = {'cabeza': (1, 0), 'ala_izq': (0, 1), 'cola': (-1, 0), 'ala_der': (0, -1)}
MEDIOS = {'ci': (.5, .5), 'ti': (-.5, .5), 'td': (-.5, -.5), 'cd': (.5, -.5)}
SECTORES = [('cabeza', 'ci'), ('ala_izq', 'ci'), ('ala_izq', 'ti'), ('cola', 'ti'),
            ('cola', 'td'), ('ala_der', 'td'), ('ala_der', 'cd'), ('cabeza', 'cd')]


def add(a, b): return tuple(x + y for x, y in zip(a, b))
def sc(a, s): return tuple(x * s for x in a)
def lerp(a, b, t): return tuple(x + (y - x) * t for x, y in zip(a, b))
def smooth(e0, e1, x):
    t = min(1, max(0, (x - e0) / (e1 - e0)))
    return t * t * (3 - 2 * t)


def curva(puntos, t):
    """Catmull-Rom por puntos (t, posición), t de 0 a 1."""
    ts = [p[0] for p in puntos]
    ps = [p[1] for p in puntos]
    i = max(0, min(len(ts) - 2, next((k for k in range(len(ts) - 1) if t <= ts[k + 1]), len(ts) - 2)))
    u = (t - ts[i]) / (ts[i + 1] - ts[i])
    p0 = ps[max(0, i - 1)]
    p1, p2 = ps[i], ps[i + 1]
    p3 = ps[min(len(ps) - 1, i + 2)]
    return tuple(
        .5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u ** 3)
        for a, b, c, d in zip(p0, p1, p2, p3))


# ---------- base preliminar: pliegue rígido de un vértice de grado 8 ----------
def base_preliminar(alfa):
    """Direcciones de los pliegues para el ángulo alfa (0 plana, 90° cerrada).
    Las esquinas bajan alfa; los medios bajan beta, de modo que el ángulo de 45° entre
    pliegues vecinos se conserva y cada triángulo de la hoja es rígido."""
    k = math.cos(math.pi / 4)
    A, B = k * math.cos(alfa), math.sin(alfa)
    R = math.hypot(A, B)
    beta = math.atan2(B, A) - math.acos(min(1, k / R))
    return alfa, beta


def punto_base(esq, med, a, b, alfa):
    al, be = base_preliminar(alfa)
    cx, cz = ESQUINAS[esq]
    mx, mz = MEDIOS[med]
    lm = math.hypot(mx, mz)
    dc = (cx * math.cos(al), -math.sin(al), cz * math.cos(al))
    dm = (mx / lm * math.cos(be) * lm, -math.sin(be) * lm, mz / lm * math.cos(be) * lm)
    y0 = .5 * math.sin(alfa)  # sube la pieza para que no se hunda al cerrarse
    return add((0, y0, 0), add(sc(dc, a), sc(dm, b)))


# ---------- grulla ----------
CIMA = (0, .30, 0)  # centro de la hoja: lomo de la grulla, entre las alas
# Los puntos medios de los bordes acaban en la raíz de las alas (delante y detrás).
COSTADO = {'ci': (.42, .25, .09), 'ti': (-.42, .25, .09), 'td': (-.42, .25, -.09), 'cd': (.42, .25, -.09)}
PUNTA_ALA = {False: (-.08, 1.04, 1.08), True: (-.08, -.02, 1.16)}  # alas arriba / abajo


def espina(esq, a, alas_abajo=False):
    """Línea central de cada solapa, del lomo (a=0) a la esquina de la hoja (a=1)."""
    if esq == 'cabeza':
        pts = [(0, CIMA), (.42, (.40, -.22, 0)), (.82, (.98, .86, 0)), (.9, (1.12, .96, 0)), (1, (1.34, .80, 0))]
    elif esq == 'cola':
        pts = [(0, CIMA), (.42, (-.40, -.22, 0)), (.86, (-1.0, .80, 0)), (1, (-1.20, .98, 0))]
    else:
        s = 1 if esq == 'ala_izq' else -1
        if alas_abajo:
            pts = [(0, CIMA), (.5, (-.06, .26, .62 * s)), (1, (-.14, -.05, 1.18 * s))]
        else:
            pts = [(0, CIMA), (.5, (-.06, .78, .50 * s)), (1, (-.16, 1.20, 1.02 * s))]
    return curva(pts, a)


def lateral(esq, med, a):
    """Hacia dónde se abre la hoja desde la espina (b) en cada sector."""
    l0 = add(COSTADO[med], sc(CIMA, -1))  # en el lomo, hasta el costado del cuerpo
    mz = MEDIOS[med][1]
    if esq in ('cabeza', 'cola'):
        fin = (0, -.13, .11 * (1 if mz > 0 else -1))  # cuello y cola: hoja estrecha en V
        return lerp(l0, fin, smooth(0, .5, a))
    hacia = 1 if MEDIOS[med][0] > 0 else -1  # ala: hacia delante o hacia atrás
    fin = (.62 * hacia, -.02, 0)
    return lerp(l0, fin, smooth(0, .32, a))


def punto_grulla(esq, med, a, b, alas_abajo=False):
    if esq in ('ala_izq', 'ala_der'):
        # Ala plana, como el papel: triángulo lomo · raíz · punta.
        s = 1 if esq == 'ala_izq' else -1
        px, py, pz = PUNTA_ALA[alas_abajo]
        punta = (px, py, pz * s)
        return add(CIMA, add(sc(add(punta, sc(CIMA, -1)), a), sc(add(COSTADO[med], sc(CIMA, -1)), b)))
    return add(espina(esq, a, alas_abajo), sc(lateral(esq, med, a), b))


# ---------- malla ----------
def construir():
    verts, uvs, claves, idx = [], [], {}, {}
    formas = {f'pliegue_{i}': [] for i in range(1, 5)}
    formas['grulla'] = []
    formas['alas'] = []

    def vertice(esq, med, i, j):
        a, b = i / N, j / N
        cx, cz = ESQUINAS[esq]
        mx, mz = MEDIOS[med]
        hx, hz = cx * a + mx * b, cz * a + mz * b
        clave = (round(hx, 5), round(hz, 5))
        if clave in idx:
            return idx[clave]
        idx[clave] = len(verts)
        verts.append((hx, 0, hz))
        uvs.append(((hx + 1) / 2, (hz + 1) / 2))
        for n in range(1, 5):
            formas[f'pliegue_{n}'].append(punto_base(esq, med, a, b, math.radians(22.5 * n)))
        formas['grulla'].append(punto_grulla(esq, med, a, b))
        formas['alas'].append(punto_grulla(esq, med, a, b, alas_abajo=True))
        return idx[clave]

    caras = []
    for esq, med in SECTORES:
        for i in range(N):
            for j in range(N - i):
                v00 = vertice(esq, med, i, j)
                v10 = vertice(esq, med, i + 1, j)
                v01 = vertice(esq, med, i, j + 1)
                caras.append((v00, v10, v01))
                if i + j < N - 1:
                    caras.append((v10, vertice(esq, med, i + 1, j + 1), v01))
    return verts, uvs, caras, formas


def a_blender(p):
    # El exportador glTF pasa de Z arriba (Blender) a Y arriba (web).
    return (p[0], -p[2], p[1])


def escena(salida, preview, foto=None):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    verts, uvs, caras, formas = construir()

    me = bpy.data.meshes.new('hoja')
    me.from_pydata([a_blender(v) for v in verts], [], caras)
    me.update()
    # Todas las caras con la cara impresa hacia arriba en la hoja plana.
    for poly in me.polygons:
        if poly.normal.z < 0:
            poly.flip()
    me.update()
    capa = me.uv_layers.new(name='UVMap')
    for poly in me.polygons:
        for li in poly.loop_indices:
            capa.data[li].uv = uvs[me.loops[li].vertex_index]
    for poly in me.polygons:
        poly.use_smooth = False

    ob = bpy.data.objects.new('grulla', me)
    bpy.context.scene.collection.objects.link(ob)
    ob.shape_key_add(name='base')
    for nombre, pos in formas.items():
        k = ob.shape_key_add(name=nombre)
        for i, p in enumerate(pos):
            k.data[i].co = a_blender(p)

    mat = bpy.data.materials.new('papel')
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes['Principled BSDF']
    bsdf.inputs['Base Color'].default_value = (.12, .32, 1, 1)
    bsdf.inputs['Roughness'].default_value = .72
    me.materials.append(mat)

    os.makedirs(os.path.dirname(os.path.abspath(salida)), exist_ok=True)
    bpy.ops.object.select_all(action='DESELECT')
    ob.select_set(True)
    bpy.ops.export_scene.gltf(
        filepath=os.path.abspath(salida), export_format='GLB', use_selection=True,
        export_morph=True, export_morph_normal=True, export_apply=False,
        export_texcoords=True, export_normals=True, export_materials='EXPORT',
        export_animations=False, export_yup=True)
    print(f'GLB: {salida} · {len(verts)} vértices · {len(caras)} triángulos')

    if preview or foto:
        cam = preparar_render(fondo=not foto)
        if preview:
            renders(ob, cam, preview)
        if foto:
            imagen_fija(ob, cam, foto)


def preparar_render(fondo=True):
    s = bpy.context.scene
    s.render.engine = 'BLENDER_EEVEE'
    s.render.film_transparent = not fondo
    s.world = bpy.data.worlds.new('mundo')
    s.world.use_nodes = True
    # Sin fondo visible, el mundo solo ilumina: más luz ambiental azulada para las caras en sombra.
    s.world.node_tree.nodes['Background'].inputs['Color'].default_value = (.02, .025, .05, 1) if fondo else (.35, .45, .85, 1)
    sol = bpy.data.objects.new('sol', bpy.data.lights.new('sol', 'SUN'))
    sol.data.energy = 3.5
    sol.rotation_euler = (math.radians(40), math.radians(10), math.radians(-35))
    s.collection.objects.link(sol)
    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam'))
    s.collection.objects.link(cam)
    s.camera = cam
    objetivo = bpy.data.objects.new('objetivo', None)
    objetivo.location = (0, 0, .2)
    s.collection.objects.link(objetivo)
    c = cam.constraints.new('TRACK_TO')
    c.target = objetivo
    return cam


def fase(ob, nombre):
    for k in ob.data.shape_keys.key_blocks:
        k.value = 1.0 if k.name == nombre else 0.0


def renders(ob, cam, carpeta):
    os.makedirs(carpeta, exist_ok=True)
    s = bpy.context.scene
    s.render.resolution_x, s.render.resolution_y = 640, 480
    vistas = {'frente': (1.2, -4.4, 1.6), 'lado': (4.4, -.6, 1.2), 'arriba': (1.0, -2.6, 3.8)}
    for nombre in ['base', 'pliegue_2', 'pliegue_4', 'grulla', 'alas']:
        fase(ob, nombre)
        for vista, pos in vistas.items():
            cam.location = pos
            s.render.filepath = os.path.join(carpeta, f'{nombre}_{vista}.png')
            bpy.ops.render.render(write_still=True)


def imagen_fija(ob, cam, ruta):
    """Grulla montada con fondo transparente: respaldo sin WebGL o con «reducir movimiento»."""
    s = bpy.context.scene
    s.render.resolution_x, s.render.resolution_y = 1000, 900
    fase(ob, 'grulla')
    cam.location = (2.6, -3.6, 1.5)
    s.render.filepath = os.path.abspath(ruta)
    bpy.ops.render.render(write_still=True)


if __name__ == '__main__':
    args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    salida = args[0] if args else 'public/3d/grulla.glb'
    opciones = dict(a.split('=', 1) for a in args[1:] if '=' in a)
    escena(salida, opciones.get('preview'), opciones.get('foto'))
