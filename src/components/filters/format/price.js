/**
 * Created by Janus on 2017/4/7.
 */
export default {
  price: pricePay
}

export function pricePay (val) {
  return parseFloat(val / 100).toFixed(2) || 0
}
