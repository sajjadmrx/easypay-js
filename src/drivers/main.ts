import { ZarinPalDriver } from "./zarinpal/zarinpal";

export interface PaymentDriver<T> {
  request(data: T): void;
}

const drivers = {
  zarinpal: ZarinPalDriver,
};

export type Drivers = keyof typeof drivers;

export type DriverInstance<T extends Drivers> = InstanceType<
  (typeof drivers)[T]
>;

export function getPaymentDriver<T extends Drivers>(
  name: T,
): DriverInstance<T> {
  const driverClass = drivers[name] as DriverInstance<T>;
  if (!driverClass) throw new Error("invalid driver name");

  // @ts-ignore
  return new driverClass();
}
