Let there exist a domain _D<sub>S</sub>_ where every element of _D<sub>S</sub>_ is a set of objects _S<sub>O</sub>_ s.t.

  - Every object of _S<sub>O</sub>_ is **arbitrary** with regards to **value** or **type**.
  - Every object _o_ of _S<sub>O</sub>_ is **opaque**. Therefore, for any two objects _a, b_ of _S<sub>O</sub>_, _a_ **!=** _b_. This is defined as **uniqueness**.
  - _S<sub>O</sub>_ is **countable**.

Given the domain _D<sub>S</sub>_, we can a define a new domain _U<sub>G</sub>_ that contains every arrangement _G_ of all possible subsets of _D<sub>S</sub>_ s.t.
  - _G_ is a **directed acyclic graph** where every element _S<sub>O</sub>_ of _D<sub>S</sub>_ in _G_ is a **vertex** of _G_ and every **edge** _e_ of _G_ connecting two vertices _A, B_ in _G_, is a **transform** on _D<sub>S</sub>_ that maps _A_ to _B_.
  (see <a href="https://github.com/ttowncompiled/observer.api/blob/theory/theory/transform.md">transform.md</a>)

For any graph _G_ which is an element of the domain _U<sub>G</sub>_, _G_ can be modeled as an implementation of the **observer pattern**.
(see <a href="https://github.com/ttowncompiled/observer.api/blob/theory/theory/observer_pattern.md">observer_pattern.md</a>)

For any **edge** _e_ of _G_ that connects two vertices _A, B_ of _G_ s.t. _e_ is the **transform** _e: A -> B_

  - _e_ is a **Subscription** of _B_ to _A_.
  - _A_ is **Subscribed** by _B_. Therefore, _A_ is a **Subject** of _B_.
  - _B_ is a **Subscriber** of _A_. Therefore, _B_ is an **Observer** of _A_.

Therefore, the domain _U<sub>G</sub>_ contains every possible arrangement allowable by the **observer pattern**.

