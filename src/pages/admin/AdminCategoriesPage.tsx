import React, { useEffect, useState } from 'react'
import { getApi } from '../../lib/api'
import { Category } from '../../lib/types'
import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table'
import { Input } from '../../components/ui/Input'
import { useToast } from '../../hooks/use-toast'
import { Trash2 } from 'lucide-react'

const api = getApi()

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const { toast } = useToast()

  const fetchCategories = async () => {
    setCategories(await api.categories.list())
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return
    try {
      await api.categories.create({ name: newCategoryName })
      toast({ title: 'Category created' })
      setNewCategoryName('')
      fetchCategories()
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to create category' })
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure? This may affect products in this category.')) {
      try {
        await api.categories.remove(id)
        toast({ title: 'Category deleted' })
        fetchCategories()
      } catch (error) {
        toast({ variant: 'destructive', title: 'Failed to delete category' })
      }
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Manage your product categories.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Slug</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {categories.map(cat => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>{cat.slug}</TableCell>
                  <TableCell><Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="flex space-x-2">
            <Input
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <Button type="submit">Add</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
