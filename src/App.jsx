import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Root from "./layouts/Root";
import Login from "./pages/Login/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Root></Root>}>
        <Route index element={<Home></Home>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
      </Route>
    </Routes>
  );
}

export default App;
