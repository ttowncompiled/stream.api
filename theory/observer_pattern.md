Under the **observer pattern**,

  - There are **Subjects** and there are **Observers**.
  - **Observers** **subscribe** to **Subjects**.
  - Any **Observer** that is **subscribed** to a **Subject** is a **Subsriber** of that **Subject**.
  - **Subjects** emit **notifications** to their **Subscribers**.
  - **Observers** receive **notifications** from their **Subscriptions**.
  - The number of **notifications** that a **Subject** can emit is **countable**. Therefore, the number of **notifications** that an **Observer** can recieve from any one **Subscription** is **countable**.
  - A **Subject** can have zero or more **Subscriptions**.
    - A **Subject** with zero **Subscriptions** is considered to be **Unsubscribed**.
    - A **Subject** with one or more **Subscriptions** is considered to be **Subscribed**.
  - An **Observer** can **subscribe** to zero or more **Subjects**.
    - An **Observer** that is **subscribed** to zero **Subjects** is considered to be **Completed**.
    - An **Observer** that is **subscribed** to one or more **Subjects** is considered to be **Active**.
  - Any **Observer** can also be a **Subject** and thus any **Subject** can also be an **Observer**.

Any implementation _I_ of the **observer pattern** can be modeled as a **directed acyclic graph**.

Let every **Subject** of _I_ and every **Observer** of _I_ be a **vertex** and let every **Subscription** of _I_ be an **edge**. For every **Subscription** between a **Subject** _S_ and an **Observer** _O_, there is a **directed edge** leading from _S_ to _O_. Since the **Subject** _S_ can have zero or more **Subscribers**, _S_ can have zero or more **directed edges** leading away from _S_. Since the **Observer** _O_ can have zero or more **Subscriptions**, _O_ can have zero or more **directed edges** leading to _O_. If _O_ has zero **Subscriptions**, then _O_ is considered to be **disconnected**, and the graph is considered to be a **disconnected** graph.

If there exists a cycle within the graph of _I_, then when any **Subject** in the cycle emits a **notification**, the runtime will enter into an infinite loop. To prevent this, the graph of _I_ must be **acyclic**.

Since any **undirected edge** between two vertices of the graph of _I_ would form a cycle of length two, if the graph of _I_ is to be **acyclic**, it must also be **directed**.

The **observer pattern** can suffer from what is known as the **lapsed listener problem**. The **lapsed listener problem** occurs when there exists a **Subscription** that is no longer required by its **Observer**. Not solving the **lapsed listener problem** leads to **notifications** being unnecessarily caught by an **Observer** which is a cost in performance. The **lapsed listener problem** can also lead to memory leaks since the active references created by the **Subscription** prevent the **Subject** from being garbage collected.

The **lapsed listener problem** can be solved by employing the **dispose pattern**.
(see <a href="https://github.com/ttowncompiled/observer.api/blob/theory/theory/dispose_pattern.md">dispose_pattern.md</a>)

