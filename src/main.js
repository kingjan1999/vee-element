import VeeDriver from './drivers/vee'
import AsyncDriver from './drivers/async'

export default function (Vue, validator, asDefault = true) {

  // form
  Vue.options.components.ElForm.options.props.driver = String

  // form item
  const options = Vue.options.components.ElFormItem.options

  // drivers
  const defaultDriver = asDefault
    ? 'vee'
    : 'async'
  const drivers = {
    async: new AsyncDriver(options),
    vee: new VeeDriver(validator),
  }

  // props
  Object.assign(options.props, {
    rules: [Object, String, Array],
    driver: String
  })

  // computed
  options.computed.isRequired = function () {
    return this.getDriver().isRequired.apply(this)
  }

  // methods
  Object.assign(options.methods, {

    getDriver () {
      return drivers[this.form.driver || defaultDriver]
    },

    validate (trigger, callback) {
      const driver = this.getDriver()
      return driver.validate.apply(this, [trigger, callback, driver]) // pass driver as 3rd argument to get around binding
    },

    getRules () {
      return this.getDriver().getRules.apply(this)
    },

    getFilteredRule (trigger) {
      return this.getDriver().getFilteredRule.apply(this, [trigger])
    }
  })
}
