---
title: "One Part Two: Operating Systems & The C Language"
created: 2025-05-15
tags:
  - c-programming
  - operating-systems
  - ipc144
  - study-guide
  - c-language
---

# Lecture One: Part Two - Operating Systems & The C Language

{~ hero layout="text_center_image_background" image_src="https://cdn.shopify.com/s/files/1/0855/1446/files/OS-buddies-1-1024x570.jpg" image_alt="Abstract code on a screen representing operating systems and programming" min_height="60vh" text_color="white" text_bg_color="black-50" content_align_vertical="center" ~}
## Diving Deeper: Operating Systems and the C Language

This section explores the crucial role of Operating Systems (OS) in managing computer activities and delves into the specifics of the C programming language, its history, and development environment.
{~~}

## Module 6: Operating Systems - The Conductors of the Orchestra

The Operating System (OS) is the master program that manages and controls all of a computer’s activities and resources. Think of it as the conductor of a complex orchestra, ensuring every instrument (hardware and software) plays in harmony. You're likely familiar with systems like Windows, macOS, or Linux. Application programs, from your web browser to your word processor, cannot function without an OS.

{~ progress value="20" label="Understanding OS: Core Concepts" color="info" ~}
Operating systems make computers user-friendly and provide a stable platform for applications.
{~~}

{~ accordion title="What is an Operating System?" open=true ~}
Operating systems (OS) are sophisticated software layers that make using computers more convenient for users, software developers, and system administrators. They provide essential services that allow applications to execute safely, efficiently, and often concurrently.

* **Core Component (Kernel):** The heart of the OS is the **kernel**, which manages the most fundamental operations.
* **Popular Desktop OS:** Linux, Windows, and macOS are prevalent. Notably, parts of each are written in C.
* **Popular Mobile OS:** Google’s Android and Apple’s iOS dominate the smartphone and tablet landscape.
{~~}

{~ accordion title="Windows: A Proprietary OS" ~}
Developed by Microsoft in the mid-1980s, Windows evolved from MS-DOS (Disk Operating System) by adding a graphical user interface (GUI).

* **Current Version:** Windows 10/11 are the latest iterations.
* **Proprietary Nature:** Windows is controlled exclusively by Microsoft.
* **Market Share:** It holds the largest share of the desktop operating system market worldwide.
{~~}

{~ accordion title="Linux: An Open-Source Powerhouse" ~}
Linux stands as a testament to the success of the open-source movement.

* **Open Source Principles:** Individuals and companies collaboratively develop, maintain, and evolve the software. Users can typically use it free of charge, under generous licensing terms.
* **Benefits:**
  * **Scrutiny & Robustness:** More eyes on the code can lead to faster bug detection and removal.
  * **Productivity & Innovation:** Open source has fueled significant technological advancements.
* **Linux Kernel:** The core of this popular, free, full-featured OS. It's developed by a global team of volunteers and is widely used in servers, PCs, and embedded systems (smartphones, smart TVs, automotive systems).
* **Accessibility:** Unlike proprietary OS source code, Linux source code is publicly available for examination, modification, and free distribution. This fosters a large development community and allows for customization.
{~~}

{~ card title="Key Open-Source Organizations" ~}
Several foundations and organizations champion the open-source philosophy:

* **GitHub:** Hosts millions of open-source projects and provides management tools.
* **The Apache Software Foundation:** Oversees over 350 projects, including big data technologies.
* **The Eclipse Foundation:** Known for the Eclipse Integrated Development Environment (IDE).
* **The Mozilla Foundation:** Creators of the Firefox web browser.
* **And many more:** OpenML (machine learning), OpenAI (AI research), OpenCV (computer vision), Python Software Foundation.
{~~}

{~ accordion title="Apple’s macOS and iOS Ecosystem" ~}
Apple, co-founded by Steve Jobs and Steve Wozniak in 1976, became a leader in personal computing.

* **GUI Inspiration:** Jobs visited Xerox PARC in 1979, which influenced Apple's adoption of GUIs.
* **Objective-C:** This language added Object-Oriented Programming (OOP) to C. Steve Jobs' company NeXT, Inc. licensed Objective-C and developed the NeXTSTEP operating system. Apple’s macOS is a descendant of NeXTSTEP.

**Derived Operating Systems:**

* **iOS:** For iPhones.
* **iPadOS:** For iPads.
* **watchOS:** For Apple Watches.
* **tvOS:** For Apple TV devices.

**Swift:** Introduced in 2014 and open-sourced in 2015, Swift has largely become the primary language for Apple app development, moving away from Objective-C.
{~~}

{~ accordion title="Google’s Android" ~}
Android is the most widely used mobile OS, built upon the Linux kernel.

* **Technology Stack:** Based on Linux, Java, and now increasingly the open-source Kotlin language.
* **Open Source & Free:** This has contributed to its widespread adoption.
* **Market Dominance (2020 data):** Accounted for approximately 84.8% of smartphone shipments.
* **Versatility:** Used in smartphones, tablets, e-readers, TVs, kiosks, cars, robots, and multimedia players.
The growth of these mobile devices creates vast opportunities for app developers.
{~~}

## Module 7: The C Programming Language - Foundation and Power

Now, let's turn our attention to the C programming language itself, a cornerstone of modern computing.

{~ progress value="50" label="Journey into C: History & Standards" color="secondary" ~}
Understanding C's origins and evolution helps appreciate its design and capabilities.
{~~}

{~ card title="Evolution of C" footer="From BCPL to Modern Standards" ~}

* **Ancestry:** C evolved from two earlier languages:

**BCPL:** Developed in 1967 by Martin Richards for writing operating systems and compilers.
**B:** Created by Ken Thompson at Bell Laboratories in 1970, modeling many features from BCPL. Used for early versions of the UNIX operating system.

* **Birth of C:** Evolved from B by **Dennis Ritchie** at Bell Laboratories, with its first implementation around **1972**.
* **UNIX Connection:** C became widely known as the development language for UNIX.
* **Modern Impact:** Many of today’s leading operating systems (and numerous applications) are written in C and/or C++.
* **Portability:** C is largely hardware-independent. With careful design, C programs can be portable across most computer systems.
{~~}

{~ accordion title="C: Built for Performance" ~}
C is extensively used for developing systems where performance is critical:

* Operating systems
* Embedded systems (controllers in devices)
* Real-time systems (requiring immediate response)
* Communications systems
By the late 1970s, C had evolved into what is now referred to as "traditional C."
{~~}

{~ accordion title="Standardization of C (ANSI C & ISO C)" ~}
The rapid spread of C to various hardware platforms led to incompatible versions, posing a problem for developers needing cross-platform code.

* **X3J11 Committee:** In 1983, the American National Standards Committee on Computers and Information Processing (X3) formed the X3J11 technical committee to create an "unambiguous and machine-independent definition of the language."
* **ANSI C (C89/C90):** The standard was approved in the U.S. in 1989 via ANSI (American National Standards Institute).
* **ISO C:** It was subsequently approved worldwide via ISO (International Standards Organization).
* **C11 and C18 Standards:** This course discusses the C11 standard (approved 2011) and its 2018 update (C18, mainly bug fixes). These standards refined and expanded C's capabilities. The next standard was anticipated around 2022/2023 (now C23).
* **Portability Advantage:** As a hardware-independent, widely available standardized language, C applications can often run with minimal or no modification across diverse computer systems.
{~~}

## Module 8: C Standard Library & Program Development

Understanding the C language also involves learning how to use its powerful standard library and the typical program development lifecycle.

{~ progress value="75" label="C Development: Libraries & Workflow" color="success" ~}
Leveraging libraries and understanding the build process are key to efficient C programming.
{~~}

{~ accordion title="The C Standard Library & Software Reuse" ~}
C programs are composed of functions. While you can write every function yourself, most C programmers utilize the extensive **C Standard Library**.

* **Two Learning Parts:**
    1. Learning the C language syntax and concepts.
    2. Learning to use the C Standard Library functions.
* **Building Blocks in C:**
  * C Standard Library functions
  * Open-source C library functions
  * Functions you create
  * Functions created by others
* **Software Reuse:** Using existing library functions saves development time and effort, preventing "reinventing the wheel."
* **Open-Source C Libraries:** Beyond the standard library, numerous third-party and open-source C libraries are available (e.g., via GitHub, Awesome C lists) for a wide range of tasks.
{~~}

{~ card title="Typical C Program Development Environment & Phases" footer="From Source Code to Execution" ~}
C systems generally include a development environment, the language itself, and its standard library. Executing a C program typically involves six phases:

1. **Edit:** Writing or modifying your C source code in a text editor (e.g., VS Code, Vim, or an IDE). Your source file usually has a `.c` extension.
    * *User Action: You create `my_program.c`.*
2. **Preprocess:** Before compilation, a **preprocessor** modifies the source code. It handles directives starting with `#` (e.g., `#include` to insert header file contents, `#define` for macros/constants).
    * *System Action: Preprocessor transforms `my_program.c` based on directives.*
3. **Compile:** A **compiler** translates the preprocessed source code into machine-language **object code** (often a `.o` or `.obj` file). If the compiler finds **syntax errors** (violations of C language rules), it issues error messages. These are also called compile-time errors.
    * *System Action: Compiler creates `my_program.o` from preprocessed code.*
4. **Link:** The **linker** combines your program's object code with object code from any library functions used (e.g., from the C Standard Library or other libraries) and any other object files part of your project. This resolves references to functions defined elsewhere and produces an **executable file** (e.g., `my_program` on Linux/macOS, `my_program.exe` on Windows).
    * *System Action: Linker combines `my_program.o` with library code to create `my_program` executable.*
5. **Load:** Before execution, the **loader** (part of the OS) copies the executable file from disk into the computer's memory (RAM). It also loads any necessary shared library components.
    * *System Action: OS loads `my_program` into memory.*
6. **Execute:** The CPU takes control and executes the program's machine-language instructions one by one.
    * *User/System Action: Program runs.*

This entire process can often be initiated with a single command (e.g., `gcc my_program.c -o my_program`).
{~~}

{~ accordion title="Understanding Compilation in More Detail" ~}
A program written in a high-level language like C is called a **source program** (or source code). Computers cannot directly understand source programs.

* **Compiler:** A program that translates the source program into an equivalent machine-language program called an **object program** (or object code).
* **Linking:** The object program is often linked with other supporting library code (which is also in object code form) before the final executable program can be run on the machine.

**Diagram:**
Source File (`.c`) -> [Preprocessor] -> Modified Source -> [Compiler] -> Object File (`.o`) -> [Linker (+ Library Code)] -> Executable File
{~~}

{~ accordion title="Potential Problems During Execution" ~}
Errors that occur while a program is running are known as **runtime errors** or execution-time errors.

* **Fatal Errors:** Cause the program to terminate immediately (crash) without completing its task (e.g., dividing by zero, accessing invalid memory).
* **Nonfatal Errors:** Allow the program to run to completion but often produce incorrect results. These are frequently due to **logic errors** in the program's design.
{~~}

{~ accordion title="Standard Input, Output, and Error Streams" ~}
Most C programs interact with data.

* **`stdin` (Standard Input):** Typically the keyboard. Functions like `scanf()` or `getchar()` read from here.
* **`stdout` (Standard Output):** Typically the computer screen. Functions like `printf()` or `puts()` write here.
* **`stderr` (Standard Error):** Also typically the screen, used specifically for displaying error messages. This allows error messages to be seen even if `stdout` is redirected to a file.
Data can also be output to other devices like disks and printers.
{~~}

{~ card title="Summary of Programming Errors in C" ~}

* **Syntax Errors (Compile-time):** Errors in code construction (e.g., missing semicolon, incorrect keyword). The compiler catches these.
* **Runtime Errors (Execution-time):** Cause the program to behave unexpectedly or abort during execution (e.g., illegal memory access, division by zero).
* **Logic Errors:** The program runs but produces incorrect results due to flaws in the algorithm or its implementation. These are often the hardest to debug.
{~~}

---
