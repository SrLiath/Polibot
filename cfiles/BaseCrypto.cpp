#include "pch.h"
#include "Base64Crypto.h"
#include <openssl/evp.h>
#include <openssl/rand.h>
#include <b64/encode.h>
#include <b64/decode.h>
#include <string>
#include <vector>

std::string Base64Encode(const std::vector<unsigned char>& data) {
    base64::encoder encoder;
    std::stringstream ss;
    encoder.encode(data.data(), data.size(), ss);
    return ss.str();
}

std::vector<unsigned char> Base64Decode(const std::string& data) {
    base64::decoder decoder;
    std::stringstream ss(data);
    std::stringstream out;
    decoder.decode(ss, out);
    std::string decoded = out.str();
    return std::vector<unsigned char>(decoded.begin(), decoded.end());
}

extern "C" BASECRYPTO_API char* EncryptBase64(const char* input) {
        std::string plaintext(input);
    std::vector<unsigned char> ciphertext(plaintext.begin(), plaintext.end());

        std::string encoded = Base64Encode(ciphertext);

        char* result = new char[encoded.size() + 1];
    strcpy_s(result, encoded.size() + 1, encoded.c_str());
    return result;
}

extern "C" BASECRYPTO_API char* DecryptBase64(const char* input) {
        std::vector<unsigned char> decoded = Base64Decode(input);

        std::string decrypted(decoded.begin(), decoded.end());

        char* result = new char[decrypted.size() + 1];
    strcpy_s(result, decrypted.size() + 1, decrypted.c_str());
    return result;
}