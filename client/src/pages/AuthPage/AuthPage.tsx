import { useEffect, useState } from "react";
import LoginForm from "./content/LoginForm";
import RegisterForm from "./content/RegisterForm";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../data/constants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { setError } from "../../store/auth/authSlice";

const AuthPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { user, error } = useSelector((state: RootState) => state.auth);
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(ROUTE_PATHS.USERS);
    } else {
      navigate(ROUTE_PATHS.AUTH);
    }
  }, [user]);

  useEffect(() => {
    dispatch(setError());
  }, [isRegister]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(setError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return <>{isRegister ? <RegisterForm setIsRegister={setIsRegister} /> : <LoginForm setIsRegister={setIsRegister} />}</>;
};

export default AuthPage;
