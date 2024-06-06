import { useLocale } from 'next-intl';

import LocaleSwitcherSelect from './locale-switcher-select';

export function LocaleSwitcher() {
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect defaultValue={locale}>
      <option value="en">English</option>
      <option value="es">Spanish</option>
    </LocaleSwitcherSelect>
  );
}
