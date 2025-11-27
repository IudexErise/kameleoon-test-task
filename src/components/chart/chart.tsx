import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
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
  /* работа с данными графика */
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

  /* работа с выбором данных */
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

  /* работа с выбором типа линий */
  const [lineStylesOpen, setLineStylesOpen] = useState<boolean>(false);
  const [lineStyles, setLineStyles] = useState<"linear" | "bump" | "area">(
    "linear"
  );

  function changeLineStyle(style: "linear" | "bump" | "area") {
    setLineStyles(style);
    setLineStylesOpen(false);
  }

  const palette = ["#FF5733", "#FFC300", "#8E44AD", "#3A86FF", "#28A745"];

  function generateColors(variations: { id?: number; name: string }[]) {
    const colors: Record<string, string> = {};

    variations.forEach((v, index) => {
      const id = String(v.id ?? 0);
      colors[id] = palette[index];
    });

    return colors;
  }
  const colors = generateColors(data.variations);

  return (
    <>
      <div className={styles.controlsContainer}>
        <div className={styles.basicControls}>
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
                  <label key={v.id}>
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
        <div className={styles.bonusControls}>
          <div className={styles.lineStyleSelectContainer}>
            <span>{`Line styles: ${lineStyles}`}</span>
            <button
              className={
                lineStylesOpen ? styles.closeButton : styles.openButton
              }
              onClick={() => setLineStylesOpen(!lineStylesOpen)}
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
          {lineStylesOpen && (
            <div className={styles.lineStyleBox}>
              <div onClick={() => changeLineStyle("linear")}>Linear</div>
              <div onClick={() => changeLineStyle("bump")}>Bump</div>
              <div onClick={() => changeLineStyle("area")}>Area</div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.ChartContainer}>
        {lineStyles === "area" ? (
          <AreaChart
            style={{
              width: "100%",
              maxWidth: "1300px",
              height: "100%",
              maxHeight: "320px",
              aspectRatio: "1.5",
            }}
            responsive
            data={parsedData.filter((item) =>
              variationsSelected.some((id) => item[id] !== undefined)
            )}
          >
            <CartesianGrid strokeDasharray="4 4 " />
            <XAxis dataKey="date" />
            <YAxis width="auto" />
            <Tooltip content={<CustomTooltip colors={colors} />} />
            {fixOriginalRecords
              .filter((v) => variationsSelected.includes(String(v.id)))
              .map((v, index) => (
                <Area
                  key={v.id}
                  type="monotone"
                  dataKey={String(v.id)}
                  name={v.name}
                  connectNulls
                  stroke={colors[v.id]}
                  fill={colors[v.id]}
                />
              ))}
          </AreaChart>
        ) : (
          <LineChart
            style={{
              width: "100%",
              maxWidth: "1300px",
              height: "100%",
              maxHeight: "320px",
              aspectRatio: "1.5",
            }}
            responsive
            data={parsedData.filter((item) =>
              variationsSelected.some((id) => item[id] !== undefined)
            )}
          >
            <CartesianGrid strokeDasharray="4 4 " />
            <XAxis dataKey="date" />
            <YAxis width="auto" />
            <Tooltip content={<CustomTooltip colors={colors} />} />
            {fixOriginalRecords
              .filter((v) => variationsSelected.includes(String(v.id)))
              .map((v, index) => (
                <Line
                  key={v.id}
                  type={lineStyles}
                  dataKey={String(v.id)}
                  name={v.name}
                  connectNulls
                  stroke={colors[v.id]}
                />
              ))}
          </LineChart>
        )}
      </div>
    </>
  );
}
