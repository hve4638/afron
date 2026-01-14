import { RTForm, RTFormNaive } from "@afron/types";
import { SetStateAction } from "react";

export type FormFieldProps<TFormType extends RTForm['type'], TValue = any> = {
    name: string;

    value: TValue;
    onChange: (value: SetStateAction<TValue>) => void;
}
