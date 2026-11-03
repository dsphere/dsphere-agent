# Plan quotas

A refusal with `error.code` `POLICY_DENIED` whose `error.hint` starts with `Plan quota hit:` means the person's DSphere
plan stops this work. Tell the person, in their language, the exact limit named in `error.hint` and `error.businessCode`
(or `details.planCode` when the code is `PLAN-RESTRICTED`). It is one of:

- daily workflow executions;
- daily automation minutes;
- workflows or automated tasks at once;
- browsers automating at once;
- app accounts open at once;
- the number of workflows;
- outside agents;
- an expired plan;
- a missing feature;
- another quota the hint names.

They can renew the plan on their DSphere account rights page; the DSphere SidePanel may also show that limit with a
renew button. Do not retry, switch browsers, or keep working around the limit.

`AUTOMATION_METERING_UNAVAILABLE` is a failed plan check, not a quota: tell the person and wait.
