const Node = require('./node');

class MaxHeap {
	constructor() {
    this.root = null;
    this.parentNodes = [];
	}

	push(data, priority) {
    const node = new Node(data, priority);
    this.insertNode(node);
    this.shiftNodeUp(node);
	}

	pop() {
    if (this.isEmpty()) {
      return this;
    }

    const detached = this.detachRoot();

    if (detached.left !== null || detached.right !== null) {
      this.restoreRootFromLastInsertedNode(detached);
      this.shiftNodeDown(this.root);
    }

    return detached.data;
	}

	detachRoot() {
    const root = this.root;

    this.root = null;
    
    const indexRoot = this.parentNodes.indexOf(root);
    if (indexRoot !== -1) {
      this.parentNodes.shift();
    }

    return root;
	}

	restoreRootFromLastInsertedNode(detached) {
    const len = this.parentNodes.length;
    const lastNode = this.parentNodes[len - 1];

    if (lastNode !== this.root) {
      lastNode.left = detached.left;
      lastNode.right = detached.right;
      
      if (detached.left !== null) {
        detached.left.parent = lastNode;
      }
      if (detached.right !== null) {
        detached.right.parent = lastNode;
      }

      if (!this.parentNodes.includes(lastNode.parent)) {
        this.parentNodes = [lastNode.parent, ...this.parentNodes];
      }

      this.root = lastNode;
      lastNode.remove();
      this.parentNodes.pop();

      if (this.root.left === null || this.root.right === null) {
        this.parentNodes = [this.root, ...this.parentNodes];
      }
    }
	}

	size() {
		const getSize = (node) => {
      if (node === null) {
        return 0;
      }
      return 1 + getSize(node.left) + getSize(node.right);
    }

    return getSize(this.root);
	}

	isEmpty() {
		return this.root === null;
	}

	clear() {
    this.root = null;
    this.parentNodes = [];
	}

	insertNode(node) {
    if (this.isEmpty()) {
      this.root = node;
      this.parentNodes = [node];
    } else {
      const firstParent = this.parentNodes[0];
      firstParent.appendChild(node);
      this.parentNodes = [...this.parentNodes, node];
      if (firstParent.left !== null && firstParent.right !== null) {
        this.parentNodes.shift();
      }
    }
	}

	shiftNodeUp(node) {
    const parent = node.parent;
    if (parent !== null && (parent.priority < node.priority)) {
      node.swapWithParent();
      if (node.parent === null) {
        this.root = node;
      }
      const indexParent = this.parentNodes.indexOf(parent);
      const indexNode = this.parentNodes.indexOf(node);
      if (indexParent !== -1) {
        this.parentNodes[indexParent] = node;
      }
      if (indexNode !== -1) {
        this.parentNodes[indexNode] = parent;
      }
      this.shiftNodeUp(node);
    }
	}

	shiftNodeDown(node) {
    const updateParentNodes = (node, parent, parentNodes) => {
      const indexParent = parentNodes.indexOf(parent);
      const indexNode = parentNodes.indexOf(node);
      if (indexParent !== -1) {
        parentNodes[indexParent] = node;
      }
      if (indexNode !== -1) {
        parentNodes[indexNode] = parent;
      }
      return parentNodes;
    }

    const leftChild = node.left;
    const rightChild = node.right;

    if (leftChild !== null || rightChild !== null) {
      if (rightChild === null && (node.priority < leftChild.priority)) {
        const parent = leftChild.parent;
        leftChild.swapWithParent();
        this.parentNodes = updateParentNodes(leftChild, parent, this.parentNodes);
        node = leftChild.left;
        if (leftChild.parent === null) {
          this.root = leftChild;
        }
      } else if (rightChild === null && (node.priority > leftChild.priority)) {
        return;
      }
      else if (leftChild === null && (node.priority < rightChild.priority)) {
        const parent = rightChild.parent;
        rightChild.swapWithParent();
        this.parentNodes = updateParentNodes(rightChild, parent, this.parentNodes);
        node = rightChild.right;
        if (rightChild.parent === null) {
          this.root = rightChild;
        }
      } else if (leftChild === null && (node.priority > rightChild.priority)) {
        return;
      } else if (node.priority < leftChild.priority || node.priority < rightChild.priority) {
        if (leftChild.priority > rightChild.priority) {
          const parent = leftChild.parent;
          leftChild.swapWithParent();
          this.parentNodes = updateParentNodes(leftChild, parent, this.parentNodes);
          node = leftChild.left;
          if (leftChild.parent === null) {
            this.root = leftChild;
          }
        } else if (leftChild.priority < rightChild.priority) {
          const parent = rightChild.parent;
          rightChild.swapWithParent();
          this.parentNodes = updateParentNodes(rightChild, parent, this.parentNodes);
          node = rightChild.right;
          if (rightChild.parent === null) {
            this.root = rightChild;
          }
        }
      }
      this.shiftNodeDown(node);
    }
	}
}

module.exports = MaxHeap;
