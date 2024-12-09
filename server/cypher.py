def egcd(a, b):
    x, y, u, v = 0, 1, 1, 0
    while a != 0:
        q = b // a  # quotient
        r = b % a   # remainder
        m = x - u * q  # update x
        n = y - v * q  # update y
        b = a  # update b to previous a
        a = r  # update a to remainder
        x = u  # update x to previous u
        y = v  # update y to previous v
        u = m  # update u to new x
        v = n  # update v to new y
    gcd = b
    return gcd, x, y

def modinv(a, m):
    gcd, x, y = egcd(a, m)
    if gcd != 1:
        return None  # modular inverse does not exist
    else:
        return x % m

def encrypt_char(char, a, b):
    if char.isalpha():
        start = ord('A') if char.isupper() else ord('a')
        return chr(((a * (ord(char) - start) + b) % 26) + start)
    return char

def decrypt_char(char, a, b):
    if char.isalpha():
        start = ord('A') if char.isupper() else ord('a')
        mod_inverse = modinv(a, 26)
        if mod_inverse is None:
            raise ValueError("Modular inverse does not exist for these values of a and 26")
        return chr(((mod_inverse * (ord(char) - start - b)) % 26) + start)
    return char

def affine_encrypt(text, a, b):
    encrypted_text = ""
    for char in text.upper().replace(' ', ''):
        encrypted_text += encrypt_char(char, a, b)
    return encrypted_text

def affine_decrypt(cipher, a, b):
    decrypted_text = ""
    for char in cipher:
        decrypted_text += decrypt_char(char, a, b)
    return decrypted_text

def main():
    text = 'ELMA'
    a = 5  # Updated to a value that is coprime with 26
    b = 8

    # calling encryption function
    affine_encrypted_text = affine_encrypt(text, a, b)
    print('Encrypted Text: {}'.format(affine_encrypted_text))

    # calling decryption function
    decrypted_text = affine_decrypt(affine_encrypted_text, a, b)
    print('Decrypted Text: {}'.format(decrypted_text))

if __name__ == '__main__':
    main()