#pragma once

#ifdef BASECRYPTO_EXPORTS
#define BASECRYPTO_API __declspec(dllexport)
#else
#define BASECRYPTO_API __declspec(dllimport)
#endif

extern "C" BASECRYPTO_API char* EncryptBase64(const char* input);
extern "C" BASECRYPTO_API char* DecryptBase64(const char* input);