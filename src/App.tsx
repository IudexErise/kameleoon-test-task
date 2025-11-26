import "./App.css";
import Chart from "./components/chart/chart";
import data from "./data.json";

function App() {
  return (
    <>
      <Chart data={data} />
    </>
  );
}

export default App;
