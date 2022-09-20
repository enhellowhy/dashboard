
import * as R from 'ramda'
import { getSignature } from '@/utils/crypto'
import i18n from '@/locales'

const LINE_POINT = 50
const isObject = v => R.is(Object, v)

const commonLbSql = ({ select, tags, time, interval, scope } = {}) => {
  const group_by = [
    {
      type: 'tag',
      params: ['listener_uuid'],
    },
    {
      type: 'tag',
      params: ['rip'],
    },
  ]
  const data = {
    metric_query: [
      {
        model: {
          measurement: 'loadbalancer_backends_state',
          database: 'prometheus',
          group_by,
          select,
          tags,
        },
      },
    ],
    scope,
    from: time.from,
    to: time.to,
    interval,
    unit: true,
  }
  data.signature = getSignature(data)
  return data
}

export const lbQuery = ({ fieldType, lsType, lsId, time, aggregate, isRule, scope } = {}) => {
  const from = time.from.replace(/\D+/g, '')
  const to = time.to ? time.to.replace(/\D+/g, '') : 0
  const timeDiff = (from - to) * 3600 // 小时 -> 秒
  const interval = `${timeDiff / LINE_POINT}s`
  const timeObj = {
    from: time.from,
    to: time.to ? 'now' : time.to,
  }
  const fields = {
    state: {
      select: [
        [
          {
            type: 'field',
            params: ['value'],
          },
          {
            type: aggregate,
            params: [],
          },
          {
            type: 'alias',
            params: ['健康状态'],
          },
        ],
      ],
      tags: [
        { key: 'listener_uuid', value: lsId, operator: '=', condition: 'and' },
      ],
    },
  }
  // const fieldItem = isRule ? ruleFields[fieldType] : fields[fieldType]
  const fieldItem = fields[fieldType]
  let { select, tags } = fieldItem
  if (isObject(select) && !R.is(Array, select)) select = select[lsType]
  if (!select) console.error(i18n.t('network.text_491', [lsType, fieldType]))
  if (!select) console.error(i18n.t('network.text_492', [lsType, fieldType]))
  return commonLbSql({ select, tags, time: timeObj, interval, scope })
}
