import { getTripLogs } from "@/lib/api/server"
import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDuration, formatDateToUTC7 } from "@/lib/utils/date"
import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"
import { TripLogCSVButton } from "./TripLogCSVButton"

export default async function TaskActionDetailPage() {
  const t = await getTranslations()
  const data = await getTripLogs()

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Trip Logs</CardTitle>
          <CardDescription className="flex items-center justify-between">
            <span>Trip Logs by Car</span>
            <TripLogCSVButton data={data} />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="border border-r">
                <TableHeader>
                    <TableRow className="border-b">
                        <TableHead className="border-r">Date</TableHead>
                        <TableHead className="border-r">License Plate</TableHead>
                        <TableHead className="border-r">Driver</TableHead>
                        <TableHead className="border-r">Start Location</TableHead>
                        <TableHead className="border-r">End Location</TableHead>
                        <TableHead className="border-r">Start Odometer</TableHead>
                        <TableHead className="border-r">End Odometer</TableHead>
                        <TableHead className="border-r">Distance</TableHead>
                        <TableHead className="border-r">Start Time</TableHead>
                        <TableHead className="border-r">End Time</TableHead>
                        <TableHead className="border-r">Duration</TableHead>
                        <TableHead className="border-r">Toll Station</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((row, index) => {
                        const currentDate = new Date(row.date).toLocaleDateString();
                        const previousDate = index > 0 ? new Date(data[index - 1]!.date).toLocaleDateString() : null;
                        const isFirstDateInGroup = currentDate !== previousDate;

                        let dateRowSpan = 0;
                        if (isFirstDateInGroup) {
                            for (let i = index; i < data.length; i++) {
                                if (new Date(data[i]!.date).toLocaleDateString() === currentDate) {
                                    dateRowSpan++;
                                } else break;
                            }
                        }

                        const currentPlate = row.license_plate;
                        const previousPlate = index > 0 ? data[index - 1]!.license_plate : null;
                        const previousDateForPlate = index > 0 ? new Date(data[index - 1]!.date).toLocaleDateString() : null;
                        const isFirstPlateInGroup =
                            currentDate !== previousDateForPlate || currentPlate !== previousPlate;

                        let plateRowSpan = 0;
                        if (isFirstPlateInGroup) {
                            for (let i = index; i < data.length; i++) {
                                if (
                                    new Date(data[i]!.date).toLocaleDateString() === currentDate &&
                                    data[i]!.license_plate === currentPlate
                                ) {
                                    plateRowSpan++;
                                } else break;
                            }
                        }

                        const currentDriver = row.username;
                        const previousDriver = index > 0 ? data[index - 1]!.username : null;
                        const previousPlateForDriver = index > 0 ? data[index - 1]!.license_plate : null;
                        const previousDateForDriver = index > 0
                            ? new Date(data[index - 1]!.date).toLocaleDateString()
                            : null;

                        const isFirstDriverInGroup =
                            currentDate !== previousDateForDriver ||
                            currentPlate !== previousPlateForDriver ||
                            currentDriver !== previousDriver;

                        let driverRowSpan = 0;
                        if (isFirstDriverInGroup) {
                            for (let i = index; i < data.length; i++) {
                                if (
                                    new Date(data[i]!.date).toLocaleDateString() === currentDate &&
                                    data[i]!.license_plate === currentPlate &&
                                    data[i]!.username === currentDriver
                                ) {
                                    driverRowSpan++;
                                } else break;
                            }
                        }

                        return (
                            <TableRow key={`${row.trip_id}-${index}`} className="border-b">
                                {isFirstDateInGroup && (
                                    <TableCell
                                        rowSpan={dateRowSpan}
                                        className="font-semibold align-top border-r"
                                    >
                                        {formatDateToUTC7(currentDate, 'date')}
                                    </TableCell>
                                )}

                                {isFirstPlateInGroup && (
                                    <TableCell
                                        rowSpan={plateRowSpan}
                                        className="font-medium align-top border-r"
                                    >
                                        {row.license_plate}
                                    </TableCell>
                                )}

                                {isFirstDriverInGroup && (
                                    <TableCell
                                        rowSpan={driverRowSpan}
                                        className="align-top border-r"
                                    >
                                        <Link
                                            href={`/fleet/trips/${row.trip_id}`}
                                            className="font-bold hover:underline"
                                        >
                                            {row.username}
                                        </Link>
                                    </TableCell>
                                )}

                                <TableCell className="border-r">
                                    {row.start_loc_factory_name || row.start_loc}
                                </TableCell>
                                <TableCell className="border-r">
                                    {row.end_loc_factory_name || row.end_loc}
                                </TableCell>
                                <TableCell className="text-right border-r">{row.start_odometer}</TableCell>
                                <TableCell className="text-right border-r">{row.end_odometer}</TableCell>
                                <TableCell className="text-right font-medium border-r">
                                    {row.distance}
                                </TableCell>
                                <TableCell className="border-r">
                                    {formatDateToUTC7(row.start_time, 'full')}
                                </TableCell>
                                <TableCell className="border-r">
                                    {formatDateToUTC7(row.end_time, 'full')}
                                </TableCell>
                                <TableCell className="text-right border-r">
                                    {formatDuration(row.duration)}
                                </TableCell>
                                <TableCell className="border-r">{row.toll_station || '-'}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}