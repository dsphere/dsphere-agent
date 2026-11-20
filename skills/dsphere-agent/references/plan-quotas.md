# Plan quotas

A refusal with `error.code` `POLICY_DENIED` whose `error.hint` starts with `Plan quota hit:` means the person's DSphere
plan stops this work. Tell the person, in their language, the exact limit named in `error.hint` and `error.businessCode`
(or `details.planCode` when the code is `PLAN-RESTRICTED`). It is one of:

- daily automation minutes;
- app accounts open at once;
- the number of workflows;
- outside agents;
- an expired plan;
- a missing feature;
- another quota the hint names.

They can renew the plan on their DSphere account rights page; the DSphere SidePanel may also show that limit with a
renew button. Do not retry, switch browsers, or keep working around the limit.

Daily automation minutes are the organization's working time of the day, counted by the second across all its
automated tasks (workflow runs, Chat tasks and outside agents) and reset at 00:00 China time. Time spent waiting for
the person to sign in (`dsagent.page.wait` until `authentication-cleared`) is not counted. When the minutes run out,
running work stops at its next renewal and new work is refused until the reset.

Plans do not limit how many workflows run per day or at once, how many tasks are automated at once, or how many
browsers automate at once. An older refusal may still name one of those; it is not a limit to plan around now.

`AUTOMATION_METERING_UNAVAILABLE` is a failed plan check, not a quota: tell the person and wait.
