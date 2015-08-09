Given the domain _D<sub>S</sub>_, we can show that _D<sub>S</sub>_ is a **group**.
(see <a href="https://github.com/ttowncompiled/observer.api/blob/theory/theory/constraints.md">constraints.md</a>)

Let there be an operation __*__ s.t. for any two sets _A, B_ of _D<sub>S</sub>_, _A_ __*__ _B_ is the **symmetric difference** of _A, B_.

Given that both _A_ and _B_ are sets of objects, the __*__ of _A, B_ is a set whose elements came from either _A_ or _B_. Therefore, __*__ of _A, B_ must be a set of objects and is contained within the domain _D<sub>S</sub>_. The domain _D<sub>S</sub>_ is said to have **closure** over the operation __*__.

The __*__ of _A, B_ is the **difference** of the **union** of _A, B_ and the **intersection** of _A, B_. The operations of **difference**, **union**, and **intersection** are all **associative** operations. Therfore, __*__ must also be **associative**.

Let there be a set of objects _E_ which is the **empty set**. Since _E_ is a set of objects, _E_ is contained within the domain _D<sub>S</sub>_. Given any set _S_ of _D<sub>S</sub>_, _S_ __*__ _E_ = _S_ = _E_ __*__ _S_. The domain _D<sub>S</sub>_ contains an **identity** w/r to the operation __*__.

For any element _S_ of the domain _D<sub>S</sub>_, _S_ __*__ _S_ = _E_. Therefore, every element of _D<sub>S</sub>_ is its own **inverse** w/r to the operation __*__.

Given that _D<sub>S</sub>_ has **closure** over the operation __*__, the operation __*__ is **associative**, _D<sub>S</sub>_ contains the **identity** w/r to the operation __*__, and that for every element _S_ of _D<sub>S</sub>_, _D<sub>S</sub>_ contains the **inverse** of _S_ w/r to the operation __*__, _D<sub>S</sub>_ is a **group** w/r to the operation __*__.

