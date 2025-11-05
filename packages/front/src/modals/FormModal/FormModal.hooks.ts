import ProfileEvent from '@/features/profile-event';
import useHotkey from '@/hooks/useHotkey';
import { useEffect, useRef, useState } from 'react';
import { RTFormWithLastValue } from '@/features/profile-event/types';
import { getRTVarConfigDefaultValue } from './utils';

interface useFormModalProps {
    focused: boolean;
    close: () => void;
}

export function useFormModal({
    focused,
    close
}: useFormModalProps) {
    const [forms, setForms] = useState<RTFormWithLastValue[]>([]);
    const latestVariablesRef = useRef<Record<string, any>>({});
    const [variables, setVariables] = useState<Record<string, any>>({});

    useEffect(() => {
        ProfileEvent.currentSession.getForms()
            .then((forms) => {
                const vars: Record<string, any> = {};
                for (const form of forms) {
                    if (form.last_value != null) {
                        vars[form.id] = form.last_value;
                    }
                    else {
                        vars[form.id] = getRTVarConfigDefaultValue(form);
                    }
                }

                setVariables(vars);
                setForms(forms);
            });

        return () => {
            ProfileEvent.currentSession.setForms(latestVariablesRef.current);
        }
    }, []);

    useEffect(() => {
        latestVariablesRef.current = variables;
    }, [variables]);

    useHotkey({
        'Escape': close,
    }, focused, []);

    return {
        forms,
        variables,
        setVariables,
    };
}