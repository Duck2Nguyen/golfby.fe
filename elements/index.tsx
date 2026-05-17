import TextField from './TextField';
import PriceInput from './PriceInput';
import SelectField from './SelectField';
import PasswordField from './PasswordField';
import DatePickerField from './DatePickerField';

export const Field = {
  Text: TextField,
  Password: PasswordField,
  DatePicker: DatePickerField,
  Select: SelectField,
};

export { PriceInput };

export default Field;
