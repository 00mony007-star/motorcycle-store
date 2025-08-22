import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { 
  Upload, 
  FileText, 
  Check, 
  X, 
  AlertCircle, 
  Download,
  Loader2,
  Database,
  FileSpreadsheet
} from 'lucide-react'
import Papa from 'papaparse'
import { Button } from '../ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Progress } from '../ui/Progress'
import { useTranslation } from 'react-i18next'
import { Product, Category } from '../../lib/types'

interface UploadResult {
  success: number
  errors: Array<{ row: number; message: string; data?: any }>
  warnings: Array<{ row: number; message: string; data?: any }>
}

interface ParsedProduct {
  title: string
  brand?: string
  category: string
  price: number
  compareAtPrice?: number
  stock: number
  description: string
  shortDescription: string
  features: string[]
  tags: string[]
  images: string[]
  specs?: Record<string, string>
}

export function BulkUpload() {
  const { t } = useTranslation()
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'parsing' | 'uploading' | 'completed' | 'error'>('idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [parsedData, setParsedData] = useState<ParsedProduct[]>([])
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [previewData, setPreviewData] = useState<any[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setUploadStatus('parsing')
    setUploadProgress(0)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const products = validateAndTransformData(results.data as any[])
          setParsedData(products)
          setPreviewData(results.data.slice(0, 5)) // Show first 5 rows for preview
          setUploadStatus('idle')
        } catch (error) {
          console.error('Parse error:', error)
          setUploadStatus('error')
        }
      },
      error: (error) => {
        console.error('CSV parse error:', error)
        setUploadStatus('error')
      }
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  })

  const validateAndTransformData = (data: any[]): ParsedProduct[] => {
    return data.map((row, index) => {
      // Basic validation and transformation
      const product: ParsedProduct = {
        title: row.title || row.name || '',
        brand: row.brand || '',
        category: row.category || 'Accessories',
        price: parseFloat(row.price) || 0,
        compareAtPrice: row.compareAtPrice ? parseFloat(row.compareAtPrice) : undefined,
        stock: parseInt(row.stock) || 0,
        description: row.description || '',
        shortDescription: row.shortDescription || row.description?.substring(0, 100) || '',
        features: row.features ? row.features.split(',').map((f: string) => f.trim()) : [],
        tags: row.tags ? row.tags.split(',').map((t: string) => t.trim()) : [],
        images: row.images ? row.images.split(',').map((img: string) => img.trim()) : [],
        specs: row.specs ? JSON.parse(row.specs) : undefined
      }

      return product
    })
  }

  const handleUpload = async () => {
    if (parsedData.length === 0) return

    setUploadStatus('uploading')
    setUploadProgress(0)

    const result: UploadResult = {
      success: 0,
      errors: [],
      warnings: []
    }

    // Simulate upload process
    for (let i = 0; i < parsedData.length; i++) {
      const product = parsedData[i]
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100))
      
      try {
        // Validate product data
        if (!product.title) {
          result.errors.push({ row: i + 1, message: 'Title is required', data: product })
          continue
        }
        
        if (product.price <= 0) {
          result.errors.push({ row: i + 1, message: 'Price must be greater than 0', data: product })
          continue
        }

        // Simulate successful upload
        result.success++
        
        if (product.stock <= 5) {
          result.warnings.push({ row: i + 1, message: 'Low stock quantity', data: product })
        }
        
      } catch (error) {
        result.errors.push({ row: i + 1, message: 'Upload failed', data: product })
      }

      setUploadProgress(((i + 1) / parsedData.length) * 100)
    }

    setUploadResult(result)
    setUploadStatus('completed')
  }

  const downloadTemplate = () => {
    const template = [
      {
        title: 'Premium Racing Helmet',
        brand: 'MotoCorp',
        category: 'Helmets',
        price: 299.99,
        compareAtPrice: 349.99,
        stock: 15,
        description: 'Professional-grade racing helmet with advanced safety features',
        shortDescription: 'Professional racing helmet with safety features',
        features: 'Lightweight carbon fiber,Anti-fog visor,DOT certified',
        tags: 'racing,safety,premium',
        images: 'https://example.com/helmet1.jpg,https://example.com/helmet2.jpg',
        specs: '{"material":"Carbon Fiber","weight":"1.2kg","certification":"DOT,ECE"}'
      }
    ]

    const csv = Papa.unparse(template)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'product-upload-template.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const resetUpload = () => {
    setUploadStatus('idle')
    setParsedData([])
    setUploadResult(null)
    setPreviewData([])
    setUploadProgress(0)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold heading-premium">
          {t('admin.bulkUpload.title', 'Bulk Product Upload')}
        </h2>
        
        <Button
          variant="outline"
          onClick={downloadTemplate}
          className="flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>{t('admin.bulkUpload.downloadTemplate', 'Download Template')}</span>
        </Button>
      </div>

      {/* Upload Area */}
      <Card className="premium-card">
        <CardContent className="p-6">
          <motion.div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragActive 
                ? 'border-primary bg-primary/5 scale-105' 
                : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <input {...getInputProps()} />
            
            <motion.div
              animate={isDragActive ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, repeat: isDragActive ? Infinity : 0 }}
            >
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            </motion.div>

            <h3 className="text-lg font-semibold mb-2">
              {isDragActive 
                ? t('admin.bulkUpload.dropHere', 'Drop your file here') 
                : t('admin.bulkUpload.dragDrop', 'Drag & drop your CSV/Excel file')
              }
            </h3>
            
            <p className="text-muted-foreground mb-4">
              {t('admin.bulkUpload.supportedFormats', 'Supports CSV, XLS, XLSX files up to 10MB')}
            </p>
            
            <Button variant="secondary">
              {t('admin.bulkUpload.browse', 'Browse Files')}
            </Button>
          </motion.div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploadStatus === 'parsing' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="premium-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="font-medium">
                  {t('admin.bulkUpload.parsing', 'Parsing file...')}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {uploadStatus === 'uploading' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="premium-card">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {t('admin.bulkUpload.uploading', 'Uploading products...')}
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(uploadProgress)}%
                </span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Data Preview */}
      {parsedData.length > 0 && uploadStatus === 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileSpreadsheet className="w-5 h-5 text-primary" />
                  <span>{t('admin.bulkUpload.preview', 'Data Preview')}</span>
                  <Badge variant="secondary">{parsedData.length} products</Badge>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={resetUpload}>
                    {t('admin.bulkUpload.cancel', 'Cancel')}
                  </Button>
                  <Button onClick={handleUpload} className="btn-premium">
                    <Database className="w-4 h-4 me-2" />
                    {t('admin.bulkUpload.upload', 'Upload Products')}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-2 font-medium">Title</th>
                      <th className="text-left p-2 font-medium">Brand</th>
                      <th className="text-left p-2 font-medium">Category</th>
                      <th className="text-left p-2 font-medium">Price</th>
                      <th className="text-left p-2 font-medium">Stock</th>
                      <th className="text-left p-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-border/50 hover:bg-muted/50"
                      >
                        <td className="p-2">{row.title || row.name}</td>
                        <td className="p-2">{row.brand}</td>
                        <td className="p-2">{row.category}</td>
                        <td className="p-2">${parseFloat(row.price || 0).toFixed(2)}</td>
                        <td className="p-2">{row.stock}</td>
                        <td className="p-2">
                          <Badge 
                            variant={
                              !row.title ? 'destructive' :
                              !row.price || parseFloat(row.price) <= 0 ? 'destructive' :
                              parseInt(row.stock) <= 5 ? 'secondary' : 'default'
                            }
                          >
                            {!row.title ? 'Missing Title' :
                             !row.price || parseFloat(row.price) <= 0 ? 'Invalid Price' :
                             parseInt(row.stock) <= 5 ? 'Low Stock' : 'Valid'}
                          </Badge>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {previewData.length < parsedData.length && (
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  {t('admin.bulkUpload.showingPreview', `Showing first ${previewData.length} of ${parsedData.length} products`)}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Upload Results */}
      {uploadResult && uploadStatus === 'completed' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>{t('admin.bulkUpload.results', 'Upload Results')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                  <div className="text-2xl font-bold text-green-600">{uploadResult.success}</div>
                  <div className="text-sm text-green-600">Successful</div>
                </div>
                
                <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-950/20">
                  <div className="text-2xl font-bold text-red-600">{uploadResult.errors.length}</div>
                  <div className="text-sm text-red-600">Errors</div>
                </div>
                
                <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                  <div className="text-2xl font-bold text-yellow-600">{uploadResult.warnings.length}</div>
                  <div className="text-sm text-yellow-600">Warnings</div>
                </div>
              </div>

              {/* Error Details */}
              {uploadResult.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-600 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Errors</span>
                  </h4>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {uploadResult.errors.map((error, index) => (
                      <div key={index} className="text-sm p-2 bg-red-50 dark:bg-red-950/20 rounded border-l-4 border-red-500">
                        <span className="font-medium">Row {error.row}:</span> {error.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warning Details */}
              {uploadResult.warnings.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-yellow-600 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Warnings</span>
                  </h4>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {uploadResult.warnings.map((warning, index) => (
                      <div key={index} className="text-sm p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded border-l-4 border-yellow-500">
                        <span className="font-medium">Row {warning.row}:</span> {warning.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={resetUpload}>
                  {t('admin.bulkUpload.uploadAnother', 'Upload Another File')}
                </Button>
                <Button onClick={() => window.location.reload()}>
                  {t('admin.bulkUpload.viewProducts', 'View Products')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Instructions */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-primary" />
            <span>{t('admin.bulkUpload.instructions', 'Upload Instructions')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Required Fields</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• <code className="bg-muted px-1 rounded">title</code> - Product name</li>
                <li>• <code className="bg-muted px-1 rounded">price</code> - Product price (decimal)</li>
                <li>• <code className="bg-muted px-1 rounded">category</code> - Product category</li>
                <li>• <code className="bg-muted px-1 rounded">stock</code> - Inventory count</li>
                <li>• <code className="bg-muted px-1 rounded">description</code> - Full description</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Optional Fields</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• <code className="bg-muted px-1 rounded">brand</code> - Product brand</li>
                <li>• <code className="bg-muted px-1 rounded">compareAtPrice</code> - Original price</li>
                <li>• <code className="bg-muted px-1 rounded">features</code> - Comma-separated</li>
                <li>• <code className="bg-muted px-1 rounded">tags</code> - Comma-separated</li>
                <li>• <code className="bg-muted px-1 rounded">images</code> - Comma-separated URLs</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Tip:</strong> Download the template file to see the exact format and example data. 
              Make sure your CSV uses the same column headers for successful import.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}