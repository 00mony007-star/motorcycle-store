import { openDB, DBSchema, IDBPDatabase } from 'idb'
import { Product, Category, User, Order, Coupon, Review, ContentBlock, Settings } from '../types'

interface MotoGearDB extends DBSchema {
  products: {
    key: string
    value: Product
    indexes: { 'by-slug': string; 'by-category': string; 'by-brand': string }
  }
  categories: {
    key: string
    value: Category
    indexes: { 'by-slug': string }
  }
  users: {
    key: string
    value: User
    indexes: { 'by-email': string }
  }
  orders: {
    key: string
    value: Order
    indexes: { 'by-userId': string }
  }
  coupons: {
    key: string
    value: Coupon
    indexes: { 'by-code': string }
  }
  reviews: {
    key: string
    value: Review
    indexes: { 'by-product': string }
  }
  contentBlocks: {
    key: string,
    value: ContentBlock,
    indexes: { 'by-key': string }
  }
  settings: {
    key: string,
    value: Settings
  }
}

let db: IDBPDatabase<MotoGearDB> | null = null

export async function getDB(): Promise<IDBPDatabase<MotoGearDB>> {
  if (db) {
    return db
  }

  db = await openDB<MotoGearDB>('MotoGearDB', 2, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        const productStore = db.createObjectStore('products', { keyPath: 'id' })
        productStore.createIndex('by-slug', 'slug', { unique: true })
        productStore.createIndex('by-category', 'category.id')
        productStore.createIndex('by-brand', 'brand')

        const categoryStore = db.createObjectStore('categories', { keyPath: 'id' })
        categoryStore.createIndex('by-slug', 'slug', { unique: true })

        const userStore = db.createObjectStore('users', { keyPath: 'id' })
        userStore.createIndex('by-email', 'email', { unique: true })

        const orderStore = db.createObjectStore('orders', { keyPath: 'id' })
        orderStore.createIndex('by-userId', 'userId')

        const couponStore = db.createObjectStore('coupons', { keyPath: 'id' })
        couponStore.createIndex('by-code', 'code', { unique: true })

        const reviewStore = db.createObjectStore('reviews', { keyPath: 'id' })
        reviewStore.createIndex('by-product', 'productId')
      }
      if (oldVersion < 2) {
        const contentStore = db.createObjectStore('contentBlocks', { keyPath: 'id' });
        contentStore.createIndex('by-key', 'key', { unique: true });
        db.createObjectStore('settings', { keyPath: 'id' });
      }
    },
  })

  return db
}

export async function initDB() {
  return getDB()
}

export async function clearAllData() {
  const db = await getDB()
  const storeNames = db.objectStoreNames
  const tx = db.transaction(storeNames, 'readwrite')
  await Promise.all(Array.from(storeNames).map(storeName => tx.objectStore(storeName).clear()))
  await tx.done
  console.log('All data cleared from IndexedDB.')
}
