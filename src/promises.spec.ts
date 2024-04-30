import { collect, failures, partition, successes } from "./promises";

describe("collect", () => {
  it("Traverses a record of promises into a promise of a record", async () => {
    const promises: Record<string, Promise<number>> = {
      success: Promise.resolve(1),
      failure: Promise.reject(new Error("")),
    };

    const completed = await collect(promises);
    expect(completed.success).toBe(1);
    expect(completed.failure).toEqual(new Error(""));
  });
});

describe("successes", () => {
  it("Traverses an array of promises into a promise of an array of successes", async () => {
    const promises: Promise<number>[] = [
      Promise.resolve(1),
      Promise.reject(new Error("a")),
      Promise.resolve(2),
      Promise.reject(new Error("b")),
    ];

    expect(await successes(promises)).toEqual([1, 2]);
  });
});

describe("failures", () => {
  it("Traverses an array of promises into a promise of an array of failures", async () => {
    const promises: Promise<number>[] = [
      Promise.resolve(1),
      Promise.reject(new Error("a")),
      Promise.resolve(2),
      Promise.reject(new Error("b")),
    ];

    expect(await failures(promises)).toEqual(["a", "b"]);
  });
});

describe("partition", () => {
  it("Traverses an array of promises into a promise of success and failure arrays", async () => {
    const promises: Promise<number>[] = [
      Promise.resolve(1),
      Promise.reject(new Error("a")),
      Promise.resolve(2),
      Promise.reject(new Error("b")),
    ];

    expect(await partition(promises)).toEqual({
      successes: [1, 2],
      failures: ["a", "b"],
    });
  });
});
