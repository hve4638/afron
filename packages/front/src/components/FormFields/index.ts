import './styles.scss';
import ToggleSwitchForm from './ToggleSwitchForm';
import NumberForm from './NumberForm';
import StringForm from './StringForm';
import StringLongForm from './StringLongForm';
import ButtonForm from './ButtonForm';
import HotkeyForm from './HotkeyForm';
import CheckBoxForm from './CheckBoxForm';
import DropdownForm from './DropdownForm';
import UploadForm from './UploadForm';

export function Field() {}

Field.ToggleSwitch = ToggleSwitchForm;
Field.Number = NumberForm;
Field.String = StringForm;
Field.StringLong = StringLongForm;
Field.Button = ButtonForm;
Field.Hotkey = HotkeyForm;
Field.CheckBox = CheckBoxForm;
Field.Dropdown = DropdownForm;
Field.Upload = UploadForm;

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
