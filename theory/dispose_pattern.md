Let there be a **Subject** _S_ and an **Observer** _O_ s.t. _S_ is also an **Observer** and _O_ is a **Subscriber** of _S_.

Let _S_ possess a **strong reference** to _O_ and let _O_ possess a **strong reference** to _S_.

Let _S_ and _O_ implement an **unsubscribe** method that removes the reference that _O_ has to _S_ and removes the reference that _S_ has to _O_.

Let _S_ implement a **dispose** method that **unsubscribes** all **Subscribers** of _S_ and **unsubscribes** _S_ from all of its **Subscriptions**.

Under the **dispose pattern**,

  - When _S_ becomes **Completed**, it must be **Disposed**.
  - If _S_ is **Disposed**, it must also become **Unsubscribed**. Therefore, _O_ must **unsubscribe** from _S_.
  - Once _S_ is **Disposed**, it may possess no references to any other **Observer** or **Subject**, and no other **Observer** nor **Subject** may possess a reference to _S_.

