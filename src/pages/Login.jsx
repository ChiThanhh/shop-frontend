import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import * as Yup from "yup";
import { toast } from 'sonner';
import { googleLoginApi, loginApi } from '@/services/AuthService';
import { useLoading } from '@/context/loadingContext';
import { addUserHistoryView } from '@/services/UserHistoryViewService';
import { setAuthToken } from '@/services/api';

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  password: Yup.string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(20, "Mật khẩu không được vượt quá 20 ký tự")
    .required("Mật khẩu là bắt buộc"),
});
const Login = ({ onClose }) => {
  const { withLoading } = useLoading();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    await loginSchema.validate(formData, { abortEarly: false });

    e.preventDefault();
    await withLoading(async () => {
      try {
        await loginSchema.validate(formData, { abortEarly: false });
        setErrors({});
        const res = await loginApi(formData);
        toast.success("Đăng nhập thành công!");
        setAuthToken(res.data.accessToken);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.accessToken);

        // Sync localStorage history lên server nếu có
        const productHistory = JSON.parse(localStorage.getItem("viewHistory")) || [];
        if (productHistory.length > 0) {
          await addUserHistoryView({ productIds: productHistory.map(p => p.product_id) });
          localStorage.removeItem("viewHistory");
        }
        
        // Reload page để context load lại history từ API
        window.location.reload();
        if (onClose) onClose();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const validationErrors = {};
          err.inner.forEach((error) => {
            validationErrors[error.path] = error.message;
          });
          setErrors(validationErrors);
        }
        console.error(err);
      }
    });
  };


  return (
    <Card className="w-full max-w-xl shadow-none border-none">
      <form onSubmit={handleSubmit}>

        <CardHeader>
          <CardTitle>Đăng nhập tài khoản</CardTitle>
          <CardDescription>
            Nhập email của bạn bên dưới để đăng nhập
          </CardDescription>

        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 mt-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Mật khẩu</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Quên mật khẩu?
                </a>
              </div>
              <Input id="password" type="password" value={formData.password} onChange={handleChange} required />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          </div>

        </CardContent>
        <CardFooter className="flex-col gap-2 mt-5">
          <Button type="submit" className="w-full cursor-pointer" >
            Đăng nhập
          </Button>
          <Button
           onClick={(e) => {
            e.preventDefault();
            googleLoginApi();
          }}
            variant="outline" className="w-full cursor-pointer">
            Đăng nhập với Google
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
export default Login;