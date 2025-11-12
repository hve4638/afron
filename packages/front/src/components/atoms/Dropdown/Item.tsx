import { ReactNode } from 'react';
import { DROPDOWN_ROLES } from './data';

interface ItemProps {
    name: ReactNode;
    value: string;
    children?: React.ReactNode;
}

function Item(props: ItemProps) {
    return null;
}

Item.__role = DROPDOWN_ROLES.item;

export default Item;