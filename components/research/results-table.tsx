import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { bestOf, modalities, protocols, results, tasks } from "@/content/results"
import { cn } from "@/lib/utils"

const taskLabel = (id: string) => tasks.find((t) => t.id === id)?.label
const protocolLabel = (id: string) => protocols.find((p) => p.id === id)?.label

// Research 05.3: every Baseline V1 Macro-F1 value. The best value per row is
// 800 brand-700; a 2px rule closes each task group.
export function ResultsTable() {
  return (
    <Table className="min-w-[600px]">
      <TableHeader>
        <TableRow>
          <TableHead>Task</TableHead>
          <TableHead>Protocol</TableHead>
          {modalities.map((m) => (
            <TableHead key={m.id} className="text-right">
              {m.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="tabular-nums">
        {results.map((row, index) => {
          const best = bestOf(row)
          const next = results[index + 1]
          const groupEnd = next !== undefined && next.task !== row.task
          const rule = groupEnd && "border-b-2"
          return (
            <TableRow key={`${row.task}-${row.protocol}`}>
              <TableCell className={cn(rule)}>{taskLabel(row.task)}</TableCell>
              <TableCell className={cn(rule)}>{protocolLabel(row.protocol)}</TableCell>
              {modalities.map((m) => (
                <TableCell
                  key={m.id}
                  className={cn(
                    "text-right",
                    m.id === best && "font-extrabold text-brand-700",
                    rule
                  )}
                >
                  {row[m.id]}
                </TableCell>
              ))}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
