// [promise/A+标准](https://promisesaplus.com)

function MyPromise(exector) {
  if (typeof exector !== "function") {
    throw new Error("Need a function to construct a promise")
  }
  this.resolveArray = []
  this.rejectArray = []
  let resolveFn = x => {
    this.status = "resolved"
    this.data = x
    for (let i = 0; i < this.resolveArray.length; i++) {
      this.data = this.resolveArray[i](x)
    }
  }
  let rejectFn = x => {
    this.status = "reject"
    this.reason = x
    for (let i = 0; i < this.rejectArray.length; i++) {
      this.reason = this.rejectArray[i](x)
    }
  }
  this.status = "pending"
  try {
    exector(resolveFn, rejectFn)
  } catch (e) {
    rejectFn(e)
  }
}

const resolvePromise = (returnPromise, x, resolve, reject) => {
  let then
  let took = false
  if (returnPromise === x) {
    // 2.3.1
    let type = new TypeError("Chaining cycle detected for promise")
    reject(type)
  }
  if (x instanceof Promise) {
    x.then(resolve, reject) // 2.3.2
  }
  if (x !== null || typeof x === "object" || typeof x === "function") {
    try {
      then = x.then // 2.3.3.1
      if (typeof then === "function") {
        then.call(
          x,
          /* 2.3.3.3.1 */ function(y) {
            // 2.3.3.3
            if (!took) return // 2.3.3.3.3
            took = true
            resolve(y)
          },
          /* 2.3.3.3.2 */ function(r) {
            if (!took) return // 2.3.3.3.3
            took = true
            reject(r)
          }
        )
      } else {
        resolve(x) // 2.3.3.4
      }
    } catch (e) {
      if (!took) return // 2.3.3.3.3,  2.3.3.3.4.1
      took = true
      reject(e) // 2.3.3.2, 2.3.3.3.4.2
    }
  } else {
    resolve(x) // 2.3.4
  }
}

MyPromise.prototype.then = function(onResolved, onRejected) {
  onResolved = typeof onResolved === "function" ? onResolved : v => v
  onRejected = typeof onRejected === "fucntion" ? onRejected : v => v
  if (this.status === "pending") {
    return new MyPromise(function(resolve, reject) {
      this.resolveArray.push(value => {
        try {
          let x = onResolved(value)
          resolvePromise(this, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })
      this.rejectArray.push(value => {
        try {
          let x = onRejected(value)
          resolvePromise(this, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })
    })
  }

  if (this.status === "resolved") {
    return new MyPromise(function(resolve, reject) {
      try {
        x = onResolved(this.data)
        resolvePromise(this, x, resolve, reject)
      } catch (e) {
        reject(e)
      }
    })
  }

  if (this.status === "rejected") {
    return new MyPromise(function(resolve, reject) {
      try {
        x = onRejected(this.reason)
        resolvePromise(this, x, resolve, reject)
      } catch (e) {
        reject(e)
      }
    })
  }
}
