Let there exist a domain _D<sub>S</sub>_ where every element of _D<sub>S</sub>_ is a set of objects _S<sub>O</sub>_ s.t.

  - Every object of _S<sub>O</sub>_ is **arbitrary** with regards to **value** or **type**.
  - Every object _o_ of _S<sub>O</sub>_ is **opaque**. Therefore, for any two objects _a, b_ of _S<sub>O</sub>_, _a_ **!=** _b_. This is defined as **uniqueness**.
  - _S<sub>O</sub>_ is **countable**.

Let there exist two sets _A, B_ of _D<sub>S</sub>_

  - Let _C_ be the **union** of _A, B_
    - _C_ is of _D<sub>S</sub>_
    - _C_ = { _o_ | _o_ is of _A_ or _o_ is of _B_ }
    - |_C_| = |_A_| + |_B_|

  - Let _C_ be the **intersection** of _A, B_
    - _C_ is of _D<sub>S</sub>_
    - _C_ = { }

  - Let _C_ be the **difference** of _A, B_ s.t. _C_ = _A_ **-** _B_
    - _C_ is of _D<sub><S</sub>_
    - _C_ = { _o_ | _o_ of _A_ }
    - |_C_| = |_A_|

  - Let _C_ be the **symmetric difference** of _A, B_ s.t. _C_ = _A_ **symmetric difference** _B_
    - _C_ is of _D<sub>S</sub>_
    - _C_ = { _o_ | _o_ is of _A_ or _o_ is of _B_ }
    - |_C_| = |_A_| + |_B_|
    - This is just the **union** of _A_ and _B_

  - Let _C_ be the **cartesian product** of _A_, _B_
    - _C_ is of _D<sub>S</sub>_
    - _C_ = { { _a_, _b_ } | _a_ is of _A_ and _b_ is of _B_ }
    - |_C_| = |_A_| * |_B_|

  - Let _C_ be the **power set** of _A_
    - _C_ is of _D<sub>S</sub>_
    - _C_ is the set of all possible subsets of _A_
    - |_C_| = 2<sup>|_A_|</sup>

Let there be a function _f: S<sub>O</sub> -> S<sub>O</sub>_. _f_ is a **transform** on _D<sub>S</sub>_. The operations defined above are just a number of possible **transforms** that can be applied to the domain _D<sub>S</sub>_.

Given the domain _D<sub>S</sub>_, we can a define a new domain _U<sub>G</sub>_ that contains every arrangement _G_ of all possible subsets of _D<sub>S</sub>_ s.t.
  - _G_ is a **directed acyclic graph** where every element _S<sub>O</sub>_ of _D<sub>S</sub>_ in _G_ is a **vertex** of _G_ and every **edge** _e_ of _G_ connecting two vertices _A, B_ in _G_, is a **transform** on _D<sub>S</sub>_ that maps _A_ to _B_.

The domain _U<sub>G</sub>_ contains every possible arrangement allowable by the **observer pattern**.
