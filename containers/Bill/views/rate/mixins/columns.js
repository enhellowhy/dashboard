import { DURATION } from '@Bill/constants'
import { getFieldCn, toCN } from '@Bill/views/rate/utils'
import { BRAND_TYPES } from '@Bill/views/rate/constants'
import { sizestrWithUnit } from '@/utils/utils'
import i18n from '@/locales'

export default {
  computed: {
    columns () {
      const vmColumns = [
        {
          field: 'res_type',
          title: i18n.t('bill.text_88'),
          slots: {
            default: ({ row }) => {
              const type = row.res_type
              let title = type
              if (type === 'cpu') {
                title = 'cpu - ' + getFieldCn(row.model)
                // title = i18n.t('bill.text_157')
              }
              if (type === 'mem') {
                title = 'mem - ' + i18n.t('bill.text_158')
                // title = i18n.t('bill.text_158')
              }
              if (type === 'disk') {
                title = 'disk - ' + getFieldCn(row.medium_type + ' - ' + row.storage_type)
              }
              if (type === 'snapshot') {
                title = 'snapshot - ' + getFieldCn(row.medium_type + ' - ' + row.storage_type)
              }
              if (type === 'network_card') {
                title = getFieldCn(row.type + ' - ' + row.category)
              }
              if (type === 'eip') {
                if (row.model) {
                  if (row.model.includes('::')) {
                    const modelArr = row.model.split('::')
                    title = `eip - ${modelArr[0]} - ${modelArr[1]}`
                  } else {
                    title = `eip - ${row.model}`
                  }
                }
              }
              title = title.replace(' -  - ', '') // 去除空字符串引起的错误数据
              return [<side-page-trigger onTrigger={() => this.handleOpenSidepage(row)}>{ title }</side-page-trigger>]
            },
          },
        },
        {
          field: 'unit',
          title: i18n.t('bill.text_159'),
          formatter: ({ row }) => {
            const rateNum = Number(row.rate_text)
            // const rate = rateNum.toFixed(3)
            const rate = rateNum.toFixed(5)
            if (row.res_type === 'outer_network_card') {
              return i18n.t('bill.text_160', [rate, toCN(row.unit)])
            } else if (row.res_type === 'inner_network_card') {
              return i18n.t('bill.text_160', [rate, toCN(row.unit)])
            }
            return i18n.t('bill.text_161', [rate, DURATION[row.duration], toCN(row.unit)])
          },
        },
        {
          field: 'effective_date',
          title: i18n.t('bill.text_162'),
          formatter: ({ row }) => {
            const date = row.effective_date.replace('TZ', '')
            const until_date = row.until_date ? row.until_date.replace('TZ', '') : null
            if (until_date) {
              return this.$t('bill.text_261', [this.$moment(date).format('YYYY-MM-DD'), this.$moment(until_date).format('YYYY-MM-DD')])
            }
            if (date) {
              return this.$moment(date).format('YYYY-MM-DD')
            }
          },
        },
      ]
      const gpuColumns = [
        {
          field: 'brand',
          title: i18n.t('bill.text_146'),
          slots: {
            default: ({ row }) => {
              return [<side-page-trigger onTrigger={() => this.handleOpenSidepage(row)}>{ row.brand || i18n.t('bill.text_163') }</side-page-trigger>]
            },
          },
        },
        {
          field: 'model',
          title: i18n.t('bill.text_148'),
          formatter: ({ row }) => {
            return row.model || i18n.t('bill.text_163')
          },
        },
        {
          field: 'unit',
          title: i18n.t('bill.text_159'),
          formatter: ({ row }) => {
            const rateNum = Number(row.rate_text)
            const rate = rateNum.toFixed(3)
            return i18n.t('bill.text_161', [rate, DURATION[row.duration], toCN(row.unit)])
          },
        },
        {
          field: 'effective_date',
          title: i18n.t('bill.text_162'),
          formatter: ({ row }) => {
            const date = row.effective_date.replace('TZ', '')
            const until_time = row.until_time ? row.until_time.replace('TZ', '') : null
            if (until_time) {
              return this.$t('bill.text_261', [this.$moment(date).format('YYYY-MM-DD'), this.$moment(until_time).format('YYYY-MM-DD')])
            }
            if (date) {
              return this.$moment(date).format('YYYY-MM-DD')
            }
          },
        },
      ]
      const baremetalColumns = [
        {
          field: 'brand',
          title: i18n.t('bill.text_146'),
          // width: 70,
          slots: {
            default: ({ row }) => {
              const icons = {
                dell: { height: '25px' },
                h3c: { height: '25px' },
                hp: { height: '25px' },
                hpe: { height: '30px' },
                inspur: { height: '50px' },
                lenovo: { height: '10px' },
                supermicro: { height: '30px' },
                huawei: { height: '30px' },
              }
              // const imgSrc = require(`../assets/${row.sys_info.oem_name}.svg`)
              const brand_pair = row.model.split('/')[2]
              const brand = brand_pair.split(':')[1].replaceAll('_', ' ')
              // const arr = Object.keys(icons)
              if (!BRAND_TYPES[brand]) {
                return brand
              }

              return [
                <a-tooltip title={ brand }>
                  <img src={ BRAND_TYPES[brand].logo } style={ icons[BRAND_TYPES[brand].name] } />
                </a-tooltip>,
              ]
            },
          },
        },
        // {
        //   field: 'brand',
        //   title: i18n.t('bill.text_146'),
        //   slots: {
        //     default: ({ row }) => {
        //       const brand_pair = row.model.split('/')[2]
        //       const brand = brand_pair.split(':')[1]
        //       return [<side-page-trigger onTrigger={() => this.handleOpenSidepage(row)}>{ brand.replace('_', ' ') || '' }</side-page-trigger>]
        //     },
        //   },
        // },
        {
          field: 'model',
          title: i18n.t('bill.text_148'),
          slots: {
            default: ({ row }) => {
              const model_pair = row.model.split('/')[3]
              const model = model_pair.split(':')[1]
              return [<side-page-trigger onTrigger={() => this.handleOpenSidepage(row)}>{ model.replaceAll('_', ' ') || '' }</side-page-trigger>]
            },
          },
          // formatter: ({ row }) => {
          //   // const date = row.model.replace('TZ', '')
          //   const model_pair = row.model.split('/')[3]
          //   if (model_pair) {
          //     return model_pair.split(':')[1]
          //   }
          //   return ''
          // },
        },
        {
          field: 'spec',
          title: i18n.t('bill.text_150'),
          formatter: ({ row }) => {
            const ret = []
            const cpu_pair = row.model.split('/')[0]
            const cpu = cpu_pair.split(':')[1]
            const mem_pair = row.model.split('/')[1]
            const mem = mem_pair.split(':')[1]
            ret.push(i18n.t('compute.text_292', [cpu]))
            ret.push(this.$t('compute.text_293', [sizestrWithUnit(mem.substr(0, mem.length - 1), 'M', 1024)]))
            return ret.join('、')
          },
        },
        {
          field: 'unit',
          title: i18n.t('bill.text_159'),
          formatter: ({ row }) => {
            const rateNum = Number(row.rate_text)
            const rate = rateNum.toFixed(3)
            return i18n.t('bill.text_161', [rate, DURATION[row.duration], toCN(row.unit)])
          },
        },
        {
          field: 'effective_date',
          title: i18n.t('bill.text_162'),
          formatter: ({ row }) => {
            const date = row.effective_date.replace('TZ', '')
            const until_date = row.until_date ? row.until_date.replace('TZ', '') : null
            if (until_date) {
              return this.$t('bill.text_261', [this.$moment(date).format('YYYY-MM-DD'), this.$moment(until_date).format('YYYY-MM-DD')])
            }
            if (date) {
              return this.$moment(date).format('YYYY-MM-DD')
            }
          },
        },
      ]
      const columnMap = {
        vm: vmColumns,
        gpu: gpuColumns,
        baremetal: baremetalColumns,
      }
      return columnMap[this.cloudEnv]
    },
  },
}
