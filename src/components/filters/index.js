/**
 * Created by Janus on 2017/4/7.
 */
import util from '../../utils'
import formatFilters from './format/price'

function install (Vue) {
  util.each(formatFilters, function (value, key) {
    Vue.filter(key, value)
  })
}

export default {
  install
}
