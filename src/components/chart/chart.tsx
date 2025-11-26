import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import styles from "./chart.module.css";
import CustomTooltip from "../сustomTooltip/customTooltip";
import { useEffect, useState } from "react";

interface VariationTypes {
  id?: number;
  name: string;
}

interface DataItemTypes {
  date: string;
  visits: Record<string, number>;
  conversions: Record<string, number>;
}

interface DataTypes {
  variations: VariationTypes[];
  data: DataItemTypes[];
}

interface ChartProps {
  data: DataTypes;
}

export default function Chart({ data }: ChartProps) {
  const parsedData = data.data.map((item) => {
    const record: Record<string, number | string> = { date: item.date };

    Object.keys(item.conversions).forEach((id) => {
      const visits = item.visits[id];
      const conv = item.conversions[id];

      const value = Number(((conv / visits) * 100).toFixed(2));

      if (!isNaN(value)) {
        record[id] = value;
      }
    });

    return record;
  });

  const fixOriginalRecords = data.variations.map((v) => ({
    id: v.id ?? 0,
    name: v.name,
  }));

  const [variationsCounter, setVariationsCounter] = useState<string>("");
  const [variationsSelected, setVariationsSelected] = useState<string[]>(
    fixOriginalRecords.map((v) => String(v.id))
  );
  const [variationsOpen, setVariationsOpen] = useState<boolean>(false);

  function toggleVariation(id: string) {
    setVariationsSelected((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  }

  useEffect(() => {
    if (data.variations.length === variationsSelected.length) {
      setVariationsCounter("All variations  selected");
    } else {
      setVariationsCounter(`${variationsSelected.length} are selected`);
    }
  }, [variationsSelected, setVariationsSelected, data.variations.length]);

  return (
    <>
      <div className={styles.controlsContainer}>
        <div className={styles.variationsSelectContainer}>
          <div className={styles.variationsSelectValue}>
            <span>{variationsCounter}</span>
            <button
              className={
                variationsOpen ? styles.closeButton : styles.openButton
              }
              onClick={() => setVariationsOpen(!variationsOpen)}
            >
              <svg
                width="14.003"
                height="14"
                viewBox="0 0 14.003 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g>
                  <rect width="14" height="14" />
                  <path
                    d="M6.99758 6.9981L0 0.691349L0.536532 0.000148296L6.99789 5.89066L13.4668 0L14.003 0.691497L6.99758 6.9981Z"
                    fill="#5E5D67"
                    fill-rule="evenodd"
                    transform="translate(0 3.5)"
                  />
                </g>
              </svg>
            </button>
          </div>
          {variationsOpen && (
            <div className={styles.variationsBox}>
              {fixOriginalRecords.map((v) => (
                <label key={v.id} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={variationsSelected.includes(String(v.id))}
                    onChange={() => toggleVariation(String(v.id))}
                    disabled={
                      variationsSelected.length === 1 &&
                      variationsSelected.includes(String(v.id))
                    }
                  />
                  {v.name}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={styles.ChartContainer}>
        <LineChart
          style={{
            width: "100%",
            maxWidth: "1300px",
            height: "100%",
            maxHeight: "320px",
          }}
          responsive
          data={parsedData.filter((item) =>
            variationsSelected.some((id) => item[id] !== undefined)
          )}
        >
          <CartesianGrid strokeDasharray="4 4 " />
          <XAxis dataKey="date" />
          <YAxis width="auto" />
          <Tooltip content={<CustomTooltip />} />
          {fixOriginalRecords
            .filter((v) => variationsSelected.includes(String(v.id)))
            .map((v) => (
              <Line
                key={v.id}
                type="linear"
                dataKey={String(v.id)}
                name={v.name}
                connectNulls
              />
            ))}
        </LineChart>
      </div>
    </>
  );
}
