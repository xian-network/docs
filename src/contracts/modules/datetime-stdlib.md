# `datetime` Standard Library (Xian Smart‑Contracts)

Xian contracts expose a sandboxed **`datetime`** module that mirrors a safe subset of Python’s `datetime`, tailored for deterministic blockchain execution.  
Everything runs in **UTC +0** and is fully deterministic across nodes.

---

## `datetime.Datetime`

```python
d = datetime.datetime(
    year, month, day,
    hour=0, minute=0, second=0, microsecond=0
)
```

* Minimum required: `year`, `month`, `day`.  
* **Intentionally different from CPython**: no `tzinfo`, `fold`, or timezone‑aware operations—​all timestamps are absolute UTC.  
* Attributes (`year`, `month`, `day`, `hour`, `minute`, `second`, `microsecond`) are read‑only.

### Comparisons

```python
d1 = datetime.datetime(2019, 10, 10)
d2 = datetime.datetime(2019, 10, 11)

d1 <  d2   # True
d1 <= d2   # True
d1 == d2   # False
d1 != d2   # True
d1 >  d2   # False
d1 >= d2   # False
```

### Arithmetic

| Expression | Result type | Notes |
|------------|-------------|-------|
| `Datetime + Timedelta` | `Datetime` | shift forward |
| `Datetime - Datetime`  | `Timedelta` | interval between two blocks |

```python
d  = datetime.datetime(2019, 10, 10)
t  = datetime.timedelta(days=1)

d2 = d + t                     # 2019‑10‑11
assert d2 - d == t             # True
```

### Parsing strings

```python
iso = "2019-10-10 10:10:10"
d   = datetime.datetime.strptime(iso, "%Y-%m-%d %H:%M:%S")
```

---

## `datetime.timedelta`

```python
t = datetime.timedelta(
    weeks=0, days=0, hours=0, minutes=0, seconds=0
)
```

Represents an **interval**—handy for lock‑ups, grace periods, &c.

### Comparisons

Exactly the same six rich comparisons as `Datetime`.

### Arithmetic

| Expression | Result type | Example |
|------------|-------------|---------|
| `Timedelta + Timedelta` | `Timedelta` | `t1 + t2` |
| `Timedelta - Timedelta` | `Timedelta` | `t2 - t1` |
| `Timedelta * int`       | `Timedelta` | `t1 * 5` |
| `Timedelta * Timedelta` | `Timedelta` | component‑wise product—**rarely useful** |
| `Timedelta + Datetime`  | `Datetime` | forward shift (commutative with `Datetime + Timedelta`) |
| `Timedelta - Datetime`  | `Datetime` | backward shift |

```python
t1 = datetime.timedelta(weeks=1)
d  = datetime.datetime(2025, 1, 1)

assert (t1 + d) == (d + t1)        # 2025‑01‑08
assert (t1 * 4).weeks == 4
```

### Quick accessors (total values)

```python
t = datetime.timedelta(days=3, hours=5)

t.seconds   # total seconds  (280 800)
t.minutes   # total minutes  (4 680)
t.hours     # total hours    (78)
t.days      # total days     (3)
t.weeks     # total weeks    (0)
```

> **Heads‑up :** Unlike CPython where `timedelta.seconds` is **only the seconds component in the final day (0‑86399)**, Xian’s implementation (and all the helper properties above) return the **total** amount in that unit. This avoids off‑by‑one‑day bugs in contract logic.

### Pre‑made constants

```python
datetime.WEEKS   # == datetime.timedelta(weeks=1)
datetime.DAYS    # == datetime.timedelta(days=1)
datetime.HOURS   # == datetime.timedelta(hours=1)
datetime.MINUTES # == datetime.timedelta(minutes=1)
datetime.SECONDS # == datetime.timedelta(seconds=1)
```

---

## `now` (block timestamp)

Inside every contract call the global **`now`** is injected by the Xian executor:

* Type : `Datetime`
* Value : block‑submission time of the current transaction

```python
EXPIRATION = datetime.timedelta(days=5)
submission_time = Variable()

@construct
def init():
    submission_time.set(now)          # capture deployment block‑time

@export
def has_expired() -> bool:
    return (now - submission_time.get()) > EXPIRATION
```

Use **`ContractingClient`** for tests —it auto‑fills `now`.  
When using **`Executor`** directly you must inject `now` yourself.

---

## Determinism & Security Notes

* The library wraps CPython objects but blocks unsafe attributes to prevent side‑effects or non‑determinism.
* Arithmetic is **pure**—no overflow, no floating‑point.
* All times are absolute (UTC), so contracts behave identically on every node.
