#ifndef BANNED_H
#define BANNED_H
#define BANNED(func) sorry_##func##_is_a_banned_function
#undef system
#define system(...) BANNED(system)
#undef sort
#define sort(...) BANNED(sort)
#undef stable_sort
#define stable_sort(...) BANNED(stable_sort)
#undef partial_sort
#define partial_sort(...) BANNED(partial_sort)
#undef search
#define search(...) BANNED(search)
#undef search_n
#define search_n(...) BANNED(search_n)
#undef reverse
#define reverse(...) BANNED(reverse)
#undef reverse_copy
#define reverse_copy(...) BANNED(reverse_copy)
#undef max
#define max(...) BANNED(max)
#undef min
#define min(...) BANNED(min)
#undef next_permutation
#define next_permutation(...) BANNED(next_permutation)
#undef swap
#define swap(...) BANNED(swap)
#undef qsort
#define qsort(...) BANNED(qsort)
#undef kill
#define kill(...) BANNED(kill)
#undef atexit
#define atexit(...) BANNED(atexit);
#undef fopen
#define fopen(...) BANNED(fopen)
#undef fclose
#define fclose(...) BANNED(fclose)
#undef fread
#define fread(...) BANNED(fread)
#undef fwrite
#define fwrite(...) BANNED(fwrite)
#undef fdopen
#define fdopen(...) BANNED(fdopen)
#undef fprintf
#define fprintf(...) BANNED(fprintf)
#undef fmax
#define fmax(...) BANNED(fmax)
#undef fmin
#define fmin(...) BANNED(fmax)
#endif /* BANNED_H */