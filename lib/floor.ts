import type { FloorTable } from "@/types";

/**
 * Where a table's chairs are drawn. These are the same rules the restaurant
 * dashboard uses (swiftab_web/src/lib/floor.ts), so a floor plan looks the
 * same to guests as it does to the person who drew it.
 */

/** The dashboard's drawing area, in layout units. */
export const CANVAS = { width: 1200, height: 760 };

export type Side = "top" | "right" | "bottom" | "left";

/** How far a chair's centre sits outside the table edge. */
export const CHAIR_OFFSET = 18;
/** Room one chair needs along a table edge. */
const CHAIR_PITCH = 46;

/**
 * Decides which edge of a rectangular table each chair sits on. Guests sit
 * along the long edges first; the ends are used once the long edges are full.
 * Returns one side per chair. Round tables do not use sides.
 */
export function seatSides(width: number, height: number, count: number): Side[] {
  if (count <= 0) return [];
  const wide = width >= height;
  const longSides: [Side, Side] = wide ? ["top", "bottom"] : ["left", "right"];
  const shortSides: [Side, Side] = wide ? ["left", "right"] : ["top", "bottom"];
  const longCapacity = Math.max(1, Math.floor(Math.max(width, height) / CHAIR_PITCH));
  const shortCapacity = Math.max(1, Math.floor(Math.min(width, height) / CHAIR_PITCH));

  const onSide: Record<Side, number> = { top: 0, right: 0, bottom: 0, left: 0 };
  let remaining = count;

  const fill = (sides: [Side, Side], capacity: number) => {
    // Alternate so the two edges stay balanced.
    for (let i = 0; i < capacity * 2 && remaining > 0; i++) {
      onSide[sides[i % 2]]++;
      remaining--;
    }
  };
  fill(longSides, longCapacity);
  fill(shortSides, shortCapacity);
  // More chairs than the table has room for: squeeze the rest along the long edges.
  for (let i = 0; remaining > 0; i++) {
    onSide[longSides[i % 2]]++;
    remaining--;
  }

  return (["top", "right", "bottom", "left"] as Side[]).flatMap((side) => Array<Side>(onSide[side]).fill(side));
}

export interface SeatPosition {
  /** Chair centre, relative to the table's top-left corner. */
  x: number;
  y: number;
  /** Degrees to turn the chair so it faces the table. */
  rotation: number;
}

/**
 * Where each chair is drawn. Round tables space chairs evenly around the
 * rim; other tables space the chairs on each edge evenly along it. Chairs
 * saved before edges were recorded are laid out afresh from the seat count.
 */
export function seatPositions(table: Pick<FloorTable, "shape" | "size" | "chairs">): SeatPosition[] {
  const { width, height } = table.size;
  const count = table.chairs.length;
  if (count === 0) return [];

  if (table.shape === "round") {
    const radius = width / 2 + CHAIR_OFFSET;
    return table.chairs.map((_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return {
        x: width / 2 + Math.sin(angle) * radius,
        y: height / 2 - Math.cos(angle) * radius,
        rotation: (angle * 180) / Math.PI,
      };
    });
  }

  const sides: Side[] = ["top", "right", "bottom", "left"];
  const recorded = table.chairs.map((c) => c.position as Side);
  // Layouts saved before edges were recorded put every chair on "top", which
  // is never what the rule above produces for two or more chairs.
  const legacy = count > 1 && new Set(recorded).size === 1;
  const assigned = count > 1 && !legacy && recorded.every((p) => sides.includes(p)) ? recorded : seatSides(width, height, count);

  const total: Record<Side, number> = { top: 0, right: 0, bottom: 0, left: 0 };
  assigned.forEach((side) => total[side]++);
  const seen: Record<Side, number> = { top: 0, right: 0, bottom: 0, left: 0 };

  return assigned.map((side) => {
    const along = (seen[side]++ + 0.5) / total[side];
    switch (side) {
      case "top":
        return { x: along * width, y: -CHAIR_OFFSET, rotation: 0 };
      case "bottom":
        return { x: along * width, y: height + CHAIR_OFFSET, rotation: 180 };
      case "left":
        return { x: -CHAIR_OFFSET, y: along * height, rotation: 270 };
      default:
        return { x: width + CHAIR_OFFSET, y: along * height, rotation: 90 };
    }
  });
}

/** The rectangle that holds every table and chair on a floor, with a margin. */
export function floorBounds(tables: Pick<FloorTable, "position" | "size" | "rotation">[]): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  if (tables.length === 0) return { x: 0, y: 0, width: CANVAS.width, height: CANVAS.height };
  const pad = CHAIR_OFFSET + 26;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const t of tables) {
    const cx = t.position.x + t.size.width / 2;
    const cy = t.position.y + t.size.height / 2;
    // A turned table can reach as far as half its diagonal in any direction.
    const turned = Boolean(t.rotation && t.rotation % 180 !== 0);
    const halfW = turned ? Math.hypot(t.size.width, t.size.height) / 2 : t.size.width / 2;
    const halfH = turned ? halfW : t.size.height / 2;
    minX = Math.min(minX, cx - halfW);
    minY = Math.min(minY, cy - halfH);
    maxX = Math.max(maxX, cx + halfW);
    maxY = Math.max(maxY, cy + halfH);
  }
  return { x: minX - pad, y: minY - pad, width: maxX - minX + pad * 2, height: maxY - minY + pad * 2 };
}
