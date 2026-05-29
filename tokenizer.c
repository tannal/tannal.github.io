#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#define MAX_VOCAB_SIZE 1000
#define MAX_TOKEN_LENGTH 50
#define MAX_SEQUENCE_LENGTH 1000

typedef struct {
    char token[MAX_TOKEN_LENGTH];
    int id;
} Vocab;

Vocab vocab[MAX_VOCAB_SIZE];
int vocab_size = 0;

void initialize() {
    vocab_size = 0;
    
    // Add words
    strcpy(vocab[vocab_size].token, "the");
    vocab[vocab_size].id = vocab_size;
    vocab_size++;

    strcpy(vocab[vocab_size].token, "quick");
    vocab[vocab_size].id = vocab_size;
    vocab_size++;

    strcpy(vocab[vocab_size].token, "brown");
    vocab[vocab_size].id = vocab_size;
    vocab_size++;

    // Add single letters
    for (char c = 'a'; c <= 'z'; c++) {
        vocab[vocab_size].token[0] = c;
        vocab[vocab_size].token[1] = '\0';
        vocab[vocab_size].id = vocab_size;
        vocab_size++;
    }
}

int find_token(const char* token) {
    for (int i = 0; i < vocab_size; i++) {
        if (strcmp(vocab[i].token, token) == 0) {
            return vocab[i].id;
        }
    }
    return -1;
}

void tokenize(const char* text) {
    int tokens[MAX_SEQUENCE_LENGTH];
    int token_count = 0;
    char word[MAX_TOKEN_LENGTH] = {0};
    int word_length = 0;

    for (int i = 0; text[i] != '\0'; i++) {
        char c = text[i];
        if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) {
            if (word_length < MAX_TOKEN_LENGTH - 1) {
                word[word_length++] = c;
            }
        } else {
            if (word_length > 0) {
                word[word_length] = '\0';
                int token_id = find_token(word);
                if (token_id != -1) {
                    tokens[token_count++] = token_id;
                } else {
                    for (int j = 0; j < word_length; j++) {
                        char single_char[2] = {word[j], '\0'};
                        int char_id = find_token(single_char);
                        if (char_id != -1) {
                            tokens[token_count++] = char_id;
                        }
                    }
                }
                word_length = 0;
            }
        }
    }

    printf("Tokenized sequence:\n");
    for (int i = 0; i < token_count; i++) {
        printf("%d ", tokens[i]);
    }
    printf("\n");
}

int main() {
    initialize();
    const char* text = "the quick brown fox";
    tokenize(text);

    // print word table
    printf("Word table:\n");
    for (int i = 0; i < vocab_size; i++) {
        printf("%s %d\n", vocab[i].token, vocab[i].id);
    }
    return 0;
}