"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Edit, ShoppingCart, Package, CreditCard, Truck } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import axios from 'axios'
import { apiurl } from '@/config'
import { format } from 'date-fns'

interface User {
  _id: string
  fullname: string
  email: string
  role: string
  createdAt: string
}

interface OrderItem {
  product_id: string
  name: string
  quantity: number
  price: number
}

interface Order {
  _id: string
  user_id: string
  items: OrderItem[]
  subtotal: number
  shipping_fee: number
  tax: number
  total: number
  shipping_address: string
  payment_method: string
  payment_status: string
  order_status: string
  tracking_number?: string
  created_at: string
}

export default function UserProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        
        const userResponse = await axios.get(`${apiurl}/users/me`,{headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }})
        setUser(userResponse.data.data.user)
        setFormData({
          fullname: userResponse.data.data.user.fullname,
          email: userResponse.data.data.user.email
        })

        const ordersResponse = await axios.get(`${apiurl}/orders`,{
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        setOrders(ordersResponse.data.data.orders)
      } catch (error) {
        toast.error('Failed to load user data')
        // router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      await axios.patch(`${apiurl}/users/${user?._id}`, {
        fullname: formData.fullname
      },{
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      toast.success('Profile updated successfully')
      setEditMode(false)
      const userResponse = await axios.get(`${apiurl}/users/me`,{
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setUser(userResponse.data.data.user)
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card': return <CreditCard className="h-4 w-4 mr-2" />
      case 'paypal': return <CreditCard className="h-4 w-4 mr-2" />
      case 'bank_transfer': return <CreditCard className="h-4 w-4 mr-2" />
      case 'cash_on_delivery': return <CreditCard className="h-4 w-4 mr-2" />
      default: return <CreditCard className="h-4 w-4 mr-2" />
    }
  }

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'processing': return <Badge variant="secondary">Processing</Badge>
      case 'shipped': return <Badge className="bg-blue-500">Shipped</Badge>
      case 'delivered': return <Badge>Delivered</Badge>
      case 'cancelled': return <Badge variant="destructive">Cancelled</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-1/4 bg-muted rounded"></div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-4">
              <div className="h-64 bg-muted rounded-lg"></div>
              <div className="h-8 w-3/4 bg-muted rounded"></div>
              <div className="h-4 w-full bg-muted rounded"></div>
            </div>
            <div className="md:col-span-2 space-y-4">
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-64 bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
        <p className="text-muted-foreground mb-8">We couldn't find your user information.</p>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        size="sm" 
        className="mb-6" 
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid md:grid-cols-3 gap-8">
        {/* User Profile Card */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your account details</CardDescription>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input
                      id="fullname"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      value={formData.email}
                      disabled
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleSaveProfile} disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="outline" onClick={() => setEditMode(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{user.fullname}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Type</p>
                    <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                      {user.role === 'admin' ? 'Admin' : 'Standard User'}
                    </Badge>
                  </div>
                  <div>
                    {/* <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium">
                      {format(new Date(user.createdAt), 'MMMM d, yyyy')}
                    </p> */}
                  </div>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setEditMode(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order History */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Your recent purchases</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No orders yet</h3>
                  <p className="text-muted-foreground mt-2">
                    Your order history will appear here
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href="/products">Browse Products</Link>
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">
                          #{order._id.slice(-6).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          {format(new Date(order.created_at), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          {getOrderStatusBadge(order.order_status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/orders`}>
                              View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}