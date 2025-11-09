import { getFactories, getRetailers, getUsers } from "@/lib/api/server";
import { getTranslations } from "next-intl/server";

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

export async function getFullFactoryOptions() {
  const factories = await getFactories({
    'page_size': '999999',
    'page': '1'
  });
  
  return factories.results.map(factory => ({
    value: factory.factory_code,
    label: `${factory.factory_name} (${factory.factory_code})`
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

export async function getStateTypeOptions() {
  const t = await getTranslations();

  return [
    { value: 'pending_approve', label: t('taskManagement.state.pendingApprove') },
    { value: 'analyze', label: t('taskManagement.state.analyze') },
    { value: 'working', label: t('taskManagement.state.working') },
    { value: 'pending_review', label: t('taskManagement.state.pendingReview') },
    { value: 'start', label: t('taskManagement.state.start') },
    { value: 'denied', label: t('taskManagement.state.denied') },
    { value: 'canceled', label: t('taskManagement.state.canceled') },
    { value: 'closed', label: t('taskManagement.state.closed') },
    { value: 'static', label: t('taskManagement.state.static') },
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

export const CAR_LICENSE_PLATE_OPTION = [
  { value: "61LD04744", label: "61LD-04744" },
  { value: "61LD06031", label: "61LD-06031" },
  { value: "50LD17678", label: "50LD-17678" },
  { value: "61LD06059", label: "61LD-06059" },
  { value: "61LD06005", label: "61LD-06005" },
  { value: "61LD04338", label: "61LD-04338" },
  { value: "61LD05015", label: "61LD-05015" },
  { value: "61LD06012", label: "61LD-06012" },
  { value: "61C62833",  label: "61C-62833" },
  { value: "61LD04751", label: "61LD-04751" },
  { value: "61K41393",  label: "61K-41393" },
  { value: "61LD08141", label: "61LD-08141" },
  { value: "50LD04904", label: "50LD-04904" },
  { value: "51M44894", label: "51M-44894" },
];

export function getProcessPrefixOptions() {
  return [
    { value: 'SP', label: 'Báo Mẫu' },
    { value: 'DR', label: 'BC hằng ngày' },
    { value: 'TA', label: 'Điều động' }
  ];
}

export async function getTimeGroupByOptions() {
  const t = await getTranslations();

  return [
    { value: 'year', label: t('datetime.year') },
    { value: 'quarter', label: t('datetime.quarter') },
    { value: 'month', label: t('datetime.month') },
    { value: 'week_of_year', label: t('datetime.week') },
    { value: 'day_of_week', label: t('datetime.weekday') },
    { value: 'date', label: t('datetime.date') },
    { value: 'day', label: t('datetime.day') },
  ];
}

export async function getTimeSelectOptions() {
  const t = await getTranslations();

  return [
    { value: 'year', label: t('datetime.year') },
    { value: 'year,quarter', label: t('datetime.timelineYearQuarter') },
    { value: 'year,month', label: t('datetime.timelineYearMonth') },
    { value: 'year,week_of_year', label: t('datetime.timelineYearWeek') },
    { value: 'year,date', label: t('datetime.byDate') },
    { value: 'quarter,year', label: t('datetime.compareYearsByQuarter') },
    { value: 'month,year', label: t('datetime.compareYearsByMonth') },
    { value: 'week_of_year,year', label: t('datetime.compareYearsByWeek') },
  ];
}

export async function getMonthOptions() {
  const t = await getTranslations();
  return [
    { value: '1', label: t('datetime.monthsShort.january') },
    { value: '2', label: t('datetime.monthsShort.february') },
    { value: '3', label: t('datetime.monthsShort.march') },
    { value: '4', label: t('datetime.monthsShort.april') },
    { value: '5', label: t('datetime.monthsShort.may') },
    { value: '6', label: t('datetime.monthsShort.june') },
    { value: '7', label: t('datetime.monthsShort.july') },
    { value: '8', label: t('datetime.monthsShort.august') },
    { value: '9', label: t('datetime.monthsShort.september') },
    { value: '10', label: t('datetime.monthsShort.october') },
    { value: '11', label: t('datetime.monthsShort.november') },
    { value: '12', label: t('datetime.monthsShort.december') },
  ];
}