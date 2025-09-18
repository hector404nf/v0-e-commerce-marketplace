"use client"

import { useState, useEffect } from "react"
import { Save, Building, Receipt, Bell, CreditCard, Truck, Globe, FileText, Calculator, Banknote } from "lucide-react"
import AdminSidebar from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface TaxConfig {
  id: string
  name: string
  rate: number
  isDefault: boolean
  description: string
}

interface InvoiceConfig {
  prefix: string
  nextNumber: number
  format: string
  template: string
  autoGenerate: boolean
  includeQR: boolean
  footerText: string
}

interface BillingConfig {
  // Datos fiscales
  companyName: string
  taxId: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  email: string
  website: string

  // Configuración de impuestos
  taxes: TaxConfig[]
  defaultCurrency: string

  // Configuración de facturas
  invoice: InvoiceConfig

  // Datos bancarios
  bankName: string
  accountNumber: string
  routingNumber: string
  iban: string
  swift: string

  // Configuración adicional
  paymentTerms: string
  latePaymentFee: number
  discountTerms: string
}

interface AdminConfig {
  // Configuración general
  storeName: string
  storeDescription: string
  logo: string
  favicon: string
  timezone: string
  language: string
  dateFormat: string

  // Configuración de facturación
  billing: BillingConfig

  // Notificaciones
  notifications: {
    newOrders: boolean
    lowStock: boolean
    customerMessages: boolean
    systemUpdates: boolean
    emailReports: boolean
    smsAlerts: boolean
  }

  // Configuración de pagos
  paymentGateways: {
    stripe: { enabled: boolean; publicKey: string; secretKey: string }
    paypal: { enabled: boolean; clientId: string; clientSecret: string }
    mercadoPago: { enabled: boolean; accessToken: string }
  }

  // Configuración de envíos
  shipping: {
    freeShippingThreshold: number
    defaultShippingCost: number
    expeditedShippingCost: number
    internationalShipping: boolean
    packagingCost: number
  }
}

const defaultTaxes: TaxConfig[] = [
  { id: "1", name: "IVA General", rate: 21, isDefault: true, description: "Impuesto sobre el Valor Añadido general" },
  { id: "2", name: "IVA Reducido", rate: 10, isDefault: false, description: "IVA reducido para productos específicos" },
  {
    id: "3",
    name: "IVA Superreducido",
    rate: 4,
    isDefault: false,
    description: "IVA superreducido para productos básicos",
  },
]

const defaultConfig: AdminConfig = {
  storeName: "Mi Tienda Online",
  storeDescription: "La mejor tienda online para tus compras",
  logo: "",
  favicon: "",
  timezone: "Europe/Madrid",
  language: "es",
  dateFormat: "DD/MM/YYYY",

  billing: {
    companyName: "",
    taxId: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "España",
    phone: "",
    email: "",
    website: "",
    taxes: defaultTaxes,
    defaultCurrency: "EUR",
    invoice: {
      prefix: "FAC",
      nextNumber: 1,
      format: "FAC-{YYYY}-{MM}-{NNNN}",
      template: "default",
      autoGenerate: true,
      includeQR: true,
      footerText: "Gracias por su compra",
    },
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    iban: "",
    swift: "",
    paymentTerms: "30 días",
    latePaymentFee: 0,
    discountTerms: "2% descuento por pago anticipado",
  },

  notifications: {
    newOrders: true,
    lowStock: true,
    customerMessages: true,
    systemUpdates: false,
    emailReports: true,
    smsAlerts: false,
  },

  paymentGateways: {
    stripe: { enabled: false, publicKey: "", secretKey: "" },
    paypal: { enabled: false, clientId: "", clientSecret: "" },
    mercadoPago: { enabled: false, accessToken: "" },
  },

  shipping: {
    freeShippingThreshold: 50,
    defaultShippingCost: 5.99,
    expeditedShippingCost: 12.99,
    internationalShipping: false,
    packagingCost: 1.5,
  },
}

const currencies = [
  { code: "EUR", name: "Euro (€)", symbol: "€" },
  { code: "USD", name: "Dólar Americano ($)", symbol: "$" },
  { code: "GBP", name: "Libra Esterlina (£)", symbol: "£" },
  { code: "MXN", name: "Peso Mexicano ($)", symbol: "$" },
  { code: "ARS", name: "Peso Argentino ($)", symbol: "$" },
]

const countries = [
  "España",
  "México",
  "Argentina",
  "Colombia",
  "Chile",
  "Perú",
  "Venezuela",
  "Ecuador",
  "Uruguay",
  "Paraguay",
]

const invoiceTemplates = [
  { id: "default", name: "Plantilla por defecto" },
  { id: "modern", name: "Plantilla moderna" },
  { id: "classic", name: "Plantilla clásica" },
  { id: "minimal", name: "Plantilla minimalista" },
]

export default function AdminConfiguracionPage() {
  const [config, setConfig] = useState<AdminConfig>(defaultConfig)
  const [isLoading, setIsLoading] = useState(false)
  const [newTax, setNewTax] = useState({ name: "", rate: 0, description: "" })

  useEffect(() => {
    // Cargar configuración existente
    const savedConfig = localStorage.getItem("adminConfig")
    if (savedConfig) {
      setConfig({ ...defaultConfig, ...JSON.parse(savedConfig) })
    }
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      localStorage.setItem("adminConfig", JSON.stringify(config))
      toast({
        title: "Configuración guardada",
        description: "Los cambios se han guardado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addTax = () => {
    if (newTax.name && newTax.rate > 0) {
      const tax: TaxConfig = {
        id: Date.now().toString(),
        name: newTax.name,
        rate: newTax.rate,
        isDefault: false,
        description: newTax.description,
      }
      setConfig((prev) => ({
        ...prev,
        billing: {
          ...prev.billing,
          taxes: [...prev.billing.taxes, tax],
        },
      }))
      setNewTax({ name: "", rate: 0, description: "" })
    }
  }

  const removeTax = (taxId: string) => {
    setConfig((prev) => ({
      ...prev,
      billing: {
        ...prev.billing,
        taxes: prev.billing.taxes.filter((tax) => tax.id !== taxId),
      },
    }))
  }

  const setDefaultTax = (taxId: string) => {
    setConfig((prev) => ({
      ...prev,
      billing: {
        ...prev.billing,
        taxes: prev.billing.taxes.map((tax) => ({
          ...tax,
          isDefault: tax.id === taxId,
        })),
      },
    }))
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar storeName={config.storeName} />

      <main className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Configuración</h1>
              <p className="text-muted-foreground">Gestiona la configuración de tu tienda</p>
            </div>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>Guardando...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="facturacion">Facturación</TabsTrigger>
              <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
              <TabsTrigger value="pagos">Pagos</TabsTrigger>
              <TabsTrigger value="envios">Envíos</TabsTrigger>
            </TabsList>

            {/* Configuración General */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Configuración General
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="storeName">Nombre de la tienda</Label>
                      <Input
                        id="storeName"
                        value={config.storeName}
                        onChange={(e) => setConfig((prev) => ({ ...prev, storeName: e.target.value }))}
                        placeholder="Mi Tienda Online"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Zona horaria</Label>
                      <Select
                        value={config.timezone}
                        onValueChange={(value) => setConfig((prev) => ({ ...prev, timezone: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Europe/Madrid">Europa/Madrid (GMT+1)</SelectItem>
                          <SelectItem value="America/Mexico_City">América/Ciudad_de_México (GMT-6)</SelectItem>
                          <SelectItem value="America/Argentina/Buenos_Aires">América/Buenos_Aires (GMT-3)</SelectItem>
                          <SelectItem value="America/Bogota">América/Bogotá (GMT-5)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storeDescription">Descripción de la tienda</Label>
                    <Textarea
                      id="storeDescription"
                      value={config.storeDescription}
                      onChange={(e) => setConfig((prev) => ({ ...prev, storeDescription: e.target.value }))}
                      placeholder="Describe tu tienda..."
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="language">Idioma</Label>
                      <Select
                        value={config.language}
                        onValueChange={(value) => setConfig((prev) => ({ ...prev, language: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="pt">Português</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Formato de fecha</Label>
                      <Select
                        value={config.dateFormat}
                        onValueChange={(value) => setConfig((prev) => ({ ...prev, dateFormat: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="logo">URL del Logo</Label>
                      <Input
                        id="logo"
                        value={config.logo}
                        onChange={(e) => setConfig((prev) => ({ ...prev, logo: e.target.value }))}
                        placeholder="https://ejemplo.com/logo.png"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="favicon">URL del Favicon</Label>
                      <Input
                        id="favicon"
                        value={config.favicon}
                        onChange={(e) => setConfig((prev) => ({ ...prev, favicon: e.target.value }))}
                        placeholder="https://ejemplo.com/favicon.ico"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Configuración de Facturación */}
            <TabsContent value="facturacion">
              <div className="space-y-6">
                {/* Datos Fiscales */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Datos Fiscales de la Empresa
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Nombre de la empresa</Label>
                        <Input
                          id="companyName"
                          value={config.billing.companyName}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              billing: { ...prev.billing, companyName: e.target.value },
                            }))
                          }
                          placeholder="Mi Empresa S.L."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="taxId">NIF/CIF</Label>
                        <Input
                          id="taxId"
                          value={config.billing.taxId}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              billing: { ...prev.billing, taxId: e.target.value },
                            }))
                          }
                          placeholder="B12345678"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        value={config.billing.address}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            billing: { ...prev.billing, address: e.target.value },
                          }))
                        }
                        placeholder="Calle Principal 123"
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="city">Ciudad</Label>
                        <Input
                          id="city"
                          value={config.billing.city}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              billing: { ...prev.billing, city: e.target.value },
                            }))
                          }
                          placeholder="Madrid"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">Provincia/Estado</Label>
                        <Input
                          id="state"
                          value={config.billing.state}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              billing: { ...prev.billing, state: e.target.value },
                            }))
                          }
                          placeholder="Madrid"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">Código Postal</Label>
                        <Input
                          id="zipCode"
                          value={config.billing.zipCode}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              billing: { ...prev.billing, zipCode: e.target.value },
                            }))
                          }
                          placeholder="28001"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="country">País</Label>
                        <Select
                          value={config.billing.country}
                          onValueChange={(value) =>
                            setConfig((prev) => ({
                              ...prev,
                              billing: { ...prev.billing, country: value },
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="defaultCurrency">Moneda por defecto</Label>
                        <Select
                          value={config.billing.defaultCurrency}
                          onValueChange={(value) =>
                            setConfig((prev) => ({
                              ...prev,
                              billing: { ...prev.billing, defaultCurrency: value },
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem key={currency.code} value={currency.code}>
                                {currency.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          value={config.billing.phone}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              billing: { ...prev.billing, phone: e.target.value },
                            }))
                          }
                          placeholder="+34 123 456 789"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={config.billing.email}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              billing: { ...prev.billing, email: e.target.value },
                            }))
                          }
                          placeholder="facturacion@empresa.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Sitio web</Label>
                        <Input
                          id="website"
                          value={config.billing.website}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              billing: { ...prev.billing, website: e.target.value },
                            }))
                          }
                          placeholder="https://empresa.com"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Configuración de Impuestos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Configuración de Impuestos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Lista de impuestos existentes */}
                    <div className="space-y-4">
                      <Label>Impuestos configurados</Label>
                      {config.billing.taxes.map((tax) => (
                        <div key={tax.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{tax.name}</span>
                              <Badge variant="secondary">{tax.rate}%</Badge>
                              {tax.isDefault && <Badge variant="default">Por defecto</Badge>}
                            </div>
                            {tax.description && <p className="text-sm text-muted-foreground mt-1">{tax.description}</p>}
                          </div>
                          <div className="flex items-center gap-2">
                            {!tax.isDefault && (
                              <Button variant="outline" size="sm" onClick={() => setDefaultTax(tax.id)}>
                                Hacer por defecto
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeTax(tax.id)}
                              disabled={tax.isDefault}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Agregar nuevo impuesto */}
                    <div className="space-y-4">
                      <Label>Agregar nuevo impuesto</Label>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="newTaxName">Nombre</Label>
                          <Input
                            id="newTaxName"
                            value={newTax.name}
                            onChange={(e) => setNewTax((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="IVA Especial"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newTaxRate">Tasa (%)</Label>
                          <Input
                            id="newTaxRate"
                            type="number"
                            value={newTax.rate}
                            onChange={(e) => setNewTax((prev) => ({ ...prev, rate: Number(e.target.value) }))}
                            placeholder="15"
                            min="0"
                            max="100"
                            step="0.01"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button onClick={addTax} className="w-full">
                            Agregar Impuesto
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newTaxDescription">Descripción (opcional)</Label>
                        <Input
                          id="newTaxDescription"
                          value={newTax.description}
                          onChange={(e) => setNewTax((prev) => ({ ...prev, description: e.target.value }))}
                          placeholder="Descripción del impuesto"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Configuración de Facturas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Receipt className="h-5 w-5" />
                      Configuración de Facturas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="invoicePrefix">Prefijo de factura</Label>
                        <Input
                          id="invoicePrefix"
                          value={config.billing.invoice.prefix}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              billing: {
                                ...prev.billing,
                                invoice: { ...prev.billing.invoice, prefix: e.target.value },
                              },
                            }))
                          }
                          placeholder="FAC"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nextNumber">Próximo número</Label>
                        <Input
                          id="nextNumber"
                          type="number"
                          value={config.billing.invoice.nextNumber}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              billing: {
                                ...prev.billing,
                                invoice: { ...prev.billing.invoice, nextNumber: Number(e.target.value) },
                              },
                            }))
                          }
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="invoiceFormat">Formato de numeración</Label>
                      <Input
                        id="invoiceFormat"
                        value={config.billing.invoice.format}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            billing: {
                              ...prev.billing,
                              invoice: { ...prev.billing.invoice, format: e.target.value },
                            },
                          }))
                        }
                        placeholder="FAC-{YYYY}-{MM}-{NNNN}"
                      />
                      <p className="text-sm text-muted-foreground">
                        Variables disponibles: {"{YYYY}"} (año), {"{MM}"} (mes), {"{DD}"} (día), {"{NNNN}"} (número)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="invoiceTemplate">Plantilla de factura</Label>
                      <Select
                        value={config.billing.invoice.template}
                        onValueChange={(value) =>
                          setConfig((prev) => ({
                            ...prev,
                            billing: {
                              ...prev.billing,
                              invoice: { ...prev.billing.invoice, template: value },
                            },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {invoiceTemplates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Generar facturas automáticamente</Label>
                          <p className="text-sm text-muted-foreground">Crear factura al confirmar pedido</p>
                        </div>
                        <Switch
                          checked={config.billing.invoice.autoGenerate}
                          onCheckedChange={(checked) =>
                            setConfig((prev) => ({
                              ...prev,
                              billing: {
                                ...prev.billing,
                                invoice: { ...prev.billing.invoice, autoGenerate: checked },
                              },
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Incluir código QR</Label>
                          <p className="text-sm text-muted-foreground">Agregar QR para verificación</p>
                        </div>
                        <Switch
                          checked={config.billing.invoice.includeQR}
                          onCheckedChange={(checked) =>
                            setConfig((prev) => ({
                              ...prev,
                              billing: {
                                ...prev.billing,
                                invoice: { ...prev.billing.invoice, includeQR: checked },
                              },
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="footerText">Texto del pie de factura</Label>
                      <Textarea
                        id="footerText"
                        value={config.billing.invoice.footerText}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            billing: {
                              ...prev.billing,
                              invoice: { ...prev.billing.invoice, footerText: e.target.value },
                            },
                          }))
                        }
                        placeholder="Gracias por su compra"
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Datos Bancarios */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Banknote className="h-5 w-5" />
                      Datos Bancarios
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="bankName">Nombre del banco</Label>
                        <Input
                          id="bankName"
                          value={config.billing.bankName}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              billing: { ...prev.billing, bankName: e.target.value },
                            }))
                          }
                          placeholder="Banco Santander"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Número de cuenta</Label>
                        <Input
                          id="accountNumber"
                          value={config.billing.accountNumber}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              billing: { ...prev.billing, accountNumber: e.target.value },
                            }))
                          }
                          placeholder="1234567890"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="iban">IBAN</Label>
                        <Input
                          id="iban"
                          value={config.billing.iban}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              billing: { ...prev.billing, iban: e.target.value },
                            }))
                          }
                          placeholder="ES91 2100 0418 4502 0005 1332"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="swift">Código SWIFT/BIC</Label>
                        <Input
                          id="swift"
                          value={config.billing.swift}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              billing: { ...prev.billing, swift: e.target.value },
                            }))
                          }
                          placeholder="BSCHESMM"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Términos de Pago */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Términos de Pago
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="paymentTerms">Términos de pago</Label>
                        <Select
                          value={config.billing.paymentTerms}
                          onValueChange={(value) =>
                            setConfig((prev) => ({
                              ...prev,
                              billing: { ...prev.billing, paymentTerms: value },
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inmediato">Pago inmediato</SelectItem>
                            <SelectItem value="15 días">15 días</SelectItem>
                            <SelectItem value="30 días">30 días</SelectItem>
                            <SelectItem value="60 días">60 días</SelectItem>
                            <SelectItem value="90 días">90 días</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="latePaymentFee">Recargo por pago tardío (%)</Label>
                        <Input
                          id="latePaymentFee"
                          type="number"
                          value={config.billing.latePaymentFee}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              billing: { ...prev.billing, latePaymentFee: Number(e.target.value) },
                            }))
                          }
                          placeholder="0"
                          min="0"
                          max="100"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="discountTerms">Términos de descuento</Label>
                      <Input
                        id="discountTerms"
                        value={config.billing.discountTerms}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            billing: { ...prev.billing, discountTerms: e.target.value },
                          }))
                        }
                        placeholder="2% descuento por pago anticipado"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notificaciones */}
            <TabsContent value="notificaciones">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Configuración de Notificaciones
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Nuevos pedidos</Label>
                        <p className="text-sm text-muted-foreground">Notificar cuando llegue un nuevo pedido</p>
                      </div>
                      <Switch
                        checked={config.notifications.newOrders}
                        onCheckedChange={(checked) =>
                          setConfig((prev) => ({
                            ...prev,
                            notifications: { ...prev.notifications, newOrders: checked },
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Stock bajo</Label>
                        <p className="text-sm text-muted-foreground">Alertar cuando el stock esté bajo</p>
                      </div>
                      <Switch
                        checked={config.notifications.lowStock}
                        onCheckedChange={(checked) =>
                          setConfig((prev) => ({
                            ...prev,
                            notifications: { ...prev.notifications, lowStock: checked },
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Mensajes de clientes</Label>
                        <p className="text-sm text-muted-foreground">Notificar mensajes de soporte</p>
                      </div>
                      <Switch
                        checked={config.notifications.customerMessages}
                        onCheckedChange={(checked) =>
                          setConfig((prev) => ({
                            ...prev,
                            notifications: { ...prev.notifications, customerMessages: checked },
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Actualizaciones del sistema</Label>
                        <p className="text-sm text-muted-foreground">Notificar actualizaciones importantes</p>
                      </div>
                      <Switch
                        checked={config.notifications.systemUpdates}
                        onCheckedChange={(checked) =>
                          setConfig((prev) => ({
                            ...prev,
                            notifications: { ...prev.notifications, systemUpdates: checked },
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Reportes por email</Label>
                        <p className="text-sm text-muted-foreground">Enviar reportes semanales por email</p>
                      </div>
                      <Switch
                        checked={config.notifications.emailReports}
                        onCheckedChange={(checked) =>
                          setConfig((prev) => ({
                            ...prev,
                            notifications: { ...prev.notifications, emailReports: checked },
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Alertas SMS</Label>
                        <p className="text-sm text-muted-foreground">Recibir alertas críticas por SMS</p>
                      </div>
                      <Switch
                        checked={config.notifications.smsAlerts}
                        onCheckedChange={(checked) =>
                          setConfig((prev) => ({
                            ...prev,
                            notifications: { ...prev.notifications, smsAlerts: checked },
                          }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Configuración de Pagos */}
            <TabsContent value="pagos">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Pasarelas de Pago
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Stripe */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Stripe</Label>
                          <p className="text-sm text-muted-foreground">Procesamiento de tarjetas de crédito</p>
                        </div>
                        <Switch
                          checked={config.paymentGateways.stripe.enabled}
                          onCheckedChange={(checked) =>
                            setConfig((prev) => ({
                              ...prev,
                              paymentGateways: {
                                ...prev.paymentGateways,
                                stripe: { ...prev.paymentGateways.stripe, enabled: checked },
                              },
                            }))
                          }
                        />
                      </div>
                      {config.paymentGateways.stripe.enabled && (
                        <div className="grid md:grid-cols-2 gap-4 ml-6">
                          <div className="space-y-2">
                            <Label htmlFor="stripePublicKey">Clave pública</Label>
                            <Input
                              id="stripePublicKey"
                              value={config.paymentGateways.stripe.publicKey}
                              onChange={(e) =>
                                setConfig((prev) => ({
                                  ...prev,
                                  paymentGateways: {
                                    ...prev.paymentGateways,
                                    stripe: { ...prev.paymentGateways.stripe, publicKey: e.target.value },
                                  },
                                }))
                              }
                              placeholder="pk_test_..."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="stripeSecretKey">Clave secreta</Label>
                            <Input
                              id="stripeSecretKey"
                              type="password"
                              value={config.paymentGateways.stripe.secretKey}
                              onChange={(e) =>
                                setConfig((prev) => ({
                                  ...prev,
                                  paymentGateways: {
                                    ...prev.paymentGateways,
                                    stripe: { ...prev.paymentGateways.stripe, secretKey: e.target.value },
                                  },
                                }))
                              }
                              placeholder="sk_test_..."
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* PayPal */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>PayPal</Label>
                          <p className="text-sm text-muted-foreground">Pagos con PayPal</p>
                        </div>
                        <Switch
                          checked={config.paymentGateways.paypal.enabled}
                          onCheckedChange={(checked) =>
                            setConfig((prev) => ({
                              ...prev,
                              paymentGateways: {
                                ...prev.paymentGateways,
                                paypal: { ...prev.paymentGateways.paypal, enabled: checked },
                              },
                            }))
                          }
                        />
                      </div>
                      {config.paymentGateways.paypal.enabled && (
                        <div className="grid md:grid-cols-2 gap-4 ml-6">
                          <div className="space-y-2">
                            <Label htmlFor="paypalClientId">Client ID</Label>
                            <Input
                              id="paypalClientId"
                              value={config.paymentGateways.paypal.clientId}
                              onChange={(e) =>
                                setConfig((prev) => ({
                                  ...prev,
                                  paymentGateways: {
                                    ...prev.paymentGateways,
                                    paypal: { ...prev.paymentGateways.paypal, clientId: e.target.value },
                                  },
                                }))
                              }
                              placeholder="AYjcyDQQpLO6..."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="paypalClientSecret">Client Secret</Label>
                            <Input
                              id="paypalClientSecret"
                              type="password"
                              value={config.paymentGateways.paypal.clientSecret}
                              onChange={(e) =>
                                setConfig((prev) => ({
                                  ...prev,
                                  paymentGateways: {
                                    ...prev.paymentGateways,
                                    paypal: { ...prev.paymentGateways.paypal, clientSecret: e.target.value },
                                  },
                                }))
                              }
                              placeholder="EHLNXJlAIxjhwVBwRbg..."
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* MercadoPago */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>MercadoPago</Label>
                          <p className="text-sm text-muted-foreground">Pagos en Latinoamérica</p>
                        </div>
                        <Switch
                          checked={config.paymentGateways.mercadoPago.enabled}
                          onCheckedChange={(checked) =>
                            setConfig((prev) => ({
                              ...prev,
                              paymentGateways: {
                                ...prev.paymentGateways,
                                mercadoPago: { ...prev.paymentGateways.mercadoPago, enabled: checked },
                              },
                            }))
                          }
                        />
                      </div>
                      {config.paymentGateways.mercadoPago.enabled && (
                        <div className="ml-6">
                          <div className="space-y-2">
                            <Label htmlFor="mercadoPagoAccessToken">Access Token</Label>
                            <Input
                              id="mercadoPagoAccessToken"
                              type="password"
                              value={config.paymentGateways.mercadoPago.accessToken}
                              onChange={(e) =>
                                setConfig((prev) => ({
                                  ...prev,
                                  paymentGateways: {
                                    ...prev.paymentGateways,
                                    mercadoPago: { ...prev.paymentGateways.mercadoPago, accessToken: e.target.value },
                                  },
                                }))
                              }
                              placeholder="TEST-1234567890..."
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Configuración de Envíos */}
            <TabsContent value="envios">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Configuración de Envíos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="freeShippingThreshold">Envío gratis desde ($)</Label>
                      <Input
                        id="freeShippingThreshold"
                        type="number"
                        value={config.shipping.freeShippingThreshold}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            shipping: { ...prev.shipping, freeShippingThreshold: Number(e.target.value) },
                          }))
                        }
                        placeholder="50.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="defaultShippingCost">Costo de envío estándar ($)</Label>
                      <Input
                        id="defaultShippingCost"
                        type="number"
                        value={config.shipping.defaultShippingCost}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            shipping: { ...prev.shipping, defaultShippingCost: Number(e.target.value) },
                          }))
                        }
                        placeholder="5.99"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="expeditedShippingCost">Costo de envío express ($)</Label>
                      <Input
                        id="expeditedShippingCost"
                        type="number"
                        value={config.shipping.expeditedShippingCost}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            shipping: { ...prev.shipping, expeditedShippingCost: Number(e.target.value) },
                          }))
                        }
                        placeholder="12.99"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="packagingCost">Costo de empaquetado ($)</Label>
                      <Input
                        id="packagingCost"
                        type="number"
                        value={config.shipping.packagingCost}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            shipping: { ...prev.shipping, packagingCost: Number(e.target.value) },
                          }))
                        }
                        placeholder="1.50"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Envíos internacionales</Label>
                      <p className="text-sm text-muted-foreground">Permitir envíos fuera del país</p>
                    </div>
                    <Switch
                      checked={config.shipping.internationalShipping}
                      onCheckedChange={(checked) =>
                        setConfig((prev) => ({
                          ...prev,
                          shipping: { ...prev.shipping, internationalShipping: checked },
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
