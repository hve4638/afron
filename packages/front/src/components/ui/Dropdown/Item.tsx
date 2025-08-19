import { DROPDOWN_ROLES } from './data';

interface ItemProps {
    name: string;
    value: string;
}

function Item(props: ItemProps) {
    return null;
}

Item.__role = DROPDOWN_ROLES.item;

export default Item;