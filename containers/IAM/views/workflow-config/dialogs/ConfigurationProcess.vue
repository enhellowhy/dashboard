<template>
  <base-dialog @cancel="cancelDialog">
    <div slot="header">{{$t('system.text_531')}}</div>
    <div slot="body">
      <a-form
        :form="form.fc"
        v-bind="formItemLayout">
        <a-form-item :label="$t('system.text_529')">
          <a-select v-decorator="decorators.processType" @change="processTypeChange">
            <a-select-option
              :placeholder="$t('system.text_543')"
              v-for="item in processTypesOpts"
              :disabled="fetchDataLoading"
              :value="item.value"
              :key="item.value">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('system.text_544')">
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
import { WORKFLOW_TYPES, PROCESS_TYPES_OPTS } from '@/constants/workflow'
import DialogMixin from '@/mixins/dialog'
import WindowsMixin from '@/mixins/windows'

export default {
  name: 'WorkflowConfigProcessDialog',
  components: {
    ProcessList,
  },
  mixins: [DialogMixin, WindowsMixin],
  data () {
    return {
      loading: false,
      form: {
        fc: this.$form.createForm(this),
      },
      decorators: {
        processType: [
          'processType',
          {
            rules: [
              {
                required: true,
                message: this.$t('system.text_545'),
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
          span: 21,
        },
        labelCol: {
          span: 3,
        },
      },
      processTypesOpts: [...PROCESS_TYPES_OPTS],
      fetchDataLoading: false,
      processList: [],
      processType: '',
      roles: {},
      users: {},
    }
  },
  computed: mapGetters(['l3PermissionEnable']),
  provide () {
    return {
      form: this.form,
    }
  },
  destroyed () {
    this.manager = null
  },
  created () {
    this.manager = new this.$Manager('process-definitions', 'v1')
    // this.manager = new this.$Manager('workflow_process_definitions', 'v1')
    this.fetchData()
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
    processTypeChange (e) {
      this.processType = e
      const val = e
      if (val === WORKFLOW_TYPES.APPLY_PROJECT_QUOTA || val === WORKFLOW_TYPES.APPLY_DOMAIN_QUOTA) {
        this.processList = [{
          userPopVisible: false,
          rolePopVisible: true,
          name: this.$t('system.text_547'),
          assignees: [],
          roles: [],
          selectedUserItems: [],
          selectedRoleItems: [],
        }]
      } else {
        this.processList = [{
          userPopVisible: false,
          rolePopVisible: true,
          name: this.$t('system.text_540'),
          assignees: [],
          roles: [],
          selectedUserItems: [],
          selectedRoleItems: [],
        }]
      }
      this.processList.map((item, idx) => {
        this.form.fc.getFieldDecorator(`name[${idx}]`, {
          preserve: true,
          initialValue: item.name,
        })
      })
      this.form.fc.resetFields(['role_list', 'user_list', 'role_scope'])
    },
    fetchData () {
      this.fetchDataLoading = true
      this.manager.list({})
        .then((res) => {
          const processDefinitions = res.data.data
          this.getProcessTypes(processDefinitions)
          this.fetchDataLoading = false
        })
        .catch(() => {
          this.getProcessTypes([])
          this.fetchDataLoading = false
        })
    },
    getProcessTypes (processDefinitions) {
      for (let i = this.processTypesOpts.length - 1; i >= 0; i--) {
        const isExist = processDefinitions.find((v) => { return v.key === this.processTypesOpts[i].value })
        if (isExist || (!this.l3PermissionEnable && this.processTypesOpts[i].value === WORKFLOW_TYPES.APPLY_DOMAIN_QUOTA)) {
          this.processTypesOpts.splice(i, 1)
        }
      }
    },
    async handleConfirm () {
      this.loading = true
      try {
        const values = await this.form.fc.validateFields()
        await this.doLocalWF(values)
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
        values.user_list.map((item, idx) => {
          const obj = {
            completed_instances: 1,
            name: values.name[idx],
            project_id: this.$store.getters.userInfo.projectId,
            user_list: [],
            role_list: [],
          }
          if (item) {
            item.map(item => {
              obj.user_list.push(this.users[item])
            })
          }
          params['process-entity'].push(obj)
        })
      } else if (values.role_list) {
        values.role_list.map((item, idx) => {
          const obj = {
            completed_instances: 1,
            name: values.name[idx],
            project_id: this.$store.getters.userInfo.projectId,
            user_list: [],
            role_list: [],
            role_scope: values.role_scope[idx],
          }
          if (item) {
            item.map(item => {
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
  },
}
</script>
