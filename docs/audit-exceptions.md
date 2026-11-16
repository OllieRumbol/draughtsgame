# Approved npm audit exceptions

`npm run audit` fails on any known vulnerability, in any package, including build-only tools (spec section 6.5, item 5, and plan section 6). A vulnerability passes only when it has a row in the table below.

* Only the owner approves a row.
* Each row names the advisory, the package, the reason and the date to check it again.
* The audit also fails when a row's review date has passed. Then the owner checks the advisory again, and either removes the row or sets a new date.

| Advisory | Package | Reason | Review by |
| --- | --- | --- | --- |
