import { JSONType, StorageAccess } from "ac-storage";
import FORM_JSON_TREE from "./form-json-tree";
import { MODEL_SETTINGS } from "./model-config";

const REQUEST_TEMPLATE_TREE = {
    'index.json': StorageAccess.JSON({
        'tree': JSONType.Array(),
        'ids': JSONType.Array(),
    }),
    '*': {
        'index.json': StorageAccess.JSON({
            'version': JSONType.String().default_value('1.0.0'),
            'id': JSONType.String(),
            'name': JSONType.String(),
            'uuid': JSONType.String(),
            'mode': JSONType.Union('prompt_only', 'flow').default_value('prompt_only'),
            'input_type': JSONType.Union('normal', 'chat').default_value('normal'),
            'forms': JSONType.Array(JSONType.String()), // form 순서
            'entrypoint_node': JSONType.Number(),
        }),
        'form.json': StorageAccess.JSON({
            // key: form_id
            '*': FORM_JSON_TREE,
        }),
        'cache.json': StorageAccess.JSON({
            'prompts': JSONType.Array({ // workflow 내에서 보여줄 prompt 순서
                'id': JSONType.String(),
                'name': JSONType.String(),
            }).strict(),
        }),
        'flow.json': StorageAccess.JSON({
            // key: node_id
            '*': {
                'type': JSONType.String(),
                'description': JSONType.String(),
                'data': JSONType.Struct(),
                'connection': JSONType.Array({
                    'from_handle': JSONType.String(),
                    'to_node': JSONType.String(),
                    'to_handle': JSONType.String(),
                }),
                'position': {
                    'x': JSONType.Number().default_value(0),
                    'y': JSONType.Number().default_value(0),
                },
            },
        }),
        'prompts': {
            // key: prompt_id
            '*': StorageAccess.JSON({
                'id': JSONType.String(),
                'name': JSONType.String(),

                'model': MODEL_SETTINGS,
                'variables': JSONType.Array({
                    'name': JSONType.String(),
                    'form_id': JSONType.String(),
                    'weak': JSONType.Bool().default_value(false),
                }),
                'constants': JSONType.Array({
                    'name': JSONType.String(),
                    'value': JSONType.Any(),
                }),
                'contents': JSONType.String(),
            }),
        },
    }
}

export default REQUEST_TEMPLATE_TREE;