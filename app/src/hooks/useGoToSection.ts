import { useLocation, useNavigate } from "react-router-dom";

export function useGoToSection() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (id: string) => {
    if (pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };
}
