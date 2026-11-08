/** Last-write-wins: the record with the later `updatedAt` wins; ties keep the local copy. */
export function remoteWins(local: { updatedAt: number } | undefined, remote: { updatedAt: number }): boolean {
  return !local || remote.updatedAt > local.updatedAt;
}

export function pickLatest<T extends { updatedAt: number }>(local: T | undefined, remote: T): T {
  return remoteWins(local, remote) ? remote : (local as T);
}

