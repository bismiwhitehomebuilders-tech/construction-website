import hashlib
import os

password = input("Enter password: ")

salt = os.urandom(16)

hash_value = hashlib.sha512(salt + password.encode()).hexdigest()

print("Salt:", salt.hex())
print("Hash:", hash_value)

