import React, { useRef } from 'react'
import { getDB, clearAllData } from '../../lib/db'
import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { useToast } from '../../hooks/use-toast'
import { Upload, Download } from 'lucide-react'

export function AdminDataPage() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = async () => {
    try {
      const db = await getDB()
      const products = await db.getAll('products')
      const categories = await db.getAll('categories')
      const users = await db.getAll('users')
      const coupons = await db.getAll('coupons')
      
      const data = { products, categories, users, coupons }
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`
      const link = document.createElement("a")
      link.href = jsonString
      link.download = `motogear-backup-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      toast({ title: "Export Successful", description: "Data has been exported to a JSON file." })
    } catch (error) {
      toast({ variant: 'destructive', title: "Export Failed", description: "Could not export data." })
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const text = e.target?.result
        if (typeof text !== 'string') throw new Error("Invalid file content")
        
        const data = JSON.parse(text)
        
        if (!data.products || !data.categories) {
            throw new Error("Invalid JSON structure.")
        }

        await clearAllData()
        const db = await getDB()
        const tx = db.transaction(['products', 'categories', 'users', 'coupons'], 'readwrite')
        
        await Promise.all([
            ...data.products.map((p: any) => tx.objectStore('products').put(p)),
            ...data.categories.map((c: any) => tx.objectStore('categories').put(c)),
            ...(data.users || []).map((u: any) => tx.objectStore('users').put(u)),
            ...(data.coupons || []).map((co: any) => tx.objectStore('coupons').put(co)),
        ])

        await tx.done
        toast({ title: "Import Successful", description: "Data has been imported. Please refresh the page." })
      } catch (error: any) {
        toast({ variant: 'destructive', title: "Import Failed", description: error.message || "Could not import data." })
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Import or export your store's data. This is a destructive action.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-semibold">Export Data</h3>
              <p className="text-sm text-muted-foreground">Download all products, categories, and users as a JSON file.</p>
            </div>
            <Button onClick={handleExport}><Download className="mr-2 h-4 w-4" /> Export</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-semibold">Import Data</h3>
              <p className="text-sm text-muted-foreground">Upload a JSON file to replace all current data. This cannot be undone.</p>
            </div>
            <Button onClick={() => fileInputRef.current?.click()} variant="outline"><Upload className="mr-2 h-4 w-4" /> Import</Button>
            <input type="file" ref={fileInputRef} onChange={handleImport} accept=".json" className="hidden" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
