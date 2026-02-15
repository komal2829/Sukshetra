
import './App.css';
import Home1 from './Pages/Home1';
import BookPage from './Pages/BookPage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
    <Routes>
    <Route path="/" element={<Home1 />} />
    <Route path="/book" element={<BookPage />} />
    </Routes>
    </Router>
  );
}

export default App;
