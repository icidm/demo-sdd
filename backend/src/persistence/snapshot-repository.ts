import { mkdir, readFile, writeFile } from "node:fs/promises";
import type { DashboardPayload } from "@demo/shared";

export interface SnapshotRepository {
  save(payload: DashboardPayload): Promise<void>;
  load(): Promise<DashboardPayload | null>;
}

export class JsonSnapshotRepository implements SnapshotRepository {
  constructor(private readonly filePath: string) {}

  async save(payload: DashboardPayload): Promise<void> {
    await mkdir(new URL(".", `file://${this.filePath}`).pathname, { recursive: true });
    await writeFile(this.filePath, JSON.stringify(payload, null, 2), "utf-8");
  }

  async load(): Promise<DashboardPayload | null> {
    try {
      const raw = await readFile(this.filePath, "utf-8");
      return JSON.parse(raw) as DashboardPayload;
    } catch {
      return null;
    }
  }
}
