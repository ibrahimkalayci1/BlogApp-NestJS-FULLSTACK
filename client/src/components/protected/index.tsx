import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/auth-context';
import PageLoader from '../loader/page-loader';

const Protected = () => {
    //! auth context ten user ve loading i al
   const {loading, user} = useAuth();  
    console.log(user,loading);
    
    // loading true ise loading ikonunu ekana bas
    if (loading ) return <PageLoader/> ;

    // user yoksa anasayfaya yönlendir
    if (user === null) return <Navigate to="/" />
    
    return <Outlet />
}

export default Protected