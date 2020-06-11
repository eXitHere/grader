#ifndef BANNED_H
#define BANNED_H

#define BANNED(func) sorry_##func##_is_a_banned_function

#undef system
#define system(x) BANNED(system)

#endif /* BANNED_H */