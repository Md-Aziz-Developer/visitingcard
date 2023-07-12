import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Register from './pages/Register';
import Visitingcard from './pages/Visitingcard';
import Usercard from './pages/Usercard';
function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/register" element={<Register/>}></Route>
      <Route path="/card" element={<Visitingcard/>}></Route>
      <Route path="/profile/:id" element={<Usercard/>}></Route>
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
