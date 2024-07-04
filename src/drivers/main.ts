import { ZarinPalDriver } from './zarinpal/zarinpal'
import { IdPayDriver } from './idpay/idpay'

const drivers = {
  zarinpal: ZarinPalDriver,
  idPay: IdPayDriver
}

export type Drivers = keyof typeof drivers

export type DriverInstance<T extends Drivers> = InstanceType<(typeof drivers)[T]>

export function getPaymentDriver<T extends Drivers>(name: T): DriverInstance<T> {
  const driverClass = drivers[name] as DriverInstance<T>
  if (!driverClass) throw new Error('invalid driver name')

  // @ts-ignore
  return new driverClass()
}
