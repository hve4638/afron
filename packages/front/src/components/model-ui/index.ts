import MaxTokenForm from './MaxTokenForm';
import TemperatureForm from './TemperatureForm';
import TopPForm from './TopPForm';
import SafetyFilterForm from './SafetyFilterForm';
import ThinkingTokensForm from './ThinkingTokensForm';
import ThinkingEnabledForm from './ThinkingEnabledForm';

function ModelForm() {}

ModelForm.MaxToken = MaxTokenForm;
ModelForm.Temperature = TemperatureForm;
ModelForm.TopP = TopPForm;
ModelForm.SafetyFilter = SafetyFilterForm;
ModelForm.ThinkingEnabled = ThinkingEnabledForm;
ModelForm.ThinkingTokens = ThinkingTokensForm;

export default ModelForm;