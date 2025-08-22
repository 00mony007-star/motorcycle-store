import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getApi } from '../../lib/api'
import { Product } from '../../lib/types'
import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table'
import { Badge } from '../../components/ui/Badge'
import { formatCurrency } from '../../lib/utils'
import { PlusCircle, MoreHorizontal, Trash2, Edit } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/DropdownMenu'
import { useToast } from '../../hooks/use-toast'

const api = getApi()

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const { toast } = useToast()

  const fetchProducts = async () => {
    const fetchedProducts = await api.products.list()
    setProducts(fetchedProducts)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.products.remove(id)
        toast({ title: 'Product deleted successfully.' })
        fetchProducts()
      } catch (error) {
        toast({ variant: 'destructive', title: 'Failed to delete product.' })
      }
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Products</CardTitle>
          <CardDescription>Manage your store's products.</CardDescription>
        </div>
        <Button asChild>
          <Link to="/admin/products/new"><PlusCircle className="mr-2 h-4 w-4" /> Add Product</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(product => (
              <TableRow key={product.id}>
                <TableCell><img src={product.images[0]} alt={product.title} className="h-12 w-12 object-cover rounded-md" /></TableCell>
                <TableCell className="font-medium">{product.title}</TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell>{formatCurrency(product.price)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell><Badge variant={product.stock > 0 ? 'secondary' : 'destructive'}>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</Badge></TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild><Link to={`/admin/products/edit/${product.id}`} className="flex items-center w-full"><Edit className="mr-2 h-4 w-4"/>Edit</Link></DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4"/>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
