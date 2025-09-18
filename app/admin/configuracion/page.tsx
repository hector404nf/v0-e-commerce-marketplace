"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Building2, CreditCard, Bell, Truck, Globe, Receipt, Trash2, Plus, Save } from "lucide-react"

interface TaxRate {
  id: string
  name: string
  rate: number
  description: string
  isDefault: boolean
}

interface BillingConfig {
  companyName: string
  taxId: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
  email: string
  website: string
  currency: string
  invoicePrefix: string
  invoiceNumberFormat: string
  nextInvoiceNumber: number
  invoiceTemplate: string
  autoGenerateInvoices: boolean
  includeQRCode: boolean
  footerText: string
  bankName: string
  accountNumber: string
  iban: string
  swiftCode: string
  paymentTerms: string
  latePaymentFee: number
  earlyPaymentDiscount: number
  taxRates: TaxRate[]
  defaultTaxRate: string
}

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [isLoading, setIsLoading] = useState(false)

  // Estados para configuración general
  const [generalConfig, setGeneralConfig] = useState({
    storeName: "TechStore Pro",
    storeDescription: "Tu tienda de tecnología de confianza",
    storeEmail: "contacto@techstore.com",
    storePhone: "+34 123 456 789",
    timezone: "Europe/Madrid",
    language: "es",
    dateFormat: "DD/MM/YYYY",
    logo: "",
    favicon: "",
  })

  // Estados para configuración de facturación
  const [billingConfig, setBillingConfig] = useState<BillingConfig>({
    companyName: "TechStore Pro S.L.",
    taxId: "B12345678",
    address: "Calle Principal 123",
    city: "Madrid",
    state: "Madrid",
    postalCode: "28001",
    country: "España",
    phone: "+34 123 456 789",
    email: "facturacion@techstore.com",
    website: "www.techstore.com",
    currency: "EUR",
    invoicePrefix: "FAC",
    invoiceNumberFormat: "{prefix}-{year}-{number:4}",
    nextInvoiceNumber: 1001,
    invoiceTemplate: "default",
    autoGenerateInvoices: true,
    includeQRCode: true,
    footerText: "Gracias por su compra. Para cualquier consulta, contacte con nosotros.",
    bankName: "Banco Santander",
    accountNumber: "1234 5678 9012 3456",
    iban: "ES91 2100 0418 4502 0005 1332",
    swiftCode: "BSCHESMM",
    paymentTerms: "30",
    latePaymentFee: 2.5,
    earlyPaymentDiscount: 2.0,
    taxRates: [
      { id: "1", name: "IVA General", rate: 21, description: "IVA general del 21%", isDefault: true },
      { id: "2", name: "IVA Reducido", rate: 10, description: "IVA reducido del 10%", isDefault: false },
      { id: "3", name: "IVA Superreducido", rate: 4, description: "IVA superreducido del 4%", isDefault: false },
    ],
    defaultTaxRate: "1",
  })

  // Estados para notificaciones
  const [notificationConfig, setNotificationConfig] = useState({
    newOrderEmail: true,
    newOrderSMS: false,
    lowStockEmail: true,
    lowStockSMS: false,
    customerMessageEmail: true,
    customerMessageSMS: false,
    dailyReportEmail: true,
    weeklyReportEmail: true,
    monthlyReportEmail: false,
  })

  // Estados para pagos
  const [paymentConfig, setPaymentConfig] = useState({
    stripeEnabled: true,
    stripePublicKey: "pk_test_...",
    stripeSecretKey: "sk_test_...",
    paypalEnabled: true,
    paypalClientId: "client_id_...",
    paypalClientSecret: "client_secret_...",
    mercadopagoEnabled: false,
    mercadopagoAccessToken: "",
  })

  // Estados para envíos
  const [shippingConfig, setShippingConfig] = useState({
    freeShippingThreshold: 50,
    standardShippingCost: 5.99,
    expressShippingCost: 12.99,
    packagingCost: 1.5,
    internationalShipping: true,
    internationalShippingCost: 25.99,
  })

  // Cargar configuración desde localStorage
  useEffect(() => {
    const savedBillingConfig = localStorage.getItem("billingConfig")
    if (savedBillingConfig) {
      setBillingConfig(JSON.parse(savedBillingConfig))
    }
  }, [])

  const handleSaveConfig = async () => {
    setIsLoading(true)
    try {
      // Simular guardado
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Guardar en localStorage
      localStorage.setItem("billingConfig", JSON.stringify(billingConfig))

      toast.success("Configuración guardada correctamente")
    } catch (error) {
      toast.error("Error al guardar la configuración")
    } finally {
      setIsLoading(false)
    }
  }

  const addTaxRate = () => {
    const newTaxRate: TaxRate = {
      id: Date.now().toString(),
      name: "",
      rate: 0,
      description: "",
      isDefault: false,
    }
    setBillingConfig((prev) => ({
      ...prev,
      taxRates: [...prev.taxRates, newTaxRate],
    }))
  }

  const removeTaxRate = (id: string) => {
    setBillingConfig((prev) => ({
      ...prev,
      taxRates: prev.taxRates.filter((rate) => rate.id !== id),
    }))
  }

  const updateTaxRate = (id: string, field: keyof TaxRate, value: any) => {
    setBillingConfig((prev) => ({
      ...prev,
      taxRates: prev.taxRates.map((rate) => (rate.id === id ? { ...rate, [field]: value } : rate)),
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
          <p className="text-muted-foreground">Gestiona la configuración de tu tienda y preferencias</p>
        </div>
        <Button onClick={handleSaveConfig} disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Facturación
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Pagos
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Envíos
          </TabsTrigger>
        </TabsList>

        {/* Configuración General */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Información de la Tienda
              </CardTitle>
              <CardDescription>Configuración básica de tu tienda online</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Nombre de la tienda</Label>
                  <Input
                    id="storeName"
                    value={generalConfig.storeName}
                    onChange={(e) => setGeneralConfig((prev) => ({ ...prev, storeName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Email de contacto</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={generalConfig.storeEmail}
                    onChange={(e) => setGeneralConfig((prev) => ({ ...prev, storeEmail: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Teléfono</Label>
                  <Input
                    id="storePhone"
                    value={generalConfig.storePhone}
                    onChange={(e) => setGeneralConfig((prev) => ({ ...prev, storePhone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona horaria</Label>
                  <Select
                    value={generalConfig.timezone}
                    onValueChange={(value) => setGeneralConfig((prev) => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Madrid">Europa/Madrid</SelectItem>
                      <SelectItem value="America/Mexico_City">América/Ciudad de México</SelectItem>
                      <SelectItem value="America/New_York">América/Nueva York</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeDescription">Descripción</Label>
                <Textarea
                  id="storeDescription"
                  value={generalConfig.storeDescription}
                  onChange={(e) => setGeneralConfig((prev) => ({ ...prev, storeDescription: e.target.value }))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Facturación */}
        <TabsContent value="billing" className="space-y-6">
          {/* Datos Fiscales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Datos Fiscales de la Empresa
              </CardTitle>
              <CardDescription>Información que aparecerá en las facturas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nombre de la empresa</Label>
                  <Input
                    id="companyName"
                    value={billingConfig.companyName}
                    onChange={(e) => setBillingConfig((prev) => ({ ...prev, companyName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">NIF/CIF</Label>
                  <Input
                    id="taxId"
                    value={billingConfig.taxId}
                    onChange={(e) => setBillingConfig((prev) => ({ ...prev, taxId: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={billingConfig.address}
                    onChange={(e) => setBillingConfig((prev) => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    value={billingConfig.city}
                    onChange={(e) => setBillingConfig((prev) => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Provincia/Estado</Label>
                  <Input
                    id="state"
                    value={billingConfig.state}
                    onChange={(e) => setBillingConfig((prev) => ({ ...prev, state: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Código postal</Label>
                  <Input
                    id="postalCode"
                    value={billingConfig.postalCode}
                    onChange={(e) => setBillingConfig((prev) => ({ ...prev, postalCode: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <Select
                    value={billingConfig.country}
                    onValueChange={(value) => setBillingConfig((prev) => ({ ...prev, country: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="España">España</SelectItem>
                      <SelectItem value="México">México</SelectItem>
                      <SelectItem value="Argentina">Argentina</SelectItem>
                      <SelectItem value="Colombia">Colombia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Moneda</Label>
                  <Select
                    value={billingConfig.currency}
                    onValueChange={(value) => setBillingConfig((prev) => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="USD">Dólar ($)</SelectItem>
                      <SelectItem value="MXN">Peso Mexicano ($)</SelectItem>
                      <SelectItem value="ARS">Peso Argentino ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={billingConfig.phone}
                    onChange={(e) => setBillingConfig((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={billingConfig.email}
                    onChange={(e) => setBillingConfig((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Sitio web</Label>
                  <Input
                    id="website"
                    value={billingConfig.website}
                    onChange={(e) => setBillingConfig((prev) => ({ ...prev, website: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuración de Impuestos */}
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Impuestos</CardTitle>
              <CardDescription>Gestiona las tasas de impuestos para tus productos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Tasas de Impuestos</h4>
                <Button onClick={addTaxRate} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir Impuesto
                </Button>
              </div>
              <div className="space-y-3">
                {billingConfig.taxRates.map((taxRate) => (
                  <div key={taxRate.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                      <Input
                        placeholder="Nombre del impuesto"
                        value={taxRate.name}
                        onChange={(e) => updateTaxRate(taxRate.id, "name", e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Tasa (%)"
                        value={taxRate.rate}
                        onChange={(e) => updateTaxRate(taxRate.id, "rate", Number.parseFloat(e.target.value) || 0)}
                      />
                      <Input
                        placeholder="Descripción"
                        value={taxRate.description}
                        onChange={(e) => updateTaxRate(taxRate.id, "description", e.target.value)}
                      />
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={taxRate.isDefault}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setBillingConfig((prev) => ({
                                ...prev,
                                taxRates: prev.taxRates.map((rate) => ({
                                  ...rate,
                                  isDefault: rate.id === taxRate.id,
                                })),
                                defaultTaxRate: taxRate.id,
                              }))
                            }
                          }}
                        />
                        <Label className="text-sm">Por defecto</Label>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeTaxRate(taxRate.id)}
                      disabled={billingConfig.taxRates.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Configuración de Facturas */}
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Facturas</CardTitle>
              <CardDescription>Personaliza el formato y numeración de las facturas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoicePrefix">Prefijo de factura</Label>
                  <Input
                    id="invoicePrefix"
                    value={billingConfig.invoicePrefix}
                    onChange={(e) => setBillingConfig((prev) => ({ ...prev, invoicePrefix: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumberFormat">Formato de numeración</Label>
                  <Input
                    id="invoiceNumberFormat"
                    value={billingConfig.invoiceNumberFormat}
                    onChange={(e) => setBillingConfig((prev) => ({ ...prev, invoiceNumberFormat: e.target.value }))}
                    placeholder="{prefix}-{year}-{number:4}"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextInvoiceNumber">Próximo número</Label>
                  <Input
                    id="nextInvoiceNumber"
                    type="number"
                    value={billingConfig.nextInvoiceNumber}
                    onChange={(e) =>
                      setBillingConfig((prev) => ({ ...prev, nextInvoiceNumber: Number.parseInt(e.target.value) || 1 }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoiceTemplate">Plantilla de factura</Label>
                <Select
                  value={billingConfig.invoiceTemplate}
                  onValueChange={(value) => setBillingConfig((prev) => ({ ...prev, invoiceTemplate: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Por defecto</SelectItem>
                    <SelectItem value="modern">Moderna</SelectItem>
                    <SelectItem value="classic">Clásica</SelectItem>
                    <SelectItem value="minimal">Minimalista</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="autoGenerateInvoices"
                  checked={billingConfig.autoGenerateInvoices}
                  onCheckedChange={(checked) =>
                    setBillingConfig((prev) => ({ ...prev, autoGenerateInvoices: checked }))
                  }
                />
                <Label htmlFor="autoGenerateInvoices">Generar facturas automáticamente al confirmar pedidos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="includeQRCode"
                  checked={billingConfig.includeQRCode}
                  onCheckedChange={(checked) => setBillingConfig((prev) => ({ ...prev, includeQRCode: checked }))}
                />
                <Label htmlFor="includeQRCode">Incluir código QR para verificación</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="footerText">Texto del pie de factura</Label>
                <Textarea
                  id="footerText"
                  value={billingConfig.footerText}
                  onChange={(e) => setBillingConfig((prev) => ({ ...prev, footerText: e.target.value }))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Datos Bancarios */}
          <Card>
            <CardHeader>
              <CardTitle>Datos Bancarios</CardTitle>
              <CardDescription>Información bancaria para transferencias y pagos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Nombre del banco</Label>
                  <Input
                    id="bankName"
                    value={billingConfig.bankName}
                    onChange={(e) => setBillingConfig((prev) => ({ ...prev, bankName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Número de cuenta</Label>
                  <Input
                    id="accountNumber"
                    value={billingConfig.accountNumber}
                    onChange={(e) => setBillingConfig((prev) => ({ ...prev, accountNumber: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="iban">IBAN</Label>
                  <Input
                    id="iban"
                    value={billingConfig.iban}
                    onChange={(e) => setBillingConfig((prev) => ({ ...prev, iban: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="swiftCode">Código SWIFT/BIC</Label>
                  <Input
                    id="swiftCode"
                    value={billingConfig.swiftCode}
                    onChange={(e) => setBillingConfig((prev) => ({ ...prev, swiftCode: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Términos de Pago */}
          <Card>
            <CardHeader>
              <CardTitle>Términos de Pago</CardTitle>
              <CardDescription>Configuración de plazos y condiciones de pago</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Plazo de pago (días)</Label>
                  <Select
                    value={billingConfig.paymentTerms}
                    onValueChange={(value) => setBillingConfig((prev) => ({ ...prev, paymentTerms: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Inmediato</SelectItem>
                      <SelectItem value="15">15 días</SelectItem>
                      <SelectItem value="30">30 días</SelectItem>
                      <SelectItem value="60">60 días</SelectItem>
                      <SelectItem value="90">90 días</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="latePaymentFee">Recargo por pago tardío (%)</Label>
                  <Input
                    id="latePaymentFee"
                    type="number"
                    step="0.1"
                    value={billingConfig.latePaymentFee}
                    onChange={(e) =>
                      setBillingConfig((prev) => ({ ...prev, latePaymentFee: Number.parseFloat(e.target.value) || 0 }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="earlyPaymentDiscount">Descuento por pago anticipado (%)</Label>
                  <Input
                    id="earlyPaymentDiscount"
                    type="number"
                    step="0.1"
                    value={billingConfig.earlyPaymentDiscount}
                    onChange={(e) =>
                      setBillingConfig((prev) => ({
                        ...prev,
                        earlyPaymentDiscount: Number.parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Notificaciones */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificaciones
              </CardTitle>
              <CardDescription>Configura cuándo y cómo recibir notificaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Notificaciones de Pedidos</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="newOrderEmail">Nuevos pedidos por email</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibir notificación cuando llegue un nuevo pedido
                      </p>
                    </div>
                    <Switch
                      id="newOrderEmail"
                      checked={notificationConfig.newOrderEmail}
                      onCheckedChange={(checked) =>
                        setNotificationConfig((prev) => ({ ...prev, newOrderEmail: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="newOrderSMS">Nuevos pedidos por SMS</Label>
                      <p className="text-sm text-muted-foreground">Recibir SMS cuando llegue un nuevo pedido</p>
                    </div>
                    <Switch
                      id="newOrderSMS"
                      checked={notificationConfig.newOrderSMS}
                      onCheckedChange={(checked) =>
                        setNotificationConfig((prev) => ({ ...prev, newOrderSMS: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Notificaciones de Inventario</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="lowStockEmail">Stock bajo por email</Label>
                      <p className="text-sm text-muted-foreground">Alertas cuando el stock esté bajo</p>
                    </div>
                    <Switch
                      id="lowStockEmail"
                      checked={notificationConfig.lowStockEmail}
                      onCheckedChange={(checked) =>
                        setNotificationConfig((prev) => ({ ...prev, lowStockEmail: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="lowStockSMS">Stock bajo por SMS</Label>
                      <p className="text-sm text-muted-foreground">SMS cuando el stock esté bajo</p>
                    </div>
                    <Switch
                      id="lowStockSMS"
                      checked={notificationConfig.lowStockSMS}
                      onCheckedChange={(checked) =>
                        setNotificationConfig((prev) => ({ ...prev, lowStockSMS: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Reportes</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dailyReportEmail">Reporte diario</Label>
                      <p className="text-sm text-muted-foreground">Resumen diario de ventas y actividad</p>
                    </div>
                    <Switch
                      id="dailyReportEmail"
                      checked={notificationConfig.dailyReportEmail}
                      onCheckedChange={(checked) =>
                        setNotificationConfig((prev) => ({ ...prev, dailyReportEmail: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weeklyReportEmail">Reporte semanal</Label>
                      <p className="text-sm text-muted-foreground">Resumen semanal de rendimiento</p>
                    </div>
                    <Switch
                      id="weeklyReportEmail"
                      checked={notificationConfig.weeklyReportEmail}
                      onCheckedChange={(checked) =>
                        setNotificationConfig((prev) => ({ ...prev, weeklyReportEmail: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="monthlyReportEmail">Reporte mensual</Label>
                      <p className="text-sm text-muted-foreground">Análisis mensual completo</p>
                    </div>
                    <Switch
                      id="monthlyReportEmail"
                      checked={notificationConfig.monthlyReportEmail}
                      onCheckedChange={(checked) =>
                        setNotificationConfig((prev) => ({ ...prev, monthlyReportEmail: checked }))
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Pagos */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Pasarelas de Pago
              </CardTitle>
              <CardDescription>Configura los métodos de pago disponibles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stripe */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Stripe</h4>
                    <p className="text-sm text-muted-foreground">Tarjetas de crédito y débito</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={paymentConfig.stripeEnabled ? "default" : "secondary"}>
                      {paymentConfig.stripeEnabled ? "Activo" : "Inactivo"}
                    </Badge>
                    <Switch
                      checked={paymentConfig.stripeEnabled}
                      onCheckedChange={(checked) => setPaymentConfig((prev) => ({ ...prev, stripeEnabled: checked }))}
                    />
                  </div>
                </div>
                {paymentConfig.stripeEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
                    <div className="space-y-2">
                      <Label htmlFor="stripePublicKey">Clave pública</Label>
                      <Input
                        id="stripePublicKey"
                        value={paymentConfig.stripePublicKey}
                        onChange={(e) => setPaymentConfig((prev) => ({ ...prev, stripePublicKey: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stripeSecretKey">Clave secreta</Label>
                      <Input
                        id="stripeSecretKey"
                        type="password"
                        value={paymentConfig.stripeSecretKey}
                        onChange={(e) => setPaymentConfig((prev) => ({ ...prev, stripeSecretKey: e.target.value }))}
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
                    <h4 className="font-medium">PayPal</h4>
                    <p className="text-sm text-muted-foreground">Pagos con PayPal</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={paymentConfig.paypalEnabled ? "default" : "secondary"}>
                      {paymentConfig.paypalEnabled ? "Activo" : "Inactivo"}
                    </Badge>
                    <Switch
                      checked={paymentConfig.paypalEnabled}
                      onCheckedChange={(checked) => setPaymentConfig((prev) => ({ ...prev, paypalEnabled: checked }))}
                    />
                  </div>
                </div>
                {paymentConfig.paypalEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
                    <div className="space-y-2">
                      <Label htmlFor="paypalClientId">Client ID</Label>
                      <Input
                        id="paypalClientId"
                        value={paymentConfig.paypalClientId}
                        onChange={(e) => setPaymentConfig((prev) => ({ ...prev, paypalClientId: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paypalClientSecret">Client Secret</Label>
                      <Input
                        id="paypalClientSecret"
                        type="password"
                        value={paymentConfig.paypalClientSecret}
                        onChange={(e) => setPaymentConfig((prev) => ({ ...prev, paypalClientSecret: e.target.value }))}
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
                    <h4 className="font-medium">MercadoPago</h4>
                    <p className="text-sm text-muted-foreground">Pagos para Latinoamérica</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={paymentConfig.mercadopagoEnabled ? "default" : "secondary"}>
                      {paymentConfig.mercadopagoEnabled ? "Activo" : "Inactivo"}
                    </Badge>
                    <Switch
                      checked={paymentConfig.mercadopagoEnabled}
                      onCheckedChange={(checked) =>
                        setPaymentConfig((prev) => ({ ...prev, mercadopagoEnabled: checked }))
                      }
                    />
                  </div>
                </div>
                {paymentConfig.mercadopagoEnabled && (
                  <div className="ml-4">
                    <div className="space-y-2">
                      <Label htmlFor="mercadopagoAccessToken">Access Token</Label>
                      <Input
                        id="mercadopagoAccessToken"
                        type="password"
                        value={paymentConfig.mercadopagoAccessToken}
                        onChange={(e) =>
                          setPaymentConfig((prev) => ({ ...prev, mercadopagoAccessToken: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Envíos */}
        <TabsContent value="shipping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Configuración de Envíos
              </CardTitle>
              <CardDescription>Gestiona los costos y opciones de envío</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold">Umbral de envío gratis (€)</Label>
                  <Input
                    id="freeShippingThreshold"
                    type="number"
                    step="0.01"
                    value={shippingConfig.freeShippingThreshold}
                    onChange={(e) =>
                      setShippingConfig((prev) => ({
                        ...prev,
                        freeShippingThreshold: Number.parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="standardShippingCost">Costo envío estándar (€)</Label>
                  <Input
                    id="standardShippingCost"
                    type="number"
                    step="0.01"
                    value={shippingConfig.standardShippingCost}
                    onChange={(e) =>
                      setShippingConfig((prev) => ({
                        ...prev,
                        standardShippingCost: Number.parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expressShippingCost">Costo envío express (€)</Label>
                  <Input
                    id="expressShippingCost"
                    type="number"
                    step="0.01"
                    value={shippingConfig.expressShippingCost}
                    onChange={(e) =>
                      setShippingConfig((prev) => ({
                        ...prev,
                        expressShippingCost: Number.parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="packagingCost">Costo de empaquetado (€)</Label>
                  <Input
                    id="packagingCost"
                    type="number"
                    step="0.01"
                    value={shippingConfig.packagingCost}
                    onChange={(e) =>
                      setShippingConfig((prev) => ({ ...prev, packagingCost: Number.parseFloat(e.target.value) || 0 }))
                    }
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="internationalShipping"
                  checked={shippingConfig.internationalShipping}
                  onCheckedChange={(checked) =>
                    setShippingConfig((prev) => ({ ...prev, internationalShipping: checked }))
                  }
                />
                <Label htmlFor="internationalShipping">Permitir envíos internacionales</Label>
              </div>
              {shippingConfig.internationalShipping && (
                <div className="space-y-2">
                  <Label htmlFor="internationalShippingCost">Costo envío internacional (€)</Label>
                  <Input
                    id="internationalShippingCost"
                    type="number"
                    step="0.01"
                    value={shippingConfig.internationalShippingCost}
                    onChange={(e) =>
                      setShippingConfig((prev) => ({
                        ...prev,
                        internationalShippingCost: Number.parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
