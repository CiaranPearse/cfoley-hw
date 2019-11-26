import { mount } from '@vue/test-utils'
import PropertyList from '@/components/PropertyList.vue'
describe('PropertyList', () => {
  it('Mounting is available', () => {
    expect(typeof PropertyList.mounted).toBe('function')
  })

  it('sets the correct default data', () => {
    const defaultData = PropertyList.data()
    expect(defaultData.loading).toBe(true)
    expect(defaultData.error).toBe(false)
    expect(defaultData.location).toBe('')
    expect(defaultData.properties).toBe(null)
  })

  it('shows loading screen if loading', () => {
    const wrapper = mount(PropertyList)
    wrapper.setData({ loading: true })
    expect(wrapper.find('#loading'))
  })

  it('shows properties if loading and error is false', () => {
    const wrapper = mount(PropertyList)
    wrapper.setData({ loading: false, error: false })
    expect(wrapper.find('#property-list'))
  })

  it('shows Error if error is true', () => {
    const wrapper = mount(PropertyList)
    wrapper.setData({ error: true, loading: false })
    expect(wrapper.find('#error'))
  })
})
