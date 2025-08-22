import { faker } from '@faker-js/faker'
import { getDB } from './index'
import { Product, Category, User, Coupon, Variant, ContentBlock, Settings } from '../types'
import { generateId, slugify } from '../utils'

const CATEGORIES = ['Helmets', 'Jackets', 'Gloves', 'Boots', 'Accessories']
const BRANDS = ['MotoCorp', 'RideSafe', 'Velocity', 'ApexGear', 'TourMaster']

function createProductVariants(categoryName: string): Variant[] {
  const variants: Variant[] = []
  if (categoryName !== 'Accessories') {
    variants.push({
      id: generateId(),
      name: 'Size',
      options: ['S', 'M', 'L', 'XL'],
    })
  }
  if (categoryName === 'Helmets' || categoryName === 'Jackets') {
    variants.push({
      id: generateId(),
      name: 'Color',
      options: ['Matte Black', 'Glossy White', 'Red', 'Blue'],
    })
  }
  return variants
}

export async function seedDatabase() {
  const db = await getDB()

  const productCount = await db.count('products')
  if (productCount > 0) {
    console.log('Database already seeded.')
    return
  }

  console.log('Seeding database...')

  const tx = db.transaction(['categories', 'products', 'users', 'coupons', 'contentBlocks', 'settings'], 'readwrite')

  // Create Categories
  const categories: Category[] = []
  for (const catName of CATEGORIES) {
    const category: Category = {
      id: generateId(),
      name: catName,
      slug: slugify(catName),
      description: faker.lorem.sentence(),
      image: `https://picsum.photos/seed/${slugify(catName)}/600/400`,
    }
    categories.push(category)
    await tx.objectStore('categories').add(category)
  }

  // Create Products
  for (let i = 0; i < 50; i++) {
    const category = faker.helpers.arrayElement(categories)
    const title = `${faker.helpers.arrayElement(['Racing', 'Touring', 'Urban', 'Adventure'])} ${category.name.slice(0, -1)}`
    const price = faker.commerce.price({ min: 200, max: 3000, dec: 0 })

    const product: Product = {
      id: generateId(),
      title,
      slug: slugify(`${title}-${i}-${faker.string.alphanumeric(4)}`),
      brand: faker.helpers.arrayElement(BRANDS),
      category,
      price: Number(price),
      compareAtPrice: faker.datatype.boolean(0.3) ? Number(price) * 1.5 : undefined,
      stock: faker.number.int({ min: 0, max: 100 }),
      rating: faker.number.float({ min: 3.5, max: 5, precision: 0.1 }),
      reviewCount: faker.number.int({ min: 5, max: 200 }),
      tags: faker.helpers.arrayElements(['new-arrival', 'best-seller', 'waterproof', 'carbon-fiber'], faker.number.int({ min: 1, max: 3 })),
      images: Array.from({ length: 3 }, () => `https://picsum.photos/seed/${faker.string.uuid()}/800/800`),
      description: faker.lorem.paragraphs(3),
      shortDescription: faker.lorem.sentence(),
      specs: {
        Material: faker.commerce.productMaterial(),
        Weight: `${faker.number.int({ min: 1, max: 2 })}kg`,
        Certification: 'DOT/ECE',
      },
      features: ['Ventilated', 'Removable Liner', 'Quick-release Strap'],
      variants: createProductVariants(category.name),
      featured: faker.datatype.boolean(0.2),
      createdAt: faker.date.past().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    await tx.objectStore('products').add(product)
  }

  // Create Users
  const customer: User = {
    id: 'user-customer-01',
    email: 'customer@motogear.com',
    name: 'John Doe',
    role: 'customer',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  await tx.objectStore('users').add(customer)

  const admin: User = {
    id: 'user-admin-01',
    email: 'admin@motogear.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  await tx.objectStore('users').add(admin)

  // Create Coupons
  const coupon1: Coupon = {
    id: 'coupon-01',
    code: 'SAVE10',
    type: 'percent',
    value: 10,
    active: true,
    appliesTo: 'all',
  }
  await tx.objectStore('coupons').add(coupon1)

  const coupon2: Coupon = {
    id: 'coupon-02',
    code: 'FREESHIP',
    type: 'fixed',
    value: 50, // Shipping rate in SAR
    active: true,
    appliesTo: 'all',
  }
  await tx.objectStore('coupons').add(coupon2)

  // Create Content Blocks
  const heroBlock: ContentBlock = {
    id: 'content-hero-1',
    key: 'homepage-hero',
    title: 'Gear Up for the Ride',
    body: 'Discover premium helmets, jackets, and accessories designed for safety and style.',
    media: ['https://images.unsplash.com/photo-1621303837119-159a41c0a2a9?fit=crop&w=1920&q=80'],
    link: '/category/all',
    active: true,
  }
  await tx.objectStore('contentBlocks').add(heroBlock);

  // Create Settings
  const initialSettings: Settings = {
    id: 'main-settings',
    storeName: 'MotoGear Store',
    currency: 'SAR',
    taxRate: 15, // VAT in SA
    shippingFlatRate: 50,
    freeShippingThreshold: 500,
  }
  await tx.objectStore('settings').add(initialSettings);


  await tx.done
  console.log('Database seeded successfully!')
}
