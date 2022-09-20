import { shallowMount } from '@vue/test-utils'
import JumpServer from '../index.vue'

jest.mock('@/utils/manager', () => {
  const nodelist = [
    { name: 'test1', id: 1 },
    { name: 'test2', id: 2 },
    { name: 'test3', id: 3 },
  ]
  function Manager () {}
  Manager.prototype.list = () => Promise.resolve({ data: { data: nodelist } })
  return { Manager }
})

describe('JumpServer switchDisabled', () => {
  const decorator = {
    jumpserverEnable: [
      'jumpserverEnable',
      {
        valuePropName: 'checked',
        initialValue: false,
      },
    ],
    jumpserver: [
      'jumpserver',
    ],
  }

  it('nodeList.length decide switchDisabled false', () => {
    const wrapper = shallowMount(JumpServer, {
      propsData: { decorator },
      data () {
        return {
          jumpserverEnable: false,
        }
      },
    })
    wrapper.vm.$nextTick(() => { // 已经模拟 manager 方法返回 nodeList
      expect(wrapper.vm.switchDisabled).toBeFalsy()
    })
  })
})
