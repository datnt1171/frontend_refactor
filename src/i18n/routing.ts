import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['vi', 'en', 'zh-hant'],
 
  // Used when no locale matches
  defaultLocale: 'vi',

  localeDetection: false
});