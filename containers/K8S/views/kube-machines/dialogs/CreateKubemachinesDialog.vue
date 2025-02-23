<template>
  <base-dialog @cancel="cancelDialog">
    <div slot="header">{{$t('k8s.create')}}</div>
    <div slot="body">
      <a-alert :showIcon="false" banner class="mt-2">
        <template slot="message">
          <div>
            <p>{{$t('k8s.text_147')}}</p>
            <p>{{$t('k8s.text_148')}}</p>
          </div>
        </template>
      </a-alert>
      <a-form
      class="mt-3"
      :form="form.fc">
        <a-form-item :label="$t('k8s.text_152')" v-bind="formItemLayout">
          <server-config
            :decorator="decorators.serverConfig"
            :networkParams="networkParams"
            :form="form"
            :cloudregionId="params.data.cloudregion_id"
            :hypervisor="hypervisor"
            :platform="platform"
            @vmAdd="vmAdd">
            <template v-slot:hypervisor="slotProps">
              <a-form-item :label="$t('k8s.platform')" v-if="hypervisorsC.length" v-bind="slotProps.formItemLayout">
                <a-radio-group v-decorator="decorators.serverConfig.hypervisor(slotProps.i)">
                  <a-radio-button v-for="item in hypervisorsC" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </a-radio-button>
                </a-radio-group>
              </a-form-item>
            </template>
          </server-config>
        </a-form-item>
      </a-form>
    </div>
    <div slot="footer">
      <a-button type="primary" @click="handleConfirm" :loading="loading">{{$t('common.create')}}</a-button>
      <a-button @click="cancelDialog">{{ $t('dialog.cancel') }}</a-button>
    </div>
  </base-dialog>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import ServerConfig from '@K8S/sections/serverConfig'
import { IMAGES_TYPE_MAP } from '@/constants/compute'
import { HYPERVISORS_MAP } from '@/constants'
import { KUBE_PROVIDER, hyperOpts } from '@K8S/views/cluster/constants'
import { isWithinRange, isRequired } from '@/utils/validate'
import DialogMixin from '@/mixins/dialog'
import WindowsMixin from '@/mixins/windows'
import { typeClouds, findPlatform } from '@/utils/common/hypervisor'
import i18n from '@/locales'

function checkIpInSegment (i, networkData) {
  return (rule, value, _callback) => {
    const isIn = isWithinRange(value, networkData.guest_ip_start, networkData.guest_ip_end)
    if (isIn) {
      _callback()
    } else {
      _callback(this.$t('k8s.text_163'))
    }
  }
}

export default {
  name: 'CreateKubemachinesDialog',
  components: {
    ServerConfig,
  },
  mixins: [DialogMixin, WindowsMixin],
  data () {
    const hypervisor = _.get(typeClouds.providerlowcaseMap, `[${this.params.data.provider}].hypervisor`) || 'kvm'
    return {
      loading: false,
      form: {
        fc: this.$form.createForm(this, {
          onValuesChange: (props, values) => {
            /*
             * if (values.zone && values.zone.key) {
             *   this.param.network = {
             *     vpc: this.data.vpc_id,
             *     filter: 'server_type.notin(ipmi, pxe)',
             *     scope: this.scope,
             *   }
             *   this.fetchCapability(values.zone.key, 'zone')
             * }
             */
            /*
             * if (values.cloudregion && values.cloudregion.key) {
             *   this.fetchCapability(values.cloudregion.key, 'cloudregion')
             * }
             */
            Object.keys(values).forEach((key) => {
              this.form.fd[key] = values[key]
            })
          },
        }),
        fi: {
          capability: {},
          clusterHypervisor: hypervisor, // 该集群的默认 hypervisor
        },
        fd: {
          hypervisor,
        },
      },
      decorators: {
        serverConfig: {
          hypervisor: i => [
            `hypervisors[${i}]`,
            {
              initialValue: hypervisor,
              rules: [
                { required: true, message: this.$t('k8s.text_99') },
              ],
            },
          ],
          sku: i => [
            `sku[${i}]`,
            {
              rules: [
                { validator: isRequired(true, 'id'), message: this.$t('compute.text_216') },
              ],
            },
          ],
          disk: i => ({
            type: [
              `systemDiskType[${i}]`,
              {
                rules: [
                  { validator: isRequired(), message: this.$t('compute.text_121') },
                ],
              },
            ],
            size: [
              `systemDiskSize[${i}]`,
              {
                rules: [
                  { required: true, message: this.$t('compute.text_122') },
                ],
              },
            ],
            schedtag: [
              `systemDiskSchedtag[${i}]`,
              {
                validateTrigger: ['change', 'blur'],
                rules: [{
                  required: true,
                  message: this.$t('compute.text_123'),
                }],
              },
            ],
            policy: [
              `systemDiskPolicy[${i}]`,
              {
                validateTrigger: ['blur', 'change'],
                rules: [{
                  required: true,
                  message: this.$t('compute.text_123'),
                }],
              },
            ],
          }),
          network: i => [
            `network[${i}]`,
            {
              rules: [
                { required: true, message: this.$t('k8s.text_122') },
              ],
            },
          ],
          ip: (i, networkData) => [
            `ip[${i}]`,
            {
              validateFirst: true,
              validateTrigger: ['blur', 'change'],
              rules: [{
                required: true,
                message: this.$t('k8s.text_169'),
              }, {
                validator: checkIpInSegment(i, networkData),
              }],
            },
          ],
          num: i => [
            `num[${i}]`,
            {
              initialValue: 1,
            },
          ],
          role: i => [
            `role[${i}]`,
            {
              initialValue: 'controlplane',
            },
          ],
          imageOS: i => [
            `imageOS[${i}]`,
            {
              os: [
                `os[${i}]`,
                {
                  initialValue: '',
                  rules: [
                    { required: true, message: i18n.t('compute.text_153') },
                  ],
                },
              ],
              image: [
                `image[${i}]`,
                {
                  initialValue: { key: '', label: '' },
                  rules: [
                    { validator: isRequired(), message: i18n.t('compute.text_214') },
                  ],
                },
              ],
              imageType: [
                `imageType[${i}]`,
                {
                  initialValue: IMAGES_TYPE_MAP.standard.key,
                },
              ],
            },
          ],
        },
      },
      formItemLayout: {
        wrapperCol: { span: 20 },
        labelCol: { span: 3 },
      },
      param: {
        zone: {
          usable: true,
          show_emulated: true,
          order_by: 'created_at',
          order: 'asc',
          scope: this.scope,
        },
        region: {
          usable: true,
          scope: this.scope,
          cloud_env: 'onpremise',
        },
        network: {},
        k8sVersions: {
          provider: KUBE_PROVIDER,
          resource_type: 'guest',
        },
      },
    }
  },
  provide () {
    return {
      form: this.form,
    }
  },
  computed: {
    ...mapGetters(['scope']),
    hypervisorsC () {
      const opts = hyperOpts.filter(item => {
        return (_.get(this.form.fi, 'capability.hypervisors') || []).find(val => val === item.value.toLowerCase())
      })
      return opts
    },
    networkParams () {
      return {
        vpc: this.params.data.vpc_id,
        filter: 'server_type.notin(ipmi, pxe)',
        scope: this.scope,
      }
    },
    hypervisor () {
      return this.form.fd.hypervisor
    },
    platform () {
      return findPlatform(this.hypervisor, 'hypervisor')
    },
  },
  created () {
    this.form.fc.getFieldDecorator('cloudregion', { preserve: true })
    this.form.fc.getFieldDecorator('zone', { preserve: true })
  },
  methods: {
    validator (type) {
      return (rule, value, _callback) => {
        if (type === 'vcpu_count') {
          if (value < 4 || value > 32) {
            return _callback(this.$t('k8s.text_172'))
          }
        } else if (type === 'vmem_size') {
          if (value < 4 || value > 128) {
            return _callback(this.$t('k8s.text_173'))
          }
        } else if (type === 'disk') {
          if (value < 1 || value > 128) {
            return _callback(this.$t('k8s.text_174'))
          }
        }
        return _callback()
      }
    },
    doCreate (data) {
      return new this.$Manager('kubeclusters', 'v1').performAction({
        id: this.params.data.id,
        action: 'add-machines',
        data,
      })
    },
    genData (data) {
      const values = {
        machines: [],
      }
      Object.keys(data.sku).map(key => {
        const disks = [{
          index: 0,
          size: data.systemDiskSize[key] * 1024,
          backend: data.systemDiskType[key].key,
        }]
        if (data.systemDiskSchedtag) {
          if (data.systemDiskSchedtag[key] && data.systemDiskPolicy[key]) {
            disks[0].schedtags = [{ id: data.systemDiskSchedtag[key], strategy: data.systemDiskPolicy[key] }]
          }
        }
        if ((this.hypervisor === HYPERVISORS_MAP.kvm.key || this.hypervisor === HYPERVISORS_MAP.cloudpods.key) && disks[0].backend.indexOf('local') !== -1) {
          disks[0].medium = disks[0].backend.split('-')[1]
          disks[0].backend = disks[0].backend.split('-')[0]
        }
        if (data.image && data.image[key]) {
          disks[0].image_id = data.image[key].key
        }
        const machinesItem = {
          vm: {
            /*
             * vcpu_count: data.vcpu_count[key],
             * vmem_size: data.vmem_size[key] * 1024,
             */
            instance_type: data.sku[key].name,
            hypervisor: this.hypervisor,
            disks,
            nets: [{ network: data.network[key] }],
          },
        }
        if (data.ip && data.ip[key]) machinesItem.vm.nets[0].address = data.ip[key]
        if (data.num[key] > 1) {
          for (let i = 0; i < data.num[key]; i++) {
            values.machines.push({ config: machinesItem, role: data.role[key], resource_type: 'vm' })
          }
        } else {
          values.machines.push({ config: machinesItem, role: data.role[key], resource_type: 'vm' })
        }
      })
      return values
    },
    async handleConfirm () {
      this.loading = true
      try {
        const values = await this.form.fc.validateFields()
        const genValues = this.genData(values)
        await this.doCreate(genValues)
        this.loading = false
        this.$message.success(this.$t('k8s.text_281'))
        this.params.refresh()
        this.cancelDialog()
      } catch (error) {
        this.loading = false
        throw error
      }
    },
    async fetchCapability (id, resource) {
      const params = {
        show_emulated: true,
        resource_type: 'shared',
        scope: this.scope,
      }
      const capabilityParams = { id, spec: 'capability', params }
      if (!id) return
      this.capabilityParams = capabilityParams
      try {
        const { data } = await new this.$Manager(`${resource}s`).getSpecific(this.capabilityParams)
        this.form.fi.capability = data
        await this.$nextTick()
        if (this.hypervisorsC.length) {
          const hasDefaultHypervisor = this.hypervisorsC.find(val => val.value === this.form.fi.clusterHypervisor)
          if (!hasDefaultHypervisor) {
            const { hypervisors } = this.form.fc.getFieldsValue()
            const values = {}
            for (const key in hypervisors) {
              values[`hypervisors[${key}]`] = this.hypervisorsC[0].value
            }
            this.form.fc.setFieldsValue(values)
          }
        }
      } catch (error) {
        throw error
      }
    },
    vmAdd ({ key }) {
      if (this.hypervisorsC.length) {
        this.form.fc.setFieldsValue({
          [`hypervisors[${key}]`]: this.hypervisorsC[0].value,
        })
      }
    },
  },
}
</script>
