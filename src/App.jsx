import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Root from "./layouts/Root";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Root></Root>}>
        <Route index element={<Home></Home>}></Route>
      </Route>
    </Routes>
  );
}

export default App;
