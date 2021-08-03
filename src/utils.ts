export const getId = (): number => Date.now()

export const removeFromListById = <T extends { id: number }>(id, arr: Array<T>): T[] =>
  arr.filter(element => element.id !== id)

export const findById = <T extends { id: number }>(id, arr: Array<T>): T | undefined =>
  arr.find(element => element.id === id)

export const sortById = <T extends { id: number }>(a: T, b: T) => a.id - b.id
