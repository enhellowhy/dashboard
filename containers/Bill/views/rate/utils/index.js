import { DIC, RATE_UNIT } from '@Bill/constants'
import i18n from '@/locales'

export const getFieldCn = (str) => {
  if (DIC[str]) {
    return DIC[str]
  }
  return str
}

export const toCN = v => {
  const unit = RATE_UNIT[v]
  return unit || v
}

export const toVmName = obj => {
  const type = obj.res_type
  if (type === 'cpu') {
    // return i18n.t('bill.text_157')
    return getFieldCn(obj.model)
  }
  if (type === 'mem') {
    return i18n.t('bill.text_158')
  }
  if (type === 'filesystem') {
    return getFieldCn(obj.model)
  }
  if (type === 'bucket') {
    return getFieldCn(obj.model)
  }
  if (type === 'disk') {
    return getFieldCn(obj.medium_type + ' - ' + obj.storage_type)
  }
  if (type === 'network_card') {
    return getFieldCn(obj.type + ' - ' + obj.category)
  }
  if (type === 'baremetal') {
    const model_pair = obj.model.split('/')[3]
    const model = model_pair.split(':')[1]
    return model.replaceAll('_', ' ')
  }
  return type
}
