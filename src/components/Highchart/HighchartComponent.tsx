import React, { useEffect, useState, useRef, useMemo } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { DatePicker, InputGroup, CustomProvider } from "rsuite";
import { Select, MenuItem, FormControl } from "@mui/material";
import "rsuite/dist/rsuite.min.css";
import { faBitcoin, faEthereum } from "@fortawesome/free-brands-svg-icons";
import {
  faPlus,
  faSliders,
  faXmark,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HighchartComponentProps, FoctorIndicator } from "../../types";
import axios from "axios";

interface Asset {
  symbol: string;
  label: string;
  icon: React.ReactElement;
}

const assets: Asset[] = [
  {
    symbol: "BTCUSDT",
    label: "Bitcoin",
    icon: <FontAwesomeIcon icon={faBitcoin} />,
  },
  {
    symbol: "ETHUSDT",
    label: "Ethereum",
    icon: <FontAwesomeIcon icon={faEthereum} />,
  },
];

interface PriceData {
  symbol: string;
  time?: string;
  datetime_open_time?: string;
  close: number;
}

const HighchartComponent: React.FC<HighchartComponentProps> = ({
  symbol,
  foctors,
  setfoctors,
  newFactorAdded,
  setNewFactorAdded,
  newNewIndicator,
  setnewNewIndicator,
  foctorsIndicator,
  setfoctorsIndicator,
}) => {
  const [data, setData] = useState<{ [key: string]: [number, number][] }>({});
  const [startDate, setStartDate] = useState<Date | null>(
    new Date("2023-01-01")
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date("2024-04-25"));
  const [interval, setInterval] = useState<string>("1d");
  const [colors, setColors] = useState<string[]>([]);
  const [lastFlattenedIndicatorsLength, setLastFlattenedIndicatorsLength] =
    useState<number>(0);
  const previousInputs = useRef({
    startDate: new Date("2023-01-01"),
    endDate: new Date("2024-04-25"),
    interval: "1d",
    foctors: [],
  });

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // ******************************************************************************************************** fetching Indicators data

  const prevIndicatorsRef = useRef<FoctorIndicator[]>([]);

  const flattenedIndicators = useMemo(() => {
    return foctors.flatMap((foctor) => foctor.foctor_indicator || []);
  }, [foctors]);

  useEffect(() => {
    const prevIndicators = prevIndicatorsRef.current;

    // Check if the length of flattenedIndicators has decreased or remained the same
    if (lastFlattenedIndicatorsLength >= flattenedIndicators.length) {
      setLastFlattenedIndicatorsLength(flattenedIndicators.length);
      console.log("block");
      prevIndicatorsRef.current = flattenedIndicators; // Update the previous state
      return;
    }

    // Find added or changed indicators
    const addedOrChangedIndicators = flattenedIndicators.filter((indicator) => {
      const prevIndicator = prevIndicators.find(
        (prev) => prev.id === indicator.id
      );
      return (
        !prevIndicator ||
        JSON.stringify(prevIndicator) !== JSON.stringify(indicator)
      );
    });

    // Log the added or changed indicators
    addedOrChangedIndicators.map(async (ind) => {
      try {
        console.log(ind);
        const formattedStartDate = startDate
          ? startDate.toISOString()
          : "2023-01-01T00:00:00";
        const formattedEndDate = endDate
          ? endDate.toISOString()
          : "2024-04-25T00:00:00";

        const allData: { [key: string]: [number, number][] } = { ...data };

        const response = await axios.get(
          `http://localhost:8000/get_indicators`,
          {
            params: {
              start_date: formattedStartDate,
              end_date: formattedEndDate,
              interval: interval,
              symbol: `${ind.symbol}USDT`,
              foctor: ind.foctor,
              foctor_ind: ind.label,
              foctor_sourse: ind.foctor_sourse.toString(),
              foctor_payload: JSON.stringify(ind.payload),
            },
          }
        );

        if (response.status !== 200) {
          console.error(
            `Error fetching data for ${ind.label}: ${response.statusText}`
          );
          return;
        }

        const result = response.data;
        console.log(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    });

    // Update the previous state
    setLastFlattenedIndicatorsLength(flattenedIndicators.length);
    prevIndicatorsRef.current = flattenedIndicators;
  }, [flattenedIndicators]);

  // fetching Indicators data ********************************************************************************************************

  useEffect(() => {
    if (newFactorAdded) {
      const newColors = [...colors];
      const factorsToAddColors = foctors.slice(colors.length);
      factorsToAddColors.forEach(() => {
        newColors.push(getRandomColor());
      });
      setColors(newColors);
      setNewFactorAdded(false);
    }
  }, [foctors, newFactorAdded]);

  useEffect(() => {
    const fetchData = async () => {
      if (!newFactorAdded) {
        return;
      }

      try {
        const formattedStartDate = startDate
          ? startDate.toISOString()
          : "2023-01-01T00:00:00";
        const formattedEndDate = endDate
          ? endDate.toISOString()
          : "2024-04-25T00:00:00";

        const allData: { [key: string]: [number, number][] } = { ...data };

        const factorsToFetch = foctors.filter((f) => {
          const key = `${f.symbol}#${f.foctor}`;
          return !data[key];
        });

        await Promise.all(
          factorsToFetch.map(async (f) => {
            if (f.foctor_sourse.includes("price_data")) {
              const response = await fetch(
                `http://localhost:8000/get_symbol_price?start_date=${formattedStartDate}&end_date=${formattedEndDate}&interval=${interval}&symbol=${f.symbol}USDT`
              );

              if (!response.ok) {
                console.error(
                  `Error fetching data for ${f.symbol}: ${response.statusText}`
                );
                return;
              }

              const result: PriceData[] = await response.json();
              console.log(result);

              if (result.length === 0) {
                console.warn(`No data found for ${f.symbol}`);
                return;
              }

              const formattedData: [number, number][] = result
                .map((item) => {
                  const time = item.time
                    ? new Date(item.time).getTime()
                    : new Date(item.datetime_open_time!).getTime();
                  const value = item[f.foctor as keyof PriceData];
                  return value !== undefined ? [time, Number(value)] : null;
                })
                .filter((item): item is [number, number] => item !== null);

              if (formattedData.length === 0) {
                console.warn(`Formatted data is empty for ${f.symbol}`);
                return;
              }

              allData[f.symbol + "#" + f.foctor] = formattedData;
            }
          })
        );

        setData(allData);
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [foctors, newFactorAdded]);

  const refetchChart = async () => {
    const currentInputs = {
      startDate,
      endDate,
      interval,
      foctors,
    };

    // Check if any input value has changed
    const inputsChanged = Object.keys(currentInputs).some(
      //@ts-ignore
      (key) => currentInputs[key] !== previousInputs.current[key]
    );

    if (!inputsChanged) {
      return;
    }

    try {
      const allData: { [key: string]: [number, number][] } = { ...data };

      for (const f of foctors) {
        const formattedStartDate = startDate
          ? startDate.toISOString()
          : "2023-01-01T00:00:00";
        const formattedEndDate = endDate
          ? endDate.toISOString()
          : "2024-04-25T00:00:00";
        if (f.foctor_sourse.includes("price_data")) {
          const response = await fetch(
            `http://localhost:8000/get_symbol_price?start_date=${formattedStartDate}&end_date=${formattedEndDate}&interval=${interval}&symbol=${f.symbol}USDT`
          );
          console.log(
            `http://localhost:8000/get_symbol_price?start_date=${formattedStartDate}&end_date=${formattedEndDate}&interval=${interval}&symbol=${f.symbol}USDT`
          );

          if (!response.ok) {
            console.error(
              `Error fetching data for ${f.symbol}: ${response.statusText}`
            );
            continue;
          }

          const result: PriceData[] = await response.json();
          console.log(result);
          if (result.length === 0) {
            console.warn(`No data found for ${f.symbol}`);
            continue;
          }

          const formattedData: [number, number][] = result
            .map((item) => {
              const time = item.time
                ? new Date(item.time).getTime()
                : new Date(item.datetime_open_time!).getTime();
              const value = item[f.foctor as keyof PriceData];
              return value !== undefined ? [time, Number(value)] : null;
            })
            .filter((item): item is [number, number] => item !== null);

          if (formattedData.length === 0) {
            console.warn(`Formatted data is empty for ${f.symbol}`);
            continue;
          }

          allData[f.symbol + "#" + f.foctor] = formattedData;
        }
      }

      console.log(allData);
      // Set the data after all promises have resolved
      setData(allData);
      //@ts-ignore
      previousInputs.current = currentInputs; // Update the ref with current inputs after fetching data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddIndicator = (
    foctor_id: string,
    foctor: string,
    symbol: string,
    foctor_sourse: string[]
  ) => {
    console.log(foctor, symbol, foctor_sourse);
    setfoctorsIndicator({
      foctor_id: foctor_id,
      symbol: symbol,
      foctor: foctor,
      foctor_sourse: foctor_sourse,
    });
    setnewNewIndicator(true);
    return;
  };

  const handleDeleteInd = (foctor_id: string, id: string) => {
    setfoctors((prevFoctors) =>
      prevFoctors.map((foctor) => {
        if (foctor.foctor_id === foctor_id) {
          return {
            ...foctor,
            foctor_indicator: foctor.foctor_indicator?.filter(
              (ind) => ind.id !== id
            ),
          };
        }
        return foctor;
      })
    );
  };

  const handleDelete = (
    deletedFoctorId: string,
    deletedFoctor: string,
    deletedSymbol: string
  ) => {
    setNewFactorAdded(false);
    setnewNewIndicator(false);
    //@ts-ignore
    setfoctors((prevFoctors) =>
      prevFoctors.filter(
        (foctor: any) =>
          !(
            foctor.foctor === deletedFoctor &&
            foctor.symbol === deletedSymbol &&
            foctor.foctor_id == deletedFoctorId
          )
      )
    );
    setData((prevData) => {
      const newData = { ...prevData };
      delete newData[deletedSymbol + "#" + deletedFoctor];
      return newData;
    });
    setColors((prevColors) => prevColors.slice(0, -1));
  };

  const options = {
    chart: {
      zoomType: "x",
      backgroundColor: "#0b0b0b",
      style: {
        fontFamily: "Outfit, sans-serif",
      },
      height: "700px",
      marginLeft: 50,
    },
    rangeSelector: {
      enabled: false,
    },
    xAxis: {
      type: "datetime",
      labels: {
        style: {
          color: "#fff",
        },
      },
    },
    yAxis: foctors.map((f, index) => ({
      labels: {
        formatter: function () {
          //@ts-ignore
          const value = this.value as number;
          return value >= 1000
            ? `${(value / 1000).toFixed(0)}k`
            : `${value.toFixed(0)}`;
        },
        style: {
          color: "#fff",
        },
      },
      lineWidth: 1,
      //@ts-ignore
      lineColor: colors[index], // Dynamically set the color of the separator line
      gridLineColor: "#151515",
      gridLineWidth: 1,
      tickAmount: 15,
      opposite: index % 2 === 1,
    })),
    plotOptions: {
      series: {
        showInNavigator: true,
      },
    },
    legend: {
      enabled: true,
      align: "center",
      verticalAlign: "bottom",
      itemStyle: {
        color: "#fff",
      },
      itemHoverStyle: {
        color: "#ffa500",
      },
    },
    series: Object.keys(data)
      .filter((key) => data[key].length > 0) // Only include non-empty series
      .map((key, index) => ({
        name: key,
        type: "line",
        data: data[key],
        //@ts-ignore
        color: colors[index], // Ensure the series color matches the yAxis color
        tooltip: {
          valueDecimals: 2,
        },
        yAxis: index, // Match the series to its respective yAxis
      })),
    tooltip: {
      shared: true,
      backgroundColor: "#333",
      style: {
        color: "#fff",
      },
    },
    credits: {
      enabled: false,
    },
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <div
        style={{
          height: "50px",
          borderBottom: "1px solid #474747",
          display: "flex",
          alignItems: "center",
          paddingInline: "15px",
        }}
      >
        {foctors.map((foctor, index) => (
          <div
            key={foctor.symbol + foctor.foctor}
            style={{ flex: 1, display: "flex" }}
          >
            <div
              style={
                newNewIndicator &&
                foctor.foctor_id == foctorsIndicator.foctor_id
                  ? {
                      backgroundColor: colors[index],
                      border: "1px solid " + colors[index],
                      padding: "6px",
                      paddingLeft: "10px",
                      display: "inline-block",
                      borderRadius: "5px",
                      marginRight: "5px",
                    }
                  : {
                      border: "1px solid " + colors[index],
                      padding: "6px",
                      paddingLeft: "10px",
                      display: "inline-block",
                      borderRadius: "5px",
                      marginRight: "5px",
                    }
              }
            >
              {foctor.symbol} {foctor.foctor}
              <FontAwesomeIcon
                style={{ marginInline: "5px", fontSize: "15px" }}
                icon={faSliders}
                onClick={() => {}}
              />
              <FontAwesomeIcon
                style={{ marginInline: "5px", fontSize: "15px" }}
                icon={faPlus}
                onClick={() => {
                  handleAddIndicator(
                    foctor.foctor_id,
                    foctor.foctor,
                    foctor.symbol,
                    foctor.foctor_sourse
                  );
                }}
              />
              <FontAwesomeIcon
                style={{ marginInline: "5px", fontSize: "15px" }}
                icon={faXmark}
                onClick={() =>
                  handleDelete(foctor.foctor_id, foctor.foctor, foctor.symbol)
                }
              />
            </div>
            {foctor.foctor_indicator ? (
              <div>
                {foctor.foctor_indicator.map((ind, indIndex) => (
                  <div
                    key={indIndex + "veivnevini"}
                    style={{
                      border: "1px solid " + colors[index],
                      padding: "6px",
                      paddingLeft: "10px",
                      display: "inline-block",
                      borderRadius: "5px",
                      marginRight: "5px",
                    }}
                  >
                    {ind.label}
                    <FontAwesomeIcon
                      style={{ marginInline: "5px", fontSize: "15px" }}
                      icon={faSliders}
                      onClick={() => {}}
                    />
                    <FontAwesomeIcon
                      style={{ marginInline: "5px", fontSize: "15px" }}
                      icon={faXmark}
                      onClick={() => handleDeleteInd(foctor.foctor_id, ind.id)}
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingInline: "15px",
        }}
      >
        <CustomProvider theme="dark">
          <InputGroup
            style={{
              width: 310,
            }}
          >
            <DatePicker
              value={startDate}
              onChange={(newValue: Date | null) => {
                setStartDate(newValue);
              }}
              format="yyyy-MM-dd"
              block
              appearance="subtle"
              placeholder="Start Date"
            />
            <InputGroup.Addon>to</InputGroup.Addon>
            <DatePicker
              value={endDate}
              onChange={(newValue: Date | null) => {
                setEndDate(newValue);
              }}
              format="yyyy-MM-dd"
              block
              appearance="subtle"
              placeholder="End Date"
            />
          </InputGroup>
        </CustomProvider>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormControl
            sx={{
              m: 1,
              minWidth: 100,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "gray", // Default border color
                },
                "&:hover fieldset": {
                  borderColor: "lightgray", // Hover border color
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white", // Focused border color
                },
                "& .MuiSvgIcon-root": {
                  color: "#fff",
                },
              },
            }}
            size="small"
          >
            <Select
              style={{ color: "gray", height: "36px" }}
              value={interval}
              onChange={(event) => setInterval(event.target.value)}
            >
              <MenuItem value="15m">15 Minutes</MenuItem>
              <MenuItem value="30m">30 Minutes</MenuItem>
              <MenuItem value="1h">1 Hour</MenuItem>
              <MenuItem value="4h">4 Hours</MenuItem>
              <MenuItem value="1d">1 Day</MenuItem>
            </Select>
          </FormControl>
          <FontAwesomeIcon
            icon={faRefresh}
            onClick={refetchChart}
            style={{
              marginLeft: 20,
              marginRight: 25,
              fontSize: 18,
              cursor: "pointer",
            }}
          />
        </div>
      </div>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"stockChart"}
        options={options}
        containerProps={{ style: { height: "100%", width: "100%" } }}
      />
    </div>
  );
};

export default HighchartComponent;
