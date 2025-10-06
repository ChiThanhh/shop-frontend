import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as Yup from "yup"; // ✅ đổi sang Yup
import { googleLoginApi, registerApi } from "@/services/AuthService";
import { toast } from "sonner";
import { useLoading } from "@/context/loadingContext";


const registerSchema = Yup.object().shape({
  full_name: Yup.string()
    .min(2, "Tên đầy đủ phải có ít nhất 2 ký tự")
    .max(50, "Tên đầy đủ không được vượt quá 50 ký tự")
    .required("Tên đầy đủ là bắt buộc"),
  email: Yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  password: Yup.string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(20, "Mật khẩu không được vượt quá 20 ký tự")
    .required("Mật khẩu là bắt buộc"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "Mật khẩu xác nhận không khớp")
    .required("Xác nhận mật khẩu là bắt buộc"),
});

const Register = ({ setTab }) => {
  const { withLoading } = useLoading();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await withLoading(async () => {
      try {
        await registerSchema.validate(formData, { abortEarly: false });

        setErrors({});
        const { full_name, email, password } = formData;
        await registerApi({ full_name, email, password });
        toast.success("Đăng ký tài khoản thành công!");
        setTab("login");
        setFormData({
          full_name: "",
          email: "",
          password: "",
          password_confirmation: "",
        });
      } catch (validationError) {
        if (validationError.inner) {
          const fieldErrors = {};
          validationError.inner.forEach((err) => {
            if (!fieldErrors[err.path]) {
              fieldErrors[err.path] = err.message;
            }
          });
          setErrors(fieldErrors);
        }
      }
    });
  };

  return (
    <Card className="w-full max-w-xl shadow-none border-none">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Đăng ký tài khoản</CardTitle>
          <CardDescription>
            Nhập thông tin bên dưới để đăng ký tài khoản
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-6 mt-4">
            {/* Full name */}
            <div className="grid gap-1">
              <Label htmlFor="full_name">Tên đầy đủ</Label>
              <Input
                id="full_name"
                type="text"
                placeholder="Nguyễn Văn A"
                value={formData.full_name}
                onChange={handleChange}
              />
              {errors.full_name && (
                <p className="text-sm text-red-500">{errors.full_name}</p>
              )}
            </div>

            {/* Email */}
            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="grid gap-1">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Password Confirmation */}
            <div className="grid gap-1">
              <Label htmlFor="password_confirmation">Xác nhận mật khẩu</Label>
              <Input
                id="password_confirmation"
                type="password"
                value={formData.password_confirmation}
                onChange={handleChange}
              />
              {errors.password_confirmation && (
                <p className="text-sm text-red-500">
                  {errors.password_confirmation}
                </p>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-2 mt-5">
          <Button type="submit" className="w-full cursor-pointer">
            Đăng ký
          </Button>
          <Button onClick={(e) => {
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
};

export default Register;
