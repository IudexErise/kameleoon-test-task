import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import CustomTooltip from "./сustomTooltip/customTooltip";

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

  return (
    <LineChart
      style={{
        width: "100%",
        maxWidth: "700px",
        height: "100%",
        maxHeight: "70vh",
        aspectRatio: 1.618,
      }}
      responsive
      data={parsedData}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis width="auto" />
      <Tooltip
        content={
          <CustomTooltip
            active={undefined}
            payload={undefined}
            label={undefined}
          />
        }
        itemSorter={(item) => -item.value}
      />
      {fixOriginalRecords.map((v) => (
        <Line
          key={v.id}
          type="linear"
          dataKey={String(v.id)}
          name={v.name}
          connectNulls={true}
        />
      ))}
    </LineChart>
  );
}
