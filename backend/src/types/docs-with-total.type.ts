export type DocsWithType<T extends Record<string, any>> = { docs: T[]; total: number };
