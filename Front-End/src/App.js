import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterLogin from "./RegisterLogin";
import File from "./File";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterLogin />} />
        <Route path="/file" element={<File />} />
      </Routes>
    </Router>
  );
};

export default App;
