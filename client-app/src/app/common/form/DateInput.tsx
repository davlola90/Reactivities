import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { FormFieldProps, Form, Label,Select } from 'semantic-ui-react'
import{DateTimePicker} from 'react-widgets';



interface IProps extends FieldRenderProps<Date, HTMLInputElement|HTMLElement> , FormFieldProps {}


const DateInput:React.FC<IProps> = ({
    input,
    width,
    date=false,
    time = false,
    placeholder,
    meta :{ touched, error } ,
    ...rest
}) => {
    return (
        <Form.Field error={ touched && !!error }  width={width}>
        <DateTimePicker
        value={input.value||null}
       {...rest}
       date={date}
       time={time}
        placeholder={placeholder}
        onChange={input.onChange}
        />
        {touched && error && (
            <Label basic color='red'>
                {error}
            </Label>
        )}
    </Form.Field>
    )
}

export default DateInput
