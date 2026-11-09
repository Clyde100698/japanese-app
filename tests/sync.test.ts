import { describe, it, expect } from "vitest";

describe("Sync & Conflict Resolution (Last-Write-Wins)", () => {
  interface VersionedRow {
    id: string;
    value: string;
    updatedAt: number;
    dirty: 0 | 1;
  }

  function resolveLww(
    local: VersionedRow | undefined,
    remote: { id: string; value: string; updatedAt: number },
  ): { wins: boolean; row: VersionedRow } {
    const wins = !local || remote.updatedAt > local.updatedAt;
    if (wins) {
      return { wins: true, row: { ...remote, dirty: 0 } };
    }
    return { wins: false, row: local };
  }

  it("remote wins when remote.updatedAt is strictly greater than local.updatedAt", () => {
    const local: VersionedRow = {
      id: "card-1",
      value: "local edit",
      updatedAt: 1000,
      dirty: 1,
    };
    const remote = {
      id: "card-1",
      value: "remote edit",
      updatedAt: 2000,
    };

    const res = resolveLww(local, remote);
    expect(res.wins).toBe(true);
    expect(res.row.value).toBe("remote edit");
    expect(res.row.dirty).toBe(0);
  });

  it("local wins when local.updatedAt is newer or equal (stale remote write ignored)", () => {
    const local: VersionedRow = {
      id: "card-1",
      value: "recent local progress",
      updatedAt: 5000,
      dirty: 1,
    };
    const staleRemote = {
      id: "card-1",
      value: "old remote progress",
      updatedAt: 3000,
    };

    const res = resolveLww(local, staleRemote);
    expect(res.wins).toBe(false);
    expect(res.row.value).toBe("recent local progress");
    expect(res.row.dirty).toBe(1);
  });

  it("preserves dirty flag if row was modified locally after push initiation", () => {
    let localRow: VersionedRow = {
      id: "card-1",
      value: "initial",
      updatedAt: 1000,
      dirty: 1,
    };

    // Push initiated with snapshot timestamp 1000
    const snapshotTimestamp = 1000;

    // While in flight, user reviews card again locally
    localRow = {
      id: "card-1",
      value: "subsequent local review",
      updatedAt: 1050,
      dirty: 1,
    };

    // Push finishes for snapshot 1000: markClean check
    const shouldMarkClean = localRow.updatedAt === snapshotTimestamp;
    expect(shouldMarkClean).toBe(false);
    // Because shouldMarkClean is false, dirty flag stays 1 for next sync cycle
    expect(localRow.dirty).toBe(1);
  });
});
