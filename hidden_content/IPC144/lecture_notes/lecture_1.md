---
title: "One Part One: Introduction to Computers, Programs, and C"
created: 2025-05-12
tags:
  - c-programming
  - computer-basics
  - ipc144
  - study-guide
---

## Module 1: Introduction to Computers, Programs, and C

{~ hero layout="text_left_image_right" image_src="https://images.unsplash.com/photo-1568716353609-12ddc5c67f04?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" image_alt="Example C code" min_height="screen" content_align_vertical="center" text_bg_color="black-50" class="hero-c-intro" ~}

This module lays the groundwork, exploring the essential components and concepts.

1. What is a **Computer**?
2. The Central Processing Unit (**CPU**)
3. Memory (Random Access Memory or **RAM**)

And more...
{~~}

{~ accordion title="What is a Computer?" ~}
A computer, in its essence, is a device comprising a Central Processing Unit (CPU), memory, storage (like a hard disk), input/output mechanisms, and communication channels. These components work in concert, guided by a mystical 'Bus'.

**Key Components:**

* **CPU:** The brain, executing instructions.
* **Memory:** Temporary storage for active programs and data.
* **Storage Devices:** Permanent repositories for your digital files (e.g., Disk, CD, Tape).
* **Input Devices:** How you command the machine (e.g., Keyboard, Mouse).
* **Output Devices:** How the machine responds (e.g., Monitor, Printer).
* **Communication Devices:** Bridges to other networks (e.g., Modem, Network Interface Card - NIC).
{~~}

{~ accordion title="The Central Processing Unit (CPU)" ~}
The CPU is the heart of the computer, retrieving and executing instructions from memory. Its speed, measured in Megahertz (MHz) or Gigahertz (GHz), dictates how quickly it can process spells. Modern CPUs, like the Intel Core series, possess immense computational power.
For example, 1 MHz means 1 million pulses per second, while 1 GHz is 1000 MHz.
{~~}

{~ accordion title="Memory (RAM)" ~}
Memory (Random Access Memory or RAM) is where your programs and their data reside while being actively used by the CPU. It's an ordered sequence of bytes, each a container for 8 bits of information.

**Key Characteristics:**

* Data must be loaded into memory for execution.
* A memory byte always holds some data, though it might be arcane gibberish initially.
* New information overwrites the old; memory is ephemeral in this sense.
* It is **volatile**: its contents are lost when power is removed.
{~~}

{~ accordion title="How Data is Stored" ~}
All data—numbers, mystical characters, powerful strings—are encoded as series of bits (0s and 1s). This binary system is fundamental because digital devices have two stable states.

* **Encoding:** The system automatically handles encoding (e.g., character 'J' as `01001010`).
* **Bytes:** The smallest addressable unit of memory. A single byte can store a small number or a single character. Larger data spans multiple adjacent bytes.
* **Uniqueness:** No two distinct pieces of data can share or split the same byte.
{~~}

{~ accordion title="Storage Devices" ~}
Since memory is volatile, programs and data are permanently etched onto storage devices.

**Main Types:**

* **Disk Drives:** Hard disks, and the ancient floppy disks.
* **CD Drives:** CD-R (writable) and CD-RW (rewritable).
* **Tape Drives:** For archiving vast libraries of spells.
{~~}

{~ accordion title="Output Devices: The Monitor" ~}
The monitor is your crystal ball, displaying text and graphical representations.

* **Resolution:** The number of pixels (picture elements) per square inch. Higher resolution generally means sharper images. A common setting for a 15-inch monitor might be $640 \times 480$ pixels.
* **Dot Pitch:** The space between pixels. Smaller dot pitch leads to a clearer display.
{~~}

{~ accordion title="Communication Devices" ~}
These devices allow your machine to converse with others across networks.

* **Modem:** Uses phone lines (up to 56,000 bps).
* **DSL (Digital Subscriber Line):** Faster than a regular modem, also uses phone lines.
* **Cable Modem:** Uses TV cable lines, comparable speed to DSL.
* **Network Interface Card (NIC):** Connects to a Local Area Network (LAN), with speeds like 10 Mbps (megabits per second).
{~~}

{~ accordion title="Programs (Software)" ~}
Programs, or software, are the sets of instructions that tell the computer what to do. Without them, a computer is but an inert collection of parts. Since computers don't understand human tongues directly, we use programming languages.
{~~}

## Module 2: Understanding Programming Languages

This section explores the different dialects used to communicate our intentions to the machine.

{~ card title="The Spectrum of Languages" ~}
Programming languages form a hierarchy, from the raw language of the machine to more human-readable forms.
{~~}

{~ accordion title="Machine Language" ~}
This is the native tongue of the CPU, a sequence of binary codes (0s and 1s) representing primitive instructions.

* **Directly Understood:** The only language a computer *truly* understands without translation.
* **Tedious & Difficult:** Writing in machine language is cumbersome and error-prone for humans. Example: `1101101010011010` might be an instruction to add two numbers.
* **Machine-Dependent:** Specific to a particular computer hardware design.
{~~}

{~ accordion title="Assembly Language" ~}
Developed to make programming easier by using English-like abbreviations (mnemonics) for machine instructions.

* **Assembler:** A special program that translates assembly language into machine code.
* **Example:** `ADDF3 R1, R2, R3` could be an assembly instruction for addition.
* **Still Low-Level:** Closer to the hardware than high-level languages.
{~~}

{~ accordion title="High-Level Languages" ~}
These languages are English-like and use familiar mathematical notations, making them easier to learn and use. C is a prime example.

* **Compiler/Interpreter:** Translator programs (compilers or interpreters) convert high-level language source code into machine language.
    **Compilers:** Translate the entire program at once, creating an executable file. This can take time, but the resulting program runs quickly. C uses a compiler.
    **Interpreters:** Execute program statements directly, one by one. This avoids compilation delay but can result in slower execution. Python often uses a mix of compilation (to bytecode) and interpretation.
* **Example:** `area = 5 * 5 * 3.1415;`
* **Source Code:** The human-readable statements written by the programmer.
{~~}

{~ accordion title="Popular High-Level Languages" ~}
A pantheon of powerful languages exists, each with its strengths:

* **COBOL:** For business applications.
* **FORTRAN:** For formula translation in scientific and engineering fields.
* **Java:** "Write once, run anywhere," used for enterprise apps, web servers, consumer devices. Developed by Sun (now Oracle).
* **Python:** Versatile, object-oriented, popular in data science, web development, and education. Developed by Guido van Rossum.
* **C++:** An object-oriented extension of C, developed by Bjarne Stroustrup.
* **C#:** Microsoft's object-oriented language, often used for web and Windows development.
* **JavaScript:** The scripting language of the web, adding interactivity to pages. NodeJS allows it to run server-side.
* **Swift:** Apple's language for iOS and macOS apps.
* **R:** Popular for statistical applications and data visualization.
* **And many more...** (BASIC, Pascal, Ada, Visual Basic, Delphi)
{~~}

## Module 3: The C Programming Language

We now focus on the venerable C language.

{~ card title="Why Learn C?" footer="Power and Control" ~}

* Foundation for many other languages (C++, Java, C#).
* Provides low-level memory manipulation capabilities.
* Used in system programming, embedded systems, game development, and high-performance computing.
* Offers a good understanding of how computers work at a deeper level.
{~~}

{~ accordion title="History of C" ~}
(The slides mention "To describe the history of C," but don't provide it. We can add a placeholder or research this if desired.)
The C language was developed at Bell Labs by Dennis Ritchie in the early 1970s, evolving from an earlier language called B, which was created by Ken Thompson. It was developed alongside the UNIX operating system, and much of UNIX was rewritten in C.
{~~}

{~ accordion title="Writing and Compiling C Programs" ~}

1. **Write:** Create a source code file (e.g., `my_program.c`) using a text editor.
2. **Compile:** Use a C compiler (like GCC) to translate the source code into machine code, creating an executable file.
    `gcc my_program.c -o my_program`
3. **Run:** Execute the compiled program.
    `./my_program`
{~~}

A simple C program might look like this:

```c
#include <stdio.h>

int main() {
    // This is a comment
    printf("Hello, World of C!\\n");
    return 0;
}
```

* `#include <stdio.h>`: Includes the standard input/output library.
* `int main() { ... }`: The main function where execution begins.
* `printf(...)`: A function to print output to the console.
* `\\n`: Represents a newline character.
* `return 0;`: Indicates successful program termination.

{~ accordion title="Types of Errors" ~}
* **Syntax Errors:** Grammatical mistakes in the code that prevent compilation (e.g., missing semicolon). The compiler will usually point these out.
* **Runtime Errors:** Errors that occur while the program is running (e.g., dividing by zero, trying to access invalid memory). These can crash your program.
* **Logic Errors:** The program compiles and runs, but produces incorrect results because the underlying algorithm or reasoning is flawed. These are often the trickiest to find.
{~~}

{~ accordion title="C Standard Library & Open-Source Libraries" ~}
* **C Standard Library:** A collection of pre-built functions and macros for common tasks (input/output, string manipulation, math operations, etc.). This helps avoid "reinventing the wheel." Accessed via `#include` directives (e.g., `stdio.h`, `stdlib.h`, `math.h`).
* **Open-Source Libraries:** Vast collections of third-party code available for use, extending C's capabilities significantly.
{~~}

## Module 4: Data Hierarchy

Understanding how data is structured, from the smallest bit to vast databases.

{~ practice difficulty="Beginner" timeframe="10 minutes" impact="Medium" focus="Data Concepts" ~}
### Data Organization Exercise
Consider a student enrollment system. Identify examples of:
1. Bits (conceptual, e.g., a flag for 'is_enrolled')
2. Characters (e.g., a student's initial)
3. Fields (e.g., 'FirstName', 'StudentID', 'GPA')
4. Records (e.g., all information for one student)
5. Files (e.g., a 'students.csv' containing all student records)
6. Databases (e.g., a relational database managing tables of students, courses, and enrollments)
Reflect on how these levels build upon each other.
{~~}

{~ accordion title="Bits" ~}
The fundamental unit of data, short for "binary digit." A bit can be either a $0$ or a $1$. They form the basis of the binary number system.
{~~}

{~ accordion title="Characters" ~}
To make data more human-friendly, bits are grouped to represent characters:
* Decimal digits ($0–9$)
* Letters (A–Z, a–z)
* Special symbols (e.g., $, @, %, &, *)
* **Character Set:** The collection of characters a computer can represent. C traditionally uses ASCII (American Standard Code for Information Interchange) by default. Unicode is also supported for broader character representation, using 1 to 4 bytes per character.
{~~}

{~ accordion title="Fields" ~}
A group of characters or bytes that conveys a specific meaning.
* Example: A person's name (a field of characters) or age (a field of digits).
{~~}

{~ accordion title="Records" ~}
A group of related fields.
* Example: An employee record might consist of fields like Employee ID, Name, Address, Hourly Pay Rate, etc.
{~~}

{~ accordion title="Files" ~}
A group of related records. Files can contain arbitrary data in various formats. Some operating systems see a file as just a sequence of bytes, with the application programmer defining its internal structure (like records). Files can be massive, holding gigabytes or terabytes of information.
{~~}

{~ accordion title="Databases" ~}
A collection of data organized for easy access and manipulation.
* **Relational Databases:** A popular model where data is stored in tables. Tables consist of records (rows) and fields (columns).
* Example: A student database might have a table for students with fields like `first_name`, `last_name`, `student_ID`, `major`, `GPA`.
{~~}

{~ accordion title="Big Data" ~}
Refers to the enormous volume of data being generated globally. Big data applications deal with processing and analyzing these massive datasets, a rapidly growing field.

**Data Unit Hierarchy:**
* **Kilobyte (KB):** $1024$ bytes (approximately $10^3$ bytes)
* **Megabyte (MB):** $1024$ KB (approximately $10^6$ bytes)
* **Gigabyte (GB):** $1024$ MB (approximately $10^9$ bytes)
* **Terabyte (TB):** $1024$ GB (approximately $10^{12}$ bytes)
* **Petabyte (PB):** $1024$ TB (approximately $10^{15}$ bytes)
* **Exabyte (EB):** $1024$ PB (approximately $10^{18}$ bytes)
* **Zettabyte (ZB):** $1024$ EB (approximately $10^{21}$ bytes)
{~~}

## Module 5: Typical C Development Environment

(The slides mention this but provide no details. We can elaborate based on common practices.)

{~ card title="Setting up Your Workshop" ~}
A typical C development environment includes:

1. **Text Editor:** To write your C source code (e.g., VS Code, Sublime Text, Vim, Emacs, or a full-fledged IDE).
2. **C Compiler:** To translate your source code into an executable program (e.g., GCC (GNU Compiler Collection) on Linux/macOS, MinGW for Windows, or Clang).
3. **Debugger:** A tool to help you find and fix errors in your code by stepping through it line by line (e.g., GDB (GNU Debugger)).
4. **Build Tools (Optional for larger projects):** Tools like `make` to automate the compilation process of projects with multiple source files.
5. **Version Control System (Recommended):** Tools like Git to track changes to your code and collaborate with others.
{~~}

## What I wrote during Lecture 01

```c
#include <stdio.h>
#include <stdlib.h> // For realloc, free, NULL, exit

struct string {
    char *str;
    int len;
};

void printString(struct string s) {
    int i;
    for (i = 0; i < s.len; i++) {
        printf("%c", s.str[i]);
    }
    // Consider if you want the newline here or after the call in main
}

int main(void) {
    puts("Hello, my fellow gamers!");
    char c;

    struct string s;
    s.str = NULL; // Initialize s.str to NULL
    s.len = 0;    // Initialize s.len to 0

    printf("Enter text, then press Enter:\n");

    // Also good to check for EOF (End Of File)
    while ((c = getchar()) != '\n' && c != EOF) {
        // Calculate new size (for current characters + new one + null terminator)
        // It's safer to allocate space for a null terminator too
        int new_len_with_null = s.len + 1 + 1;
        char *temp_str = (char *)realloc(s.str, sizeof(char) * new_len_with_null);

        if (temp_str == NULL) {
            // Handle realloc failure
            perror("Failed to reallocate memory");
            free(s.str); // Free any previously allocated memory
            return 1;    // Exit with an error code
        }
        s.str = temp_str; // Update s.str only if realloc was successful

        s.str[s.len] = c;    // Add the new character
        s.len++;             // Increment the length
        s.str[s.len] = '\0'; // Add null terminator for safety with other string functions

        if (c == 'w' || c == 'W') {
            printf("You are a winner.\n");
        }
        if (c == 'l' || c == 'L') {
            printf("You are a loser.\n");
        }
        // printf("You typed: %c.\n", c); // This might be a bit noisy here
    }

    printf("The string is: ");
    printString(s); // Now this is safer
    printf("\n");   // Ensure a newline after printing the string

    free(s.str); // Free the final allocated memory
    s.str = NULL; // Good practice: set pointer to NULL after freeing

    return 0; // Indicate successful execution
}
```

In this example, we're using a `struct` to store a string. The `struct` contains two fields: `str` and `len`. The `str` field is a pointer to a character array, and the `len` field is an integer representing the length of the string.

The `printString` function takes a `struct string` as an argument and prints the string to the console.

## Understanding a C Program for Dynamic String Input

This C program is designed to read a line of text entered by the user. A key feature is its ability to handle strings of varying lengths without a predefined size limit, by dynamically allocating memory as the user types. This approach showcases several important C programming concepts, including custom data structures, direct memory management, and robust error handling.

### Core Components and Logic

The program's functionality is built around these central ideas:

* **Custom String Representation:**
    * To manage the string and its properties efficiently, the program typically defines a custom data structure (using `struct` in C). This structure usually bundles together:
        1.  A **pointer** (`char *`) that will hold the memory address of the first character of the string.
        2.  An **integer** that tracks the current number of characters in the string (its length).

* **Dynamic Memory Management – The Heart of the Program:**
    * **Initialization:** Before any input is read, the string structure is initialized to represent an empty string. The character pointer is often set to `NULL` (a special pointer value indicating it doesn't point to any valid memory yet), and the length is set to `0`.
    * **Growth on Demand (`realloc`):** This is where the "dynamic" aspect comes in. As each character is typed by the user:
        * The program attempts to resize the memory block allocated for the string. The `realloc` standard library function is ideal for this, as it tries to extend the existing memory block or find a new, larger one if necessary. Memory is allocated for the current characters, the new character, and a special "null terminator" character.
        * **Crucial Error Checking:** `realloc` can fail if the system runs out of memory. The program responsibly checks the pointer returned by `realloc`. If it's `NULL`, it signifies an allocation failure. The program should then handle this error (e.g., by printing an error message to `stderr` using `perror`, freeing any memory that was successfully allocated previously, and exiting or returning an error code).
    * **Storing the Character:** If memory allocation is successful, the new character is added to the end of the string in the newly allocated space.
    * **Updating Length:** The string's length counter in the custom structure is incremented.
    * **Null Termination:** After adding the new character, a **null terminator** (`\0`) is placed at the very end of the character sequence. This is a fundamental convention in C. The null terminator marks the end of the string and is essential for many standard C string library functions to work correctly.
    * **Memory Deallocation (`free`):** Once the program has finished using the dynamically allocated string (e.g., after printing it), the memory must be explicitly returned to the system using the `free` function. This prevents memory leaks. It's also good practice to set the pointer to `NULL` after freeing it to avoid accidental use of a "dangling pointer."

* **Character-by-Character Input (`getchar`):**
    * The program reads input from the user one character at a time, typically using the `getchar()` standard library function.
    * This input process is usually controlled by a loop that continues until a specific condition is met – commonly, when the user presses the 'Enter' key (which generates a **newline character**, `\n`) or if an **End-Of-File (EOF)** condition is detected (e.g., if input is redirected from a file, or the user signals EOF via keyboard shortcut).

* **Conditional In-Loop Processing (Example):**
    * The example code also includes a simple demonstration of processing characters as they are input. For instance, if the user types a 'w' or 'W', a "winner" message is printed; if they type an 'l' or 'L', a "loser" message is printed. This shows how input can be reacted to immediately.

* **Custom String Output Function:**
    * A dedicated function is often created to print the contents of the custom string structure. This function would iterate from the beginning of the character array (pointed to by `str`) up to its current `len`, printing each character.

### Program Flow Summary

The typical execution sequence of such a program is:

1. **Initialize:** Set up the custom string structure to represent an empty string (pointer to `NULL`, length to `0`).
2. **Prompt User:** Display a message asking the user to enter text.
3. **Input Loop:**
    a.  Read a single character using `getchar()`.
    b.  **Check for Termination:** If the character is a newline (`\n`) or `EOF`, exit the loop.
    c.  **Reallocate Memory:** Call `realloc` to request memory for the current string length plus the new character, plus one for the null terminator.
    d.  **Handle Allocation Failure:** If `realloc` returns `NULL`:
        i.  Print an error message (e.g., using `perror`).
        ii. Free any memory previously allocated to `s.str` to avoid leaks.
        iii. Exit the program with an error status.
    e.  **Store Character & Update:** If `realloc` succeeds:
        i.  Assign the newly returned pointer to the string's character pointer.
        ii. Add the new character to the end of the string data.
        iii. Increment the string length.
        iv. Place the null terminator (`\0`) after the last valid character.
    f.  **Conditional Logic:** Perform any immediate checks based on the input character (like the 'w'/'l' example).
4. **Output:** After the loop terminates, print the complete string that was read.
5. **Cleanup:** Call `free` to release the dynamically allocated memory for the string. Set the pointer to `NULL`.
6. **Terminate:** End the program, typically returning `0` to indicate success.

### Key Learning Takeaways from Such Code

Studying and understanding this type of program provides insights into several core C concepts:

* **Dynamic Memory Management:** The necessity and techniques for allocating, resizing (`realloc`), and freeing (`free`) memory at runtime.
* **Pointers:** Deepens understanding of how pointers are used to manage memory addresses.
* **Custom Data Structures (`struct`):** How to define and use structures to group related data.
* **Error Handling:** The importance of anticipating and managing potential runtime errors, especially memory allocation failures.
* **Character-Based I/O:** Techniques for reading and processing input one character at a time.
* **C-Style Strings:** The convention of null-terminated strings and their management.
* **Memory Safety:** Practices like checking `realloc`'s return, freeing memory, and setting freed pointers to `NULL` to prevent common bugs like memory leaks and dangling pointers.
* 