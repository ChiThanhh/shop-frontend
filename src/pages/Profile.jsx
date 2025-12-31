import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    User, Mail, Phone, MapPin, Lock, Bell,
    Camera, Save, Plus, Trash2, Check, Edit,
    Home as HomeIcon, X
} from 'lucide-react';
import { toast } from 'sonner';
import { useLoading } from '@/context/loadingContext';
import { getAllProvinces, getAllDistricts, getAllWards, createMyAddress, updateMyAddress, getMyAddresses, deleteMyAddress, setDefaultAddress } from '@/services/AddressService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getUserProfile, updateUserProfile } from '@/services/UserService';
import { useConfirm } from '@/context/confirmContext';

export default function Profile() {
    const { withLoading } = useLoading();
    const [user, setUser] = useState({});
    const { confirm } = useConfirm();
    const [activeTab, setActiveTab] = useState('personal');
    const [avatarPreview, setAvatarPreview] = useState('');

    // Personal Info State
    const [personalInfo, setPersonalInfo] = useState({
        full_name: '',
        phone: '',
        email: ''
    });

    useEffect(() => {
        if (user.full_name || user.phone || user.email) {
            setPersonalInfo({
                full_name: user.full_name || '',
                phone: user.phone || '',
                email: user.email || ''
            });
        }
        if (user.avatar_url) {
            setAvatarPreview(user.avatar_url);
        }
    }, [user]);

    // Address State
    const [addresses, setAddresses] = useState([]);
    const [showAddressDialog, setShowAddressDialog] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [addressForm, setAddressForm] = useState({
        label: '',
        full_name: '',
        phone: '',
        province: '',
        district: '',
        ward: '',
        province_name: '',
        district_name: '',
        ward_name: '',
        street: '',
        isDefault: false
    });

    // Location data
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    // Password State
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Notification Settings
    const [notifications, setNotifications] = useState({
        orderUpdates: true,
        promotions: true,
        newsletter: false,
        productRestock: true,
        priceDrops: true,
        sms: false,
        email: true,
        push: true
    });
    const fetchAddresses = async () => {
        try {
            const res = await getMyAddresses();
            setAddresses(res.data || []);
            console.log('Fetched addresses:', res.data);
        }
        catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };
    // Fetch provinces on mount
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const resUser = await getUserProfile();
                const res = await getAllProvinces();

                setProvinces(res.data || []);
                setUser(resUser.data);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };
        fetchProvinces();
        fetchAddresses();
    }, []);

    // Fetch districts when province changes
    const handleProvinceChange = async (provinceCode) => {
        const selectedProvince = provinces.find(p => p.code.toString() === provinceCode);
        setAddressForm(prev => ({
            ...prev,
            province: provinceCode,
            province_name: selectedProvince?.name || '',
            district: '',
            district_name: '',
            ward: '',
            ward_name: ''
        }));
        setDistricts([]);
        setWards([]);

        try {
            const res = await getAllDistricts(provinceCode);
            setDistricts(res.data?.districts || []);
        } catch (error) {
            console.error('Error fetching districts:', error);
        }
    };

    // Fetch wards when district changes
    const handleDistrictChange = async (districtCode) => {
        const selectedDistrict = districts.find(d => d.code.toString() === districtCode);
        setAddressForm(prev => ({
            ...prev,
            district: districtCode,
            district_name: selectedDistrict?.name || '',
            ward: '',
            ward_name: ''
        }));
        setWards([]);

        try {
            const res = await getAllWards(districtCode);
            setWards(res.data?.wards || []);
        } catch (error) {
            console.error('Error fetching wards:', error);
        }
    };

    // Handle avatar upload
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Save personal info
    const handleSavePersonalInfo = () => {
        withLoading(async () => {
            try {
                await updateUserProfile(personalInfo);
                setUser(prev => ({
                    ...prev,
                    full_name: personalInfo.full_name,
                    phone: personalInfo.phone
                }));
                toast.success('Cập nhật thông tin cá nhân thành công!');
            } catch (error) {
                console.error('Error updating profile:', error);
            }
        });
    };

    // Add/Edit Address
    const handleSaveAddress = () => {
        if (!addressForm.full_name || !addressForm.phone || !addressForm.province || !addressForm.district || !addressForm.ward || !addressForm.street) {
            toast.error('Vui lòng điền đầy đủ thông tin!');
            return;
        }


        withLoading(async () => {
            if (editingAddress) {
                await updateMyAddress(editingAddress.address_id, {
                    label: addressForm.label,
                    full_name: addressForm.full_name,
                    phone: addressForm.phone,
                    province: addressForm.province,
                    district: addressForm.district,
                    ward: addressForm.ward,
                    province_name: addressForm.province_name,
                    district_name: addressForm.district_name,
                    ward_name: addressForm.ward_name,
                    line1: addressForm.street,
                    is_default: addressForm.isDefault
                });
                await fetchAddresses();
                toast.success('Cập nhật địa chỉ thành công!');
            } else {
                try {
                    await createMyAddress({
                        label: addressForm.label,
                        full_name: addressForm.full_name,
                        phone: addressForm.phone,
                        province: addressForm.province,
                        district: addressForm.district,
                        ward: addressForm.ward,
                        province_name: addressForm.province_name,
                        district_name: addressForm.district_name,
                        ward_name: addressForm.ward_name,
                        line1: addressForm.street,
                        is_default: addressForm.isDefault
                    });
                    toast.success('Thêm địa chỉ thành công!');

                } catch (error) {
                    console.error('Error creating address:', error);
                }

            }
            await fetchAddresses();
            setShowAddressDialog(false);
            resetAddressForm();
        });
    };

    // Delete Address
    const handleDeleteAddress = async (id) => {
        const ok = await confirm('Bạn có chắc chắn muốn xóa địa chỉ này?');
        if (ok) {
            withLoading(async () => {
                await deleteMyAddress(id);
                await fetchAddresses();
            });
        }
        toast.success('Xóa địa chỉ thành công!');
    };

    // Set default address
    const handleSetDefault = (id) => {
        withLoading(async () => {
            await setDefaultAddress(id);
            await fetchAddresses();
        });
        toast.success('Đã đặt làm địa chỉ mặc định!');
    };

    // Open address dialog for editing
    const handleEditAddress = async (address) => {
        setEditingAddress(address);
        setAddressForm({
            label: address.label || '',
            full_name: address.full_name || '',
            phone: address.phone || '',
            province: address.province || '',
            district: address.district || '',
            ward: address.ward || '',
            province_name: address.province_name || '',
            district_name: address.district_name || '',
            ward_name: address.ward_name || '',
            street: address.line1 || '',
            isDefault: address.is_default || false
        });

        // Load districts if province exists
        if (address.province) {
            try {
                const res = await getAllDistricts(address.province);
                setDistricts(res.data?.districts || []);
            } catch (error) {
                console.error('Error fetching districts:', error);
            }
        }

        // Load wards if district exists
        if (address.district) {
            try {
                const res = await getAllWards(address.district);
                setWards(res.data?.wards || []);
            } catch (error) {
                console.error('Error fetching wards:', error);
            }
        }

        setShowAddressDialog(true);
    };

    // Reset address form
    const resetAddressForm = () => {
        setEditingAddress(null);
        setAddressForm({
            label: '',
            full_name: '',
            phone: '',
            province: '',
            district: '',
            ward: '',
            province_name: '',
            district_name: '',
            ward_name: '',
            street: '',
            isDefault: false
        });
        setDistricts([]);
        setWards([]);
    };

    // Change password
    const handleChangePassword = () => {
        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            toast.error('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Mật khẩu mới không khớp!');
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }

        withLoading(async () => {
            // API call here
            await new Promise(resolve => setTimeout(resolve, 1000));
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            toast.success('Đổi mật khẩu thành công!');
        });
    };

    // Save notification settings
    const handleSaveNotifications = () => {
        withLoading(async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            toast.success('Lưu cài đặt thông báo thành công!');
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Tài khoản của tôi</h1>
                    <p className="text-gray-600 dark:text-gray-400">Quản lý thông tin cá nhân và cài đặt tài khoản</p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-8">
                        <TabsTrigger value="personal" className="flex items-center gap-2">
                            <User className="size-4" />
                            <span className="hidden sm:inline">Thông tin</span>
                        </TabsTrigger>
                        <TabsTrigger value="address" className="flex items-center gap-2">
                            <MapPin className="size-4" />
                            <span className="hidden sm:inline">Địa chỉ</span>
                        </TabsTrigger>
                        <TabsTrigger value="password" className="flex items-center gap-2">
                            <Lock className="size-4" />
                            <span className="hidden sm:inline">Mật khẩu</span>
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="flex items-center gap-2">
                            <Bell className="size-4" />
                            <span className="hidden sm:inline">Thông báo</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Personal Information Tab */}
                    <TabsContent value="personal">
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin cá nhân</CardTitle>
                                <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Avatar */}
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <img
                                            src={avatarPreview}
                                            alt="Avatar"
                                            className="size-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                                        />
                                        <label
                                            htmlFor="avatar-upload"
                                            className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                                        >
                                            <Camera className="size-4" />
                                            <input
                                                id="avatar-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleAvatarChange}
                                            />
                                        </label>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{user.full_name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Họ và tên</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 size-4 text-gray-400" />
                                            <Input
                                                id="name"
                                                value={personalInfo.full_name}
                                                onChange={(e) => setPersonalInfo(prev => ({ ...prev, full_name: e.target.value }))}
                                                className="pl-10"
                                                placeholder="Nhập họ và tên"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 size-4 text-gray-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={personalInfo.email}
                                                disabled
                                                className="pl-10 bg-gray-100 dark:bg-gray-800"
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500">Email không thể thay đổi</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Số điện thoại</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 size-4 text-gray-400" />
                                            <Input
                                                id="phone"
                                                value={personalInfo.phone}
                                                onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
                                                className="pl-10"
                                                placeholder="0123456789"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button onClick={handleSavePersonalInfo} className="w-full sm:w-auto">
                                    <Save className="size-4 mr-2" />
                                    Lưu thay đổi
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Address Tab */}
                    <TabsContent value="address">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Địa chỉ giao hàng</CardTitle>
                                        <CardDescription>Quản lý địa chỉ giao hàng của bạn</CardDescription>
                                    </div>

                                    <Button disabled={addresses.length >= 4 && !editingAddress} onClick={() => setShowAddressDialog(true)}>
                                        <Plus className="size-4 mr-2" />
                                        Thêm địa chỉ
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {addresses.map((address) => (
                                    <div
                                        key={address.id}
                                        className="border rounded-lg p-4 hover:border-primary transition-colors relative"
                                    >
                                        {address.isDefault && (
                                            <Badge className="absolute top-4 right-4">Mặc định</Badge>
                                        )}

                                        <div className="space-y-2 pr-24">
                                            <div className="flex items-center gap-2">
                                                <HomeIcon className="size-4 text-gray-500" />
                                                <h4 className="font-semibold">{address.label}</h4>
                                            </div>
                                            <p className="text-sm"><strong>{address.full_name}</strong> | {address.phone}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {address.line1}, {address.ward_name || address.ward}, {address.district_name || address.district}, {address.province_name || address.province}
                                            </p>
                                        </div>

                                        <div className="flex gap-2 mt-4">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEditAddress(address)}
                                            >
                                                <Edit className="size-3 mr-1" />
                                                Sửa
                                            </Button>
                                            {address.is_default && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="bg-green-600 text-white hover:bg-green-600 hover:text-white"
                                            
                                                    >
                                                        <Check className="size-3 mr-1" />
                                                        Mặc định
                                                    </Button>
                                           
                                                </>
                                            )}
                                            {!address.is_default && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleSetDefault(address.address_id)}
                                                    >
                                                        <Check className="size-3 mr-1" />
                                                        Đặt mặc định
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleDeleteAddress(address.address_id)}
                                                    >
                                                        <Trash2 className="size-3 mr-1" />
                                                        Xóa
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Password Tab */}
                    <TabsContent value="password">
                        <Card>
                            <CardHeader>
                                <CardTitle>Đổi mật khẩu</CardTitle>
                                <CardDescription>Cập nhật mật khẩu để bảo mật tài khoản</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 size-4 text-gray-400" />
                                        <Input
                                            id="current-password"
                                            type="password"
                                            value={passwordForm.currentPassword}
                                            onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                            className="pl-10"
                                            placeholder="Nhập mật khẩu hiện tại"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="new-password">Mật khẩu mới</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 size-4 text-gray-400" />
                                        <Input
                                            id="new-password"
                                            type="password"
                                            value={passwordForm.newPassword}
                                            onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                            className="pl-10"
                                            placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 size-4 text-gray-400" />
                                        <Input
                                            id="confirm-password"
                                            type="password"
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                            className="pl-10"
                                            placeholder="Nhập lại mật khẩu mới"
                                        />
                                    </div>
                                </div>

                                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                                    <p className="text-sm text-amber-800 dark:text-amber-200">
                                        <strong>Lưu ý:</strong> Mật khẩu phải có ít nhất 6 ký tự và bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
                                    </p>
                                </div>

                                <Button onClick={handleChangePassword} className="w-full sm:w-auto">
                                    <Lock className="size-4 mr-2" />
                                    Đổi mật khẩu
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications">
                        <Card>
                            <CardHeader>
                                <CardTitle>Cài đặt thông báo</CardTitle>
                                <CardDescription>Quản lý các loại thông báo bạn muốn nhận</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Order Notifications */}
                                <div>
                                    <h4 className="font-semibold mb-4">Thông báo đơn hàng</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="order-updates">Cập nhật đơn hàng</Label>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Nhận thông báo khi đơn hàng có cập nhật
                                                </p>
                                            </div>
                                            <Switch
                                                id="order-updates"
                                                checked={notifications.orderUpdates}
                                                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, orderUpdates: checked }))}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Marketing Notifications */}
                                <div className="border-t pt-6">
                                    <h4 className="font-semibold mb-4">Thông báo khuyến mãi</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="promotions">Chương trình khuyến mãi</Label>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Nhận thông tin về các chương trình ưu đãi
                                                </p>
                                            </div>
                                            <Switch
                                                id="promotions"
                                                checked={notifications.promotions}
                                                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, promotions: checked }))}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="newsletter">Bản tin</Label>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Nhận bản tin về xu hướng thời trang mới
                                                </p>
                                            </div>
                                            <Switch
                                                id="newsletter"
                                                checked={notifications.newsletter}
                                                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, newsletter: checked }))}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Product Notifications */}
                                <div className="border-t pt-6">
                                    <h4 className="font-semibold mb-4">Thông báo sản phẩm</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="restock">Hàng về lại</Label>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Thông báo khi sản phẩm hết hàng có lại
                                                </p>
                                            </div>
                                            <Switch
                                                id="restock"
                                                checked={notifications.productRestock}
                                                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, productRestock: checked }))}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="price-drops">Giảm giá</Label>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Thông báo khi sản phẩm yêu thích giảm giá
                                                </p>
                                            </div>
                                            <Switch
                                                id="price-drops"
                                                checked={notifications.priceDrops}
                                                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, priceDrops: checked }))}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Notification Channels */}
                                <div className="border-t pt-6">
                                    <h4 className="font-semibold mb-4">Kênh nhận thông báo</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="email-notif">Email</Label>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Nhận thông báo qua email
                                                </p>
                                            </div>
                                            <Switch
                                                id="email-notif"
                                                checked={notifications.email}
                                                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="sms-notif">SMS</Label>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Nhận thông báo qua tin nhắn
                                                </p>
                                            </div>
                                            <Switch
                                                id="sms-notif"
                                                checked={notifications.sms}
                                                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="push-notif">Push Notification</Label>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Nhận thông báo trên trình duyệt
                                                </p>
                                            </div>
                                            <Switch
                                                id="push-notif"
                                                checked={notifications.push}
                                                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button onClick={handleSaveNotifications} className="w-full sm:w-auto">
                                    <Save className="size-4 mr-2" />
                                    Lưu cài đặt
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Address Dialog */}
            <Dialog open={showAddressDialog} onOpenChange={(open) => {
                setShowAddressDialog(open);
                if (!open) resetAddressForm();
            }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingAddress ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}</DialogTitle>
                        <DialogDescription>
                            {editingAddress ? 'Cập nhật thông tin địa chỉ giao hàng' : 'Nhập thông tin địa chỉ giao hàng mới'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="addr-name">Tên địa chỉ *</Label>

                                <Select
                                    fullWidth
                                    value={addressForm.label}
                                    onValueChange={(value) => setAddressForm(prev => ({ ...prev, label: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Nhà riêng/văn phòng" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Nhà riêng">
                                            Nhà riêng
                                        </SelectItem>
                                        <SelectItem value="Văn phòng">
                                            Văn phòng
                                        </SelectItem>

                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="addr-fullname">Họ và tên *</Label>
                                <Input
                                    id="addr-fullname"
                                    value={addressForm.full_name}
                                    onChange={(e) => setAddressForm(prev => ({ ...prev, full_name: e.target.value }))}
                                    placeholder="Nguyễn Văn A"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="addr-phone">Số điện thoại *</Label>
                            <Input
                                id="addr-phone"
                                value={addressForm.phone}
                                onChange={(e) => setAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                                placeholder="0123456789"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="addr-province">Tỉnh/Thành phố *</Label>
                                <Select
                                    value={addressForm.province}
                                    onValueChange={handleProvinceChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn tỉnh/thành" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {provinces.map((province) => (
                                            <SelectItem key={province.code} value={province.code.toString()}>
                                                {province.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="addr-district">Quận/Huyện *</Label>
                                <Select
                                    value={addressForm.district}
                                    onValueChange={handleDistrictChange}
                                    disabled={!addressForm.province}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn quận/huyện" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {districts.map((district) => (
                                            <SelectItem key={district.code} value={district.code.toString()}>
                                                {district.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="addr-ward">Phường/Xã *</Label>
                                <Select
                                    value={addressForm.ward}
                                    onValueChange={(value) => {
                                        const selectedWard = wards.find(w => w.code.toString() === value);
                                        setAddressForm(prev => ({
                                            ...prev,
                                            ward: value,
                                            ward_name: selectedWard?.name || ''
                                        }));
                                    }}
                                    disabled={!addressForm.district}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn phường/xã" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {wards.map((ward) => (
                                            <SelectItem key={ward.code} value={ward.code.toString()}>
                                                {ward.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="addr-street">Địa chỉ cụ thể *</Label>
                            <Input
                                id="addr-street"
                                value={addressForm.street}
                                onChange={(e) => setAddressForm(prev => ({ ...prev, street: e.target.value }))}
                                placeholder="Số nhà, tên đường"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Switch
                                id="addr-default"
                                checked={addressForm.isDefault}
                                onCheckedChange={(checked) => setAddressForm(prev => ({ ...prev, isDefault: checked }))}
                            />
                            <Label htmlFor="addr-default">Đặt làm địa chỉ mặc định</Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setShowAddressDialog(false);
                            resetAddressForm();
                        }}>
                            Hủy
                        </Button>
                        <Button onClick={handleSaveAddress}>
                            <Save className="size-4 mr-2" />
                            Lưu địa chỉ
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
