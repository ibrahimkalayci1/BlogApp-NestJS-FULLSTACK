import axios from "axios";
import authService from "./auth";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    //! withCredentials istek atarken cookileri de göndermemde sakınca yok demek
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

//! eğer refresh token ın süresi dolduysa yeni bir access token oluştur
//! gelen cevaptaki hatayı kontrol edip refresh endpointine istek at
//! eğer refresh token ında süres dolduysa login sayfasına yönlendir

api.interceptors.response.use(
    //! api den her olumlu cevap geldiğinde çalışır
    (res) => res,
    //! api den gelen her hatada çalışır
    async (err) => {

        //! atılan api isteğini al
        const originalRequest = err.config;

        //! eğer hatanın sebebi access token ın süresinin dolması ise
        if (
            originalRequest && 
            !originalRequest.retry && 
            originalRequest.url === "user/me" &&
            err.response.status === 401 && 
            err.response.data.message === "Unauthorized"
        ) {
            // isteği tekrar atacağımız için retry ı true yap
           originalRequest.retry = true;


        try {
            // refresh token ile yeni bir access token oluştur
            await authService.refreshToken()

            // hata aldığımız son isteği tekrar at
            return api.request(originalRequest)
        } catch (error) {
            // eğer refresh token ın süresi dolduysa logout
            await authService.logout();

            // login sayfasına yönlendir
            window.location.href = "/login";

        }
    }
    // ! hata döndür
    return Promise.reject(err);
} 
);
export default api;





