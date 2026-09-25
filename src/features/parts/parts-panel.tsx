import { useState } from "react"
import { Heading } from "@/components/shared/heading"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PartCard } from "@/features/parts/part-card"
import { PART_CATEGORIES, PARTS } from "@/features/parts/parts.content"
import type { IPartCategoryItem } from "@/features/parts/parts.interface"

export function PartsPanel() {
  const [category, setCategory] = useState<IPartCategoryItem["value"]>("all")
  const visible = category === "all" ? PARTS : PARTS.filter((p) => p.category === category)
  const count = (value: IPartCategoryItem["value"]) => (value === "all" ? PARTS.length : PARTS.filter((p) => p.category === value).length)
  return (
    <div>
      <Heading>Hardware parts</Heading>
      <Tabs value={category} onValueChange={(v) => setCategory(v as IPartCategoryItem["value"])} className="mb-4">
        <TabsList className="w-full">
          {PART_CATEGORIES.map(({ value, label }) => (
            <TabsTrigger key={value} value={value}>
              {label} <span className="text-muted-foreground tabular-nums">{count(value)}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="flex flex-col gap-3">
        {visible.map((part) => (
          <PartCard key={part.id} part={part} />
        ))}
      </div>
    </div>
  )
}
