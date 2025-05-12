---
title: "Number Systems"
created: 2025-05-12
tags:
  - c-programming
  - computer-science
  - number-systems
  - binary
  - octal
  - decimal
  - hexadecimal
---

## A.1 Number Systems

A **number system**, or **numeral system**, is a sacred methodology for inscribing or naming numbers. Each system is defined by its **base** (or **radix**), denoted as $r$. A system with base $r$ employs $r$ distinct symbols, or digits. The initial digit in every system is always $0$.

For instance:

* A base-2 system (binary) uses two digits: $0, 1$.
* A base-8 system (octal) uses eight digits: $0, 1, 2, 3, 4, 5, 6, 7$.
* Should the base exceed $10$, the subsequent digits are represented by letters of the alphabet, commencing with 'A'.

Numbers are manifested as strings of these digit symbols. **Table A.1** illuminates some common number systems.

{~ card title="Table A.1: Common Number Systems" ~}
| System Name         | Base (Radix) $r$ | Digits Used                                   |
|---------------------|--------------------|-----------------------------------------------|
| Binary              | 2                  | $0, 1$                                          |
| Octal               | 8                  | $0, 1, 2, 3, 4, 5, 6, 7$                        |
| Decimal             | 10                 | $0, 1, 2, 3, 4, 5, 6, 7, 8, 9$                  |
| Hexadecimal         | 16                 | $0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A, B, C, D, E, F$ |
(*Where A=10, B=11, C=12, D=13, E=14, F=15 in decimal*)
{~~}

Among these, four are paramount in the digital arts: **binary, octal, decimal,** and **hexadecimal**. The decimal system is our mundane companion. Computers, however, converse only in **binary** (0s and 1s). Octal and hexadecimal serve as compact shorthands for these binary incantations.

{~ alert type="info" ~}
**Key Principles of Number Systems:**
1.  A number is a string of permissible digits (e.g., `10101` is valid binary; `1012` is not).
2.  The value of a number like `101` is ambiguous without its base. It could be $(101)_2$ (binary for decimal 5) or $(101)_8$ (octal for decimal 65). Thus, we denote the base as a subscript, e.g., $(101)_2$.
3.  Each digit possesses a **place value**. The rightmost digit has place value $0$, increasing by one for each digit to its left. In decimal $483$, '3' has place value $0$, '8' has $1$, and '4' has $2$.
4.  Number systems are **weighted**. For a base $r$ system, a digit at place value $p$ has a weight of $r^p$. In decimal $483$:
    * Digit 3: weight $10^0 = 1$
    * Digit 8: weight $10^1 = 10$
    * Digit 4: weight $10^2 = 100$
5.  The rightmost digit is the **Least Significant Digit (LSD)**; the leftmost is the **Most Significant Digit (MSD)**. In $483$, '3' is LSD, '4' is MSD.
6.  Numbers can be converted between systems.
{~~}

## A.2 Number System Conversions: Transmuting Values

We often need to translate numbers between different systema.

{~ accordion title="Conversion Categories" open=true ~}
1.  Decimal to any other base $r$.
2.  Any other base $r$ to Decimal.
3.  Binary to Octal and Hexadecimal.
4.  Octal and Hexadecimal to Binary.
{~~}

### A.2.1 Conversion from Decimal to Any Other Base $r$

The alchemical process:
1.  Divide the decimal number by the target radix $r$, noting the quotient and remainder.
2.  Repeatedly divide the quotient by $r$ until the quotient is $0$.
3.  Collect the remainders. The first remainder is the LSD, the last is the MSD. Write them in reverse order of calculation.

{~ card title="Table A.2: Decimal to Binary, Octal, Hexadecimal (Example: Decimal 23)" ~}
**Decimal to Binary: $(23)_{10} \rightarrow (?)_{2}$**
| Division    | Quotient | Remainder (LSD first) |
|-------------|----------|-----------------------|
| $23 \div 2$ | 11       | $1$                   |
| $11 \div 2$ | 5        | $1$                   |
| $5 \div 2$  | 2        | $1$                   |
| $2 \div 2$  | 1        | $0$                   |
| $1 \div 2$  | 0        | $1$ (MSD)             |
Result: $(10111)_2$

**Decimal to Octal: $(23)_{10} \rightarrow (?)_{8}$**
| Division    | Quotient | Remainder (LSD first) |
|-------------|----------|-----------------------|
| $23 \div 8$ | 2        | $7$                   |
| $2 \div 8$  | 0        | $2$ (MSD)             |
Result: $(27)_8$

**Decimal to Hexadecimal: $(23)_{10} \rightarrow (?)_{16}$**
| Division    | Quotient | Remainder (LSD first) |
|-------------|----------|-----------------------|
| $23 \div 16$| 1        | $7$                   |
| $1 \div 16$ | 0        | $1$ (MSD)             |
Result: $(17)_{16}$
{~~}

### A.2.2 Conversion from Any Other Base $r$ to Decimal

To convert a number from base $r$ to decimal, multiply each digit by its associated weight ($r^p$) and sum the results.

{~ card title="Table A.3: Binary, Octal, Hexadecimal to Decimal Examples" ~}
**Binary to Decimal: $(1011)_2 \rightarrow (?)_{10}$**
$(1 \times 2^3) + (0 \times 2^2) + (1 \times 2^1) + (1 \times 2^0)$
$= (1 \times 8) + (0 \times 4) + (1 \times 2) + (1 \times 1)$
$= 8 + 0 + 2 + 1 = 11$
Result: $(1011)_2 = (11)_{10}$

**Octal to Decimal: $(726)_8 \rightarrow (?)_{10}$**
$(7 \times 8^2) + (2 \times 8^1) + (6 \times 8^0)$
$= (7 \times 64) + (2 \times 8) + (6 \times 1)$
$= 448 + 16 + 6 = 470$
Result: $(726)_8 = (470)_{10}$

**Hexadecimal to Decimal: $(AB)_{16} \rightarrow (?)_{10}$**
(Remember: A=10, B=11)
$(10 \times 16^1) + (11 \times 16^0)$
$= (10 \times 16) + (11 \times 1)$
$= 160 + 11 = 171$
Result: $(AB)_{16} = (171)_{10}$
{~~}

### A.2.3 Conversion from Binary to Octal and Hexadecimal

These conversions are streamlined due to their direct relationship.

{~ accordion title="Binary to Octal" ~}
1.  Partition the binary number into groups of **3 bits** each, starting from the right (LSD). (Because $2^3 = 8$, so 3 bits represent all 8 octal digits).
2.  If the leftmost group is incomplete, pad it with leading zeros.
3.  Convert each 3-bit group to its octal equivalent.
4.  The resulting string of octal digits is the answer.

**Example (Table A.4): $(1011101)_2 \rightarrow (?)_{8}$**
Binary: `1 011 101`
Padded: `001 011 101`
Octal:    `1   3   5`
Result: $(135)_8$
{~~}

{~ accordion title="Binary to Hexadecimal" ~}
1.  Partition the binary number into groups of **4 bits** each, starting from the right (LSD). (Because $2^4 = 16$, so 4 bits represent all 16 hexadecimal digits).
2.  If the leftmost group is incomplete, pad it with leading zeros.
3.  Convert each 4-bit group to its hexadecimal equivalent.
4.  The resulting string of hexadecimal digits is the answer.

**Example (Table A.5): $(1011101)_2 \rightarrow (?)_{16}$**
*(Note: The example in the provided text $(11101001)_2 \rightarrow (5D)_{16}$ seems to have a typo for the input binary number if it's meant to be from the same source $1011101_2$. Let's use the original $1011101_2$ for consistency with the octal example, then do the table's example.)*

**Correcting for $(1011101)_2 \rightarrow (?)_{16}$:**
Binary: `101 1101`
Padded: `0101 1101`
Hex:      `5    D`
Result: $(5D)_{16}$

**As per Table A.5's actual example: $(11101001)_2 \rightarrow (?)_{16}$**
Binary: `1110 1001`
Hex:      `E    9`
*The table image actually shows $01011101_2$ which leads to $5D_{16}$. Assuming the binary number shown in the table image `01011101` was intended for the example, not the text `(11101001)2`.*

Let's use the visual from a typical Table A.5 structure for clarity:
Binary: `0101 1101` (assuming this was intended)
Hex:      `5    D`
Result: $(5D)_{16}$
{~~}

### A.2.4 Conversion from Octal and Hexadecimal to Binary

This is the reverse of the previous conversions.

{~ accordion title="Octal to Binary" ~}
For each octal digit, write its 3-bit binary equivalent.

**Example (from Table A.6): $(275)_8 \rightarrow (?)_{2}$**
Octal: `2   7   5`
Binary: `010 111 101`
Result: $(010111101)_2$ or $(10111101)_2$ (leading zero can be omitted)
{~~}

{~ accordion title="Hexadecimal to Binary" ~}
For each hexadecimal digit, write its 4-bit binary equivalent.

**Example (from Table A.6): $(9AF)_{16} \rightarrow (?)_{2}$**
Hex:    `9    A    F`
Binary: `1001 1010 1111`
Result: $(100110101111)_2$
{~~}

---
