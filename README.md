The project is organized into folders according to the following path pattern `src/<language>`; so the JS code lives inside the `src/js` directory.

I have implemented three solutions:

1. A JS solution (src/js/main.js) that uses the reduce function to perform a recursive application of the sha256 operator.
2. Another JS solution (src/js/main-rec.js) that implements a recursive version of the `verifyHash` function
3. A Go lang implementation (src/go/main.go)

Note on unit tests
===
I have written a unit test for one of the JS implementation. However, it looks redundant as the actual test happens within the main module for each language and more specifically the main function. The module that contains the `verifyHash` includes both the implementation and the main function that acts as a unit against an existing merkle tree which we know is correct. 


Instructions
===

To run the JS implementation:

Go to `src/js` and type:

- `node main.js` 
- `node main-rec.js`

To run the Go implementation:

Go to `src/go` and type:

- `go run main.go` 


There are no comments in the code because I tend to write tiny function that have a single responsibility and a self-explanatory name; thus additional comments can be sometimes confusing.
