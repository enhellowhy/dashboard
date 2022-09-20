<template>
  <base-dialog @cancel="cancelDialog">
    <div slot="header">{{$t('system.text_548')}}</div>
    <div slot="body">
      <dialog-selected-tips :name="$t('system.text_13')" :count="params.data.length" :action="$t('system.text_548')" />
      <dialog-table :data="params.data" :columns="params.columns.slice(0, 1)" />
      <a-form
        :form="form.fc"
        v-bind="formItemLayout"
        hideRequiredMark>
        <a-form-item :label="$t('system.text_48')" :help="$t('system.text_549')" class="mb-3" v-show="isCustomeService">
          <a-radio-group v-decorator="decorators.type" @change="changeTypeHandle">
              <template v-for="(item) of options.TYPES">
                <a-radio-button :value="item.key" :key="item.key">{{ item.label }}</a-radio-button>
              </template>
            </a-radio-group>
        </a-form-item>
        <a-form-item :label="$t('system.text_550')" v-if="isThirdWF" required>
          <a-row type="flex" justify="start" :gutter="4">
            <a-col :span="12">
              <a-form-item>
                <a-select
                  show-search
                  allow-clear
                  option-filter-prop="children"
                  :loading="dataLoading.serviceDesk"
                  :filter-option="filterOption"
                  v-decorator="decorators.serviceDesk"
                  @change="changeServiceDeskHandle">
                  <a-select-option v-for="obj in options.SERVICE_DESKS" :value="obj.key" :key="obj.key">{{ obj.label }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item>
                <a-select
                  show-search
                  allow-clear
                  option-filter-prop="children"
                  :filter-option="filterOption"
                  :loading="dataLoading.requestType"
                  v-decorator="decorators.requestType">
                  <a-select-option v-for="obj in options.REQUEST_TYPES" :value="obj.key" :key="obj.key">{{ obj.label }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item :label="$t('system.text_544')" v-if="!isThirdWF">
          <process-list
            :decorator="decorators.processEntity"
            :process-ops="processList"
            :type="processType"
            @roles="getRoles"
            @users="getUsers" />
        </a-form-item>
      </a-form>
    </div>
    <div slot="footer">
      <a-button type="primary" @click="handleConfirm" :loading="loading">{{ $t('dialog.ok') }}</a-button>
      <a-button @click="cancelDialog">{{ $t('dialog.cancel') }}</a-button>
    </div>
  </base-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import ProcessList from '../components/ProcessList'
import { TYPES } from '../constants'
import { WORKFLOW_TYPES } from '@/constants/workflow'
import DialogMixin from '@/mixins/dialog'
import WindowsMixin from '@/mixins/windows'

export default {
  name: 'WorkflowConfigUpdateProcessDialog',
  components: {
    ProcessList,
  },
  mixins: [DialogMixin, WindowsMixin],
  data () {
    return {
      loading: false,
      form: {
        fc: this.$form.createForm(this),
        fd: {
          type: 'local',
          serviceDeskId: '',
          requestTypeId: '',
        },
      },
      decorators: {
        type: [
          'type', {
            initialValue: 'local',
          },
        ],
        serviceDesk: [
          'serviceDesk', {
            initialValue: '',
            rules: [
              {
                required: true,
                message: ' ',
              },
            ],
          },
        ],
        requestType: [
          'requestType', {
            initialValue: '',
            rules: [
              {
                required: true,
                message: ' ',
              },
            ],
          },
        ],
        processEntity: {
          name: i => [
            `name[${i}]`,
          ],
          role_list: i => [
            `role_list[${i}]`,
            {
              rules: [
                {
                  validator: this.checkRole(i),
                },
              ],
            },
          ],
          role_scope: i => [
            `role_scope[${i}]`,
            {
              initialValue: 'system',
            },
          ],
          user_list: i => [
            `user_list[${i}]`,
            {
              rules: [
                {
                  validator: this.checkUser(i),
                },
              ],
            },
          ],
        },
      },
      formItemLayout: {
        wrapperCol: {
          span: 20,
        },
        labelCol: {
          span: 4,
        },
      },
      processList: [],
      roles: {},
      users: {},
      processType: this.params.data[0].key,
      options: {
        TYPES,
        SERVICE_DESKS: [],
        REQUEST_TYPES: [],
      },
      dataLoading: {
        serviceDesk: false,
        requestType: false,
      },
    }
  },
  computed: {
    ...mapGetters(['l3PermissionEnable']),
    isCustomeService () {
      return this.params.data[0].key === WORKFLOW_TYPES.CUSTOMER_SERVICE
    },
    isThirdWF () {
      return this.form.fd.type === 'third'
    },
    selectItem () {
      return this.params.data[0]
    },
  },
  provide () {
    return {
      form: this.form,
    }
  },
  watch: {
    isThirdWF (val) {
      if (val) {
        const setting = JSON.parse(this.selectItem.setting || '{}')
        this.form.fd.serviceDeskId = setting.serviceDeskId
        this.form.fd.requestTypeId = setting.requestTypeId
        this.fetchServiceDesks()
      }
    },
  },
  destroyed () {
    this.manager = null
    this.extraJiraManager = null
  },
  created () {
    this.manager = new this.$Manager('process-definitions', 'v1')
    this.extraJiraManager = new this.$Manager('extra-jiras', 'v1')
    this.fetchData()
  },
  mounted () {
    if (this.isCustomeService && this.selectItem.type === 'service_desk') {
      const setting = JSON.parse(this.selectItem.setting || '{}')
      this.form.fd.serviceDeskId = setting.serviceDeskId
      this.form.fd.requestTypeId = setting.requestTypeId
      this.$nextTick(() => {
        this.form.fc.setFieldsValue({
          type: 'third',
        })
        this.form.fd.type = 'third'
      })
    }
  },
  methods: {
    checkUser (i) {
      return (rule, value, callback) => {
        const currentRoles = this.form.fc.getFieldValue(`role_list[${i}]`)
        let errorText = ''
        if ((!currentRoles || currentRoles.length === 0) && (!value || value.length === 0)) {
          errorText = this.$t('system.text_546')
          return callback(errorText)
        }
        return callback()
      }
    },
    checkRole (i) {
      return (rule, value, callback) => {
        const currentUsers = this.form.fc.getFieldValue(`user_list[${i}]`)
        let errorText = ''
        if ((!currentUsers || currentUsers.length === 0) && (!value || value.length === 0)) {
          errorText = this.$t('system.text_582')
          return callback(errorText)
        }
        return callback()
      }
    },
    getRoles (data) {
      data.map(item => {
        if (!this.roles[item.id]) {
          this.roles[item.id] = item
        }
      })
    },
    getUsers (data) {
      data.map(item => {
        if (!this.users[item.id]) {
          this.users[item.id] = item
        }
      })
    },
    loadProcessData () {
      if (this.isCustomeService && this.selectItem.type === 'service_desk') {
        const rs = {
          data: {
            process_definition_entity: [
              {
                name: this.$t('system.text_551'),
                user_list: [],
              },
            ],
          },
        }
        return Promise.resolve(rs)
      }
      return this.manager.get({ id: this.params.data[0].id })
    },
    async fetchData () {
      try {
        const processData = await this.loadProcessData()
        const processList = processData.data.process_definition_entity.map((item) => {
          return {
            name: item.name,
            assignees: item.user_list || [],
            roles: item.role_list || [],
            role_scope: item.role_scope,
          }
        })
        // this.processList = processList
        this.processList = processList.map((item, idx) => {
          this.form.fc.getFieldDecorator(`name[${idx}]`, {
            initialValue: item.name,
          })
          const userList = []
          const rolesList = []
          if ((item.assignees && item.assignees.length > 0) && (item.roles && item.roles.length > 0)) {
            item.assignees.map(item => {
              userList.push(item.id)
            })
            this.form.fc.getFieldDecorator(`user_list[${idx}]`, {
              initialValue: userList,
            })
            item.roles.map(item => {
              rolesList.push(item.id)
            })
            this.form.fc.getFieldDecorator(`role_list[${idx}]`, {
              initialValue: rolesList,
            })
            this.form.fc.getFieldDecorator(`role_scope[${idx}]`, {})
            this.$nextTick(() => {
              this.form.fc.setFieldsValue({
                [`role_scope[${idx}]`]: item.role_scope,
              })
            })
            return {
              ...item,
              rolePopVisible: true,
              userPopVisible: true,
            }
          } else if (item.roles && item.roles.length > 0) {
            this.form.fc.getFieldDecorator(`role_scope[${idx}]`, {})
            this.$nextTick(() => {
              this.form.fc.setFieldsValue({
                [`role_scope[${idx}]`]: item.role_scope,
              })
            })
            item.roles.map(item => {
              rolesList.push(item.id)
            })
            this.form.fc.getFieldDecorator(`role_list[${idx}]`, {
              initialValue: rolesList,
            })
            return {
              ...item,
              rolePopVisible: true,
            }
          } else if (item.assignees && item.assignees.length > 0) {
            item.assignees.map(item => {
              userList.push(item.id)
            })
            this.form.fc.getFieldDecorator(`user_list[${idx}]`, {
              initialValue: userList,
            })
            return {
              ...item,
              userPopVisible: true,
            }
          }
        })
      } catch (err) {
        throw err
      }
    },
    async handleConfirm () {
      this.loading = true
      try {
        const values = await this.form.fc.validateFields()
        if (values.type === 'third') {
          await this.doThirdWF(values)
        } else {
          await this.doLocalWF(values)
        }
        this.loading = false
        this.cancelDialog()
        this.params.refresh()
      } catch (error) {
        this.loading = false
        throw error
      }
    },
    doLocalWF (values) {
      const params = {
        'process-key': this.processType,
        'process-entity': [],
      }
      if (values.user_list && values.role_list) {
        if (values.user_list.length >= values.role_list.length) {
          for (let idx = 0; idx < values.user_list.length; idx++) {
            const item = values.user_list[idx]
            const obj = {
              completed_instances: 1,
              name: values.name[idx],
              project_id: this.$store.getters.userInfo.projectId,
              user_list: [],
              role_list: [],
              role_scope: values.role_scope[idx],
            }
            if (item) {
              item.forEach(item => {
                obj.user_list.push(this.users[item])
              })
            }
            if (values.role_list[idx]) {
              values.role_list[idx].forEach(item => {
                obj.role_list.push(this.roles[item])
              })
            }
            params['process-entity'].push(obj)
          }
        } else {
          for (let idx = 0; idx < values.role_list.length; idx++) {
            const item = values.role_list[idx]
            const obj = {
              completed_instances: 1,
              name: values.name[idx],
              project_id: this.$store.getters.userInfo.projectId,
              user_list: [],
              role_list: [],
              role_scope: values.role_scope[idx],
            }
            if (item) {
              item.forEach(item => {
                obj.role_list.push(this.roles[item])
              })
            }
            if (values.user_list[idx]) {
              values.user_list[idx].forEach(item => {
                obj.user_list.push(this.users[item])
              })
            }
            params['process-entity'].push(obj)
          }
        }
      } else if (values.user_list) {
        values.user_list.forEach((item, idx) => {
          const obj = {
            completed_instances: 1,
            name: values.name[idx],
            project_id: this.$store.getters.userInfo.projectId,
            user_list: [],
            role_list: [],
          }
          if (item) {
            item.forEach(item => {
              obj.user_list.push(this.users[item])
            })
          }
          params['process-entity'].push(obj)
        })
      } else if (values.role_list) {
        values.role_list.forEach((item, idx) => {
          const obj = {
            completed_instances: 1,
            name: values.name[idx],
            project_id: this.$store.getters.userInfo.projectId,
            user_list: [],
            role_list: [],
            role_scope: values.role_scope[idx],
          }
          if (item) {
            item.forEach(item => {
              obj.role_list.push(this.roles[item])
            })
          }
          params['process-entity'].push(obj)
        })
      }
      return this.manager.create({
        data: params,
      })
    },
    doThirdWF (values) {
      const params = {
        'process-key': this.processType,
        type: 'service_desk',
        setting: {
          serviceDeskId: values.serviceDesk,
          requestTypeId: values.requestType,
        },
      }
      return new this.$Manager('extra-process-definitions', 'v1')
        .create({ data: params })
    },
    changeTypeHandle (v) {
      this.form.fd.type = v.target.value
    },
    changeServiceDeskHandle (v) {
      this.form.fc.setFieldsValue({
        requestType: '',
      })
      this.form.fd.requestTypeId = ''
      if (v) {
        this.fetchRequestTypesByServiceDesk(v)
      }
    },
    fetchServiceDesks () {
      this.dataLoading.serviceDesk = true
      this.extraJiraManager.get({ id: 'service-desks', params: { type: 'service_desk' } })
        .then((res) => {
          this.dataLoading.serviceDesk = false
          const dataArr = res.data || []
          this.options.SERVICE_DESKS = dataArr.map((item) => {
            return {
              key: item.serviceDeskId,
              label: item.projectName,
            }
          })
          const serviceDeskId = this.form.fd.serviceDeskId || dataArr[0].serviceDeskId
          this.form.fc.setFieldsValue({
            serviceDesk: serviceDeskId,
          })
          this.fetchRequestTypesByServiceDesk(serviceDeskId)
        })
        .catch(() => {
          this.options.SERVICE_DESKS = []
          this.dataLoading.serviceDesk = false
        })
    },
    fetchRequestTypesByServiceDesk (serviceDeskId) {
      this.dataLoading.requestType = true
      this.options.REQUEST_TYPES = []
      this.extraJiraManager.get({ id: 'request-types', params: { type: 'service_desk', serviceDeskId } })
        .then((res) => {
          this.dataLoading.requestType = false
          const dataArr = res.data || []
          this.options.REQUEST_TYPES = dataArr.map((item) => {
            return {
              key: item.requestTypeId,
              label: item.name,
            }
          })
          const requestTypeId = this.form.fd.requestTypeId || dataArr[0].requestTypeId
          this.form.fc.setFieldsValue({
            requestType: requestTypeId,
          })
        })
        .catch(() => {
          this.options.REQUEST_TYPES = []
          this.dataLoading.requestType = false
        })
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.indexOf(input) >= 0
      )
    },
  },
}
</script>
