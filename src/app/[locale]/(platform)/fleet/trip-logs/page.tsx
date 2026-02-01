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
import { getTranslations, getLocale } from "next-intl/server"
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SidebarRightMobileTrigger } from '@/components/dashboard/SidebarRightMobileTrigger';
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import { getYearOptions, getMonthOptions, redirectWithDefaults } from "@/lib/utils/filter"
import { CAR_LICENSE_PLATE_OPTION } from '@/lib/utils/filter';
import type { PageFilterConfig } from "@/types"
import { TripLogCSVButton } from "./TripLogCSVButton"


interface TripLogPageProps {
  searchParams: Promise<{
    month?: string,
    year?: string,
    license_plate?: string,
    driver?: string,
  }>
}

export default async function Page({searchParams}: TripLogPageProps) {
  const params = await searchParams
  const locale = await getLocale()
  const t = await getTranslations()
  const today = toZonedTime(new Date(), 'Asia/Ho_Chi_Minh');

  const defaultParams = {
    year: format(today, 'yyyy'),
    month: format(today, 'M')
  }

  redirectWithDefaults({
    currentParams: params,
    defaultParams,
    pathname: '/fleet/trip-logs',
    locale
  });

  const FilterConfig: PageFilterConfig = {
    showResetButton: false,
    autoApplyFilters: true,
    isPaginated: false,
    
    filters: [
      {
        id: 'year',
        type: 'select',
        label: t('filter.selectYear'),
        options: getYearOptions()
      },
      {
        id: 'month',
        type: 'select',
        label: t('filter.selectMonth'),
        options: await getMonthOptions()
      },
      {
        id: 'license_plate',
        type: 'multiselect',
        label: t('fleet.trip.licensePlate'),
        placeholder: t('filter.selectLicensePlate'),
        options: CAR_LICENSE_PLATE_OPTION
      },
    //   {
    //     id: 'driver',
    //     type: 'multiselect',
    //     label: t('filter.selectUser'),
    //     placeholder: t('filter.selectUser'),
    //     options: await getTTVNOptions()
    //   }
    ]
  }
  
  const data = await getTripLogs(params)

  return (
    <SidebarProvider>
      <SidebarInset className="flex flex-col min-w-0">
        <SidebarRightMobileTrigger />
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('fleet.trip.tripLog')}</CardTitle>
          <CardDescription className="flex items-center justify-between">
            <span>{t('fleet.trip.tripLogDescription')}</span>
            <TripLogCSVButton data={data} />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="border border-r">
                <TableHeader>
                    <TableRow className="border-b">
                        <TableHead className="border-r">{t('common.date')}</TableHead>
                        <TableHead className="border-r">{t('fleet.trip.licensePlate')}</TableHead>
                        <TableHead className="border-r">{t('fleet.trip.driver')}</TableHead>
                        <TableHead className="border-r">{t('fleet.trip.startLocation')}</TableHead>
                        <TableHead className="border-r">{t('fleet.trip.endLocation')}</TableHead>
                        <TableHead className="border-r">{t('fleet.trip.startOdometer')}</TableHead>
                        <TableHead className="border-r">{t('fleet.trip.endOdometer')}</TableHead>
                        <TableHead className="border-r">{t('fleet.trip.distance')}</TableHead>
                        <TableHead className="border-r">{t('fleet.trip.startTime')}</TableHead>
                        <TableHead className="border-r">{t('fleet.trip.endTime')}</TableHead>
                        <TableHead className="border-r">{t('taskManagement.action.duration')}</TableHead>
                        <TableHead className="border-r">{t('fleet.stop.tollStation')}</TableHead>
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
                                    {row.start_loc_factory_name}
                                </TableCell>
                                <TableCell className="border-r">
                                    {row.end_loc_factory_name}
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
    </SidebarInset>
      
      <SidebarRight filterConfig={FilterConfig} />
    </SidebarProvider>
  )
}