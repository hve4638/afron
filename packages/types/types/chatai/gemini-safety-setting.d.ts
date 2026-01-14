export declare namespace GeminiSafetySetting {
    type FilterNames = 'HARM_CATEGORY_HARASSMENT'
        | 'HARM_CATEGORY_HATE_SPEECH'
        | 'HARM_CATEGORY_SEXUALLY_EXPLICIT'
        | 'HARM_CATEGORY_DANGEROUS_CONTENT'
        | 'HARM_CATEGORY_CIVIC_INTEGRITY';

    type Threshold = (
        'OFF'
        | 'BLOCK_NONE'
        | 'BLOCK_ONLY_HIGH'
        | 'BLOCK_MEDIUM_AND_ABOVE'
        | 'BLOCK_LOW_AND_ABOVE'
    );
}