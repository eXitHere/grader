# ⚙️ Installation guide <br/>

```
1: 📄 npm install
2: 📄 npm start
```

```
สำคัญ : --> sudo chmod 777 -R ./compile_run
สำคัญกว่า : -> แกอะ
```

## 💣💣 ถ้าระบบไม่สามารถ exec compiler ได้จะไม่สามารถรัน server ได้ 💣💣

# Exclusive Error code

-   P : pass
-   (-) : fail
-   C : create file error [ex. create c/cpp fail]
-   B : build fail [ex. syntax error]
-   L : Library banned
-   F : Function banned
-   O : out of buffer [1MB]
-   M : out of memory [>64MB]
-   T : timeout [1 Sec]
-   R : runtime error [out of array ... bra bra]
-   X : standard output error
-   W : wrong input/output from test case plz contact admin
-   W1: questionId wrong
-   * : Error from system
# 💻 Compiler <br/>

-   require g++ (MinGW.org GCC-6.3.0-1) 6.3.0 (possible)
-   std = c++14
-   OS: Linux 64 bit
-   Library standard for MinGW

# 🛡 Block library (removed library)

-   algorithm
-   bit/stdc++.h
-   thread
-   fstream
-   atomic
-   mutex
-   unistd.h
-   signal.h
-   unistd.h

# (อ้างอิงจาก http://www.delorie.com/djgpp/doc/libc/)

## library ที่ไม่มีในระบบ

-   conio.h
-   dos.h
-   debug/dbgcom.h
-   dpmi.h
-   go32.h
-   io.h
-   stdlib.h
-   process.h

# 🛡 Block function

-   windows.h (any)
    -   system(x) (protect v.2)
-   algorithm
    -   sort
    -   stable_sort
    -   partial_sort
    -   search
    -   search_n
    -   reverse
    -   reverse_copy
    -   max
    -   min
    -   next_permutation
    -   swap
-   stdlib.h
    -   qsort
    -   kill (protect v.2)
    -   atexit (protect v.2)
-   stdio.h
    -   fopen
    -   fclose
    -   fread
    -   fwrite
    -   fdopen
    -   fprintf
-   cmath
    -   fmax
    -   fmin

protect v.2 คือการบล็อก library แล้ว block function ซ้ำ
