# observer.api

To provide an abstract design of the Observer pattern.

Through its availability of types, TypeScript provides the means to define an abstract API. An abstract API is designed to be implemented rather than employed. The Observer pattern is a very powerful pattern for web applications to follow. However, building one implementation to be used by all applications can lead to unwanted suffering.

Every application is designed to solve a set of challenges. Each set of challenges comes with its own set of constraints. In theory, designing an implementation that is optimal for all applications requires satisfying every possible constraint that any application could pose. This is an impossible design to achieve. In our ecosystem, there are many cases where given two constraints, one can be satisfied only if the other is not. In practice, we usually settle for an implementation that can satisfy enough of the most common constraints. However, as the ecosystem changes, so too does our concept of what's 'common'.

Since every application has its own set of constraints, each application needs its own implementation of the Observer pattern. My goal is to describe an abstraction that can be easily constrained to any application's target domain. I hope to achieve this by using broad generalizations in cases where any assumption would inherently conflict with at least one application's domain. e.g. Treating all objects as opaque is one broad generalization that is very useful since every application could have their own unique domain of objects. This will allow application developers to have a more straightforward approach for designing an implementation of the Observer pattern that bets fits their needs. 

It is often a common practice to design an implementation that has the capability to be extended to a domain very different than the domain it was originally intended for. I find that this practice often leaves developers settling for a utility that is less than optimal. This is because the process of extending from one domain to another can be very confusing when the two domains have conflicting constraints.

Therefore, the best approach is to first develop an abstraction that can be easily constrained to any domain and then define an implementation that will satisfy the most common constraints after. When developers need an implementation that is more optimal for their target domain, they can always fall back on constraining the original design rather than extending another's implementation.

If this is interesting, check out
<a href="https://github.com/Reactive-Extensions/RxJS">RxJs</a>
or
<a href="https://github.com/ReactiveX/RxJS">RxJs Next</a>

