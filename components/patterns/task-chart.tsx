"use client"

import { ChartAxis, ChartGroups, ChartLegend } from "@/components/patterns/bar-chart"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { tasks } from "@/content/results"

// Research 05.3: the Macro-F1 chart with the Four-class / Binary relation toggle.
export function TaskChart() {
  return (
    <Card className="gap-[22px] p-[clamp(20px,3vw,32px)]">
      <Tabs defaultValue="four" className="contents">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3.5">
          <h4 className="m-0 text-[19px]">Macro-F1 by protocol</h4>
          <TabsList aria-label="Task">
            {tasks.map((task) => (
              <TabsTrigger key={task.id} value={task.id}>
                {task.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <ChartLegend />
        {tasks.map((task) => (
          <TabsContent key={task.id} value={task.id}>
            <ChartGroups task={task.id} />
          </TabsContent>
        ))}
        <ChartAxis />
      </Tabs>
    </Card>
  )
}
