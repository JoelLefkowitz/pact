import { fromPairs, keys, values, zip } from "ramda";

type Settled<T> = PromiseSettledResult<Awaited<T>>;

export const resolve = <T>(i: T): Promise<T> => Promise.resolve(i);

export const reject = <T>(i: Error): Promise<T> => Promise.reject(i);

export const collect = async <T>(
  promises: Record<string, Promise<T>>,
): Promise<Record<string, T>> => {
  // Since promises is mutable we need to snapshot the kvs to keep them aligned
  const frozen = keys(promises);
  const settled = await Promise.allSettled(values(promises));

  return fromPairs(
    zip<string, Settled<T>>(frozen, settled).map(([k, v]) => [
      k,
      v.status === "fulfilled" ? v.value : v.reason,
    ]),
  );
};

export const successes = async <T>(promises: Promise<T>[]): Promise<T[]> => {
  const settled = await Promise.allSettled(promises);
  return settled.reduce<T[]>(
    (acc, x) => (x.status === "fulfilled" ? [...acc, x.value] : acc),
    [],
  );
};

export const failures = async <T>(
  promises: Promise<T>[],
): Promise<string[]> => {
  const settled = await Promise.allSettled(promises);
  return settled.reduce<string[]>(
    (acc, x) =>
      x.status === "rejected"
        ? [...acc, (x.reason as { message: string }).message]
        : acc,
    [],
  );
};

export const partition = async <T>(
  promises: Promise<T>[],
): Promise<{ successes: T[]; failures: string[] }> => ({
  successes: await successes(promises),
  failures: await failures(promises),
});
