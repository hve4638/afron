import './styles.scss';
import ToggleSwitchForm from './ToggleSwitchForm';
import NumberForm from './NumberForm';
import StringForm from './StringForm';
import StringLongForm from './StringLongForm';
import ButtonForm from './ButtonForm';
import HotkeyForm from './HotkeyForm';
import CheckBoxForm from './CheckBoxForm';
import DropdownForm from './DropdownForm';

export function Form() {}

Form.ToggleSwitch = ToggleSwitchForm;
Form.Number = NumberForm;
Form.String = StringForm;
Form.StringLong = StringLongForm;
Form.Button = ButtonForm;
Form.Hotkey = HotkeyForm;
Form.CheckBox = CheckBoxForm;
Form.Dropdown = DropdownForm;

const TextForm = StringForm;
export {
    ToggleSwitchForm,
    NumberForm,
    StringForm,
    TextForm,
    StringLongForm,
    ButtonForm,
    HotkeyForm,
    CheckBoxForm,
    DropdownForm,
}
