import MaxTokenForm from './MaxTokenForm';
import TemperatureForm from './TemperatureForm';
import TopPForm from './TopPForm';
import SafetyFilterForm from './SafetyFilterForm';
import ThinkingTokensForm from './ThinkingTokensForm';
import ThinkingEnabledForm from './ThinkingEnabledForm';
import VerbosityForm from './VerbosityForm';
import ReasoningEffortForm from './ReasoningEffortForm';

function ModelForm() {}

ModelForm.MaxToken = MaxTokenForm;
ModelForm.Temperature = TemperatureForm;
ModelForm.TopP = TopPForm;
ModelForm.SafetyFilter = SafetyFilterForm;
ModelForm.ThinkingEnabled = ThinkingEnabledForm;
ModelForm.ThinkingTokens = ThinkingTokensForm;
ModelForm.Verbosity = VerbosityForm;
ModelForm.ReasoningEffort = ReasoningEffortForm;

export default ModelForm;