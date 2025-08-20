"use client"
// Ceci indique à Next.js que ce composant doit être rendu côté client
// (obligatoire si vous utilisez des hooks comme useEffect ou useState).

import { useEffect, useState } from "react"
// useState pour stocker les données et l'état de chargement.
// useEffect pour déclencher la récupération de données après le rendu initial.

import { TrendingUp } from "lucide-react"
// Icône de tendance vers le haut (pour le footer du card).

import { BarChart, CartesianGrid, XAxis } from "recharts"
// Composants principaux de la librairie Recharts pour créer un diagramme à barres.

import ChartBarActive from "@/app/components/ChartBarActive"
// Composant personnalisé qui gère l’affichage des barres du graphique.

import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter,
} from "@/components/ui/card"
// Composants UI pré-construits (venant de shadcn ou votre dossier local).

import {
  ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig,
} from "@/components/ui/chart"
// Composants utilitaires pour mettre en forme et ajouter un tooltip au graphique.

// --------------------
// Configuration du tooltip
// --------------------
const chartConfig = {
  price: { label: "Price (USD)" },
} satisfies ChartConfig
// Ici on définit la configuration du graphique.
// `satisfies ChartConfig` permet à TypeScript de valider la structure.

// --------------------
// Composant principal de la page
// --------------------
export default function Page() {
  const [chartData, setChartData] = useState<any[]>([])
  // Stockera les données transformées prêtes pour le graphique.

  const [loading, setLoading] = useState(true)
  // Permet d'afficher "Loading..." pendant le chargement.

  useEffect(() => {
    async function fetchData() {
      try {
        // --- Récupération des données depuis CoinGecko ---
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1"
        )
        const data = await res.json()
        console.log("API raw data:", data) // Debug : voir les données originales dans la console.

        // --- Transformation des données pour le graphique ---
        const formatted = data.map((coin: any, index: number) => ({
          crypto: coin.symbol.toUpperCase(), // ex: BTC, ETH
          price: Number(coin.current_price), // valeur numérique
          fill: `hsl(${(index * 36) % 360}, 70%, 50%)`, // Couleur unique par barre
        }))
        console.log("Chart data:", formatted) // Debug : vérifier le format.

        setChartData(formatted) // Mise à jour du state
      } catch (error) {
        console.error("Erreur API :", error) // En cas d'erreur réseau ou parsing
      } finally {
        setLoading(false) // On arrête l'état de chargement quoi qu'il arrive
      }
    }

    fetchData() // Lancement de la fonction au montage du composant
  }, [])
  // [] => useEffect ne s’exécute qu'une seule fois après le premier rendu.

  return (
    <main className="p-6">
      <Card>
        {/* En-tête de la carte */}
        <CardHeader>
          <CardTitle>Top 10 Most Expensive Cryptocurrencies</CardTitle>
          <CardDescription>Live data from API</CardDescription>
        </CardHeader>

        {/* Contenu de la carte */}
        <CardContent>
          {loading ? (
            // Affichage pendant le chargement
            <p>Loading...</p>
          ) : (
            // Affichage une fois les données récupérées
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <BarChart data={chartData}>
                {/* Grille du graphique (lignes horizontales seulement) */}
                <CartesianGrid vertical={false} />

                {/* Axe des X (les symboles crypto) */}
                <XAxis
                  dataKey="crypto" // clé utilisée dans chartData
                  tickLine={false} // pas de ligne sur les ticks
                  tickMargin={10} // espace sous les labels
                  tickFormatter={(value) => String(value)} // conversion explicite en string
                />

                {/* Tooltip personnalisé */}
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />

                {/* Barres du graphique avec effet actif */}
                <ChartBarActive dataKey="price" />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>

        {/* Pied de carte (info supplémentaire) */}
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Showing top 10 cryptocurrencies by price in USD
          </div>
        </CardFooter>
      </Card>
    </main>
  )
}
