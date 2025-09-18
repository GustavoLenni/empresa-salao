import { Routes, Route } from "react-router-dom";
import Login from './pages/login'
import Home from './pages/home'


export default function Router(){
    return(
        <>
        <div className='main'>
            <Routes>
                <Route path='/' element={<Login/>}></Route>
                <Route path='/home' element={<Home/>}></Route>
            </Routes>
        </div>
        </>
    )
}