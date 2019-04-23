import * as React from 'react';
import { Form, Switch, Select } from 'antd';
import { FieldTypeEnum, RuleTypeEnum } from 'nooket-common';

const FormItem = Form.Item;
const Option = Select.Option;

class SettingsForm extends React.Component<any, any> {
  public state = {
    allowManualOrder: this.props.allowManualOrder,
  };

  private handleAllowManualOrderChange = value => {
    const {
      form: { setFieldsValue },
    } = this.props;

    setFieldsValue({ allowGrouping: !value });
    this.setState({ allowManualOrder: value });
  };

  public render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { allowManualOrder } = this.state;

    const formItemLayout = {
      labelCol: {
        sm: { span: 6 },
        xs: { span: 24 },
      },
      wrapperCol: {
        sm: { span: 18 },
        xs: { span: 24 },
      },
    };

    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label="Manual order"
          extra="By default the view mantains the data order"
        >
          {getFieldDecorator('allowManualOrder', {
            valuePropName: 'checked',
            onChange: this.handleAllowManualOrderChange,
          })(<Switch />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Allow grouping"
          extra="Group the data by month"
        >
          {getFieldDecorator('allowGrouping', {
            getValueProps(value) {
              return {
                checked: !allowManualOrder && value,
                disabled: allowManualOrder,
              };
            },
          })(<Switch />)}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create({
  mapPropsToFields: (props: any) => {
    const { allowManualOrder, allowGrouping } = props;

    return {
      allowManualOrder: Form.createFormField({
        value: allowManualOrder,
      }),
      allowGrouping: Form.createFormField({
        value: allowGrouping,
      }),
    };
  },
})(SettingsForm);
