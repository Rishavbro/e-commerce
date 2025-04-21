import React, { lazy, useEffect } from 'react'
import { BrowserRouter ,Navigate,Route,Routes} from 'react-router-dom';
import {Toaster} from 'react-hot-toast'
import Navbar from './components/Navbar';
import { useUserStore } from './store/useUserStore';
import LoadingSpinner from './components/LoadigSpinner';
import { useCartStore } from './store/useCartStore';

const Home = lazy(()=>import('./pages/Home'));
const Signup = lazy(()=>import('./pages/Signup'));
const Login = lazy(()=>import('./pages/Login'));
const AdminPage = lazy(()=>import('./pages/AdminPage'));
const CategoryPage = lazy(()=>import('./pages/CategoryPage'));
const CartPage = lazy(()=>import('./pages/CartPage'));
const PurchaeSuccessPage = lazy(()=>import("./pages/PurchaseSuccessPage"));
const PurchaseCancelPage = lazy(()=>import('./pages/PurchaseCancelPage'))
const App = () => {
  const {user,checkAuth,checkingAuth}  = useUserStore();
  const {getCartItems} = useCartStore();



  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  useEffect(()=>{
   if(!user) return
     getCartItems()
  },[getCartItems])

  if(checkingAuth){
    return <LoadingSpinner />
  }

  return (

<div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
			{/* Background gradient */}
			<div className='absolute inset-0 overflow-hidden'>
				<div className='absolute inset-0'>
					<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
				</div>
			</div>

			<div className='relative z-50 pt-20'>
   
    
      <Navbar />
    <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/signup' element={user ?<Navigate to={'/'} />:<Signup />} />
    <Route path='/login' element={user ?<Navigate to={'/'} />:<Login />} />
    <Route path='/secret-dashboard' element={user?.role === 'admin' ? <AdminPage /> : <Navigate  to={'/login'}/>} />
    <Route path='/category/:category' element={<CategoryPage />} />
    <Route path='/cart' element={user ? <CartPage /> :<Navigate  to={'/login'}/>} />
    <Route path='/purchase-success'  element={user ? <PurchaeSuccessPage /> : <Navigate  to={'/login'}/>}/>
    <Route path='/purchase-cancel'  element={user ? <PurchaseCancelPage /> : <Navigate  to={'/login'}/>}/>

    </Routes>
    
      </div>
			<Toaster />
		</div>

  )
}

export default App

