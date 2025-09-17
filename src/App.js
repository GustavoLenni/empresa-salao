import "./App.css";
import "./styles/reset.css";
import Rotas from "./router.js";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      <div id="Roteador">
        <Rotas />
      </div>
    </Router>
  );
}

export default App;
