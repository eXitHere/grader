# ⚙️ Installation guide <br/>

```
1: 📄 npm install
2: 📄 npm start
```

## 💣💣 ถ้าระบบไม่สามารถ exec compiler ได้จะไม่สามารถรัน server ได้ 💣💣

# 💻 Compiler <br/>

[Folder](../dev/compile_run)

-   g++.exe (MinGW.org GCC-6.3.0-1) 6.3.0
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

# Library path for gnc (g++) <br/>

📂 lib\gcc\mingw32\6.3.0\include\c++ <-- ex. algorithm
