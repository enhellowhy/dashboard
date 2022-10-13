import i18n from '@/locales'

export default {
  ForbiddenError: i18n.t('error_title.ForbiddenError'),
  NotFoundError: i18n.t('notify.NotFoundError'),
  IncorrectUsernameOrPassword: i18n.t('notify.IncorrectUsernameOrPassword'),
  InvalidCredentialError: i18n.t('notify.InvalidCredentialError'),
  TooManyFailedAttempts: i18n.t('notify.TooManyFailedAttempts'),
}

export const DETAIL_ERRMSG = {
  findUserByMobile: i18n.t('notify.FindUserByMobile'),
  TooManyFailedAttempts: i18n.t('notify.TooManyFailedAttempts'),
}
