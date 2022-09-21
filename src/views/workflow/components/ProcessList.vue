<template>
  <div>
    <a-steps :current="current" labelPlacement="vertical" size="small">
      <a-step
        v-for="(p, index) in newProcessList"
        :key="index"
        :status="p.status"
        :title="p.activity_name">
        <template slot="description">
          <a-popover>
            <template slot="content">
              <span>{{ p.assignees }}</span>
            </template>
            <span>{{ p.end_time }}</span>
          </a-popover>
        </template>
      </a-step>
      <!--      <a-step-->
<!--        v-for="(p, index) in newProcessList"-->
<!--        :key="index"-->
<!--        :title="p.title">-->
<!--        <template slot="description">-->
<!--          <a-popover>-->
<!--            <template slot="content">-->
<!--              <span>{{ p.assignees }}</span>-->
<!--            </template>-->
<!--            <span>{{ p.shortAssigness }}</span>-->
<!--          </a-popover>-->
<!--        </template>-->
<!--      </a-step>-->
    </a-steps>
  </div>
</template>

<script>
const R = require('ramda')
export default {
  name: 'ProcessList',
  props: {
    processList: {
      type: Array,
      required: true,
    },
  },
  data () {
    return {
      current: -1,
    }
  },
  computed: {
    newProcessList () {
      // return this.processList.map((item) => {
      //   const assigneesArr = Array.isArray(item.assignees) ? item.assignees : [item.assignees]
      //   const assignees = assigneesArr.join(',')
      //   return {
      //     title: item.title,
      //     assignees: assignees,
      //     shortAssigness: assignees.length > 26 ? `${assignees.substring(0, 26)}...` : assignees,
      //   }
      // })
      let flag = false
      const newList = this.processList.map((item) => {
        let assignees = ''
        if (R.isNil(item.task_assignee_name)) {
          assignees = '--'
        } else {
          assignees = item.task_assignee_name.join(',')
        }
        let command_message = ''
        switch (item.command_message) {
          case '提交':
          case '同意':
            command_message = 'finish'
            break
          case '流程结束':
            command_message = 'finish'
            flag = true
            break
          case '终止':
          case '拒绝':
          case '驳回':
            command_message = 'error'
            break
          default:
            command_message = 'process'
        }
        return {
          activity_name: item.activity_name,
          end_time: item.end_time,
          assignees: assignees,
          status: command_message,
        }
      })
      if (!flag) {
        newList.push({
          activity_name: '结束',
          end_time: '',
          assignees: '--',
          status: 'wait',
        })
      }
      return newList
    },
  },
}
</script>
