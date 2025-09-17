import { createContext, useContext, useEffect, useState, type FC, type ReactNode } from "react";
import type { LoginValues, RegisterValues, User } from "../types";
import authService from "../services/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


// context types
//! asenkron fonksynlrn return tipi Promise
interface IAuthContext {
    loading: boolean;
    user: User | null | undefined;
    register: (values: RegisterValues) => Promise<void>;
    login: (values: LoginValues) => Promise<void>;
    logout: () => Promise<void>;
}


// Context
const AuthContext = createContext<IAuthContext | undefined>(undefined);


// Context Provider
//! Providerlar her zaman hoc olur o yuzden children alırlar
const AuthProvider : FC<{children: ReactNode }> = ({children}) => {
    const navigate = useNavigate()
    const [loading,setLoading] = useState<boolean>(false);
    const [user, setUser] = useState<User | null | undefined>(undefined);


//! login olduğumuzda sayfa yenilenince atıyordu o yüzden sayfa her yenilendiğinde 
//! get user fonksiyonu ile istek attık
     useEffect(() => {

        //! eğer kullanıcı giriş yapmamışsa fonksiyonu durdur
  if (localStorage.getItem("isLoggedIn") !== "true" ) return setUser(null) ;

  const getUser = async () => {
    setLoading(true);
  
    try {
  const user = await authService.getProfile();
  console.log(user);
  setUser(user);       
    } catch (error) {
        setUser(null);
        console.log(error);
    } finally {
        setLoading(false);
    }
  };
  getUser();
     }, []);
   

    const register = async (values: RegisterValues) => {
        setLoading(true);

        try{
           await authService.register(values)
           toast.success("Kullanıcı Başarıyla Oluşturuldu. Giriş Yapınız");
           navigate("/login");
        } catch (error:any) {
            toast.error(error?.response?.data?.message || "Kullanıcı oluşturulurken bir hata oluştu");
        } finally {
            setLoading(false)
        }
    };
    
    const login = async (values: LoginValues) => {
        setLoading(true);

        try{
          const user = await authService.login(values)
            setUser(user)
            localStorage.setItem("isLoggedIn", "true")
            navigate("/");
            toast.success("Giriş Başarılı");
         } catch (error : any) {
             toast.error(error?.response?.data?.message || "Giriş başarısız");
         } finally {
             setLoading(false)
         }
        };
       
        
        const logout = async () => {
    
            try {
              await authService.logout();
              setUser(null)
              localStorage.setItem("isLoggedIn", "false")
              navigate("/login")
              toast.success("Çıkış Yapıldı")
            } catch (error: any) {
              toast.error(error?.response?.data?.message || "Çıkış yapıldı")
            }
      
          };

          return <AuthContext.Provider value={{loading,user,register,login,logout}}>{children}</AuthContext.Provider>

        } ;



        //! Context yapısına abone işlemlerini kolaylaştırma fonksiyonu
     const useAuth = () => {
        const context = useContext(AuthContext);

       if (!context) {
        throw new Error ("useAuth AuthProvider' ın içinde kullanılmalıdır");
       }
       return context;
    }


    export {AuthContext,AuthProvider, useAuth};




    





     
