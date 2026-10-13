import { v4 as uuid } from "uuid";

class LocalDatabase {
  prefix = "auralis_db_";
  getCollection(t) {
    try {
      const r = localStorage.getItem(this.prefix + t);
      return r ? JSON.parse(r) : [];
    } catch {
      return [];
    }
  }
  setCollection(t, r) {
    try {
      localStorage.setItem(this.prefix + t, JSON.stringify(r));
    } catch (n) {
      console.error("DB Write Error:", n);
    }
  }
  findMany(t, r) {
    const n = this.getCollection(t);
    return r
      ? n.filter((l) => Object.entries(r).every(([o, u]) => l[o] === u))
      : n;
  }
  findFirst(t, r) {
    return this.findMany(t, r)[0] || null;
  }
  findById(t, r) {
    return this.getCollection(t).find((l) => l.id === r) || null;
  }
  create(t, r) {
    const n = this.getCollection(t),
      l = { ...r, id: r.id || uuid() };
    return (n.push(l), this.setCollection(t, n), l);
  }
  update(t, r, n) {
    const l = this.getCollection(t),
      o = l.findIndex((u) => u.id === r);
    return o === -1
      ? null
      : ((l[o] = { ...l[o], ...n, updatedAt: new Date().toISOString() }),
        this.setCollection(t, l),
        l[o]);
  }
  delete(t, r) {
    const n = this.getCollection(t),
      l = n.filter((o) => o.id !== r);
    return l.length === n.length ? false : (this.setCollection(t, l), true);
  }
  count(t) {
    return this.getCollection(t).length;
  }
  aggregate(t, r, n) {
    const l = this.getCollection(t);
    return (n ? l.filter(n) : l).reduce((u, d) => u + (Number(d[r]) || 0), 0);
  }
  query(t, r) {
    return this.getCollection(t).filter(r);
  }
  isInitialized() {
    return localStorage.getItem(this.prefix + "initialized") === "true";
  }
  markInitialized() {
    localStorage.setItem(this.prefix + "initialized", "true");
  }
  clearAll() {
    (Object.keys(localStorage)
      .filter((r) => r.startsWith(this.prefix))
      .forEach((r) => localStorage.removeItem(r)),
      localStorage.removeItem(this.prefix + "initialized"),
      localStorage.removeItem("auralis_token"));
  }
}

export const db = new LocalDatabase();
