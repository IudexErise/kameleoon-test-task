import "./App.css";
import Chart from "./components/chart";
import data from "./data.json";

function App() {
  return (
    <>
      <Chart data={data} />
    </>
  );
}

export default App;
