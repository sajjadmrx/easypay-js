import { ZarinPalDriver } from "./zarinpal/zarinpal";

export interface PaymentDriver<T> {
    request(data: T): void;
}


const drivers = {
    zarinpal: ZarinPalDriver
};


export type DriversName = keyof typeof drivers

export type DriverInstance<T extends DriversName> = InstanceType<typeof drivers[T]>;

export function getDriver<T extends DriversName>(name: T): DriverInstance<T> {
    const driverClass = drivers[name] as DriverInstance<T>;
    if (!driverClass)
        throw new Error("invalid driver name")

    // @ts-ignore
    return new driverClass()
}
