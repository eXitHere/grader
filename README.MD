# ⚙️ Installation guide <br/>

```
1: 📄 npm install
2: 📄 npm start
```

## 💣💣 ถ้าระบบไม่สามารถ exec compiler ได้จะไม่สามารถรัน server ได้ 💣💣

# Exclusive Error code

-   P : pass
-   (-) : fail
-   C : create file error [ex. banned lib, create c/cpp fail]
-   B : build fail [ex. syntax error]
-   L : Library banned
-   F : Function banned
-   M : out of memory [>64MB]
-   T : timeout [1 Sec]
-   R : runtime error [out of array ... bra bra]
-   X : standard output error

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

# 🛡 Block function (./compile_run/banned.h)

-   windows.h (any)
    -   system(x)
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
-   stdio.h
    -   fopen
    -   fclose
    -   fread
    -   fwrite
-   cmath
    -   fmax
    -   fmin
