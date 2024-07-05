import { ZarinPalDriver } from './zarinpal/zarinpal'
import { IdPayDriver } from './idpay/idpay'
import { ZibalDriver } from './zibal/zibal'

const drivers = {
  zarinpal: ZarinPalDriver,
  idPay: IdPayDriver,
  zibal: ZibalDriver
}

export type Drivers = keyof typeof drivers

export type DriverInstance<T extends Drivers> = InstanceType<(typeof drivers)[T]>

export function getPaymentDriver<T extends Drivers>(name: T): DriverInstance<T> {
  const driverClass = drivers[name] as DriverInstance<T>
  if (!driverClass) throw new Error(`Driver ${name} not found`)

  // @ts-ignore
  return new driverClass()
}
