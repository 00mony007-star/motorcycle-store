import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getApi } from '../../lib/api'
import { Product, Category } from '../../lib/types'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { Textarea } from '../../components/ui/Textarea'
import { Checkbox } from '../../components/ui/Checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { useToast } from '../../hooks/use-toast'
import { Loader2 } from 'lucide-react'

const api = getApi()

const productSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  brand: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  compareAtPrice: z.coerce.number().optional(),
  stock: z.coerce.number().int('Stock must be an integer'),
  description: z.string().min(10, 'Description is required'),
  shortDescription: z.string().min(5, 'Short description is required'),
  images: z.string().min(1, 'At least one image URL is required'),
  featured: z.boolean().default(false),
})

type ProductFormValues = z.infer<typeof productSchema>

export function AdminProductEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(!!id)
  const isNew = !id

  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedCategories = await api.categories.list()
        setCategories(fetchedCategories)
        if (!isNew) {
          const fetchedProduct = await api.products.getById(id)
          setProduct(fetchedProduct)
          if (fetchedProduct) {
            reset({
              title: fetchedProduct.title,
              brand: fetchedProduct.brand,
              categoryId: fetchedProduct.category.id,
              price: fetchedProduct.price,
              compareAtPrice: fetchedProduct.compareAtPrice,
              stock: fetchedProduct.stock,
              description: fetchedProduct.description,
              shortDescription: fetchedProduct.shortDescription,
              images: fetchedProduct.images.join(', '),
              featured: fetchedProduct.featured,
            })
          }
        }
      } catch (error) {
        toast({ variant: 'destructive', title: 'Failed to load data' })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id, isNew, reset, toast])

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const category = categories.find(c => c.id === data.categoryId)
      if (!category) throw new Error("Category not found")

      const productData = {
        ...data,
        category,
        images: data.images.split(',').map(s => s.trim()),
        // These are not in the form but required by type
        rating: product?.rating || 0,
        reviewCount: product?.reviewCount || 0,
        tags: product?.tags || [],
        features: product?.features || [],
      }

      if (isNew) {
        await api.products.create(productData)
        toast({ title: 'Product created successfully' })
      } else {
        await api.products.update(id, productData)
        toast({ title: 'Product updated successfully' })
      }
      navigate('/admin/products')
    } catch (error) {
      toast({ variant: 'destructive', title: 'Operation failed' })
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isNew ? 'Create Product' : 'Edit Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><Label htmlFor="title">Title</Label><Input id="title" {...register('title')} /><p className="text-destructive text-xs mt-1">{errors.title?.message}</p></div>
            <div><Label htmlFor="brand">Brand</Label><Input id="brand" {...register('brand')} /><p className="text-destructive text-xs mt-1">{errors.brand?.message}</p></div>
            <div>
              <Label htmlFor="categoryId">Category</Label>
              <Controller name="categoryId" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              )} />
              <p className="text-destructive text-xs mt-1">{errors.categoryId?.message}</p>
            </div>
            <div><Label htmlFor="price">Price</Label><Input id="price" type="number" step="0.01" {...register('price')} /><p className="text-destructive text-xs mt-1">{errors.price?.message}</p></div>
            <div><Label htmlFor="compareAtPrice">Compare At Price</Label><Input id="compareAtPrice" type="number" step="0.01" {...register('compareAtPrice')} /><p className="text-destructive text-xs mt-1">{errors.compareAtPrice?.message}</p></div>
            <div><Label htmlFor="stock">Stock</Label><Input id="stock" type="number" {...register('stock')} /><p className="text-destructive text-xs mt-1">{errors.stock?.message}</p></div>
          </div>
          <div><Label htmlFor="shortDescription">Short Description</Label><Textarea id="shortDescription" {...register('shortDescription')} /><p className="text-destructive text-xs mt-1">{errors.shortDescription?.message}</p></div>
          <div><Label htmlFor="description">Full Description</Label><Textarea id="description" rows={5} {...register('description')} /><p className="text-destructive text-xs mt-1">{errors.description?.message}</p></div>
          <div><Label htmlFor="images">Image URLs (comma-separated)</Label><Input id="images" {...register('images')} /><p className="text-destructive text-xs mt-1">{errors.images?.message}</p></div>
          <div className="flex items-center space-x-2">
            <Controller name="featured" control={control} render={({ field }) => (
                <Checkbox id="featured" checked={field.value} onCheckedChange={field.onChange} />
            )} />
            <Label htmlFor="featured">Featured Product</Label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>Cancel</Button>
            <Button type="submit">Save Product</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
