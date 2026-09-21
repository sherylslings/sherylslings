import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { carrierGuide } from '@/content/carrierGuide';

export const CompareTable = () => (
  <section id="compare" className="scroll-mt-24 py-16 md:py-24">
    <h2 className="text-3xl font-semibold text-foreground md:text-4xl">
      {carrierGuide.compare.title}
    </h2>

    <div className="mt-8 overflow-hidden rounded-lg border border-border bg-card text-card-foreground">
      <Table className="min-w-max">
        <TableHeader className="bg-muted">
          <TableRow>
            {carrierGuide.compare.columns.map((column) => (
              <TableHead key={column} scope="col" className="whitespace-normal font-semibold text-foreground">
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {carrierGuide.compare.rows.map((row) => (
            <TableRow key={row[0]}>
              <th scope="row" className="p-4 text-left align-middle font-semibold text-foreground">
                {row[0]}
              </th>
              {row.slice(1).map((cell, index) => (
                <TableCell key={`${row[0]}-${carrierGuide.compare.columns[index + 1]}`} className="max-w-xs leading-relaxed">
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
      {carrierGuide.compare.caption}
    </p>
  </section>
);