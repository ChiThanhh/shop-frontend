import { verifyToken } from "@/services/AuthService";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => async () => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            localStorage.setItem("token", token);

            const data = await verifyToken(token);

            const user = data?.data;

            localStorage.setItem("user", JSON.stringify(user));

            navigate("/");
        }
    }, [navigate]);

    return <p>Đang xử lý đăng nhập Google...</p>;
};

export default GoogleSuccess;
