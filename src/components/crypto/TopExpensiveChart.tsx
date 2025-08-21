"use client"

import { useState, useEffect } from "react"
import { TrendingUp } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  LabelList,
  Cell,
  Line,
  LineChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { ChevronLeft, ChevronRight } from "lucide-react"

// ----- Types -----
type CryptoData = {
  symbol: string
  price: number
  fill: string
}

type VolumeData = {
  name: string
  volume: number
  fill: string
}

type MarketCapData = {
  name: string
  marketCap: number
  fill: string
}

type CheapData = {
  symbol: string
  price: number
  fill: string
}

type AtlData = {
  symbol: string
  atl: number
}

// ----- Config charts -----
const chartConfigBar = {
  price: { label: "Price (USD)" },
} satisfies ChartConfig

const chartConfigPieVolume = {
  volume: { label: "Volume (USD)" },
} satisfies ChartConfig

const chartConfigPieCap = {
  marketCap: { label: "Market Cap (USD)" },
} satisfies ChartConfig

const chartConfigPieCheap = {
  price: { label: "Price (USD)" },
} satisfies ChartConfig

const chartConfigLineATL = {
  atl: { label: "ATL (USD)" },
} satisfies ChartConfig

type AthData = {
  symbol: string
  ath: number
}

type Coin = {
  id: string
  image: string
  name: string
  symbol: string
  current_price: number
  price_change_percentage_24h: number
  total_volume: number
  market_cap: number
}


export function ChartBarActive() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [chartData, setChartData] = useState<CryptoData[]>([])
  const [volumeData, setVolumeData] = useState<VolumeData[]>([])
  const [capData, setCapData] = useState<MarketCapData[]>([])
  const [cheapData, setCheapData] = useState<CheapData[]>([])
  const [atlData, setAtlData] = useState<AtlData[]>([])
  const [athData, setAthData] = useState<AthData[]>([])

  const [today, setToday] = useState("")
  const [categoriesCount, setCategoriesCount] = useState<number | null>(null)
  const [exchangesCount, setExchangesCount] = useState<number | null>(null)
  const [platformsCount, setPlatformsCount] = useState<number | null>(null)
  const [indexesCount, setIndexesCount] = useState<number | null>(null)

  useEffect(() => {
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    }
    setToday(now.toLocaleDateString("en-US", options))

    async function fetchCounts() {
      try {
        const [catsRes, exchRes, platRes, idxRes] = await Promise.all([
          fetch("https://api.coingecko.com/api/v3/coins/categories/list"),
          fetch("https://api.coingecko.com/api/v3/exchanges"),
          fetch("https://api.coingecko.com/api/v3/asset_platforms"),
          fetch("https://api.coingecko.com/api/v3/indexes")
        ])

        const [cats, exch, plats, idx] = await Promise.all([
          catsRes.json(), exchRes.json(), platRes.json(), idxRes.json()
        ])

        setCategoriesCount(Array.isArray(cats) ? cats.length : null)
        setExchangesCount(Array.isArray(exch) ? exch.length : null)
        setPlatformsCount(Array.isArray(plats) ? plats.length : null)
        setIndexesCount(Array.isArray(idx) ? idx.length : null)
      } catch (err) {
        console.error("API fetch error:", err)
      }
    }

    fetchCounts()
  }, [])

  const [coins, setCoins] = useState<Coin[]>([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(0)
  const perPage = 5

  // Fetch API CoinGecko
  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCoins(data)
        } else {
          console.error("API ne renvoie pas un tableau :", data)
          setCoins([])
        }
      })
      .catch((err) => {
        console.error("Erreur API :", err)
        setCoins([])
      })
  }, [])

  // Filtrer les cryptos
  const filteredCoins = Array.isArray(coins)
    ? coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    )
    : []

  // Pagination
  const start = page * perPage
  const end = start + perPage
  const paginatedCoins = filteredCoins.slice(start, end)

  const nextPage = () => {
    if ((page + 1) * perPage < filteredCoins.length) {
      setPage(page + 1)
    }
  }

  const prevPage = () => {
    if (page > 0) {
      setPage(page - 1)
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const resCoins = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&order=market_cap_desc&per_page=250&page=1&sparkline=false"
        )
        const coins = await resCoins.json()

        // --- Top 10 par prix ---
        const top10 = coins
          .sort((a: any, b: any) => b.current_price - a.current_price)
          .slice(0, 10)

        const colorsBar = [
          "#ff6384", "#36a2eb", "#cc65fe", "#ffce56",
          "#4bc0c0", "#9966ff", "#ff9f40", "#ffcd56",
          "#c9cbcf", "#2ecc71",
        ]

        const mappedBar: CryptoData[] = top10.map((coin: any, index: number) => ({
          symbol: coin.symbol.toUpperCase(),
          price: coin.current_price,
          fill: colorsBar[index % colorsBar.length],
        }))
        setChartData(mappedBar)

        // --- Top 3 par volume ---
        const top3Volume = coins
          .sort((a: any, b: any) => b.total_volume - a.total_volume)
          .slice(0, 3)

        const colorsPie1 = ["#ff6384", "#36a2eb", "#cc65fe"]

        const mappedPieVolume: VolumeData[] = top3Volume.map((coin: any, index: number) => ({
          name: coin.name,
          volume: coin.total_volume,
          fill: colorsPie1[index % colorsPie1.length],
        }))
        setVolumeData(mappedPieVolume)

        // --- Top 3 par market cap ---
        const top3Cap = coins
          .sort((a: any, b: any) => b.market_cap - a.market_cap)
          .slice(0, 3)

        const colorsPie2 = ["#ffce56", "#4bc0c0", "#9966ff"]

        const mappedPieCap: MarketCapData[] = top3Cap.map((coin: any, index: number) => ({
          name: coin.name,
          marketCap: coin.market_cap,
          fill: colorsPie2[index % colorsPie2.length],
        }))
        setCapData(mappedPieCap)

        // --- Top 5 cheapest coins ---
        const cheapest5 = coins
          .filter((coin: any) => coin.current_price && coin.current_price > 0) // <-- ajout du filtre
          .sort((a: any, b: any) => a.current_price - b.current_price)
          .slice(0, 5)

        const colorsPie3 = ["#ff9f40", "#2ecc71", "#e74c3c", "#8e44ad", "#3498db"]

        const mappedPieCheap: CheapData[] = cheapest5.map((coin: any, index: number) => ({
          symbol: coin.symbol.toUpperCase(),
          price: coin.current_price,
          fill: colorsPie3[index % colorsPie3.length],
        }))
        setCheapData(mappedPieCheap)


        // --- Top 5 by All-Time-Low (ATL) ---
        const top5Atl = coins
          .filter((c: any) => typeof c.atl === "number" && isFinite(c.atl) && c.atl > 0)
          .sort((a: any, b: any) => a.atl - b.atl)
          .slice(0, 5)

        const mappedATL: AtlData[] = top5Atl.map((coin: any) => ({
          symbol: coin.symbol.toUpperCase(),
          atl: coin.atl,
        }))
        setAtlData(mappedATL)
        // --- Top 10 by All-Time-High (ATH) ---
        const top10Ath = coins
          .filter((c: any) => typeof c.ath === "number" && isFinite(c.ath) && c.ath > 0)
          .sort((a: any, b: any) => b.ath - a.ath)
          .slice(0, 10)

        const mappedAth: AthData[] = top10Ath.map((coin: any) => ({
          symbol: coin.symbol.toUpperCase(),
          ath: coin.ath,
        }))

        setAthData(mappedAth)

      } catch (err) {
        console.error("Erreur API :", err)
      }
    }

    fetchData()
  }, [])

  type StatCardProps = {
    title: string
    value: number | null
  }

  const bgMap: Record<string, string> = {
    CATEGORIES: "bg-gradient-to-br from-indigo-500 to-purple-500 text-white",
    EXCHANGES: "bg-gradient-to-br from-green-500 to-emerald-600 text-white",
    "ASSET PLATFORMS": "bg-gradient-to-br from-blue-500 to-cyan-500 text-white",
    "MARKET INDEXES": "bg-gradient-to-br from-orange-400 to-red-500 text-white",
  }

  function StatCard({ title, value }: StatCardProps) {
    const bg = bgMap[title] ?? "bg-gray-100 dark:bg-gray-800"
    return (
      <div className={`rounded-xl p-4 shadow-md flex flex-col items-center justify-center ${bg}`}>
        <p className="text-sm font-medium opacity-80">{title}</p>
        <p className="text-2xl font-bold mt-2">{value ?? '—'}</p>
      </div>
    )
  }


  return (
    <div className="grid gap-6">
      <div className="space-y-6">
        {/* Titre Overview + date */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Overview</h1>
          <p className="text-gray-500 dark:text-gray-400">Today: {today}</p>
        </div>

        {/* Card Stats */}
        <div className="bg-white dark:bg-gray-900 shadow-md rounded-2xl p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard title="CATEGORIES" value={categoriesCount} />
            <StatCard title="EXCHANGES" value={exchangesCount} />
            <StatCard title="ASSET PLATFORMS" value={platformsCount} />
            <StatCard title="MARKET INDEXES" value={indexesCount} />
          </div>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-2xl">
        {/* Barre de recherche */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Top 250 Cryptocurrencies
          </h2>
          <input
            type="text"
            placeholder="Search by name or symbol..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(0) // reset page when searching
            }}
            className="border px-3 py-2 rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Symbol</th>
                <th className="p-3 text-right">Price</th>
                <th className="p-3 text-right">24h</th>
                <th className="p-3 text-right">Volume</th>
                <th className="p-3 text-right">Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCoins.map((coin) => (
                <tr
                  key={coin.id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="p-3">
                    <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                  </td>
                  <td className="p-3 text-gray-900 dark:text-gray-100">{coin.name}</td>
                  <td className="p-3 uppercase text-gray-600 dark:text-gray-400">{coin.symbol}</td>
                  <td className="p-3 text-right text-gray-900 dark:text-gray-100">
                    ${coin.current_price.toLocaleString()}
                  </td>
                  <td
                    className={`p-3 text-right font-semibold ${coin.price_change_percentage_24h > 0
                      ? "text-green-500"
                      : "text-red-500"
                      }`}
                  >
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </td>
                  <td className="p-3 text-right text-gray-900 dark:text-gray-100">
                    ${coin.total_volume.toLocaleString()}
                  </td>
                  <td className="p-3 text-right text-gray-900 dark:text-gray-100">
                    ${coin.market_cap.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={prevPage}
            disabled={page === 0}
            className={`flex items-center px-3 py-2 rounded-lg border dark:border-gray-700 ${page === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
          >
            <ChevronLeft className="w-5 h-5" /> Prev
          </button>

          <span className="text-gray-700 dark:text-gray-300">
            Page {page + 1} of {Math.ceil(filteredCoins.length / perPage) || 1}
          </span>

          <button
            onClick={nextPage}
            disabled={(page + 1) * perPage >= filteredCoins.length}
            className={`flex items-center px-3 py-2 rounded-lg border dark:border-gray-700 ${(page + 1) * perPage >= filteredCoins.length
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
          >
            Next <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ---- BAR CHART ---- */}
      <Card className="dark:bg-gray-900">
        <CardHeader>
          <CardTitle>Top 10 Most Expensive Cryptocurrencies</CardTitle>
          <CardDescription>Live prices in USD</CardDescription>
        </CardHeader>

        <CardContent>
          <ChartContainer config={chartConfigBar}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="symbol" tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar
                dataKey="price"
                strokeWidth={2}
                radius={8}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                activeBar={(props: any) =>
                  activeIndex === props.index ? (
                    <Rectangle
                      {...props}
                      fill={props.payload.fill}
                      fillOpacity={0.8}
                      stroke={props.payload.fill}
                      strokeDasharray={4}
                    />
                  ) : (
                    <Rectangle {...props} fill={props.payload.fill} />
                  )
                }
              />
            </BarChart>
          </ChartContainer>
        </CardContent>

        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Showing top 10 cryptocurrencies by price
          </div>
        </CardFooter>
      </Card>

      {/* ---- 2 CHARTS EN COLONNE ---- */}
      <div className="grid grid-cols-2 gap-6">
        {/* PIE VOLUME */}
        <Card className="flex flex-col dark:bg-gray-900">
          <CardHeader className="items-center pb-0">
            <CardTitle>Top 3 Cryptocurrencies By Volume</CardTitle>
            <CardDescription>Live trading volume in USD</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfigPieVolume}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="volume" hideLabel />} />
                <Pie data={volumeData} dataKey="volume">
                  {volumeData.map((entry, index: number) => (
                    <Cell key={`cell-vol-${index}`} fill={entry.fill} />
                  ))}
                  <LabelList dataKey="name" stroke="none" fontSize={12} />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* PIE MARKET CAP */}
        <Card className="flex flex-col dark:bg-gray-900">
          <CardHeader className="items-center pb-0">
            <CardTitle>Top 3 Cryptocurrencies By Market Cap</CardTitle>
            <CardDescription>Live market cap in USD</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfigPieCap}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="marketCap" hideLabel />} />
                <Pie data={capData} dataKey="marketCap">
                  {capData.map((entry, index: number) => (
                    <Cell key={`cell-cap-${index}`} fill={entry.fill} />
                  ))}
                  <LabelList dataKey="name" stroke="none" fontSize={12} />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* ---- PIE CHEAP CRYPTOS ---- */}
        <Card className="flex flex-col dark:bg-gray-900">
          <CardHeader className="items-center pb-0">
            <CardTitle>Top 5 Cheapest Cryptocurrencies</CardTitle>
            <CardDescription>Live prices in USD</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfigPieCheap}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="price" hideLabel />} />
                <Pie data={cheapData} dataKey="price" nameKey="symbol" innerRadius={50}>
                  {cheapData.map((entry, index: number) => (
                    <Cell key={`cell-cheap-${index}`} fill={entry.fill} />
                  ))}
                  <LabelList dataKey="symbol" stroke="none" fontSize={12} />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* ---- LINE CHART ATL ---- */}
        <Card className="dark:bg-gray-900">
          <CardHeader>
            <CardTitle>Top 5 Cryptocurrencies By All-Time-Low</CardTitle>
            <CardDescription>All-time low price in USD</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigLineATL}>
              <LineChart
                accessibilityLayer
                data={atlData}
                margin={{ top: 20, left: 12, right: 12 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis dataKey="symbol" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <Line
                  dataKey="atl"
                  type="monotone"
                  stroke="#ff6384"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                >
                  <LabelList position="top" className="fill-foreground" fontSize={12} />
                </Line>
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 leading-none font-medium">
              Data refreshed <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-none">
              Showing lowest recorded prices (ATL)
            </div>
          </CardFooter>
        </Card>
      </div>
      {/* ---- LINE CHART ATH ---- */}
      <Card className="dark:bg-gray-900">
        <CardHeader>
          <CardTitle>Top 10 Cryptocurrencies By All-Time-High</CardTitle>
          <CardDescription>All-time high price in USD</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfigLineATL}>
            <LineChart
              accessibilityLayer
              data={athData}
              margin={{ top: 20, left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis dataKey="symbol" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Line
                dataKey="ath"
                type="monotone"
                stroke="#36a2eb"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              >
                <LabelList position="top" className="fill-foreground" fontSize={12} />
              </Line>
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Data refreshed <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Showing highest recorded prices (ATH)
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
