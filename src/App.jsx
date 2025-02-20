import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Root from "./layouts/Root";
import Login from "./pages/Login/Login";
import Register from "./pages/Login/Register";
import Tasks from "./pages/Tasks";
import PrivetRoute from "./routes/PrivetRoute";
import TaskItem from "./pages/TaskItem";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Root></Root>}>
        <Route
          index
          element={
            <PrivetRoute>
              <Home></Home>
            </PrivetRoute>
          }></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route
          path="/tasks"
          element={
            <PrivetRoute>
              <Tasks></Tasks>
            </PrivetRoute>
          }></Route>
      </Route>
    </Routes>
  );
}

export default App;
