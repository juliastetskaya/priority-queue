const MaxHeap = require('./max-heap.js');

class PriorityQueue {
	constructor(maxSize = 30) {
    this.maxSize = maxSize;
    this.heap = new MaxHeap();
	}

	push(data, priority) {
    if (this.maxSize > 0) {
      this.heap.push(data, priority);
      this.maxSize -= 1;
    } else {
      throw Error;
    }
	}

	shift() {
    if (!this.heap.isEmpty()) {
      return this.heap.pop();
    }
    throw Error;
	}

	size() {
    return this.heap.size();
	}

	isEmpty() {
		return this.heap.isEmpty();
	}
}

module.exports = PriorityQueue;
