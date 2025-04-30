import { BrowserRouter, Routes, Route } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import CreatePage from "./pages/CreatePage";
import "./App.css";
import EditPage from "./pages/EditPage";

function App() {
  return (
    <div className="page-wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/edit/:id" element={<EditPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
