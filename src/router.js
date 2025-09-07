import { Routes, Route } from "react-router-dom";
import Login from './pages/login'
export default function Router(){
    return(
        <>
        <div className='main'>
            <Routes>
                <Route path='/' element={<Login/>}></Route>
            </Routes>
        </div>
        </>
    )
}