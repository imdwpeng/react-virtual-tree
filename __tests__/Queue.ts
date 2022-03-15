/*
 * @Author: Dong
 * @Date: 2022-01-21 14:45:07
 * @LastEditors: Dong
 * @LastEditTime: 2022-01-21 15:00:35
 */
import Queue from "../src/index";

describe("Queue", () => {
  test("Queue Methods", () => {
    const queue = Queue();
    expect(queue).toBe(1);
  });
});
