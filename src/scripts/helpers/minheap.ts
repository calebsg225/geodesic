/**
 * Creates a new minHeap object
 * @class
 */
class MinHeap {
  heap: number[];
  /**
   * @param {number[]} nums - sorts minHeap by data.sort
   */
  constructor(nums: number[]) {
    this.heap = [];
    this.buildHeap(nums);
  }

  /**
   * sorts array of nums into the minHeap
   * @param {number[]} nums - values to be sorted
   */
  private buildHeap = (nums: number[]) => {
    for (let i = 0; i < nums.length; i++) {
      this.insert(nums[i]);
    }
  }

  /**
   * swaps two values stored in the heap at the given indices
   * @param {number} i 
   * @param {number} j 
   */
  private swap = (i: number, j: number): void => {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  /**
   * recursively moves a digit higher until its parent is smaller
   * @param {number} i 
   */
  private siftUp = (i: number): void => {
    if (!i) return;
    const p = Math.floor((i-1)/2);
    if (this.heap[p] < this.heap[i]) {
      this.swap(p, i);
      this.siftUp(p);
    }
  }

  /**
   * recursively moves digits lower in the tree until both children are larger
   * @param {number} i 
   */
  private siftDown = (i: number): void => {
    if (i >= this.heap.length - 1) return;
    const lc = i*2+1;
    const rc = i*2+2;
    let s = i;
    if (lc < this.heap.length && this.heap[lc] < this.heap[i]) s = lc;
    if (rc < this.heap.length && this.heap[rc] < this.heap[s]) s = rc;
    if (s !== i) {
      this.swap(s, i);
      this.siftDown(s);
    }
  }

  /**
   * inserts a number into the minHeap
   * @param {number} num 
   */
  insert = (num: number) => {
    this.heap.push(num);
    this.siftUp(this.heap.length - 1);
  }

  /**
   * removes and returns the smallest value in the heap
   * @returns {number} - smallest value removed from heap
   */
  remove = (): number => {
    this.swap(0, this.heap.length - 1);
    const res = this.heap.pop()!;
    this.siftDown(0);
    return res;
  }
}

export default MinHeap;