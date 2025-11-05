import { dropdownItem } from './utils';

export const VAR_DROPDOWN_ITEMS = [
    dropdownItem('텍스트', 'text'),
    dropdownItem('숫자', 'number'),
    dropdownItem('체크박스', 'checkbox'),
    dropdownItem('목록', 'select'),
    dropdownItem('구조체', 'struct'),
    dropdownItem('배열', 'array'),
] as const;
export const FIELD_DROPDOWN_ITEMS = [
    dropdownItem('텍스트', 'text'),
    dropdownItem('숫자', 'number'),
    dropdownItem('체크박스', 'checkbox'),
    dropdownItem('목록', 'select'),
] as const;
