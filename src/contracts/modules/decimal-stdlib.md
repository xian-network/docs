# `decimal` Standard Library (Xian Smart‑Contracts)

Xian smart contracts provide a sandboxed `decimal` type for high-precision, deterministic arithmetic, which is essential for financial calculations and other applications where floating-point inaccuracies are unacceptable.

Standard Python `float` types are prohibited in smart contracts because their behavior can be non-deterministic across different machine architectures. The `decimal` type solves this by providing a fixed-point number implementation that behaves identically on every node.

Under the hood, this module is a secure wrapper around Python's standard `Decimal` library, configured for blockchain execution.

---

## Key Features

### 1. Automatic `float` Conversion

For developer convenience, the Xian compiler automatically converts any floating-point literal (e.g., `1.23`) into a `decimal` object. This means you can write natural-looking code, and it will be made safe and deterministic automatically.

```python
# The developer writes this:
rate = 0.05

# The compiler automatically treats it as this:
rate = decimal('0.05')
```

### 2. Fixed Precision

The `decimal` type uses a fixed precision of **60 total digits**, split into:
*   **30 digits** for the integer part (before the decimal point).
*   **30 digits** for the fractional part (after the decimal point).

Values exceeding these limits are automatically handled:
-   Numbers larger than the maximum will be clamped to the maximum value.
-   Fractional parts longer than 30 digits will be truncated (rounded towards zero).

### 3. Deterministic Rounding

All arithmetic operations are deterministic and use `ROUND_FLOOR` rounding. This means that for any calculation, the result is always rounded down, ensuring consistent results across the network.

---

## Usage

The `decimal` type is exposed as a built-in function that can be called to create a high-precision number from a `str`, `int`, or `float`. Using a **string is highly recommended** to avoid any potential precision loss during instantiation.

### Instantiation

```python
# Recommended: create from a string for maximum precision
precise_value = decimal('1234567890.09876543210987654321')

# Create from an integer
int_value = decimal(100)

# Automatic conversion from a float literal
float_value = 25.5 
```

### Arithmetic Operations

All standard arithmetic operators are supported. Operations between `decimal` objects, or between a `decimal` and an `int`/`float`, will always result in a new `decimal` object.

```python
a = decimal('10.5')
b = 2.0  # Treated as decimal('2.0')

# Addition
result_add = a + b  # returns decimal('12.5')

# Subtraction
result_sub = a - b  # returns decimal('8.5')

# Multiplication
result_mul = a * b  # returns decimal('21.0')

# Division
result_div = a / b  # returns decimal('5.25')

# Exponentiation
result_pow = b ** 3 # returns decimal('8.0')
```

### Comparisons

`decimal` objects can be compared with each other or with standard number types.

```python
val1 = decimal('100.1')
val2 = decimal('100.2')
val3 = 100.1 # This is also a decimal

val1 < val2   # True
val1 == val3  # True
val2 > val3   # True
```

---

## Smart Contract Example

This example demonstrates a simple contract that calculates compound interest, showcasing how `decimal` is used for financial logic.

```python
# State variables to store decimal values
principal = Variable()
interest_rate = Variable()

@construct
def setup_loan():
    # It's best practice to set initial values using strings for precision.
    principal.set(decimal('10000.0')) 
    
    # The compiler will automatically convert this float to a decimal.
    interest_rate.set(0.05) 

@export
def calculate_total_amount(years: int):
    # Retrieve the decimal values from state
    p = principal.get()
    r = interest_rate.get()

    # Perform calculations. The result of each operation is a decimal.
    # Formula: Amount = P * (1 + r)^n
    one = decimal('1.0')
    final_amount = p * ((one + r) ** years)
    
    return final_amount
```