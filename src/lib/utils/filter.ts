import { getFactories, getRetailers, getUsers } from "@/lib/api/server";

export async function getFactoryOptions() {
  const factories = await getFactories({
    'is_active': 'true', 
    'has_onsite': 'true',
    'page_size': '999999',
    'page': '1'
  });
  
  return factories.results.map(factory => ({
    value: factory.factory_code,
    label: factory.factory_name
  }));
}

export async function getRetailerOptions() {
  const retailers = await getRetailers({
    'page_size': '999999',
    'page': '1' 
  });
  
  return retailers.results.map(retailer => ({
    value: retailer.id,
    label: retailer.name
  }));
}

export async function getUserOptions() {
  const users = await getUsers({
    'department__name__in': 'KTC,KTW,KVN,TT',
    'role__name__in': 'technician',
    'page_size': '999999',
    'page': '1'
  });
  
  return users.results.map(user => ({
    value: user.id,
    label: user.username
  }));
}

export function getStateTypeOptions() {
  return [
    { value: 'pending_approve', label: 'Pending Approve' },
    { value: 'analyze', label: 'Analyze' },
    { value: 'working', label: 'Working' },
    { value: 'pending_review', label: 'Pending Review' },
    { value: 'start', label: 'Start' },
    { value: 'denied', label: 'Denied' },
    { value: 'canceled', label: 'Canceled' },
    { value: 'closed', label: 'Closed' },
    { value: 'static', label: 'Static'}
  ];
}

export function getDepartmentOptions() {
  return [
    { value: 'KTW', label: 'KTW' },
    { value: 'KTC', label: 'KTC' },
    { value: 'KVN', label: 'KVN' },
    { value: 'TT', label: 'TT' },
  ];
}

export const MONTH_OPTIONS = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' }
];

export const TIME_GROUP_BY_OPTIONS = [
  { value: 'year', label: 'Year' },
  { value: 'quarter', label: 'Quarter' },
  { value: 'month', label: 'Month' },
  { value: 'week_of_year', label: 'Week' },
  { value: 'day_of_week', label: 'Weekday' },
  { value: 'date', label: 'Date' },
  { value: 'day', label: 'Day' },
];

export const TIME_SELECT_OPTIONS = [
  { value: 'year', label: 'Year' },
  { value: 'year,quarter', label: 'Timeline (Year-Quarter)' },
  { value: 'year,month', label: 'Timeline (Year-Month)' },
  { value: 'year,week_of_year', label: 'Timeline (Year-Week)' },
  { value: 'year,date', label: 'By Date' },
  { value: 'quarter,year', label: 'Compare Years by Quarter' },
  { value: 'month,year', label: 'Compare Years by Month' },
  { value: 'week_of_year,year', label: 'Compare Years by Week' },
];

export function getYearOptions(yearsBack: number = 3): Array<{ value: string; label: string }> {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: yearsBack + 1 }, (_, i) => {
    const year = currentYear - i;
    return { value: year.toString(), label: year.toString() };
  });
}

export const THINNER_PAINT_OPTIONS = [
  { value: '原料溶劑 NL DUNG MOI', label: '原料溶劑 NL DUNG MOI' },
  { value: '成品溶劑DUNG MOI TP', label: '成品溶劑DUNG MOI TP' },
  { value: '烤調色PM HAP', label: '烤調色PM HAP' },
  { value: '木調色PM GO', label: '木調色PM GO' },
  { value: '底漆 LOT', label: '底漆 LOT' },
  { value: '面漆 BONG', label: '面漆 BONG' },
  { value: '水性SON NUOC', label: '水性SON NUOC' },
  { value: '色母SON CAI', label: '色母SON CAI' },
  { value: '補土 BOT TRET', label: '補土 BOT TRET' },
  { value: '半成品BAN THANHPHAM', label: '半成品BAN THANHPHAM' },
  { value: '助劑PHU GIA', label: '助劑PHU GIA' },
  { value: '色精TINH MAU', label: '色精TINH MAU' },
  { value: '粉類 BOT', label: '粉類 BOT' },
  { value: '硬化劑chat cung', label: '硬化劑chat cung' },
]

export function getProcessPrefixOptions() {
  return [
    { value: 'SP', label: 'Báo Mẫu' },
    { value: 'DR', label: 'BC hằng ngày' },
    { value: 'TA', label: 'Điều động' }
  ];
}